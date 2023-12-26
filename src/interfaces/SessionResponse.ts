/**
 * Represents the structure of a single session entry in the response from the PAN-OS API.
 * Contains detailed information about each session including source, destination, protocol, state, and other relevant data.
 */
export interface SessionEntry {
  /**
   * Destination IP address of the session.
   */
  dst: string;

  /**
   * Translated source IP address for NAT.
   */
  xsource: string;

  /**
   * Source IP address of the session.
   */
  source: string;

  /**
   * Translated destination IP address for NAT.
   */
  xdst: string;

  /**
   * Translated source port number for NAT.
   */
  xsport: string;

  /**
   * Translated destination port number for NAT.
   */
  xdport: string;

  /**
   * Source port number of the session.
   */
  sport: string;

  /**
   * Destination port number of the session.
   */
  dport: string;

  /**
   * Protocol used in the session.
   */
  proto: string;

  /**
   * Zone from which the session originated.
   */
  from: string;

  /**
   * Zone where the session is destined.
   */
  to: string;

  /**
   * Start time of the session.
   */
  'start-time': string;

  /**
   * Indicates if NAT is applied to the session.
   */
  nat: string;

  /**
   * Source NAT IP address.
   */
  srcnat: string;

  /**
   * Destination NAT IP address.
   */
  dstnat: string;

  /**
   * Indicates if the session is a proxy session.
   */
  proxy: string;

  /**
   * Indicates if decrypt mirror is applied to the session.
   */
  'decrypt-mirror': string;

  /**
   * Current state of the session.
   */
  state: string;

  /**
   * Type of the session.
   */
  type: string;

  /**
   * Total byte count for the session.
   */
  'total-byte-count': string;

  /**
   * Index of the session entry.
   */
  idx: string;

  /**
   * Index of the virtual system associated with the session.
   */
  'vsys-idx': string;

  /**
   * Virtual system associated with the session.
   */
  vsys: string;

  /**
   * Application associated with the session.
   */
  application: string;

  /**
   * Security rule applied to the session.
   */
  'security-rule': string;

  /**
   * Ingress interface for the session.
   */
  ingress: string;

  /**
   * Egress interface for the session.
   */
  egress: string;

  /**
   * Flags associated with the session.
   */
  flags: string;
}

/**
 * Represents the structure of the session response from the PAN-OS API.
 * Contains the status of the request and the result with session entries.
 */
export interface SessionResponse {
  /**
   * Contains the status of the request and the result payload with session entries.
   */
  response: {
    /**
     * Indicates if the request to fetch session information was successful ('success') or not ('error').
     */
    status: string;

    /**
     * The parent element containing the session entries.
     */
    result: {
      /**
       * Either a single `SessionEntry` object or an array of `SessionEntry` objects.
       * This reflects the possibility of receiving one or many session entries from the API.
       */
      entry: SessionEntry | SessionEntry[]; // Can be an array of entries or a single entry
    };
  };
}
