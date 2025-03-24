# How to Use the Jira Assets CLI

There are several ways to use the Jira Assets CLI tool:

## 1. Setup

First, make sure you have all dependencies installed:

```bash
npm install
```

Then build the project:

```bash
npm run build
```

## 2. Use the Shell Script Wrapper (Recommended)

The easiest way is to use the included shell script wrapper:

```bash
# Make the script executable (only needed once)
chmod +x jira-assets.sh

# Show help information
./jira-assets.sh --help

# Configure your Jira connection
./jira-assets.sh config

# List all schemas
./jira-assets.sh schemas

# Get objects from a schema (replace 1 with your schema ID)
./jira-assets.sh objects --schema 1

# Search for objects with IQL
./jira-assets.sh search --query "objectType = Server"

# Get JSON output for MCP integration
./jira-assets.sh search --query "objectType = Server" --json
```

## 3. Run Commands Directly with Node

Alternatively, you can run the CLI commands directly using Node:

```bash
# Show help information
node dist/index.js --help

# Configure your Jira connection
node dist/index.js config

# List all schemas
node dist/index.js schemas

# Get objects from a schema (replace 1 with your schema ID)
node dist/index.js objects --schema 1

# Search for objects with IQL
node dist/index.js search --query "objectType = Server"

# Get JSON output for MCP integration
node dist/index.js search --query "objectType = Server" --json
```

## 4. Create a Shell Alias (Optional)

For easier usage, you can create a shell alias:

In bash/zsh (add to your `~/.bashrc` or `~/.zshrc`):

```bash
alias jira-assets="node /full/path/to/your/project/dist/index.js"
```

Replace `/full/path/to/your/project` with the actual full path to your project directory.

After adding the alias, reload your shell configuration:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

Then you can use it like:

```bash
jira-assets --help
jira-assets config
jira-assets schemas
```

## MCP Integration

For MCP integration, you can use the JSON output:

```javascript
const { execSync } = require('child_process');
const path = require('path');

// Path to the CLI script
const cliPath = path.resolve('/path/to/your/project/dist/index.js');

// Get schemas
const schemas = JSON.parse(
  execSync(`node ${cliPath} schemas --json`).toString()
);

// Get objects from a schema
const objects = JSON.parse(
  execSync(`node ${cliPath} objects --schema 1 --json`).toString()
);

// Search for specific objects
const searchResults = JSON.parse(
  execSync(`node ${cliPath} search --query "objectType = Server" --json`).toString()
);

// Alternatively, use the shell script
const shellScriptPath = path.resolve('/path/to/your/project/jira-assets.sh');
const schemasByScript = JSON.parse(
  execSync(`${shellScriptPath} schemas --json`).toString()
);
```

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Rebuild the project: `npm run build`
3. Check for error messages when running commands
4. Verify your Jira credentials and connection
