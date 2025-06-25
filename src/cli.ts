#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { postToAll } from "./poster.js";
// dotenv is imported and config called within loadAppConfig
import { readFileSync } from "fs";
import { ConfigError, formatError } from "./utils.js";
import { loadAppConfig } from "./config.js";

export async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("file", {
      alias: "f",
      type: "string",
      description: "Path to the markdown file to post",
      demandOption: true,
    })
    .option("dry-run", {
      type: "boolean",
      description: "Run without actually posting",
      default: false,
    })
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version")
    .parse();

  try {
    // Load and validate configuration
    const appConfig = loadAppConfig();

    // Read and validate content
    let content: string;
    try {
      content = readFileSync(argv.file, "utf-8").trim();
      if (!content) {
        throw new Error("File is empty");
      }
    } catch (error) {
      throw new Error(
        `Failed to read file '${argv.file}': ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    console.log(
      `Posting content (${content.length} characters):\n---\n${content}\n---`
    );

    if (argv["dry-run"]) {
      console.log("Dry run: No posts were made");
      return;
    }

    await postToAll(appConfig, content);
    console.log("✅ Successfully posted to all platforms");
  } catch (error) {
    if (error instanceof ConfigError) {
      console.error("❌ Configuration error:", error.message);
    } else {
      console.error("❌ Error:", formatError(error));
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Unhandled error:", formatError(error));
  process.exit(1);
});
