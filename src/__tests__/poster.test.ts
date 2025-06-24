import { postToAll } from '../poster.js';
import * as mastodon from '../mastodon.js';
import * as bluesky from '../bluesky.js';

// Mock the modules
jest.mock('../mastodon.js');
jest.mock('../bluesky.js');

describe('postToAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call both Mastodon and Bluesky posting functions', async () => {
    const mockContent = 'Test post content';
    
    // Setup mocks
    (mastodon.postToMastodon as jest.Mock).mockResolvedValue(undefined);
    (bluesky.postToBluesky as jest.Mock).mockResolvedValue(undefined);

    await postToAll(mockContent);

    expect(mastodon.postToMastodon).toHaveBeenCalledWith(mockContent);
    expect(bluesky.postToBluesky).toHaveBeenCalledWith(mockContent);
  });

  it('should not throw if one service fails', async () => {
    const mockContent = 'Test post content';
    const mockError = new Error('API Error');
    
    // Setup mocks - Mastodon fails, Bluesky succeeds
    (mastodon.postToMastodon as jest.Mock).mockRejectedValue(mockError);
    (bluesky.postToBluesky as jest.Mock).mockResolvedValue(undefined);

    // Should not throw
    await expect(postToAll(mockContent)).resolves.not.toThrow();
    
    // Both should still be called
    expect(mastodon.postToMastodon).toHaveBeenCalledWith(mockContent);
    expect(bluesky.postToBluesky).toHaveBeenCalledWith(mockContent);
  });
});
