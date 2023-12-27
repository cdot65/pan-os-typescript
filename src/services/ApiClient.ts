import { parseStringPromise } from 'xml2js';
import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  private axiosInstance: AxiosInstance;

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
   * Executes an authenticated GET HTTP request to an API endpoint and returns the response as a string.
   * This generic method can be used to fetch data from various API endpoints that return XML responses.
   *
   * @param endpoint The specific API endpoint to target in the GET request.
   * @param apiKey The API key used to authenticate the request.
   * @param params Optional query parameters to include in the request URL.
   * @returns A promise that resolves to the response data as a raw string, which is expected to be in XML format.
   * @throws An error when the GET request fails, including axios-related error information.
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
   * Sends an authenticated POST HTTP request to an API endpoint with XML data in the request body.
   * This method is suited for operations that require sending data to the API, such as creating or updating resources.
   *
   * @param endpoint The specific API endpoint to target in the POST request.
   * @param apiKey The API key for authenticating the request.
   * @param data The XML-formatted string to send in the body of the POST request.
   * @returns A promise that resolves to the response data as a raw string.
   * @throws An error if the POST request fails or the body data is not formatted correctly.
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

  public async getData(
    endpoint: string,
    params?: object,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const responseXml = await this.get(endpoint, params);
    return parseStringPromise(responseXml);
  }

  /**
   * Sends a configuration request to the PAN-OS device.
   * @protected
   * @param xpath - XPath expression selecting the configuration context.
   * @param element - XML element defining the configuration change.
   * @param action - The action to perform ('set', 'edit', 'delete').
   * @returns The XML response string from the device.
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
