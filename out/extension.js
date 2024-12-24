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
exports.deactivate = exports.generateFileTree = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('filetree-generator.generateTree', async (uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('Please right-click on a folder to generate its file tree.');
            return;
        }
        try {
            const config = vscode.workspace.getConfiguration('filetreeGenerator');
            const configuredPatterns = config.get('ignoredPatterns', []);
            const defaultPatterns = ['.git', 'node_modules', '.DS_Store'];
            const options = {
                ignoredPatterns: [...new Set([...defaultPatterns, ...configuredPatterns])],
                maxDepth: config.get('maxDepth', 10),
                includeMarkdown: config.get('includeMarkdown', false),
            };
            const treeContent = await generateFileTree(uri.fsPath, '', 0, options);
            let finalContent = treeContent;
            if (options.includeMarkdown) {
                const ignoredPatternsText = options.ignoredPatterns
                    .map((p) => `"${p}"`)
                    .join(', ');
                finalContent = `Below is a generated filetree. Files within patterns ${ignoredPatternsText} are ignored.\n\n\`\`\`\n${treeContent}\`\`\``;
            }
            await vscode.env.clipboard.writeText(finalContent);
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'File tree copied to clipboard!',
                cancellable: false,
            }, async () => {
                await new Promise((resolve) => setTimeout(resolve, 1500));
            });
        }
        catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error generating file tree: ${error.message}`);
            }
            else {
                vscode.window.showErrorMessage('An unknown error occurred while generating the file tree');
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function generateFileTree(rootPath, prefix = '', depth = 0, options) {
    if (depth >= options.maxDepth) {
        return '';
    }
    let output = '';
    const files = await fs.promises.readdir(rootPath);
    const filteredFiles = files.filter((file) => {
        const fullPath = path.join(rootPath, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        return !(!isDirectory && options.ignoredPatterns.includes(file));
    });
    for (let i = 0; i < filteredFiles.length; i++) {
        const file = filteredFiles[i];
        const fullPath = path.join(rootPath, file);
        const stats = await fs.promises.stat(fullPath);
        const isLast = i === filteredFiles.length - 1;
        const branchSymbol = isLast ? '└── ' : '├── ';
        output += `${prefix}${branchSymbol}${file}\n`;
        if (stats.isDirectory()) {
            if (!options.ignoredPatterns.includes(file)) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                output += await generateFileTree(fullPath, newPrefix, depth + 1, options);
            }
        }
    }
    return output;
}
exports.generateFileTree = generateFileTree;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map