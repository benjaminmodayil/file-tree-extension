# File Tree to Text

A Visual Studio Code extension that generates a text representation of your folder structure and copies it to your clipboard.

## Features

- Generate a visual tree representation of any folder structure
- Right-click on any folder in the VS Code explorer to generate its tree
- Automatically copies the tree to your clipboard
- Configurable ignored patterns and depth settings
- Automatically ignores common system folders (.git, node_modules, .DS_Store)

## Usage

1. Right-click on any folder in the VS Code explorer
2. Select "Generate File Tree" from the context menu
3. The folder structure will be copied to your clipboard

## Example Output

```
├── .env
├── .env.local
├── .env.local.sample
├── .env.sample
├── .gitignore
├── README.md
├── app.ts
├── bun.lockb
├── bunfig.toml
├── data
│   └── card-list.json
├── handlers
│   ├── auth.ts
│   ├── example.ts
│   └── onePiece.ts
├── index.ts
├── out
│   └── index.js
├── package-lock.json
├── package.json
├── routes
���   ├── example.ts
│   └── onePiece.ts
├── schemas
│   ├── example.ts
│   └── onePiece.ts
├── scratchpad.ts
├── scripts
│   ├── generateCardList.ts
│   └── identify-image.js
├── types.ts
└── utils
    ├── index.ts
    └── pagination
        └── numbered.tsx

```

## Extension Settings

This extension contributes the following settings:

- `filetreeGenerator.ignoredPatterns`: Additional patterns to ignore when generating the file tree
- `filetreeGenerator.maxDepth`: Maximum depth to traverse when generating the file tree (default: 10)

Example settings.json:

```json
{
  "filetreeGenerator.ignoredPatterns": ["dist", "coverage", ".env"],
  "filetreeGenerator.maxDepth": 15
}
```

## Development

### Prerequisites

- Node.js
- npm
- Visual Studio Code

### Setup

1. Clone the repository

```bash
git clone https://github.com/benjaminmodayil/file-tree-extension.git
cd file-tree-extension
```

2. Install dependencies

```bash
npm install
```

3. Open in VS Code

```bash
code .
```

### Development Commands

- `npm run compile`: Compile the TypeScript code
- `npm run watch`: Watch for changes and recompile
- `npm run lint`: Run ESLint

### Testing the Extension

1. Press F5 in VS Code to launch the extension in debug mode
2. In the new VS Code window that opens, right-click on any folder
3. Select "Generate File Tree" from the context menu

### Building and Publishing

1. Update version in package.json
2. Run `vsce package` to create .vsix file
3. Run `vsce publish` to publish to marketplace

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
