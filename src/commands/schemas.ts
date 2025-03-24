import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import apiService from '../services/api';

interface SchemaCommandOptions {
  json?: boolean;
  id?: string;
}

export default (program: Command): void => {
  program
    .command('schemas')
    .description('List all Jira Assets schemas')
    .option('-j, --json', 'Output raw JSON')
    .option('-i, --id <id>', 'Get schema by ID')
    .action(async (options: SchemaCommandOptions) => {
      const spinner = ora('Fetching schemas...').start();
      
      try {
        if (options.id) {
          const schemaId = parseInt(options.id, 10);
          
          if (isNaN(schemaId)) {
            spinner.fail('Invalid schema ID');
            return;
          }
          
          const schema = await apiService.getSchema(schemaId);
          spinner.succeed(`Schema details for ID: ${schemaId}`);
          
          if (options.json) {
            console.log(JSON.stringify(schema, null, 2));
            return;
          }
          
          console.log(chalk.blue('\nSchema Details:'));
          console.log(chalk.blue('---------------------'));
          console.log(chalk.green('ID:'), schema.id);
          console.log(chalk.green('Name:'), schema.name);
          console.log(chalk.green('Object Count:'), schema.objectCount || 0);
          console.log(chalk.green('Created:'), new Date(schema.created).toLocaleString());
          console.log(chalk.green('Updated:'), new Date(schema.updated).toLocaleString());
        } else {
          const schemas = await apiService.getSchemas();
          spinner.succeed(`Found ${schemas.length} schemas`);
          
          if (options.json) {
            console.log(JSON.stringify(schemas, null, 2));
            return;
          }
          
          console.log(chalk.blue('\nAvailable Schemas:'));
          console.log(chalk.blue('---------------------'));
          
          schemas.forEach((schema: any) => {
            console.log(
              chalk.green(`[ID: ${schema.id}]`),
              chalk.yellow(schema.name),
              chalk.gray(`(${schema.objectCount || 0} objects)`)
            );
          });
        }
      } catch (error) {
        spinner.fail('Failed to fetch schemas');
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
      }
    });
};
