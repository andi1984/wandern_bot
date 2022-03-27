require("dotenv").config();
const path = require("path");

import Bree = require("bree");

const bree = new Bree({
  root: path.join(__dirname, "jobs"),
  /**
   * We only need the default extension to be "ts"
   * when we are running the app with ts-node - otherwise
   * the compiled-to-js code still needs to use JS
   */
  defaultExtension: process.env.TS_NODE ? "ts" : "js",
  jobs: [
    { name: "alive", interval: "1m" },
    { name: "natur-boost", interval: "at 12:00 am" },
  ],
});

bree.start();
