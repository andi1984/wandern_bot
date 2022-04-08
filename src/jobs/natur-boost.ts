import type { MastoClient } from "masto";
import login from "../helper/login";
import { asyncForEach } from "../helper/async";

(async () => {
  const { parentPort } = require("worker_threads");
  console.log("Starting nature worker");
  const mastoInstance: MastoClient = await login();
  const timelines = mastoInstance.timelines;
  const results = timelines.getTagIterable("natur");
  //Async iterable
  const result: { value: { id: string }[] } = await results.next();

  // We got our first X entries in result.value
  // Reblog/Boost all natur posts
  await asyncForEach(result.value, async (post) => {
    await mastoInstance.statuses.reblog(post.id, { visibility: "public" });
    return true;
  });

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
