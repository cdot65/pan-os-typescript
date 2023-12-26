// src/objects/AddressObject.ts

import { PanObject } from './PanObject';

export type AddressType = 'ip-netmask' | 'ip-range' | 'ip-wildcard' | 'fqdn';

export class AddressObject extends PanObject {
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
