import cron = require("node-cron");

const login = require("../helper/login");

const schedule = () => {
  console.log("schedule alive");
  cron.schedule("*/5 * * * *", () => {
    console.log("still alive");
  });
};

module.exports = schedule;
