package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"fmt"

	"net/http"

	"crypto/rand"
	"encoding/base64"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tokens"

	"github.com/go-webauthn/webauthn/webauthn"
)

const (
	WEBAUTHN_COLLECTION_NAME       string = "users"
	WEBAUTHN_CREDENTIALS_FIELDNAME string = "webauthn_credentials"
	WEBAUTHN_ID_B64_FIELDNAME      string = "webauthn_id_b64"
)

func findUser(app *pocketbase.PocketBase, email string) (*User, error) {
	// Find user
	user := User{}
	err := app.Dao().DB().
		NewQuery(fmt.Sprintf(
			"SELECT id, email, name, %s, %s FROM %s WHERE email={:email}",
			WEBAUTHN_ID_B64_FIELDNAME, WEBAUTHN_CREDENTIALS_FIELDNAME, WEBAUTHN_COLLECTION_NAME)).
		Bind(dbx.Params{"email": email}).
		One(&user)
	if err != nil {
		return nil, err
	}

	err = user.ensureWebAuthnId(app)
	return &user, err
}

func createUser(app *pocketbase.PocketBase, email string) error {

	collection, err := app.Dao().FindCollectionByNameOrId(WEBAUTHN_COLLECTION_NAME)
	if err != nil {
		return err
	}

	record := models.NewRecord(collection)
	form := forms.NewRecordUpsert(app, record)

	// create long random password (NOTE: password auth is disabled anyway)
	randomBuffer := make([]byte, 32)
	rand.Read(randomBuffer)
	password := base64.StdEncoding.EncodeToString(randomBuffer)

	err = form.LoadData(map[string]any{
		"email":                     email,
		"password":                     password,
		"passwordConfirm":              password,
		WEBAUTHN_ID_B64_FIELDNAME:      "",
		WEBAUTHN_CREDENTIALS_FIELDNAME: "",
	})
	if err != nil {
		return err
	}

	err = form.Submit()
	return err
}

func findOrCreateUser(app *pocketbase.PocketBase, email string) (*User, error) {

	// try to find user
	user, err := findUser(app, email)

	// error? -> create user if not existent
	if err != nil {
		err = createUser(app, email)
		if err != nil {
			return nil, err
		}
		user, err = findUser(app, email)
		if err != nil {
			return nil, err
		}
	}

	err = user.ensureWebAuthnId(app)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (user *User) ensureWebAuthnId(app *pocketbase.PocketBase) error {
	authRecord, err := app.Dao().FindAuthRecordByEmail(WEBAUTHN_COLLECTION_NAME, user.Email)
	if err != nil {
		return apis.NewNotFoundError("User not found.", err)
	}

	// create webauthn id only if it doesnt exist yet
	if authRecord.GetString(WEBAUTHN_ID_B64_FIELDNAME) != "" {
		return nil
	}

	// create 64 bytes of random data
	randomBuffer := make([]byte, 64)
	rand.Read(randomBuffer)
	user.WebAuthnIdB64 = base64.StdEncoding.EncodeToString(randomBuffer)

	// store in database
	authRecord.Set(WEBAUTHN_ID_B64_FIELDNAME, user.WebAuthnIdB64)
	err = app.Dao().Save(authRecord)
	if err != nil {
		return NewInternalServerError("Could not store webauthn id to db.", err)
	}

	return nil
}

func (user User) addCredential(app *pocketbase.PocketBase, credential webauthn.Credential) error {
	authRecord, err := app.Dao().FindAuthRecordByEmail(WEBAUTHN_COLLECTION_NAME, user.Email)
	if err != nil {
		return apis.NewNotFoundError("User not found.", err)
	}
	authRecord.Set(WEBAUTHN_CREDENTIALS_FIELDNAME, credential)
	return app.Dao().Save(authRecord)
}

func (user User) sendAuthTokenResponse(app *pocketbase.PocketBase, c echo.Context) error {

	authRecord, err := app.Dao().FindAuthRecordByEmail(WEBAUTHN_COLLECTION_NAME, user.Email)
	if err != nil {
		return apis.NewNotFoundError("User not found.", err)
	}

	token, err := tokens.NewRecordAuthToken(app, authRecord)
	if err != nil {
		return NewInternalServerError("Failed to create auth token.", err)
	}

	return c.JSON(http.StatusOK, map[string]any{
		"token": token,
		"user":  authRecord,
		"email": authRecord.Get("email"),
	})
}

func NewInternalServerError(message string, data any) *apis.ApiError {
	return apis.NewApiError(500, message, data)
}

func main() {
// configure and initialize webauthn
	wconfig := &webauthn.Config{
		RPDisplayName: "Pulse Digital News",                                       // Display Name for your site
		RPID:          "localhost",                                                // Generally the FQDN for your site
		RPOrigins:     []string{"http://127.0.0.1:8090", "http://localhost:8090", "http://localhost:5173", "https://app-pulsenews.maxencelallemand.fr", "https://app-pulsenews.maxencelallemand.fr:443"}, // The origin URLs allowed for WebAuthn requests
	}

	webAuthn, err := webauthn.New(wconfig)
	if err != nil {
		fmt.Println(err)
		return
	}

	// create a map holding the sessions used during registration and login flow
	webAuthnSessions := make(map[string]*webauthn.SessionData)

	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		25,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	var queryTimeout int
	app.RootCmd.PersistentFlags().IntVar(
		&queryTimeout,
		"queryTimeout",
		30,
		"the default SELECT queries timeout in seconds",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (hooks and migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	// GitHub selfupdate
	ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{})

	app.OnAfterBootstrap().PreAdd(func(e *core.BootstrapEvent) error {
		app.Dao().ModelQueryTimeout = time.Duration(queryTimeout) * time.Second
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDir), indexFallback))
		
		// register routes for registration:
		// 	1. *begin* creates a challenge for the authenticator to sign
		// 	2. *finish* validates the generated credential and stores it in the user record
		e.Router.POST("/webauthn-begin-registration/:emailb64", func(c echo.Context) error {
			emailb64 := c.PathParam("emailb64")
			email, err := base64.StdEncoding.DecodeString(emailb64)
			if err != nil {
				return apis.NewBadRequestError("Could not decode user from path.", err)
			}

			// Find or create the new user
			// TODO: if the user exists, throw an error (cant register a credential for existing users, if not authenticated)
			user, err := findOrCreateUser(app, string(email))
			if err != nil {
				return apis.NewNotFoundError("User not found.", err)
			}

			options, session, err := webAuthn.BeginRegistration(user)
			if err != nil {
				return NewInternalServerError("Could not start WebAuthn registration flow.", err)
			}

			// store the sessionData values
			webAuthnSessions[user.WebAuthnIdB64] = session

			// return the options generated
			// -> options.publicKey contain our registration options
			return c.JSON(http.StatusOK, options)
		})

		e.Router.POST("/webauthn-finish-registration/:emailb64", func(c echo.Context) error {
			emailb64 := c.PathParam("emailb64")
			email, err := base64.StdEncoding.DecodeString(emailb64)
			if err != nil {
				return apis.NewBadRequestError("Could not decode user from path.", err)
			}

			// Find or create the new user
			user, err := findOrCreateUser(app, string(email))
			if err != nil {
				return apis.NewNotFoundError("User not found.", err)
			}
			session := webAuthnSessions[user.WebAuthnIdB64]
			delete(webAuthnSessions, user.WebAuthnIdB64)

			credential, err := webAuthn.FinishRegistration(user, *session, c.Request())
			if err != nil {
				// Handle Error and return.
				return apis.NewBadRequestError("Failed to verify login credentials.", err)
			}

			// If creation was successful, store the credential object
			err = user.addCredential(app, *credential)
			if err != nil {
				return err
			}

			return c.JSON(http.StatusOK, map[string]string{"status": "success"})
		})

		// register routes for authentication (similar to registration):
		// 	1. *begin* creates a challenge for the authenticator to sign
		// 	2. *finish* validates the signature and responds with a pocketbase auth token
		e.Router.POST("/webauthn-begin-login/:emailb64", func(c echo.Context) error {
			emailb64 := c.PathParam("emailb64")
			email, err := base64.StdEncoding.DecodeString(emailb64)
			if err != nil {
				return apis.NewBadRequestError("Could not decode user from path.", err)
			}

			user, err := findUser(app, string(email))
			if err != nil {
				return apis.NewNotFoundError("User not found.", err)
			}

			options, session, err := webAuthn.BeginLogin(user)
			if err != nil {
				// Handle Error and return.
				return err
			}

			// store the session values
			webAuthnSessions[user.WebAuthnIdB64] = session

			// return the options generated
			// options.publicKey contain our registration options
			return c.JSON(http.StatusOK, options)

		})

		e.Router.POST("/webauthn-finish-login/:emailb64", func(c echo.Context) error {
			emailb64 := c.PathParam("emailb64")
			email, err := base64.StdEncoding.DecodeString(emailb64)
			if err != nil {
				return apis.NewBadRequestError("Could not decode user from path.", err)
			}

			user, err := findOrCreateUser(app, string(email))
			if err != nil {
				return apis.NewNotFoundError("User not found.", err)
			}

			// Get the session data stored from the function above and complete login
			session := webAuthnSessions[user.WebAuthnIdB64]
			_, err = webAuthn.FinishLogin(user, *session, c.Request())
			if err != nil {
				return apis.NewBadRequestError("Failed to verify login credentials.", err)
			}

			// If login was successful, send auth token for further communication
			return user.sendAuthTokenResponse(app, c)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}