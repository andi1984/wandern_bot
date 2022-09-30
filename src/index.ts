import dotenv from "dotenv";
import process from "node:process";
import * as path from "node:path";
import Bree from "bree";

dotenv.config();

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
    { name: "feed-grabber", interval: "3h" },
    { name: "feed-tooter", interval: "2h" },
    { name: "latest-hashtag-boost", interval: "30h" },
    { name: "alive", interval: "30m" },
  ],
});

(async () => {
  await bree.start();
})();
