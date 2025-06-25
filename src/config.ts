import dotenv from "dotenv";
import { ConfigError } from "./utils.js";

export interface MastodonConfig {
  accessToken: string;
  apiUrl: string;
}

export interface BlueskyConfig {
  identifier: string;
  password: string;
}

export interface AppConfig {
  mastodon: MastodonConfig;
  bluesky: BlueskyConfig;
}

export function loadAppConfig(): AppConfig {
  // Ensure dotenv is configured at the earliest point possible within this loading logic
  dotenv.config();

  const mastodonAccessToken = process.env.MASTODON_ACCESS_TOKEN;
  const mastodonApiUrl = process.env.MASTODON_API_URL;
  const blueskyIdentifier = process.env.BLUESKY_IDENTIFIER;
  const blueskyPassword = process.env.BLUESKY_PASSWORD;

  const missingVars: string[] = [];
  if (!mastodonAccessToken) missingVars.push("MASTODON_ACCESS_TOKEN");
  if (!mastodonApiUrl) missingVars.push("MASTODON_API_URL");
  if (!blueskyIdentifier) missingVars.push("BLUESKY_IDENTIFIER");
  if (!blueskyPassword) missingVars.push("BLUESKY_PASSWORD");

  if (missingVars.length > 0) {
    throw new ConfigError(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        "Please check your .env file or environment configuration."
    );
  }

  // The '!' asserts that these values are non-null, which is safe due to the check above.
  return {
    mastodon: {
      accessToken: mastodonAccessToken!,
      apiUrl: mastodonApiUrl!,
    },
    bluesky: {
      identifier: blueskyIdentifier!,
      password: blueskyPassword!,
    },
  };
}
