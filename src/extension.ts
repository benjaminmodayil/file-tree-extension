import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface TreeOptions {
  ignoredPatterns: string[];
  maxDepth: number;
  includeMarkdown: boolean;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'filetree-generator.generateTree',
    async (uri: vscode.Uri) => {
      if (!uri) {
        vscode.window.showErrorMessage(
          'Please right-click on a folder to generate its file tree.'
        );
        return;
      }

      try {
        const config = vscode.workspace.getConfiguration('filetreeGenerator');
        const configuredPatterns = config.get<string[]>('ignoredPatterns', []);
        const defaultPatterns = ['.git', 'node_modules', '.DS_Store'];

        const options: TreeOptions = {
          ignoredPatterns: [...new Set([...defaultPatterns, ...configuredPatterns])],
          maxDepth: config.get<number>('maxDepth', 10),
          includeMarkdown: config.get<boolean>('includeMarkdown', false),
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
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'File tree copied to clipboard!',
            cancellable: false,
          },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(`Error generating file tree: ${error.message}`);
        } else {
          vscode.window.showErrorMessage(
            'An unknown error occurred while generating the file tree'
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export async function generateFileTree(
  rootPath: string,
  prefix: string = '',
  depth: number = 0,
  options: TreeOptions
): Promise<string> {
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

export function deactivate() {}
