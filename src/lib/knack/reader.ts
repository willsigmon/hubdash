/**
 * Skill 1: knack_reader
 * REST-based access to Knack Objects and Views
 */

import { KnackConfig, KnackRecord, KnackResponse, KnackQueryParams } from './types';
import { KnackAuth } from './auth';

export class KnackReader {
  private auth: KnackAuth;
  private baseUrl: string;

  constructor(config: KnackConfig) {
    this.auth = new KnackAuth(config);
    this.baseUrl = config.baseUrl || 'https://api.knack.com/v1';
  }

  /**
   * Get records from a Knack object
   */
  async getRecords<T = KnackRecord>(
    objectKey: string,
    params: KnackQueryParams = {}
  ): Promise<KnackResponse<T>> {
    const queryParams = new URLSearchParams();

    if (params.rows_per_page) queryParams.append('rows_per_page', params.rows_per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));

    const url = `${this.baseUrl}/objects/${objectKey}/records?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.auth.getApiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch records: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get records from a Knack view
   */
  async getViewRecords<T = KnackRecord>(
    sceneId: string,
    viewId: string,
    userToken?: string,
    params: KnackQueryParams = {}
  ): Promise<KnackResponse<T>> {
    const queryParams = new URLSearchParams();

    if (params.rows_per_page) queryParams.append('rows_per_page', params.rows_per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.sort_field) queryParams.append('sort_field', params.sort_field);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.filters) queryParams.append('filters', JSON.stringify(params.filters));

    const url = `${this.baseUrl}/pages/${sceneId}/views/${viewId}/records?${queryParams.toString()}`;

    const headers = userToken
      ? this.auth.getUserHeaders(userToken)
      : this.auth.getApiHeaders();

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch view records: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single record by ID
   */
  async getRecord<T = KnackRecord>(
    objectKey: string,
    recordId: string
  ): Promise<T> {
    const url = `${this.baseUrl}/objects/${objectKey}/records/${recordId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.auth.getApiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch record: ${response.statusText}`);
    }

    return response.json();
  }
}
