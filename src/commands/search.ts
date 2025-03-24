import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import apiService, { JiraObject } from '../services/api';

interface SearchCommandOptions {
  query: string;
  page: string;
  limit: string;
  json?: boolean;
}

export default (program: Command): void => {
  program
    .command('search')
    .description('Search Jira Assets objects using IQL')
    .requiredOption('-q, --query <iql>', 'IQL query string (required)')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-l, --limit <number>', 'Results per page', '50')
    .option('-j, --json', 'Output raw JSON')
    .action(async (options: SearchCommandOptions) => {
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      
      if (!options.query) {
        console.error(chalk.red('Error: IQL query is required'));
        console.log(chalk.yellow('Example: jira-assets search -q "objectType = Server"'));
        return;
      }
      
      const spinner = ora(`Searching objects with query: ${options.query}...`).start();
      
      try {
        const result = await apiService.searchObjects(options.query, page, limit);
        spinner.succeed(`Found ${result.objectEntries.length} objects (total: ${result.totalFilterCount})`);
        
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }
        
        console.log(chalk.blue(`\nSearch Results for: "${options.query}" (Page ${page})`));
        console.log(chalk.blue('--------------------------------------'));
        
        if (!result.objectEntries || result.objectEntries.length === 0) {
          console.log(chalk.yellow('No objects found matching this query'));
          return;
        }
        
        result.objectEntries.forEach((obj: JiraObject) => {
          console.log(
            chalk.green(`[ID: ${obj.id}]`),
            chalk.yellow(obj.label),
            chalk.gray(`(Type: ${obj.objectType.name})`)
          );
          
          // Display attributes if available
          if (obj.attributes && obj.attributes.length > 0) {
            console.log(chalk.gray('  Attributes:'));
            obj.attributes.forEach(attr => {
              if (attr.objectTypeAttributeId && attr.objectAttributeValues) {
                const values = attr.objectAttributeValues
                  .map((val: any) => val.displayValue || val.value)
                  .filter(Boolean)
                  .join(', ');
                
                if (values) {
                  console.log(chalk.gray(`    ${attr.objectTypeAttribute?.name || 'Unknown'}: ${values}`));
                }
              }
            });
          }
          console.log(); // Empty line between objects
        });
        
        console.log(chalk.blue('Pagination:'));
        console.log(chalk.gray(`Page ${page} of ${Math.ceil(result.totalFilterCount / limit)}`));
        console.log(chalk.gray(`Total objects: ${result.totalFilterCount}`));
        
        if (result.totalFilterCount > page * limit) {
          console.log(chalk.yellow(`\nUse --page ${page + 1} to see the next page`));
        }
      } catch (error) {
        spinner.fail('Search failed');
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
      }
    });
};
