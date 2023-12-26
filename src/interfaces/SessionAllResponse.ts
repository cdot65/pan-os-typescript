// src/interfaces/SessionAllResponse.ts

/**
 * Describes the details of an individual session entry as returned by the PAN-OS API, representing active sessions on the device.
 */
export interface SessionEntry {
  /**
   * The destination IP address of the session.
   */
  dst: string;

  /**
   * The untranslated source IP address if source NAT is performed.
   */
  xsource: string;

  /**
   * The source IP address of the session.
   */
  source: string;

  /**
   * The untranslated destination IP address if destination NAT is performed.
   */
  xdst: string;

  /**
   * The untranslated source port if source NAT is performed.
   */
  xsport: string;

  /**
   * The untranslated destination port if destination NAT is performed.
   */
  xdport: string;

  /**
   * The source port of the session.
   */
  sport: string;

  /**
   * The destination port of the session.
   */
  dport: string;

  /**
   * The protocol used in the session.
   */
  proto: string;

  /**
   * The source zone of the session.
   */
  from: string;

  /**
   * The destination zone of the session.
   */
  to: string;

  /**
   * The start time of the session.
   */
  'start-time': string;

  /**
   * Indicates whether NAT is applied to the session.
   */
  nat: string;

  /**
   * Source NAT type applied to the session.
   */
  srcnat: string;

  /**
   * Destination NAT type applied to the session.
   */
  dstnat: string;

  /**
   * Indicates whether a proxy is used in the session.
   */
  proxy: string;

  /**
   * Indicates whether decrypt mirror is applied to this session.
   */
  'decrypt-mirror': string;

  /**
   * The state of the session.
   */
  state: string;

  /**
   * The type of the session.
   */
  type: string;

  /**
   * The total byte count of the session.
   */
  'total-byte-count': string;

  /**
   * The session index.
   */
  idx: string;

  /**
   * The virtual system index the session belongs to.
   */
  'vsys-idx': string;

  /**
   * The virtual system associated with the session.
   */
  vsys: string;

  /**
   * The application associated with the session.
   */
  application: string;

  /**
   * The security rule associated with the session.
   */
  'security-rule': string;

  /**
   * The ingress interface for the session.
   */
  ingress: string;

  /**
   * The egress interface for the session.
   */
  egress: string;

  /**
   * Any additional flags associated with the session.
   */
  flags: string;
}

/**
 * Represents the structured response from the PAN-OS API containing session information for all active sessions.
 */
export interface SessionAllResponse {
  /**
   * The response wrapper containing the response status and the session entries.
   */
  response: {
    /**
     * The status of the session information request, signifying success or an error.
     */
    status: string;

    /**
     * The container holding the actual session entries returned by the request.
     */
    result: {
      /**
       * An array of `SessionEntry` objects, each providing details of an individual session.
       */
      entry: SessionEntry[];
    };
  };
}
