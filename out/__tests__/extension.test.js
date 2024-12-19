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
const path = __importStar(require("path"));
const extension_1 = require("../extension");
suite('Extension Test Suite', () => {
    test('Generate tree for simple directory', async () => {
        const testDir = path.join(__dirname, '../../src/__tests__/fixtures/simple');
        const options = {
            ignoredPatterns: ['.git', 'node_modules'],
            maxDepth: 10,
        };
        const tree = await (0, extension_1.generateFileTree)(testDir, '', 0, options);
        assert.match(tree, /├── file1.txt\n└── file2.txt/);
    });
    test('Respects max depth', async () => {
        // Add depth test
    });
    test('Ignores specified patterns', async () => {
        // Add ignore pattern test
    });
});
//# sourceMappingURL=extension.test.js.map