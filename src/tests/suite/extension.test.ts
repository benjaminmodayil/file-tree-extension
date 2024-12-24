import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { suite, test, suiteSetup, suiteTeardown } from 'mocha';
import { generateFileTree } from '../../extension';
import { FileTreeError, ErrorCodes } from '../../errors';

suite('Extension Test Suite', () => {
  const fixturesPath = path.resolve(__dirname, '../../../src/test/fixtures');

  suiteSetup(async () => {
    // Create test fixtures
    await fs.mkdir(fixturesPath, { recursive: true });
    await fs.mkdir(path.join(fixturesPath, 'simple'), { recursive: true });
    await fs.mkdir(path.join(fixturesPath, 'nested'), { recursive: true });
    await fs.mkdir(path.join(fixturesPath, 'nested/dir1'), { recursive: true });
    await fs.mkdir(path.join(fixturesPath, 'nested/dir2'), { recursive: true });

    // Create test files
    await fs.writeFile(path.join(fixturesPath, 'simple/file1.txt'), 'test');
    await fs.writeFile(path.join(fixturesPath, 'simple/file2.txt'), 'test');
    await fs.writeFile(path.join(fixturesPath, 'nested/dir1/file1.txt'), 'test');
    await fs.writeFile(path.join(fixturesPath, 'nested/dir2/file2.txt'), 'test');
  });

  suiteTeardown(async () => {
    // Clean up test fixtures
    await fs.rm(fixturesPath, { recursive: true, force: true });
  });

  test('Generate tree for simple directory', async () => {
    const testDir = path.join(fixturesPath, 'simple');
    const options = {
      ignoredPatterns: ['.git', 'node_modules'],
      maxDepth: 10,
      includeMarkdown: false,
    };

    const tree = await generateFileTree(testDir, '', 0, options);
    assert.match(tree, /├── file1.txt\n└── file2.txt/);
  });

  test('Generates markdown formatted output', async () => {
    const testDir = path.join(fixturesPath, 'simple');
    const options = {
      ignoredPatterns: ['.git', 'node_modules'],
      maxDepth: 10,
      includeMarkdown: true,
    };

    const tree = await generateFileTree(testDir, '', 0, options);
    const finalContent = `Below is a generated filetree. Files within patterns ".git", "node_modules" are ignored.\n\n\`\`\`\n${tree}\`\`\``;

    // Test the command directly
    const uri = vscode.Uri.file(testDir);
    await vscode.commands.executeCommand('filetree-generator.generateTree', uri);

    // Get clipboard content
    const clipboardContent = await vscode.env.clipboard.readText();
    assert.strictEqual(clipboardContent, finalContent);
  });

  test('Respects max depth', async () => {
    const testDir = path.join(fixturesPath, 'nested');
    const options = {
      ignoredPatterns: [],
      maxDepth: 1,
      includeMarkdown: false,
    };

    const tree = await generateFileTree(testDir, '', 0, options);
    assert.match(tree, /├── dir1\n└── dir2/);
    assert.doesNotMatch(tree, /file1.txt/);
    assert.doesNotMatch(tree, /file2.txt/);
  });

  test('Ignores specified patterns', async () => {
    const testDir = path.join(fixturesPath, 'nested');
    const options = {
      ignoredPatterns: ['dir1'],
      maxDepth: 10,
      includeMarkdown: false,
    };

    const tree = await generateFileTree(testDir, '', 0, options);
    assert.doesNotMatch(tree, /dir1/);
    assert.match(tree, /dir2/);
  });

  test('Handles non-existent directory', async () => {
    const testDir = path.join(fixturesPath, 'nonexistent');
    const options = {
      ignoredPatterns: [],
      maxDepth: 10,
      includeMarkdown: false,
    };

    await assert.rejects(
      async () => await generateFileTree(testDir, '', 0, options),
      (error: FileTreeError) => {
        assert.strictEqual(error.code, ErrorCodes.INVALID_PATH);
        return true;
      }
    );
  });

  test('Command is registered', () => {
    const extension = vscode.extensions.getExtension('modayilme.filetree-generator');
    assert.notStrictEqual(extension, undefined);
  });
});
