// src/models/AddressObject.ts

import { VersionedPanObject } from './VersionedPanObject';

/**
 * Represents the supported address types in the PAN-OS platform.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * The `AddressObject` class extends `VersionedPanObject` to model network address entities
 * in the PAN-OS device's configuration.
 */
export class AddressObject extends VersionedPanObject {
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];

  /**
   * Instantiates a new `AddressObject`.
   *
   * @param name The name of the address object.
   * @param value The value of the address object (e.g., '192.168.1.1').
   * @param type The type of address object (e.g., 'ip-netmask').
   * @param description An optional description for the address object.
   * @param tag Optional tags associated with the address object.
   */
  constructor(
    name: string,
    value: string,
    type: AddressType = 'ip-netmask',
    description?: string,
    tag?: string[],
  ) {
    super(name);
    this.value = value;
    this.type = type;
    this.description = description;
    this.tag = tag;
  }

  /**
   * Constructs the XPath for the address object targeting the PAN-OS configuration XML structure.
   *
   * @returns The XPath as a string.
   */
  public getXpath(): string {
    // Example XPath, adjust based on your schema
    return `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='${this.name}']`;
  }

  /**
   * Creates the XML representation of the address object suitable for the PAN-OS API.
   *
   * @returns XML string of the address object.
   */
  public toXml(): string {
    // Implement your XML generation logic
    let xml = `<entry name="${this.name}">`;
    xml += `<${this.type}>${this.value}</${this.type}>`;
    if (this.description) {
      xml += `<description>${this.description}</description>`;
    }
    if (this.tag && this.tag.length > 0) {
      xml += '<tag>';
      this.tag.forEach((t) => (xml += `<member>${t}</member>`));
      xml += '</tag>';
    }
    xml += '</entry>';
    return xml;
  }

  /**
   * Creates the partial XML representation of modifiable fields in an address object for the
   * PAN-OS API.
   *
   * @param fields Fields of the `AddressObject` to include in the XML. If empty, all fields will be included.
   * @returns XML string of the editable fields of the address object.
   */
  public toEditableXml(fields: Array<keyof AddressObject> = []): string {
    let xml = `<entry name="${this.name}">`;

    if (
      fields.length === 0 ||
      fields.includes('type') ||
      fields.includes('value')
    ) {
      xml += `<${this.type}>${this.value}</${this.type}>`;
    }
    if (
      (fields.length === 0 || fields.includes('description')) &&
      this.description
    ) {
      xml += `<description>${this.description}</description>`;
    }
    if (
      (fields.length === 0 || fields.includes('tag')) &&
      this.tag &&
      this.tag.length > 0
    ) {
      xml += '<tag>';
      this.tag.forEach((t) => (xml += `<member>${t}</member>`));
      xml += '</tag>';
    }
    xml += '</entry>';

    return xml;
  }
}
