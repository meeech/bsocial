export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function formatError(error: unknown): string {
  let errorMessage = error instanceof Error ? error.message : String(error);

  // Redact potential sensitive information
  // Redact Bearer tokens
  errorMessage = errorMessage.replace(
    /Bearer\s+[A-Za-z0-9\-_.~+/]+=*/g, // Removed unnecessary escape from \- and \.
    "Bearer [REDACTED]"
  );
  // Redact password-like strings (common patterns)
  // This first regex handles explicit assignments like "password: secretValue" or "token = myToken"
  errorMessage = errorMessage.replace(
    /\b(password|secret|token|key|api_key|apikey|auth_token|access_token)\s*[:=]\s*['"]?([A-Za-z0-9\-_.~+/=]{4,})['"]?/gi, // Removed unnecessary escape from \- and \.
    '$1: "[REDACTED]"'
  );
  // This second regex handles cases like "User password mySuperSecretPassword123"
  // It's more specific to 'password' and 'secret' to avoid false positives on 'key' or 'token'
  errorMessage = errorMessage.replace(
    /\b(password|secret)\s+([A-Za-z0-9\-_.~+/=]+)/gi, // Removed unnecessary escape from \- and \.
    (match, p1, _p2) => {
      // p2 is unused in the replacement logic, so prefix with _
      // p1 is 'password' or 'secret'
      return `${p1}: "[REDACTED]"`;
    }
  );

  return errorMessage;
}

export function truncate(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}
