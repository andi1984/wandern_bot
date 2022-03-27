import cron = require("node-cron");
const { parentPort } = require("worker_threads");

const login = require("../helper/login");

(async () => {
  console.log("Starting nature worker");
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

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
