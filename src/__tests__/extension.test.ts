import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateFileTree } from '../extension';

suite('Extension Test Suite', () => {
  test('Generate tree for simple directory', async () => {
    const testDir = path.join(__dirname, '../../src/__tests__/fixtures/simple');
    const options = {
      ignoredPatterns: ['.git', 'node_modules'],
      maxDepth: 10,
    };

    const tree = await generateFileTree(testDir, '', 0, options);
    assert.match(tree, /├── file1.txt\n└── file2.txt/);
  });

  test('Respects max depth', async () => {
    // Add depth test
  });

  test('Ignores specified patterns', async () => {
    // Add ignore pattern test
  });
});
