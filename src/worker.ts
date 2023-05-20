import { apiParams, sanitizeResponse } from './lib/twitter';
import { TweetV2Response } from './types/tweet';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const ids = url.searchParams.get('ids');
    const queryParams = new URLSearchParams(apiParams);

    const response = await fetch(
      `https://api.twitter.com/2/tweets?ids=${ids}&${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${env.TWITTER_API_KEY}`,
        },
      }
    );

    const {
      data = [],
      includes: { media = [], users = [], tweets = [] } = {
        media: [],
        users: [],
        tweets: [],
      },
    } = await response.json<TweetV2Response>();

    const sanitized = sanitizeResponse(data, media, users, tweets)();

    return new Response(JSON.stringify(sanitized), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
