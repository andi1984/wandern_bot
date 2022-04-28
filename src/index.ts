require("dotenv").config();
const path = require("path");

const Bree = require("bree");

console.log("starting bree");
const bree = new Bree({
  root: path.join(__dirname, "jobs"),
  /**
   * We only need the default extension to be "ts"
   * when we are running the app with ts-node - otherwise
   * the compiled-to-js code still needs to use JS
   */
  defaultExtension: process.env.TS_NODE ? "ts" : "js",
  jobs: [
    { name: "feed-grabber", interval: "2h" },
    { name: "feed-tooter", cron: "0 16 * * *" },
    { name: "latest-hashtag-boost", interval: "2h" },
    { name: "alive", interval: "30m" },
  ],
});

bree.start();
