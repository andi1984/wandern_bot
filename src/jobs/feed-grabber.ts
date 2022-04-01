const feeds:Record<string, string> = require("../data/rssfeeds.json");

import getFeed from "../helper/getFeed";
import { createClient } from "@supabase/supabase-js";
import sha256 from "crypto-js/sha256";

const { parentPort } = require("worker_threads");

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

type DB_ITEM = {
  hash: string;
  json: string;
}

// Iterate over all feeds
(async () => {
  Object.values(feeds).forEach(async (feedURL: string) => {
    const rssData: { items: any[] } = await getFeed(feedURL);

    // 1. Hash feedURL to get a unique id for the table
    const tableId = sha256(feedURL);

    // cf. https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
    const asyncFilter = async (arr: any[], predicate: (value: DB_ITEM, index: number, array:DB_ITEM[]) => Promise<boolean>) => {
      const results = await Promise.all(arr.map(predicate));

      return arr.filter((_v, index) => results[index]);
    };

    const newData = await asyncFilter(
      rssData.items.map((item: any) => {
        return {
          hash: `${tableId}-${sha256(item.title)}`,
          data: JSON.stringify(item),
        };
      }),
      async(item:DB_ITEM) => {
        // Check that hash isn't already in the table
        let { data: feeds, error } = await supabase
          .from("feeds")
          .select("hash")
          .in("hash", [item.hash]);

        return (!feeds || feeds.length == 0) && error == null;
      }
    );

    console.log(`Inserting ${newData.length} new items`);
    if (newData.length > 0) {
      const { data, error } = await supabase.from("feeds").insert(newData);
      console.log({ data, error });
    }

    if (parentPort) parentPort.postMessage("done");
    else process.exit(0);
  });
})();
