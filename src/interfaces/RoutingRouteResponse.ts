// src/interfaces/RoutingRouteResponse.ts

/**
 * Represents a single routing entry as returned by the PAN-OS API.
 */
export interface RoutingEntry {
  'virtual-router': string;
  destination: string;
  nexthop: string;
  metric: string;
  flags: string;
  age: string;
  interface: string;
  'route-table': string;
}

/**
 * Represents the structure of the routing route response from the PAN-OS API.
 */
export interface RoutingRouteResponse {
  response: {
    status: string;
    result: {
      flags: string;
      entry: RoutingEntry | RoutingEntry[]; // Can be an array of entries or a single entry
    };
  };
}
