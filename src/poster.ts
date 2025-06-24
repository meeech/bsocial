import { postToMastodon } from './mastodon.js';
import { postToBluesky } from './bluesky.js';
import { formatError, truncate } from './utils.js';

export async function postToAll(content: string): Promise<void> {
  const results = await Promise.allSettled([
    postToMastodon(content).catch(error => ({
      platform: 'Mastodon',
      error: error instanceof Error ? error.message : String(error)
    })),
    postToBluesky(content).catch(error => ({
      platform: 'Bluesky',
      error: error instanceof Error ? error.message : String(error)
    }))
  ]);

  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map(result => result.reason);

  if (errors.length > 0) {
    const errorMessages = errors.map(err => 
      `- ${err.platform || 'Unknown platform'}: ${truncate(err.error, 200)}`
    ).join('\n');
    
    throw new Error(`Failed to post to some platforms:\n${errorMessages}`);
  }
}
