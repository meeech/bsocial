import { postToMastodon } from './mastodon.js';
import { postToBluesky } from './bluesky.js';

export async function postToAll(content: string): Promise<void> {
  await Promise.all([
    postToMastodon(content).catch(console.error),
    postToBluesky(content).catch(console.error)
  ]);
}
