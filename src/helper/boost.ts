import { MastoClient, Status } from "masto";

import login from "./login";
import settings from "../data/settings.json";

/**
 * Boost a status after several checks.
 */
const boost = async (status: Status) => {
  const mastoInstance: MastoClient = await login();

  // Check if status is not a reply
  const isReply = !!status.inReplyToId;
  // Check that status is not from ourselves
  const isFromUs = status.account.acct == settings.username;

  // If it is not a reply and does not come from us, we boost it!
  if (!isReply && !isFromUs) {
    await mastoInstance.statuses.reblog(status.id, { visibility: "public" });
  }
};

export default boost;
