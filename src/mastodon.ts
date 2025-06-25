import { ConfigError } from "./utils.js";
import { MastodonConfig } from "./config.js"; // Import MastodonConfig

// Using built-in fetch API available in Node.js 18+
// No need to import or declare it

const MAX_POST_LENGTH = 500; // Mastodon's default post length

export async function postToMastodon(
  config: MastodonConfig,
  content: string
): Promise<void> {
  // ConfigError for missing token/URL is now handled by loadAppConfig

  if (content.length > MAX_POST_LENGTH) {
    throw new Error(
      `Post is too long (${content.length} characters). Maximum is ${MAX_POST_LENGTH}.`
    );
  }

  try {
    const response = await fetch(`${config.apiUrl}/statuses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.accessToken}`,
        "Idempotency-Key": generateIdempotencyKey(content),
      },
      body: JSON.stringify({
        status: content,
        visibility: "public",
      }),
    });

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorData = (await response.json()) as { error?: string };
        errorDetails = errorData.error ? `: ${errorData.error}` : "";
      } catch (_e) {
        // Failed to parse error response
      }
      throw new Error(
        `Mastodon API error (${response.status} ${response.statusText})${errorDetails}`
      );
    }

    // Verify the response
    const result = (await response.json()) as { id?: string };
    if (!result.id) {
      throw new Error("Unexpected response from Mastodon API");
    }
  } catch (error) {
    if (error instanceof ConfigError) {
      throw error;
    }
    throw new Error(
      `Failed to post to Mastodon: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function generateIdempotencyKey(content: string): string {
  // Simple hash function for generating a consistent idempotency key
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `bsocial-${hash}`;
}
