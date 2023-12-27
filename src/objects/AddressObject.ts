// src/objects/AddressObject.ts

import { VersionedPanObject } from './VersionedPanObject';

/**
 * Supported address formats for network locations used in address objects.
 * @enum "ip-netmask" A network address in CIDR format.
 * @enum "ip-range" A range of IP addresses.
 * @enum "ip-wildcard" An IP address with a wildcard mask.
 * @enum "fqdn" A fully qualified domain name.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * The `AddressObject` class represents network address configuration within PAN-OS,
 * extending `PanObject` to include additional properties specific to network locations.
 * These objects play a crucial role in defining rules and policies for the firewall system.
 */
export class AddressObject extends VersionedPanObject {
  /**
   * The network address or range associated with this address object, formatted according to the specified `type`.
   */
  value: string;

  /**
   * Specifies the format of the address object's value, corresponding to one of the supported `AddressType` formats.
   */
  type: AddressType;

  /**
   * An optional human-readable description providing context about the purpose or usage of the address object.
   */
  description?: string;

  /**
   * Optional classification tags that may be used to organize address objects into groups or categories.
   */
  tag?: string[];

  /**
   * Instantiates an `AddressObject` with the given properties, providing a name and network location details.
   * Additional optional metadata like descriptions and tags can be included to enhance identification and organization.
   *
   * @param name The unique identifier for the address object within PAN-OS.
   * @param value The network location value, such as an IP address or range.
   * @param type Indicates the format of the address value (defaults to 'ip-netmask').
   * @param description An optional descriptive text for the address object.
   * @param tag Optional tags for sorting or annotation purposes.
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
   * Converts the `AddressObject` instance into its XML representation as required by the PAN-OS API.
   *
   * @returns A string containing the XML configuration of the address object.
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
