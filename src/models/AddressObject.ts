import { AddressObjectConfig } from '../interfaces/AddressObjectConfig';
import { VersionedPanObject } from './VersionedPanObject';

/**
 * Available network address formats within the PAN-OS system.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * Models network address configurations for PAN-OS as a `VersionedPanObject`.
 * Contains details such as address value, type, description, and associated tags.
 */
export class AddressObject extends VersionedPanObject {
  /**
   * The specific network address value (e.g., IP address, IP range).
   */
  value: string;

  /**
   * The type of the network address, indicating its format.
   */
  type: AddressType;

  /**
   * An optional description providing additional information about the address object.
   */
  description?: string;

  /**
   * Tags associated with the address object for organizational purposes.
   */
  tag?: string[];

  /**
   * Creates a new `AddressObject` instance.
   *
   * @param name - The unique name identifying the address object.
   * @param value - The value that the object configures (e.g., IP address, subnet, range).
   * @param type - The type of address represented by the object.
   * @param description - A description of the address object (default is undefined).
   * @param tag - An array of tags to associate with the address object (default is undefined).
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
    this.tag = tag?.filter((t) => t != null) || [];
  }

  /**
   * Static method to generate the XPath for the address objects in PAN-OS configuration XML.
   *
   * @returns The address objects XPath as a string.
   */
  public static getXpath(): string {
    return "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address";
  }

  /**
   * Provides the XPath for identifying this specific address object in PAN-OS configuration XML.
   *
   * @returns The address object's XPath as a string.
   */
  public getXpath(): string {
    return AddressObject.getXpath();
  }

  /**
   * Generates an XML representation of the address object for interaction with PAN-OS API.
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

  /**
   * Parses a configuration payload into instances of `AddressObject`.
   *
   * @param config - Configuration data from PAN-OS API response, specific to AddressObject settings.
   * @returns An array of `AddressObject` instances derived from the configuration data.
   */
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
          ).filter((t): t is string => t !== undefined),
        ),
    );
  }
}
