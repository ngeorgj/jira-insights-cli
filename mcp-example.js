#!/usr/bin/env node
/**
 * Example of using Jira Assets CLI with Model Context Protocol (MCP)
 * 
 * This script demonstrates how an MCP server could use the Jira Assets CLI
 * to fetch data and create objects with dependencies.
 */

const { execSync } = require('child_process');
const path = require('path');

// Path to CLI script - using the shell wrapper script
const cliPath = path.resolve(__dirname, 'jira-assets.sh');

/**
 * Fetch data from Jira Assets CLI
 * @param {string} command The CLI command to execute
 * @param {Object} options Command options
 * @returns {Object} Parsed JSON result
 */
const fetchFromJira = (command, options = {}) => {
  // Build options string
  const optionsStr = Object.entries(options)
    .map(([key, value]) => {
      // Handle different option formats (e.g. --schema 1, --json)
      if (value === true) return `--${key}`;
      return `--${key} "${value}"`;
    })
    .join(' ');

  // Execute command and parse JSON result
  const result = execSync(`${cliPath} ${command} ${optionsStr} --json`).toString();
  return JSON.parse(result);
};

/**
 * MCP Server Demo: Creating objects with dependencies
 */
class McpJiraServerDemo {
  /**
   * Fetch all schemas from Jira Assets
   */
  async getSchemas() {
    try {
      // This would be wrapped in an MCP tool function
      console.log('Fetching schemas...');
      const schemas = fetchFromJira('schemas');
      console.log(`Found ${schemas.length} schemas`);
      return schemas;
    } catch (error) {
      console.error('Error fetching schemas:', error.message);
      throw error;
    }
  }

  /**
   * Fetch all objects for a given schema
   */
  async getObjectsBySchema(schemaId) {
    try {
      console.log(`Fetching objects for schema ${schemaId}...`);
      const objects = fetchFromJira('objects', { schema: schemaId });
      console.log(`Found ${objects.objectEntries.length} objects`);
      return objects.objectEntries;
    } catch (error) {
      console.error(`Error fetching objects for schema ${schemaId}:`, error.message);
      throw error;
    }
  }

  /**
   * Search for objects matching a query
   */
  async searchObjects(query) {
    try {
      console.log(`Searching for objects with query: ${query}`);
      const results = fetchFromJira('search', { query });
      console.log(`Found ${results.objectEntries.length} matching objects`);
      return results.objectEntries;
    } catch (error) {
      console.error(`Error searching objects:`, error.message);
      throw error;
    }
  }

  /**
   * Demo: Find all services with their dependencies
   */
  async findServicesWithDependencies() {
    // Example of how this might be used in an MCP context
    try {
      // 1. Find all services
      const services = await this.searchObjects('objectType = Service');
      
      // 2. For each service, find its dependencies
      const servicesWithDeps = await Promise.all(
        services.map(async (service) => {
          // Using a mock query - in a real scenario you'd construct this from attributes
          const depQuery = `objectType = Server AND attributes.Service = "${service.label}"`;
          const dependencies = await this.searchObjects(depQuery);
          
          return {
            ...service,
            dependencies
          };
        })
      );
      
      console.log(`Processed ${servicesWithDeps.length} services with their dependencies`);
      return servicesWithDeps;
    } catch (error) {
      console.error('Error in demo:', error.message);
      throw error;
    }
  }
}

/**
 * Main function - this would be part of your MCP server implementation
 */
async function main() {
  console.log('Starting MCP Jira Assets integration demo...');
  
  const demo = new McpJiraServerDemo();
  
  try {
    // Example: Get all schemas
    const schemas = await demo.getSchemas();
    console.log('Schemas:', schemas.map(s => `${s.id} - ${s.name}`).join(', '));
    
    // This is a mock demo - in a real scenario, you would:
    // 1. Create an MCP server
    // 2. Define tools that use these functions
    // 3. Register the server with MCP settings
    
    console.log('\nDemo completed successfully');
    console.log('\nNote: This is a mock example. To use this with actual Jira data:');
    console.log('1. Configure the CLI with your Jira credentials: ./jira-assets.sh config');
    console.log('2. Adjust the queries to match your Jira Assets schema structure');
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

// Run the demo
main().catch(console.error);
