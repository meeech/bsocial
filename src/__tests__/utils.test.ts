import { describe, it, expect } from "vitest";
import { formatError } from "../utils.js";

describe("formatError", () => {
  it("should return the message from an Error object", () => {
    const error = new Error("Test error message");
    expect(formatError(error)).toBe("Test error message");
  });

  it("should convert a non-Error object to a string", () => {
    expect(formatError("A simple string error")).toBe("A simple string error");
    expect(formatError(123)).toBe("123");
  });

  it("should redact Bearer tokens", () => {
    const errorMessage =
      "API Error: Invalid token Bearer abc123XYZ.foo-bar_baz~+/=";
    expect(formatError(errorMessage)).toBe(
      "API Error: Invalid token Bearer [REDACTED]"
    );
  });

  it("should redact password-like strings with common keywords", () => {
    expect(formatError('Error: password: "supersecret"')).toBe(
      'Error: password: "[REDACTED]"'
    );
    expect(formatError('Details: secret="anotherSecretValue"')).toBe(
      'Details: secret: "[REDACTED]"'
    );
    expect(formatError("Config: token = myTokenValue123")).toBe(
      'Config: token: "[REDACTED]"'
    );
    expect(formatError('Auth: api_key: "key_abc123"')).toBe(
      'Auth: api_key: "[REDACTED]"'
    );
  });

  it("should redact simple password values if they appear after specific keywords and are long enough", () => {
    expect(formatError("User password myverylongpassword")).toBe(
      'User password: "[REDACTED]"'
    );
    expect(formatError("User secret thisisalsoasecret")).toBe(
      'User secret: "[REDACTED]"'
    );
  });

  it('should not redact short values unless keyword is "password" or "secret"', () => {
    expect(formatError("User token short")).toBe("User token short"); // Not redacted
    expect(formatError("User key tiny")).toBe("User key tiny"); // Not redacted
    expect(formatError("User password short")).toBe(
      'User password: "[REDACTED]"'
    ); // Redacted due to "password"
  });

  it("should handle mixed content with redaction", () => {
    const complexError =
      'Failed due to: Bearer oldToken123 and password: "myOldPassword" and some other info.';
    const expected =
      'Failed due to: Bearer [REDACTED] and password: "[REDACTED]" and some other info.';
    expect(formatError(complexError)).toBe(expected);
  });

  it("should not redact normal text that might look like a pattern", () => {
    expect(formatError("This is a normal message without secrets.")).toBe(
      "This is a normal message without secrets."
    );
    expect(formatError("The key to success is hard work.")).toBe(
      "The key to success is hard work."
    );
  });
});
