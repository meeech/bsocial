# 🐝 bsocial (broadcast social)

A simple CLI tool to post to multiple social media platforms from a markdown file.

## Features

- Post to Mastodon and Bluesky simultaneously
- Simple markdown file input
- Environment-based configuration
- Dry-run mode for testing
- Input validation and error handling

## Installation

```bash
# Install globally
npm install -g broadcast-social

# Or use with npx
npx bsocial -f your-post.md
```

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your API credentials:
   ```env
   # Mastodon Configuration
   MASTODON_ACCESS_TOKEN=your_mastodon_access_token
   MASTODON_API_URL=https://mastodon.social/api/v1

   # Bluesky Configuration
   BLUESKY_IDENTIFIER=your_handle.bsky.social
   BLUESKY_PASSWORD=your_app_password
   ```

## Usage

```bash
# Basic usage
bsocial -f path/to/your-post.md

# Dry run (validate without posting)
bsocial -f path/to/your-post.md --dry-run

# Show help
bsocial --help
```

### Post Format

Create a markdown file with your post content:

```markdown
# This is a test post

Hello world! This post will be published to both Mastodon and Bluesky.

#hashtag #test
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

## License

MIT

## Note

Agentic Development involved in produciton of this code.
