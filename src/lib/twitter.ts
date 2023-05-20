import {
  ReferencedTweetV2,
  Tweet,
  TweetMediaV2,
  TweetUserV2,
  TweetV2,
  TweetaAttachmentV2,
} from '../types/tweet';

export const apiParams = {
  expansions: [
    'author_id',
    'referenced_tweets.id',
    'attachments.media_keys',
    'referenced_tweets.id.author_id',
  ].join(','),
  'tweet.fields': [
    'id',
    'text',
    'author_id',
    'created_at',
    'attachments',
    'public_metrics',
    'referenced_tweets',
  ].join(','),
  'user.fields': [
    'id',
    'url',
    'name',
    'username',
    'verified',
    'profile_image_url',
  ].join(','),
  'media.fields': [
    'url',
    'type',
    'width',
    'height',
    'media_key',
    'duration_ms',
    'public_metrics',
    'preview_image_url',
  ].join(','),
};

export function sanitizeResponse(
  data: TweetV2[],
  media: TweetMediaV2[],
  users: TweetUserV2[],
  tweets: TweetV2[]
) {
  function getUrl(username: string, tweetId: string): string {
    return `https://twitter.com/${username}/status/${tweetId}`;
  }

  function getAuthor(authorId: string): TweetUserV2 {
    const author = users.find((user) => user.id === authorId);

    return (
      author ?? {
        id: '',
        name: 'User not found',
        profile_image_url: '',
        url: '',
        username: '',
        verified: false,
      }
    );
  }

  function getAttachments(
    media_keys: TweetaAttachmentV2['media_keys'] = []
  ): TweetMediaV2[] {
    return media.filter(({ media_key }) => media_keys.includes(media_key));
  }

  function getReferencedTweets(referencedTweets: ReferencedTweetV2[]): Tweet[] {
    return tweets
      .filter((tweet) => referencedTweets.some(({ id }) => id === tweet.id))
      .map(transformTweet);
  }

  function transformTweet(tweet: TweetV2): Tweet {
    const {
      id,
      author_id,
      created_at,
      public_metrics,
      text,
      attachments: apiAttachments,
      referenced_tweets: apiReferencedTweets,
    } = tweet;

    const author = getAuthor(author_id);
    const url = getUrl(author.username, id);

    const attachments = getAttachments(apiAttachments?.media_keys);
    const referenced_tweets = getReferencedTweets(apiReferencedTweets ?? []);

    return {
      id,
      url,
      text,
      author,
      created_at,
      attachments,
      public_metrics,
      referenced_tweets,
    };
  }

  return function (): Tweet[] {
    return data.map(transformTweet);
  };
}
