// src/models/AddressObject.ts

import { VersionedPanObject } from './VersionedPanObject';

export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

export class AddressObject extends VersionedPanObject {
  value: string;
  type: AddressType;
  description?: string;
  tag?: string[];

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

  public getXpath(): string {
    // Example XPath, adjust based on your schema
    return `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='${this.name}']`;
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

  /**
   * Generates the XML representation of the address object for PAN-OS API compatibility.
   * Includes only the fields that are being edited.
   * @param fields - Fields to include in the XML. If empty, include all fields.
   * @returns XML string representing the editable fields of the address object.
   */
  public toEditableXml(fields: Array<keyof AddressObject> = []): string {
    let xml = `<entry name="${this.name}">`;

    // Include only specified fields or all fields if none are specified
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
