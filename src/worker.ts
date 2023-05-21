import { apiParams, sanitizeResponse } from './lib/twitter';
import { TweetV2Response } from './types/tweet';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(apiParams);

    const ids = url.searchParams.get('ids');
    const authorization = request.headers.get('Authorization');

    if (request.method !== 'GET') {
      return new Response('405 Method Not Allowed', {
        status: 405,
      });
    }

    if (authorization === null || authorization !== env.BEARER_TOKEN) {
      return new Response('401 Unauthorized', {
        status: 401,
      });
    }

    const cache = await env.API_EDNOESCO.get('json');

    if (cache) {
      return new Response(cache, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
    const json = JSON.stringify(sanitized);

    await env.API_EDNOESCO.put('json', json, { expirationTtl: 60 * 10 });

    return new Response(json, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
