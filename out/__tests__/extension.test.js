"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path_1 = __importDefault(require("path"));
const extension_1 = require("../extension");
test('Generate tree for simple directory', async () => {
    const testDir = path_1.default.join(__dirname, '../../src/__tests__/fixtures/simple');
    const options = {
        ignoredPatterns: ['.git', 'node_modules'],
        maxDepth: 10,
        includeMarkdown: false,
    };
    const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
    assert_1.default.match(tree, /├── file1.txt\n└── file2.txt/);
});
test('Respects max depth', async () => {
    // Add depth test
});
test('Ignores specified patterns', async () => {
    // Add ignore pattern test
});
//# sourceMappingURL=extension.test.js.map