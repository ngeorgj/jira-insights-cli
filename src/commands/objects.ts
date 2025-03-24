import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import apiService, { JiraObject } from '../services/api';

interface ObjectCommandOptions {
  schema: string;
  page: string;
  limit: string;
  json?: boolean;
}

export default (program: Command): void => {
  program
    .command('objects')
    .description('Get objects from a specific schema')
    .requiredOption('-s, --schema <id>', 'Schema ID (required)')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-l, --limit <number>', 'Results per page', '50')
    .option('-j, --json', 'Output raw JSON')
    .action(async (options: ObjectCommandOptions) => {
      const schemaId = parseInt(options.schema, 10);
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      
      if (isNaN(schemaId)) {
        console.error(chalk.red('Error: Invalid schema ID'));
        return;
      }
      
      const spinner = ora(`Fetching objects from schema ID: ${schemaId}...`).start();
      
      try {
        const result = await apiService.getObjects(schemaId, page, limit);
        spinner.succeed(`Found ${result.objectEntries.length} objects`);
        
        if (options.json) {
          console.log(JSON.stringify(result, null, 2));
          return;
        }
        
        console.log(chalk.blue(`\nObjects from Schema ID: ${schemaId} (Page ${page})`));
        console.log(chalk.blue('--------------------------------------'));
        
        if (!result.objectEntries || result.objectEntries.length === 0) {
          console.log(chalk.yellow('No objects found in this schema'));
          return;
        }
        
        result.objectEntries.forEach((obj: JiraObject) => {
          console.log(
            chalk.green(`[ID: ${obj.id}]`),
            chalk.yellow(obj.label),
            chalk.gray(`(Key: ${obj.objectKey})`)
          );
        });
        
        console.log(chalk.blue('\nPagination:'));
        console.log(chalk.gray(`Page ${page} of ${Math.ceil(result.totalFilterCount / limit)}`));
        console.log(chalk.gray(`Total objects: ${result.totalFilterCount}`));
        
        if (result.totalFilterCount > page * limit) {
          console.log(chalk.yellow(`\nUse --page ${page + 1} to see the next page`));
        }
      } catch (error) {
        spinner.fail('Failed to fetch objects');
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
      }
    });
};
