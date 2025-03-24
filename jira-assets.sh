#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the Jira Assets CLI with any passed arguments
node "$SCRIPT_DIR/dist/index.js" "$@"
