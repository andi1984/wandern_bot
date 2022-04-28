import { MastoClient, Status } from "masto";

import login from "./login";
import { asyncForEach } from "./async";
import boost from "./boost";

const hashtagBoost = async (hashtag: string) => {
  const mastoInstance: MastoClient = await login();
  const timelines = mastoInstance.timelines;
  const results = timelines.getTagIterable(hashtag);
  //Async iterable
  const result: { value: Status[] } = await results.next();

  // We got our first X entries in result.value
  // Reblog/Boost all natur posts
  await asyncForEach(result.value, async (post) => {
    await boost(post);
    return true;
  });
};

export default hashtagBoost;
