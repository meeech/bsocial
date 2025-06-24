export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function validateEnv() {
  const requiredVars = {
    'MASTODON_ACCESS_TOKEN': 'Mastodon access token',
    'BLUESKY_IDENTIFIER': 'Bluesky identifier (handle)',
    'BLUESKY_PASSWORD': 'Bluesky app password'
  } as const;

  const missingVars = Object.entries(requiredVars)
    .filter(([varName]) => !process.env[varName])
    .map(([_, friendlyName]) => friendlyName);

  if (missingVars.length > 0) {
    throw new ConfigError(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file.'
    );
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function truncate(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}
