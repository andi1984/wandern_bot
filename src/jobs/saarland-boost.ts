import type { MastoClient, Status } from "masto";
import login from "../helper/login";
import { asyncForEach } from "../helper/async";

const NUM_PAGINATIONS = 5;

(async () => {
  const { parentPort } = require("worker_threads");
  console.log("Starting saarland worker");
  const mastoInstance: MastoClient = await login();
  const timelines = mastoInstance.timelines;
  const results = timelines.getTagIterable("saarland");

  const interestingToots: Status[] = [];

  // Find interesting toots in the first X timeline pages
  let i = 0;
  do {
    i += 1;

    //Async iterable
    const result = await results.next();

    // We got our first X entries in result.value
    result.value.forEach((post: Status) => {
      const tags = post.tags.map((tag) => tag.name);
      // console.log(tags);
      if (
        tags.includes("natur") ||
        tags.includes("wetter") ||
        tags.includes("wandern") ||
        tags.includes("saarWandern")
      ) {
        interestingToots.push(post);
      }
    });
  } while (i < NUM_PAGINATIONS);

  await asyncForEach(interestingToots, async (post) => {
    // Retoot
    await mastoInstance.statuses.reblog(post.id, { visibility: "public" });

    // Follow the ppls
    await mastoInstance.accounts.follow(post.account.id, { reblogs: true });

    return true;
  });

  // signal to parent that the job is done
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
