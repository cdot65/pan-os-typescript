// src/objects/AddressObject.ts

import { VersionedPanObject } from './VersionedPanObject';

/**
 * Supported address formats for network locations used in PAN-OS address objects.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * `AddressObject` extends `VersionedPanObject` to manage network address configurations in PAN-OS.
 * It facilitates defining rules and policies by encapsulating properties specific to network locations.
 */
export class AddressObject extends VersionedPanObject {
  /**
   * The network address, range, or other value based on `type`.
   */
  value: string;

  /**
   * The format type of the `value`.
   */
  type: AddressType;

  /**
   * An optional description of the address object.
   */
  description?: string;

  /**
   * Optional tags for administrative purposes.
   */
  tag?: string[];

  /**
   * Constructs a new `AddressObject` instance with a name, address value and type. You can optionally
   * include a description and tags for additional context or organization.
   *
   * @param name - The name of the address object.
   * @param value - The network address or range value for the object.
   * @param type - The format of the address value (default is 'ip-netmask').
   * @param description - An optional description of the address object.
   * @param tag - Optional array of tags for the object.
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
   * Generates the XML representation of the address object for PAN-OS API compatibility.
   * @returns XML string representing the address object.
   */
  public toXml(): string {
    // The XML generation logic is unchanged. TypeDoc does not require any specific code changes.
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
