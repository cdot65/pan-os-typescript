// src/services/BaseService.ts

import { BaseClient } from '../BaseClient';
import { parseStringPromise } from 'xml2js';

/**
 * BaseService provides a foundational class for service-layer classes.
 * It encapsulates common functionality such as API requests and XML parsing,
 * which can be utilized by subclassing services.
 */
export class BaseService {
  /**
   * Initializes BaseService with a BaseClient instance.
   *
   * @param baseClient - The BaseClient instance used for HTTP requests.
   */
  constructor(protected baseClient: BaseClient) {}

  /**
   * Performs an API request with automated XML parsing.
   * This method is intended to be used by subclassing services for API interactions.
   *
   * @param apiKey - The API key for authenticating the request.
   * @param endpoint - The API endpoint to send the request to.
   * @param params - Optional parameters for the request.
   * @returns A promise resolving to the parsed response in JSON format.
   * @throws An error if the API request or XML parsing fails.
   */
  protected async makeApiRequest(
    apiKey: string,
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // Retrieve XML response from the API
    const responseXml = await this.baseClient.getWithApiKey(
      endpoint,
      apiKey,
      params,
    );

    // Parse the XML response into JSON format
    const parsedResponse = await parseStringPromise(responseXml);
    return parsedResponse;
  }
}
