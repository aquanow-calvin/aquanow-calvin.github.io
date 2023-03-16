const fs = require('fs').promises;

const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(express.static("build"));
app.use(bodyParser.json());

fs.readFile("package.json", 'binary').then(async(pkg) => {
  const { name, proxy } = JSON.parse(pkg);
  const port = proxy.split(`:`)[2].split(`/`)[0];
  app.listen(port, async () => {
    console.log(`[${name.toUpperCase()}] Service started. Go to >> ${proxy}`);
  });
});

["uncaughtException", "unhandledRejection"].forEach((eventType) => { process.on(eventType, async (e) => { console.error(e) }) });