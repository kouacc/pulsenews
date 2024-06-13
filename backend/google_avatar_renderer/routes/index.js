var express = require("express");
var axios = require("axios");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/fetch/avatar", async function (req, res, next) {
  try {
    const { url } = req.body;
    const response = await axios.get(url, {
      responseType: "stream",
    });
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/health", async (req, res) => {
  try {
    const healthcheck = {
      uptime: `${process.uptime()} seconds`,
      message: "OK",
      timestamp: Date.now(),
    };
    res.send(healthcheck);
  } catch (error) {
    next(
      createError({
        status: SERVICE_UNAVAILABLE,
        message: error,
      })
    );
  }
});

module.exports = router;
