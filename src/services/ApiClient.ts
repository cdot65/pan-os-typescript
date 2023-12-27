import { parseStringPromise } from 'xml2js';
import axios, { AxiosInstance } from 'axios';

/**
 * The `ApiClient` class provides a wrapper around Axios HTTP client for making API calls to a PAN-OS device.
 * It abstracts the complexities of making HTTP GET and POST requests, handling XML responses, and sending
 * configuration commands to the device.
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;

  /**
   * Constructs a new ApiClient instance, initializing the Axios client with base URL and headers.
   *
   * @param hostname - The hostname or IP address of the PAN-OS device.
   * @param apiKey - The API key used for authenticating requests to the PAN-OS device.
   */
  constructor(hostname: string, apiKey: string) {
    this.axiosInstance = axios.create({
      baseURL: `https://${hostname}`,
      headers: {
        Accept: 'application/xml',
        'Content-Type': 'application/xml',
        ...(apiKey && { 'X-PAN-KEY': apiKey }),
      },
    });
  }

  /**
   * Performs a GET HTTP request to a specified API endpoint. This method is primarily used
   * to retrieve data from the PAN-OS device. It handles XML response formats.
   *
   * @param endpoint - The API endpoint for the GET request.
   * @param params - (Optional) Query parameters to include in the request.
   * @returns A promise resolving to the response data as a raw XML string.
   * @throws An error if the GET request fails, with details of the failure.
   */
  public async get(endpoint: string, params?: object): Promise<string> {
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params: params,
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  }

  /**
   * Performs a POST HTTP request to a specified API endpoint. This method is used for operations
   * that require sending data, like creating or updating resources on the PAN-OS device.
   *
   * @param endpoint - The API endpoint for the POST request.
   * @param data - The XML-formatted string to be sent in the request body.
   * @returns A promise resolving to the response data as a raw XML string.
   * @throws An error if the POST request fails or if the body data is incorrectly formatted.
   */
  public async post(endpoint: string, data: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }

  /**
   * Fetches data from a specified API endpoint and parses the XML response into a JavaScript object.
   * This method combines the GET request and XML parsing functionality.
   *
   * @param endpoint - The API endpoint to send the GET request to.
   * @param params - (Optional) Parameters for the request.
   * @returns A promise resolving to the parsed JavaScript object from the XML response.
   */
  public async getData(
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const responseXml = await this.get(endpoint, params);
    return parseStringPromise(responseXml);
  }

  /**
   * Sends a configuration command to the PAN-OS device. This method is used for 'set', 'edit',
   * and 'delete' operations on the device's configuration.
   *
   * @param xpath - The XPath expression selecting the configuration context.
   * @param element - The XML element defining the configuration change. Required for 'set' and 'edit' actions.
   * @param action - The configuration action to perform ('set', 'edit', 'delete').
   * @param apiKey - The API key for authenticating the request.
   * @returns A promise resolving to the XML response string from the device.
   */
  public async postConfig(
    xpath: string,
    element: string,
    action: 'set' | 'edit' | 'delete',
    apiKey: string,
  ): Promise<string> {
    const data = new URLSearchParams();
    data.append('type', 'config');
    data.append('action', action);
    data.append('key', apiKey);
    data.append('xpath', xpath);
    if (action !== 'delete') {
      data.append('element', element);
    }

    return this.post('/api/', data.toString());
  }
}
