import masto = require("masto");

const getInstance = async () => {
  return await masto.login({
    url: process.env.API_INSTANCE as string,
    accessToken: process.env.ACCESS_TOKEN as string,
  });
};

module.exports = getInstance;
