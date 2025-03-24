#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import configCommand from './commands/config';
import schemasCommand from './commands/schemas';
import objectsCommand from './commands/objects';
import searchCommand from './commands/search';

const program = new Command();

program
  .name('jira-assets')
  .description('CLI to fetch data from Jira Assets (Insight)')
  .version('1.0.0');

// Register commands
configCommand(program);
schemasCommand(program);
objectsCommand(program);
searchCommand(program);

// Global error handling
program.showHelpAfterError();

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Error: Invalid command ${program.args.join(' ')}`));
  console.log();
  program.help();
});

program.parse();
