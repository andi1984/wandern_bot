import cron = require("node-cron");

const login = require("../helper/login");

const schedule = () => {
  console.log("schedule natur-boost");
  cron.schedule("0 0 * * Mon", async () => {
    const mastoInstance = await login();
    const timelines = mastoInstance.timelines;
    const results = timelines.getTagIterable("natur");
    // const results = mastoInstance.search({ q: "#natur" });
    //Async iterable
    results.next().then((result: { value: { id: string }[] }) => {
      // We got our first X entries in result.value
      // Reblog/Boost all natur posts
      result.value.forEach((post) => {
        mastoInstance.statuses.reblog(post.id, { visibility: "public" });
      });
    });
  });
};

module.exports = schedule;
