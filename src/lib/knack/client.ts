/**
 * Knack API Client
 * Connects to HTI's Knack database as the source of truth
 */

export interface KnackConfig {
  appId: string;
  apiKey: string;
  baseUrl?: string;
}

export interface KnackRecord {
  id: string;
  [key: string]: any;
}

export interface KnackFilterRule {
  field: string;
  operator: 'is' | 'is not' | 'contains' | 'starts with' | 'ends with' | 'is blank' | 'is not blank' | '>' | '<' | '>=' | '<=' | 'is after' | 'is before';
  value?: string | number | boolean;
}

export interface KnackQueryOptions {
  filters?: KnackFilterRule | KnackFilterRule[];
  rows_per_page?: number;
  page?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}

export class KnackClient {
  private appId: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: KnackConfig) {
    this.appId = config.appId || process.env.KNACK_APP_ID || '';
    this.apiKey = config.apiKey || process.env.KNACK_API_KEY || '';
    this.baseUrl = config.baseUrl || 'https://api.knack.com/v1';

    if (!this.appId || !this.apiKey) {
      console.warn('⚠️ Knack credentials not configured. Add KNACK_APP_ID and KNACK_API_KEY to .env.local');
    }
  }

  /**
   * Check if Knack is configured
   */
  isConfigured(): boolean {
    return Boolean(this.appId && this.apiKey);
  }

  /**
   * Get common headers for Knack API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'X-Knack-Application-Id': this.appId,
      'X-Knack-REST-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetch all records from a Knack object
   * Handles filter encoding internally and provides type safety
   */
  async getRecords(objectKey: string, options?: KnackQueryOptions): Promise<KnackRecord[]> {
    if (!this.isConfigured()) {
      throw new Error('Knack client not configured. Please add credentials to .env.local');
    }

    try {
      const params = new URLSearchParams();

      if (options?.rows_per_page) {
        params.append('rows_per_page', String(options.rows_per_page));
      }

      if (options?.page) {
        params.append('page', String(options.page));
      }

      if (options?.sort_field) {
        params.append('sort_field', options.sort_field);
      }

      if (options?.sort_order) {
        params.append('sort_order', options.sort_order);
      }

      // Handle filter encoding - accept both single filter and array
      if (options?.filters) {
        const filterArray = Array.isArray(options.filters) ? options.filters : [options.filters];
        if (filterArray.length > 0) {
          params.append('filters', JSON.stringify(filterArray));
        }
      }

      const url = `${this.baseUrl}/objects/${objectKey}/records${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Knack API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error(`Error fetching Knack records from ${objectKey}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record in a Knack object
   */
  async createRecord(objectKey: string, data: Record<string, any>): Promise<KnackRecord> {
    if (!this.isConfigured()) {
      throw new Error('Knack client not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/objects/${objectKey}/records`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Knack API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error creating Knack record in ${objectKey}:`, error);
      throw error;
    }
  }

  /**
   * Update a record in a Knack object
   */
  async updateRecord(objectKey: string, recordId: string, data: Record<string, any>): Promise<KnackRecord> {
    if (!this.isConfigured()) {
      throw new Error('Knack client not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/objects/${objectKey}/records/${recordId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Knack API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating Knack record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record from a Knack object
   */
  async deleteRecord(objectKey: string, recordId: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Knack client not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/objects/${objectKey}/records/${recordId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Knack API error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting Knack record ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Auto-discover Knack objects in the application
   */
  async discoverObjects(): Promise<any[]> {
    if (!this.isConfigured()) {
      throw new Error('Knack client not configured');
    }

    try {
      // Note: Knack doesn't have a direct "list objects" endpoint
      // You typically get this info from the application schema
      // This would require admin API access
      const response = await fetch(`${this.baseUrl}/applications/${this.appId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Knack API error: ${response.status}`);
      }

      const data = await response.json();
      return data.application?.objects || [];
    } catch (error) {
      console.error('Error discovering Knack objects:', error);
      // Return empty array if discovery fails (user can manually configure)
      return [];
    }
  }
}

// Singleton instance
let knackClient: KnackClient | null = null;

export function getKnackClient(): KnackClient {
  if (!knackClient) {
    knackClient = new KnackClient({
      appId: process.env.KNACK_APP_ID || '',
      apiKey: process.env.KNACK_API_KEY || '',
    });
  }
  return knackClient;
}
