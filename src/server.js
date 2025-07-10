const express = require("express");
const app = express();
const next = require("next");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

nextApp
  .prepare()
  .then(() => {
    const server = express();
    // if(!dev) {
    //   server.use(secure)
    // }

    server.get("/produk-hukum/:id", (req, res) => {
      const actualPage = "/peraturan";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/putusan-pengadilan/:id", (req, res) => {
      const actualPage = "/putusanpengadilan";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/monografi-hukum/:id", (req, res) => {
      const actualPage = "/monografihukum";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/artikel/:id", (req, res) => {
      const actualPage = "/artikel";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/tentangkami/:id", (req, res) => {
      const actualPage = "/tentang";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/detail/:j/:n/:t/:s", (req, res) => {
      const actualPage = "/detailperaturan";
      let cookiex;
      let randm = Math.random().toString(36).substr(2, 5);
      const queryParams = {
        q: req.params.j + "/" + req.params.n + "/" + req.params.t,
        // cokk: randm,
      };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/detailputusan/:j/:n/:t", (req, res) => {
      const actualPage = "/detailputusan";
      const queryParams = {
        q: req.params.j + "/" + req.params.n + "/" + req.params.t,
      };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/detailmonografi/:j/:n/:t", (req, res) => {
      const actualPage = "/detailmonografi";
      const queryParams = {
        q: req.params.j + "/" + req.params.n + "/" + req.params.t,
      };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/artikeldetail/:j/:n/:t", (req, res) => {
      const actualPage = "/detailartikel";
      const queryParams = {
        q: req.params.j + "/" + req.params.n + "/" + req.params.t,
      };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/detail/:j/:n/:t", (req, res) => {
      const actualPage = "/detailperaturan";
      const queryParams = {
        q: req.params.j + "/" + req.params.n + "/" + req.params.t,
      };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/galeridetail/:id", (req, res) => {
      const actualPage = "/galeridetail";
      const queryParams = { q: req.params.id };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/produk-hukum/:id/:subject", (req, res) => {
      const actualPage = "/peraturan";
      const queryParams = { q: req.params.id + "/" + req.params.subject };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/putusan-pengadilan/:id/:subject", (req, res) => {
      const actualPage = "/putusanpengadilan";
      const queryParams = { q: req.params.id + "/" + req.params.subject };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/monografi-hukum/:id/:subject", (req, res) => {
      const actualPage = "/monografihukum";
      const queryParams = { q: req.params.id + "/" + req.params.subject };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/artikel/:id/:subject", (req, res) => {
      const actualPage = "/artikel";
      const queryParams = { q: req.params.id + "/" + req.params.subject };
      nextApp.render(req, res, actualPage, queryParams);
    });

    server.get("/syncnonstandar", (req, res) => {
      const actualPage = "/peraturanjdihn";
      nextApp.render(req, res, actualPage);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.post("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
