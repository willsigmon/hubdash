/**
 * Skill 2: knack_auth
 * Handles API key and user token authentication
 */

import { KnackConfig, KnackAuthResponse } from './types';

export class KnackAuth {
  private config: KnackConfig;

  constructor(config: KnackConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://api.knack.com/v1',
    };
  }

  /**
   * Get headers for API key authentication
   */
  getApiHeaders(): HeadersInit {
    return {
      'X-Knack-Application-Id': this.config.appId,
      'X-Knack-REST-API-Key': this.config.apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get headers for user token authentication
   */
  getUserHeaders(userToken: string): HeadersInit {
    return {
      'X-Knack-Application-Id': this.config.appId,
      'Authorization': userToken,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Login user and retrieve user token
   */
  async loginUser(email: string, password: string): Promise<string> {
    const response = await fetch(
      `${this.config.baseUrl}/applications/${this.config.appId}/session`,
      {
        method: 'POST',
        headers: {
          'X-Knack-Application-Id': this.config.appId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data: KnackAuthResponse = await response.json();
    return data.session.user.token;
  }

  /**
   * Refresh expired user token
   */
  async refreshToken(currentToken: string): Promise<string> {
    // Knack handles token refresh through re-authentication
    // Implementation depends on your session management strategy
    throw new Error('Token refresh requires re-authentication');
  }
}
