import { VersionedPanObject } from './VersionedPanObject';
import { AddressObjectConfig } from '../interfaces/AddressObjectConfig';

/**
 * Defines the available types of network addresses in PAN-OS.
 */
export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

/**
 * Network address entities for PAN-OS configuration are modeled by the `AddressObject` class.
 * It is a subclass of `VersionedPanObject`, and it contains the network address attributes like value, type,
 * an optional description, and associated tags.
 */
export class AddressObject extends VersionedPanObject {
  /**
   * The network address value represented by the object.
   */
  value: string;

  /**
   * The format of the network address (e.g., IP netmask, IP range, etc.).
   */
  type: AddressType;

  /**
   * A human-readable description for the address object.
   */
  description?: string;

  /**
   * Any associated tags for the address object.
   */
  tag?: string[];

  /**
   * Constructs a new instance of an `AddressObject`.
   *
   * @param name         - The unique identifier for the address object.
   * @param value        - The network address or range that the object represents.
   * @param type         - The format of the network address.
   * @param description  - An optional narrative description of the address object.
   * @param tag          - Optional labels associated with the address object.
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
   * Generates the XPath used to reference address objects within PAN-OS configuration XML.
   * This is a static method that can be used without an instance of `AddressObject`.
   *
   * @returns The XPath string that can locate address objects in the PAN-OS configuration XML.
   */
  public static getXpath(): string {
    return "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address";
  }

  /**
   * Retrieves the XPath used for addressing the current address object within PAN-OS configuration XML.
   *
   * @returns The XPath string specific to this address object.
   */
  public getXpath(): string {
    return AddressObject.getXpath();
  }

  /**
   * Transforms the address object to its XML string representation, suitable for PAN-OS API interactions.
   *
   * @returns An XML string representing the address object for API consumption.
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
   * Parses a configuration object to create an array of `AddressObject` instances.
   * Protected method intended for internal use within the SDK.
   *
   * @param config - The configuration object from the PAN-OS API response.
   * @returns An array of `AddressObject` instances instantiated from the configuration object.
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
