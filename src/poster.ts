import { postToMastodon } from "./mastodon.js";
import { postToBluesky } from "./bluesky.js";
import { truncate } from "./utils.js";
import { AppConfig } from "./config.js"; // Import AppConfig

interface PostError {
  platform: string;
  error: string;
}

export async function postToAll(
  appConfig: AppConfig,
  content: string
): Promise<void> {
  const results = await Promise.allSettled([
    postToMastodon(appConfig.mastodon, content).catch(
      (error): PostError => ({
        platform: "Mastodon",
        error: error instanceof Error ? error.message : String(error),
      })
    ),
    postToBluesky(appConfig.bluesky, content).catch(
      (error): PostError => ({
        platform: "Bluesky",
        error: error instanceof Error ? error.message : String(error),
      })
    ),
  ]);

  // All promises in 'results' will be fulfilled because of the inner .catch
  // Their 'value' will be the original success type (e.g., void) or PostError
  // All promises in 'results' are fulfilled because of the inner .catch.
  // Their 'value' will be either 'void' (on success) or 'PostError' (on caught error).
  const errors: PostError[] = results
    .filter(
      // This type predicate asserts that we are only dealing with fulfilled promises
      // and that their value is of type void | PostError.
      (result): result is PromiseFulfilledResult<void | PostError> =>
        result.status === "fulfilled"
    )
    .map((fulfilledResult) => fulfilledResult.value) // Extract the value
    .filter((value): value is PostError => {
      // This type guard filters out 'void' values and confirms 'value' is a PostError.
      return (
        typeof value === "object" &&
        value !== null &&
        "platform" in value &&
        typeof value.platform === "string" &&
        "error" in value &&
        typeof value.error === "string"
      );
    });

  if (errors.length > 0) {
    const errorMessages = errors
      .map(
        (
          err: PostError // err is now definitely PostError
        ) => `- ${err.platform}: ${truncate(err.error, 200)}`
      )
      .join("\n");

    throw new Error(`Failed to post to some platforms:\n${errorMessages}`);
  }
}
