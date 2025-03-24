# Jira Assets CLI

A user-friendly command-line tool for fetching Jira Assets (formerly Insight) data. Designed to work seamlessly with Model Context Protocol (MCP) for creating objects with dependencies.

## Installation

```bash
# Install globally
npm install -g jira-assets-cli

# Or install locally in your project
npm install --save jira-assets-cli
```

## Configuration

Before using the CLI, you need to configure your Jira credentials:

```bash
# Run the interactive configuration
jira-assets config

# Show current configuration
jira-assets config --show

# Clear configuration
jira-assets config --clear
```

You'll need to provide:
- Your Jira URL (e.g., `https://your-domain.atlassian.net`)
- Your Jira email address
- An [API token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/) from your Atlassian account

## Usage

### List All Schemas

Retrieve all available object schemas from your Jira Assets instance:

```bash
# List all schemas
jira-assets schemas

# Get details for a specific schema
jira-assets schemas --id 1

# Output as JSON
jira-assets schemas --json
```

### Fetch Objects by Schema

Get objects from a specific schema:

```bash
# Get objects from schema ID 1
jira-assets objects --schema 1

# Pagination support
jira-assets objects --schema 1 --page 2 --limit 100

# Output as JSON
jira-assets objects --schema 1 --json
```

### Search Objects

Search for objects using Insight Query Language (IQL):

```bash
# Basic search
jira-assets search --query "objectType = Server"

# Complex search with multiple criteria
jira-assets search --query "objectType = Server AND Name ~ \"prod*\" AND attributes.Status = Active"

# Pagination
jira-assets search --query "objectType = Server" --page 2 --limit 100

# Output as JSON
jira-assets search --query "objectType = Server" --json
```

## MCP Integration

This CLI is designed to work with Model Context Protocol (MCP). When using the `--json` option, results are returned in a format compatible with MCP (list[dict]), making it easy to:

1. Fetch schema information
2. Retrieve objects by schema
3. Search for specific objects
4. Process complex dependencies between objects

Example MCP usage:

```javascript
// In your MCP server
const { execSync } = require('child_process');

// Get schemas
const schemas = JSON.parse(
  execSync('jira-assets schemas --json').toString()
);

// Get objects from a schema
const objects = JSON.parse(
  execSync('jira-assets objects --schema 1 --json').toString()
);

// Search for specific objects
const searchResults = JSON.parse(
  execSync('jira-assets search --query "objectType = Server" --json').toString()
);
```

## IQL Examples

Insight Query Language (IQL) supports complex queries:

- `objectType = Server` - Find all Server objects
- `Name ~ "prod*"` - Find objects with names starting with "prod"
- `attributes.Status = Active` - Find objects with Status attribute equal to Active
- `created > "2023-01-01"` - Find objects created after January 1, 2023
- `objectType = Server AND attributes.Environment = Production` - Find all Production Servers

For more details on IQL syntax, refer to the [Jira Assets documentation](https://developer.atlassian.com/cloud/insight/rest/api-group-iql/#api-rest-insight-1-0-iql-objects-get).

## License

MIT
