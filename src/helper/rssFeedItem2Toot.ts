import type { Item } from "rss-parser";

type AdditionalFeedItems = {
    'dc:creator': string;
}

export type FeedItem = Item & AdditionalFeedItems;

const rssFeedItem2Toot = (item: FeedItem, hashtags?: string[]) => {
    
    const creator = item.creator || item['dc:creator'];
    const title = item.title;
    const link = item.link;

    return `${item.title}${!!creator ? ', ' : ''}${creator||''}${!!hashtags ? hashtags.map(tag => ` #${tag}`).join(' ') : ''}\n\n${link}`

}

export default rssFeedItem2Toot;