import { Command } from 'commander';
import chalk from 'chalk';
import { setConfig, getConfig, clearConfig } from '../utils/config';

interface ConfigCommandOptions {
  show?: boolean;
  clear?: boolean;
}
import { createInterface } from 'readline';

// Create interactive prompt for config input
const prompt = createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptQuestion = (question: string): Promise<string> => new Promise(resolve => {
  prompt.question(question, (answer: string) => resolve(answer));
});

export default (program: Command): void => {
  program
    .command('config')
    .description('Configure Jira Assets CLI connection')
    .option('-s, --show', 'Show current configuration')
    .option('-c, --clear', 'Clear configuration')
    .action(async (options: ConfigCommandOptions) => {
      if (options.show) {
        const config = getConfig();
        console.log(chalk.blue('Current configuration:'));
        console.log(chalk.blue('---------------------'));
        console.log(chalk.green('Jira URL:'), config.jiraUrl || chalk.yellow('Not set'));
        console.log(chalk.green('Email:'), config.email || chalk.yellow('Not set'));
        console.log(chalk.green('API Token:'), config.apiToken ? chalk.gray('****') : chalk.yellow('Not set'));
        
        if (!config.jiraUrl || !config.email || !config.apiToken) {
          console.log();
          console.log(chalk.yellow('Configuration is incomplete. Run \'jira-assets config\' to set up.'));
        }
        
        prompt.close();
        return;
      }

      if (options.clear) {
        clearConfig();
        console.log(chalk.green('Configuration cleared successfully'));
        prompt.close();
        return;
      }

      try {
        console.log(chalk.blue('Jira Assets CLI Configuration'));
        console.log(chalk.blue('----------------------------'));
        
        const jiraUrl = await promptQuestion(chalk.yellow('Jira URL (e.g. https://your-domain.atlassian.net): '));
        const email = await promptQuestion(chalk.yellow('Jira Email: '));
        const apiToken = await promptQuestion(chalk.yellow('Jira API Token: '));
        
        if (!jiraUrl || !email || !apiToken) {
          console.log(chalk.red('All fields are required. Configuration aborted.'));
          prompt.close();
          return;
        }

        setConfig('jiraUrl', jiraUrl.trim());
        setConfig('email', email.trim());
        setConfig('apiToken', apiToken.trim());
        
        console.log(chalk.green('Configuration saved successfully'));
      } catch (error) {
        console.error(chalk.red('Error configuring CLI:'), error instanceof Error ? error.message : String(error));
      }
      
      prompt.close();
