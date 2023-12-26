// src/objects/AddressObject.ts

import { PanObject } from './PanObject';

/**
 * Enumeration of the types of addresses supported by the AddressObject.
 * Defines the various formats for network locations that can be used in address objects.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * Represents an address object within PAN-OS, derived from the PanObject.
 * Address objects are used for various firewall policy types and define the network location of interest.
 */
export class AddressObject extends PanObject {
  /**
   * The network location value of the address object, format based on the `type`.
   */
  value: string;

  /**
   * The type of the network location represented by the address object.
   */
  type: AddressType;

  /**
   * Optional description of the address object for additional clarity.
   */
  description?: string;

  /**
   * Optional tags for classifying or grouping the address object.
   */
  tag?: string[];

  /**
   * Constructs a new instance of the AddressObject.
   * Initializes the object with a name, network location value, and optional description and tags.
   *
   * @param name - Unique name of the address object.
   * @param value - The network location value, which varies based on `type` (e.g., CIDR notation for 'ip-netmask').
   * @param type - The type of address object; defaults to 'ip-netmask'.
   * @param description - Optional description of the address object.
   * @param tag - Optional list of tags associated with the address object.
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
   * Generates and returns the XML representation of the address object.
   * The XML format follows the PAN-OS API requirements for address object definitions.
   *
   * @returns The address object in XML format as a string.
   */
  public toXml(): string {
    // XML generation logic specific to AddressObject
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
}
