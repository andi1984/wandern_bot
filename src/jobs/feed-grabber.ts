import feeds from "../data/rssfeeds.json";

import getFeed from "../helper/getFeed";
import createClient from "../helper/db";

import sha256 from "crypto-js/sha256";

const { parentPort } = require("worker_threads");

// Create a single supabase client for interacting with your database
const supabase = createClient();

type DB_ITEM = {
  hash: string;
  data: string;
}

// cf. https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
const asyncFilter = async <K>(arr: K[], predicate: (value: K, index: number, array:K[]) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};

const asyncForEach = async <K>(arr: K[], predicate: (value: K, index: number, array:K[]) => Promise<boolean>) => await Promise.all(arr.map(predicate));

// Iterate over all feeds
(async () => {
  await asyncForEach(
    Object.values(feeds),
    async (feedURL: string) => {
      const rssData: { items: any[] } = await getFeed(feedURL);

      // 1. Hash feedURL to get a unique id for the table
      const tableId = sha256(feedURL);

      const newData = await asyncFilter(
        rssData.items.map((item: any) => {
          return {
            hash: `${tableId}-${sha256(item.title)}`,
            data: JSON.stringify(item),
          };
        }),
        async (item: DB_ITEM) => {
          // Check that hash isn't already in the table
          let { data: feeds, error } = await supabase
            .from("feeds")
            .select("hash")
            .in("hash", [item.hash]);

          return (!feeds || feeds.length == 0) && error == null;
        }
      );

      if (newData.length > 0) {
        console.log(`Inserting ${newData.length} new items`);
        const { data, error } = await supabase.from("feeds").insert(newData);
        console.log({ data, error });

        return true;
      }

      return false;
    });
  
  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();

  
