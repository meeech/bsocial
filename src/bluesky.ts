import { BskyAgent, RichText } from '@atproto/api';

const BLUESKY_IDENTIFIER = process.env.BLUESKY_IDENTIFIER;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

export async function postToBluesky(content: string): Promise<void> {
  if (!BLUESKY_IDENTIFIER || !BLUESKY_PASSWORD) {
    console.warn('BLUESKY_IDENTIFIER or BLUESKY_PASSWORD not set, skipping Bluesky post');
    return;
  }

  const agent = new BskyAgent({
    service: 'https://bsky.social',
  });

  await agent.login({
    identifier: BLUESKY_IDENTIFIER,
    password: BLUESKY_PASSWORD,
  });

  const rt = new RichText({ text: content });
  await rt.detectFacets(agent);

  await agent.post({
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  });
}
