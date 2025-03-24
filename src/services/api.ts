import axios, { AxiosInstance } from 'axios';
import { getConfig, hasRequiredConfig } from '../utils/config';

// Types for Jira Assets API responses
export interface Schema {
  id: number;
  name: string;
  objectTypeId?: number;
  [key: string]: any;
}

export interface JiraObject {
  id: number;
  label: string;
  objectKey: string;
  objectType: {
    id: number;
    name: string;
  };
  attributes: any[];
  [key: string]: any;
}

export interface SearchResult {
  objectEntries: JiraObject[];
  objectIds: number[];
  totalFilterCount: number;
}

export class ApiService {
  private client: AxiosInstance | null = null;
  
  constructor() {}
  
  private initClient() {
    if (this.client) return; // Already initialized
    
    if (!hasRequiredConfig()) {
      throw new Error('Missing required configuration. Run: jira-assets config');
    }
    
    const config = getConfig();
    
    this.client = axios.create({
      baseURL: `${config.jiraUrl}/rest/insight/1.0`,
      auth: {
        username: config.email || '',
        password: config.apiToken || '',
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Get all schemas
  async getSchemas() {
    this.initClient();
    const response = await this.client!.get('/objectschema/list');
    return response.data;
  }

  // Get schema by ID
  async getSchema(id: number) {
    this.initClient();
    const response = await this.client!.get(`/objectschema/${id}`);
    return response.data;
  }

  // Get objects by schema ID
  async getObjects(schemaId: number, page = 1, limit = 50) {
    this.initClient();
    const response = await this.client!.get(`/objectschema/${schemaId}/objects`, {
      params: { page, limit }
    });
    return response.data;
  }

  // Search objects with IQL (Insight Query Language)
  async searchObjects(iql: string, page = 1, limit = 50) {
    this.initClient();
    const response = await this.client!.get('/iql/objects', {
      params: {
        iql,
        page,
        limit,
        includeAttributes: true,
        includeTypeAttributes: true
      }
    });
    return response.data as SearchResult;
  }
}

export default new ApiService();
