import { readFileSync } from 'fs';
import { postToAll } from '../poster.js';
import * as cli from '../cli.js';

// Mock dependencies
jest.mock('fs');
jest.mock('../poster.js');

describe('CLI', () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`Process exited with code ${code}`);
  });
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (readFileSync as jest.Mock).mockReset();
    (postToAll as jest.Mock).mockReset();
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it('should read file and call postToAll with content', async () => {
    const mockContent = 'Test post content';
    (readFileSync as jest.Mock).mockReturnValue(mockContent);
    
    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ['node', 'cli.js', '-f', 'test.md'];

    // Import the CLI module after setting up mocks
    const { main } = await import('../cli.js');
    
    await main();

    expect(readFileSync).toHaveBeenCalledWith('test.md', 'utf-8');
    expect(postToAll).toHaveBeenCalledWith(mockContent);
    
    // Restore process.argv
    process.argv = originalArgv;
  });

  it('should handle file read errors', async () => {
    const mockError = new Error('File not found');
    (readFileSync as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ['node', 'cli.js', '-f', 'nonexistent.md'];

    // Import the CLI module after setting up mocks
    const { main } = await import('../cli.js');
    
    await expect(main()).rejects.toThrow('Process exited with code 1');
    expect(console.error).toHaveBeenCalledWith('Error:', 'File not found');
    
    // Restore process.argv
    process.argv = originalArgv;
  });
});
