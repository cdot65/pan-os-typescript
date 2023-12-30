// src/models/VersionedPanObject.ts
import { PanObject } from './PanObject';

/**
 * An abstract class that extends `PanObject` to provide version-specific
 * features for PAN-OS objects. Subclasses must implement the `toXml` method
 * that converts the object state to its corresponding XML representation
 * for compatibility with PAN-OS API requests.
 */
export abstract class VersionedPanObject extends PanObject {
  /**
   * Abstract method to get the XPath of the object for PAN-OS configuration.
   * @abstract
   * @returns The XPath string of the object.
   */
  public abstract getXpath(): string;

  /**
   * Abstract method to convert the object to its XML representation for PAN-OS API calls.
   * @abstract
   * @returns The XML string of the object.
   */
  public abstract toXml(): string;

  /**
   * Abstract method to parse configuration into an array of PanObject instances.
   * @param config - The configuration data fetched from the PAN-OS device.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract parseConfigObjects(config: any): PanObject[];

  /**
   * Creates the PAN-OS configuration object on the device by sending an API request.
   * This method calls the API to create the object based on its XPath and XML representation.
   * @returns A promise that resolves once the creation API call completes.
   */
  public async create(): Promise<void> {
    const xpath = this.getXpath();
    const element = this.toXml();
    await this.apiClient.setConfig(xpath, element);

    // Optionally, mark the configuration as changed
    // Additional implementation details for marking the configuration...
  }

  /**
   * Applies the PAN-OS configuration object on the device by sending an API request.
   * This method calls the API to replace the object based on its XPath and XML representation.
   * @returns A promise that resolves once the apply API call completes.
   */
  public async apply(): Promise<void> {
    const xpath = this.getXpath();
    const element = this.toXml();
    const entryName = this.name;
    await this.apiClient.editConfig(xpath, element, entryName);
  }
}
