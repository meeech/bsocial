We are writing a script that can take a post, and send it to mastodon API and Bluesky API.
This will be a tool we launch from the cli. We can point it to a .md file which has the contents we want posted. So the ux is something like

npx bsocial -f post.md
We can configure API keys, endpoints in a .env file.

This should be kept simple. Add some basic unit tests you can run to validate you break anything as we work.
Focus on the basic task - be mindful of YAGNI.
So make a simple plan for this. It should be checklist style so we can tick things off as they're done.
