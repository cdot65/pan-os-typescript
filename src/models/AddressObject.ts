import { VersionedPanObject } from './VersionedPanObject';

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
    this.tag = tag;
  }

  /**
   * Generates the XPath referencing this address object in the PAN-OS configuration.
   * Adjust as per your PAN-OS schema.
   *
   * @returns The XPath as a string.
   */
  public getXpath(): string {
    return `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address`;
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

  /**
   * Fetches the configuration for this address object from the device.
   * @returns A promise resolving to the configuration data, either as raw XML or a parsed object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fetchAddressObjectConfig(): Promise<any> {
    const xpath = this.getXpath();
    return this.fetchConfig(xpath, true); // Using true to parse the response by default
  }
}
