/**
 * Skill 3: knack_pagination
 * Manages full data retrieval respecting 1,000-record limit
 */

import { KnackReader } from './reader';
import { KnackRecord, KnackQueryParams } from './types';

export class KnackPagination {
  private reader: KnackReader;

  constructor(reader: KnackReader) {
    this.reader = reader;
  }

  /**
   * Fetch all pages of records from an object
   */
  async fetchAllPages<T = KnackRecord>(
    objectKey: string,
    params: Omit<KnackQueryParams, 'page'> = {}
  ): Promise<T[]> {
    const rowsPerPage = params.rows_per_page || 1000;
    const allRecords: T[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await this.reader.getRecords<T>(objectKey, {
        ...params,
        rows_per_page: rowsPerPage,
        page: currentPage,
      });

      allRecords.push(...response.records);
      totalPages = response.total_pages;
      currentPage++;

      // Respect Knack's rate limit (10 requests per second)
      if (currentPage <= totalPages) {
        await this.sleep(100);
      }
    } while (currentPage <= totalPages);

    return allRecords;
  }

  /**
   * Fetch all pages from a view
   */
  async fetchAllViewPages<T = KnackRecord>(
    sceneId: string,
    viewId: string,
    userToken?: string,
    params: Omit<KnackQueryParams, 'page'> = {}
  ): Promise<T[]> {
    const rowsPerPage = params.rows_per_page || 1000;
    const allRecords: T[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const response = await this.reader.getViewRecords<T>(
        sceneId,
        viewId,
        userToken,
        {
          ...params,
          rows_per_page: rowsPerPage,
          page: currentPage,
        }
      );

      allRecords.push(...response.records);
      totalPages = response.total_pages;
      currentPage++;

      // Respect rate limit
      if (currentPage <= totalPages) {
        await this.sleep(100);
      }
    } while (currentPage <= totalPages);

    return allRecords;
  }

  /**
   * Sleep utility for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
