require("dotenv").config();

// Import and run all cron jobs
const alivePing = require("./jobs/alive");
const natur = require("./jobs/natur-boost");

alivePing();
natur();
