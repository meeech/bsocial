export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function validateEnv() {
  const requiredVars = {
    MASTODON_ACCESS_TOKEN: "Mastodon access token",
    BLUESKY_IDENTIFIER: "Bluesky identifier (handle)",
    BLUESKY_PASSWORD: "Bluesky app password",
  } as const;

  const missingVars = Object.entries(requiredVars)
    .filter(([varName]) => !process.env[varName])
    .map(([_, friendlyName]) => friendlyName);

  if (missingVars.length > 0) {
    throw new ConfigError(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        "Please check your .env file."
    );
  }
}

export function formatError(error: unknown): string {
  let errorMessage = error instanceof Error ? error.message : String(error);

  // Redact potential sensitive information
  // Redact Bearer tokens
  errorMessage = errorMessage.replace(
    /Bearer\s+[A-Za-z0-9\-_\.~+/]+=*/g,
    "Bearer [REDACTED]"
  );
  // Redact password-like strings (common patterns)
  // This first regex handles explicit assignments like "password: secretValue" or "token = myToken"
  errorMessage = errorMessage.replace(
    /\b(password|secret|token|key|api_key|apikey|auth_token|access_token)\s*[:=]\s*['"]?([A-Za-z0-9\-_\.~+/=]{4,})['"]?/gi,
    '$1: "[REDACTED]"'
  );
  // This second regex handles cases like "User password mySuperSecretPassword123"
  // It's more specific to 'password' and 'secret' to avoid false positives on 'key' or 'token'
  // and requires the value to be reasonably long.
  errorMessage = errorMessage.replace(
    /\b(password|secret)\s+([A-Za-z0-9\-_\.~+/=]+)/gi, // Removed {8,} length constraint for password/secret
    (match, p1, p2) => {
      // p1 is 'password' or 'secret', p2 is the value
      return `${p1}: "[REDACTED]"`;
    }
  );

  return errorMessage;
}

export function truncate(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}
