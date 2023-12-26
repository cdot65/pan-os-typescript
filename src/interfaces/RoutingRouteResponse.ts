// src/interfaces/RoutingRouteResponse.ts

/**
 * Details of an individual routing entry provided by PAN-OS, including destination, next hop, and other routing information.
 */
export interface RoutingEntry {
  /**
   * The name of the virtual router associated with this routing entry.
   */
  'virtual-router': string;

  /**
   * The network destination of the route, typically in CIDR notation.
   */
  destination: string;

  /**
   * The next hop IP address to which packets should be sent.
   */
  nexthop: string;

  /**
   * The metric associated with this route, used for route prioritization.
   */
  metric: string;

  /**
   * The routing flags for the route, providing additional context about the routing behavior.
   */
  flags: string;

  /**
   * The age of the route since it was last updated.
   */
  age: string;

  /**
   * The interface through which the next hop can be reached.
   */
  interface: string;

  /**
   * The route table to which this route belongs.
   */
  'route-table': string;
}

/**
 * Describes the response structure returned by PAN-OS when querying routing route information.
 * Contains a collection of `RoutingEntry` items representing individual routing entries.
 */
export interface RoutingRouteResponse {
  /**
   * Contains the status of the request and the result payload with routing entries.
   */
  response: {
    /**
     * Indicates if the request to fetch routing route information was successful ('success') or not ('error').
     */
    status: string;

    /**
     * The parent element containing the routing flags and the individual routing entries.
     */
    result: {
      /**
       * Flags representing attributes that are applicable to the entire routing route response.
       */
      flags: string;

      /**
       * Either a single `RoutingEntry` object or an array of `RoutingEntry` objects.
       * This reflects the possibility of receiving one or many routing entries from the API.
       */
      entry: RoutingEntry | RoutingEntry[]; // Can be an array of entries or a single entry
    };
  };
}
