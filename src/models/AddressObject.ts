import { VersionedPanObject } from './VersionedPanObject';
import { AddressObjectConfig } from '../interfaces/AddressObjectConfig';

/**
 * Represents the types of network addresses in PAN-OS.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * The `AddressObject` class models network address entities for PAN-OS configuration.
 * This class extends `VersionedPanObject` and encapsulates properties like value, type,
 * description, and associated tags for an address object.
 */
export class AddressObject extends VersionedPanObject {
  /**
   * The value of the address object, such as an IP address or range.
   */
  value: string;

  /**
   * The type of the address object, indicating its format.
   */
  type: AddressType;

  /**
   * An optional description for the address object.
   */
  description?: string;

  /**
   * Optional tags associated with the address object.
   */
  tag?: string[];

  /**
   * Constructs an `AddressObject` instance.
   *
   * @param name - The unique name identifying this address object.
   * @param value - The address or range this object represents.
   * @param type - The type of the address, determining its format.
   * @param description - An optional description of the address object.
   * @param tag - An optional array of tags associated with the address object.
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
    this.tag = tag?.filter((t) => t != null) || []; // Filters out undefined values
  }

  /**
   * Static method to generate the XPath referencing address objects in the PAN-OS configuration.
   *
   * @returns The XPath as a string.
   */
  public static getXpath(): string {
    return "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address";
  }

  public getXpath(): string {
    return AddressObject.getXpath();
  }

  /**
   * Creates the XML representation of this address object for PAN-OS API interactions.
   *
   * @returns The XML string representing this address object.
   */
  public toXml(): string {
    let xml = `<entry name="${this.name}"><${this.type}>${this.value}</${this.type}>`;
    if (this.description) {
      xml += `<description>${this.description}</description>`;
    }
    if (this.tag && this.tag.length > 0) {
      xml += '<tag>';
      this.tag.forEach((t) => {
        if (t) {
          xml += `<member>${t}</member>`;
        }
      });
      xml += '</tag>';
    }
    xml += '</entry>';
    return xml;
  }

  protected parseConfigObjects(config: AddressObjectConfig): AddressObject[] {
    const addressEntries = config.response.result.address.entry;
    return addressEntries.map(
      (entry) =>
        new AddressObject(
          entry.$.name,
          entry['ip-netmask'] || entry.fqdn || '',
          entry['ip-netmask'] ? 'ip-netmask' : 'fqdn',
          entry.description || '',
          (entry.tag?.member
            ? Array.isArray(entry.tag.member)
              ? entry.tag.member
              : [entry.tag.member]
            : []
          ).filter((t): t is string => t !== undefined), // Filter out undefined values
        ),
    );
  }
}
