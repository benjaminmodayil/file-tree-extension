"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const mocha_1 = require("mocha");
const extension_1 = require("../../extension");
const errors_1 = require("../../errors");
(0, mocha_1.suite)('Extension Test Suite', () => {
    const fixturesPath = path.resolve(__dirname, '../../../src/test/fixtures');
    (0, mocha_1.suiteSetup)(async () => {
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
    (0, mocha_1.suiteTeardown)(async () => {
        // Clean up test fixtures
        await fs.rm(fixturesPath, { recursive: true, force: true });
    });
    (0, mocha_1.test)('Generate tree for simple directory', async () => {
        const testDir = path.join(fixturesPath, 'simple');
        const options = {
            ignoredPatterns: ['.git', 'node_modules'],
            maxDepth: 10,
            includeMarkdown: false,
        };
        const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
        assert.match(tree, /├── file1.txt\n└── file2.txt/);
    });
    (0, mocha_1.test)('Generates markdown formatted output', async () => {
        const testDir = path.join(fixturesPath, 'simple');
        const options = {
            ignoredPatterns: ['.git', 'node_modules'],
            maxDepth: 10,
            includeMarkdown: true,
        };
        const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
        const finalContent = `Below is a generated filetree. Files within patterns ".git", "node_modules" are ignored.\n\n\`\`\`\n${tree}\`\`\``;
        // Test the command directly
        const uri = vscode.Uri.file(testDir);
        await vscode.commands.executeCommand('filetree-generator.generateTree', uri);
        // Get clipboard content
        const clipboardContent = await vscode.env.clipboard.readText();
        assert.strictEqual(clipboardContent, finalContent);
    });
    (0, mocha_1.test)('Respects max depth', async () => {
        const testDir = path.join(fixturesPath, 'nested');
        const options = {
            ignoredPatterns: [],
            maxDepth: 1,
            includeMarkdown: false,
        };
        const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
        assert.match(tree, /├── dir1\n└── dir2/);
        assert.doesNotMatch(tree, /file1.txt/);
        assert.doesNotMatch(tree, /file2.txt/);
    });
    (0, mocha_1.test)('Ignores specified patterns', async () => {
        const testDir = path.join(fixturesPath, 'nested');
        const options = {
            ignoredPatterns: ['dir1'],
            maxDepth: 10,
            includeMarkdown: false,
        };
        const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
        assert.doesNotMatch(tree, /dir1/);
        assert.match(tree, /dir2/);
    });
    (0, mocha_1.test)('Handles non-existent directory', async () => {
        const testDir = path.join(fixturesPath, 'nonexistent');
        const options = {
            ignoredPatterns: [],
            maxDepth: 10,
            includeMarkdown: false,
        };
        await assert.rejects(async () => await (0, extension_1.generateFileTree)(testDir, '', 0, options), (error) => {
            assert.strictEqual(error.code, errors_1.ErrorCodes.INVALID_PATH);
            return true;
        });
    });
    (0, mocha_1.test)('Command is registered', () => {
        const extension = vscode.extensions.getExtension('modayilme.filetree-generator');
        assert.notStrictEqual(extension, undefined);
    });
});
//# sourceMappingURL=extension.test.js.map