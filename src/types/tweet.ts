export type TweetaAttachmentV2 = {
  media_keys?: string[];
};

export type TweetPublicMetricsV2 = {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
};

export type ReferencedTweetV2 = {
  type: 'retweeted' | 'quoted' | 'replied_to';
  id: string;
};

export type TweetMediaV2 = {
  media_key: string;
  type: 'video' | 'animated_gif' | 'photo';
  duration_ms?: number;
  height?: number;
  width?: number;
  url?: string;
  preview_image_url?: string;
  public_metrics?: { view_count: number };
};

export type TweetUserV2 = {
  id: string;
  username: string;
  profile_image_url: string;
  verified: boolean;
  url: string;
  name: string;
};

type TweetIncludesV2 = {
  media: TweetMediaV2[];
  users: TweetUserV2[];
  tweets: TweetV2[];
};

export type TweetV2 = {
  id: string;
  text: string;
  author_id: string;
  attachments?: TweetaAttachmentV2;
  created_at: string;
  edit_history_tweet_ids: string[];
  public_metrics: TweetPublicMetricsV2;
  referenced_tweets?: ReferencedTweetV2[];
};

export type TweetV2Response = {
  data?: TweetV2[];
  includes?: TweetIncludesV2;
};

export type CleanTweetV2 = Omit<
  TweetV2,
  'edit_history_tweet_ids' | 'referenced_tweets' | 'attachments' | 'author_id'
>;

export type Tweet = CleanTweetV2 & {
  url: string;
  author: TweetUserV2;
  attachments: TweetMediaV2[];
  referenced_tweets: CleanTweetV2[];
};
