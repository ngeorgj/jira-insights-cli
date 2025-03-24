import Conf from 'conf';

interface ConfigStore {
  jiraUrl?: string;
  apiToken?: string;
  email?: string;
}

// Create a secure config store
const config = new Conf<ConfigStore>({
  projectName: 'jira-assets-cli',
  schema: {
    jiraUrl: {
      type: 'string'
    },
    apiToken: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  },
  // Encrypt sensitive data in production
  encryptionKey: 'jira-assets-cli-secret-key'
});

export const getConfig = (): ConfigStore => config.store;

export const setConfig = (key: keyof ConfigStore, value: string): void => {
  config.set(key, value);
};

export const hasRequiredConfig = (): boolean => 
  Boolean(config.get('jiraUrl') && config.get('apiToken') && config.get('email'));

export const clearConfig = (): void => {
  config.clear();
};

export default config;
