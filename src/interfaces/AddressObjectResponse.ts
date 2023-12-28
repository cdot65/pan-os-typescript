// src/interfaces/AddressObjectResponse.ts
export interface AddressObjectEntry {
  name: string;
  'ip-netmask'?: string;
  'ip-range'?: string;
  fqdn?: string;
  description?: string;
  tag?: string[];
}

export interface AddressObjectList {
  entry: AddressObjectEntry[];
}

export interface AddressObjectResult {
  address: AddressObjectList;
}

export interface AddressObjectResponse {
  response: {
    '@_status': string;
    result: AddressObjectResult;
  };
}
