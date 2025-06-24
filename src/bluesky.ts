import { BskyAgent, RichText } from '@atproto/api';
import { ConfigError } from './utils.js';

const BLUESKY_IDENTIFIER = process.env.BLUESKY_IDENTIFIER;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

// Bluesky's post limits
const MAX_POST_LENGTH = 300;
const MAX_LINK_LENGTH = 30; // Approximate length of a t.co link

export async function postToBluesky(content: string): Promise<void> {
  if (!BLUESKY_IDENTIFIER || !BLUESKY_PASSWORD) {
    throw new ConfigError('BLUESKY_IDENTIFIER or BLUESKY_PASSWORD is not set');
  }

  // Basic content validation
  if (!content.trim()) {
    throw new Error('Post content cannot be empty');
  }

  // Check post length (approximate, as Bluesky counts links differently)
  const estimatedLength = estimatePostLength(content);
  if (estimatedLength > MAX_POST_LENGTH) {
    throw new Error(`Post is too long (estimated ${estimatedLength} characters). Maximum is ${MAX_POST_LENGTH}.`);
  }

  const agent = new BskyAgent({
    service: 'https://bsky.social',
  });

  try {
    // Login
    const loginResult = await agent.login({
      identifier: BLUESKY_IDENTIFIER,
      password: BLUESKY_PASSWORD,
    });

    if (!loginResult.success) {
      throw new Error('Failed to authenticate with Bluesky');
    }

    // Process text and detect facets (mentions, links, etc.)
    const rt = new RichText({ text: content });
    await rt.detectFacets(agent);

    // Post the content
    const postResult = await agent.post({
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    });

    if (!postResult.uri) {
      throw new Error('Unexpected response from Bluesky API');
    }
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new Error(`Failed to post to Bluesky: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Estimate the length of a post as Bluesky would count it.
 * This is approximate as the actual counting is done by Bluesky's servers.
 */
function estimatePostLength(text: string): number {
  // Simple approximation: count all characters, links as MAX_LINK_LENGTH
  // This is not perfect but gives a reasonable estimate
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let length = text.length;
  let match;
  
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    length = length - url.length + Math.min(url.length, MAX_LINK_LENGTH);
  }
  
  return length;
}
