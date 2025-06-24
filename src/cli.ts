#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { postToAll } from './poster.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('file', {
      alias: 'f',
      type: 'string',
      description: 'Path to the markdown file to post',
      demandOption: true,
    })
    .help()
    .alias('h', 'help')
    .version()
    .alias('v', 'version')
    .parse();

  try {
    const content = readFileSync(argv.file, 'utf-8');
    await postToAll(content);
    console.log('Successfully posted to all platforms');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(console.error);
