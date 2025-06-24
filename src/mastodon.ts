import fetch from 'node-fetch';

const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;
const MASTODON_API_URL = process.env.MASTODON_API_URL || 'https://mastodon.social/api/v1';

export async function postToMastodon(content: string): Promise<void> {
  if (!MASTODON_ACCESS_TOKEN) {
    console.warn('MASTODON_ACCESS_TOKEN not set, skipping Mastodon post');
    return;
  }

  const response = await fetch(`${MASTODON_API_URL}/statuses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MASTODON_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      status: content,
      visibility: 'public'
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Mastodon API error: ${response.status} ${response.statusText} - ${JSON.stringify(error)}`);
  }
}
