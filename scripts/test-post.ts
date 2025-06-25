#!/usr/bin/env node
import { postToAll } from "../src/poster.js";
import { loadAppConfig } from "../src/config.js"; // dotenv.config() is called within loadAppConfig

async function runTest() {
  const appConfig = loadAppConfig(); // Load configuration
  const testContent = `Hello from bsocial test script!\n\nThis is a test post sent directly via the API.\n\n#bsocial #test #${Date.now()}`;

  console.log("Testing with content:");
  console.log("---");
  console.log(testContent);
  console.log("---\n");

  try {
    console.log("Posting to all platforms...");
    await postToAll(appConfig, testContent);
    console.log("✅ Successfully posted to all platforms!");
  } catch (error) {
    console.error("❌ Error posting:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

runTest().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
