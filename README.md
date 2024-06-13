# Pulse Digital News

Ce repo contient les fichiers de l'application Pulse Digital News, un projet collectif de 1ère année de BUT MMI.

Pulse Digital News est un site de veille pour tout le monde, centré sur l'art. Les utilisateurs peuvent découvrir des oeuvres fournies par l'API de [l'Art Institute of Chigago](https://api.artic.edu/docs/), tout en ajoutant aussi des contenus externes.



## Installation

Pour installer l'application en local, vous aurez besoin de Node 21 (ou plus récent).
Vous aurez aussi besoin de Docker et d'installer l'image [Link Preview Generator Server](https://hub.docker.com/repository/docker/ashwamegh/lpdg-server).

Installez les dépendances

```sh
npm install
```

Puis lancez le serveur de développement
```sh
npm run dev
```

Ensuite, lancez le backend Pocketbase
```sh
cd backend/pocketbase
```

```sh
./pocketbase serve
```

Et enfin, lancez le contenur Docker Link Preview Generator Server.

Si vous avez configuré la connexion avec Google, ous pouvez aussi lancer le serveur google_avatar_renderer en tapant :
```sh
cd backend/google_avatar_renderer
```
Sur Windows Powershell
```sh
$env:DEBUG='google_avatar_redirect:*'; npm start
```
Sur macOS/Linux
```powershell
DEBUG=google_avatar_redirect:* npm start
```

## Déploiement

Pour déployer l'app, tapez :

```sh
npm run build
```

Vous devrez build Pocketbase à l'aide de golang.

```sh
go build
```

Pour un déploiement sur serveur, utilisez le dossier `pb_public` de Pocketbase pour distribuer l'application.

Il vous faudra changer le fichier .env.production avec les URL de vos serveurs Pocketbase, Link Preview Generator et google_avatar_redirect.

