// src/models/VersionedPanObject.ts
import { PanObject } from './PanObject';

/**
 * Represents an abstract base class for PAN-OS configuration objects that are version-specific.
 * Derived classes must implement methods to define object-specific XPaths, provide XML representations
 * for API requests, and parse configuration data.
 */
export abstract class VersionedPanObject extends PanObject {
  /**
   * Constructs the XPath for the PAN-OS configuration context of the object.
   *
   * @abstract
   * @returns {string} The XPath string corresponding to the object's location in the PAN-OS configuration hierarchy.
   */
  public abstract getXpath(): string;

  /**
   * Serializes the object state to its XML representation tailored for PAN-OS API interactions.
   *
   * @abstract
   * @returns {string} An XML string representing the object's state for the API.
   */
  public abstract toXml(): string;

  /**
   * Interprets configuration data and parses it into an array of `PanObject` instances.
   *
   * @abstract
   * @param config - The configuration data retrieved from the PAN-OS device.
   * @returns {PanObject[]} An array of `PanObject` instances derived from the configuration data.
   */
  protected abstract parseConfigObjects(config: unknown): PanObject[];

  /**
   * Issues an API request to create this configuration object on the PAN-OS device.
   *
   * @returns {Promise<void>} A promise that resolves once the object has been successfully created.
   */
  public async create(): Promise<void> {
    const xpath = this.getXpath();
    const element = this.toXml();
    await this.apiClient.setConfig(xpath, element);
    // Optionally, mark the configuration as changed
    // Additional implementation details for marking the configuration...
  }

  /**
   * Issues an API request to apply changes to this configuration object on the PAN-OS device.
   * It effectively replaces the object at its XPath location with the current object state.
   *
   * @returns {Promise<void>} A promise that resolves once the changes have been successfully applied.
   */
  public async apply(): Promise<void> {
    const xpath = this.getXpath();
    const element = this.toXml();
    const entryName = this.name;
    await this.apiClient.editConfig(xpath, element, entryName);
  }
}
