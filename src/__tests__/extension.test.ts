import assert from 'assert';
import path from 'path';
import { generateFileTree } from '../extension';

test('Generate tree for simple directory', async () => {
  const testDir = path.join(__dirname, '../../src/__tests__/fixtures/simple');
  const options = {
    ignoredPatterns: ['.git', 'node_modules'],
    maxDepth: 10,
    includeMarkdown: false,
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
