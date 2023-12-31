// src/interfaces/AddressObjectConfig.ts
export interface AddressObjectConfig {
  response: {
    result: {
      address: {
        entry: {
          $: { name: string };
          'ip-netmask'?: string;
          fqdn?: string;
          description?: string;
          tag?: {
            member: string | string[];
          };
        }[];
      };
    };
  };
}
