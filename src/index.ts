require("dotenv").config();

// Import and run all cron jobs
const natur = require("./jobs/natur-boost");

natur();
