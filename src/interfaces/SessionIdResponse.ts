// src/interfaces/SessionIdResponse.ts

/**
 * Describes the details of a session's traffic direction, including origin and destination, protocol, and state for a particular session direction, either client-to-server or server-to-client.
 */
export interface SessionDirection {
  /** The source IP address for this direction of the traffic. */
  source: string;
  /** The destination IP address for this direction of the traffic. */
  dst: string;
  /** The protocol used in this direction of the traffic. */
  proto: string;
  /** The source port number used in this direction of the traffic. */
  sport: string;
  /** The destination port number used in this direction of the traffic. */
  dport: string;
  /** The session type for this direction of the traffic. */
  type: string;
  /** The state of this particular direction of the session. */
  state: string;
  /** The IP version used by the session. */
  ipver: string;
  /** The source zone for this direction of the traffic. */
  'source-zone': string;
  /** The user associated with the source of the traffic in this direction. */
  'src-user': string;
  /** The user associated with the destination of the traffic in this direction. */
  'dst-user': string;
}

/**
 * Describes the response structure for session details corresponding to a specific session ID as returned by the PAN-OS API.
 */
export interface SessionIdResponse {
  /** The response wrapper that contains the status and result details for the session ID request. */
  response: {
    /** Indicates if the session ID request was successful ('success') or encountered an error ('error'). */
    status: string;
    /** Contains the detailed session information for the specific session ID queried. */
    result: {
      /** The slot on the firewall where this session is located. */
      slot: string;
      /** The CPU identifier processing this session. */
      cpu: string;
      /** Details of the client-to-server (c2s) session direction. */
      c2s: SessionDirection;
      /** Details of the server-to-client (s2c) session direction. */
      s2c: SessionDirection;
      /** The start time when the session was established. */
      'start-time': string;
      /** The virtual system (vsys) associated with the session. */
      vsys: string;
      /** The application associated with the session. */
      application: string;
      /** The identifier for the firewall where the session exists. */
      firewall: string;
      /** The reason why the session was terminated. */
      'end-reason': string;
      'pktlog-up': string;
      'pansys-up': string;
      timeout: string;
      timestamp: string;
      'time-start': string;
      'c2s-packets': string;
      'c2s-octets': string;
      's2c-packets': string;
      's2c-octets': string;
      'prxy-started': string;
      'prxy-wait-ssl': string;
      'app-insufficient': string;
      'sess-log': string;
      'sess-ager': string;
      'sess-ha-sync': string;
      rule: string;
      override: string;
      'nat-src': string;
      'nat-dst': string;
      'nat-rule-vsys': string;
      'nat-rule': string;
      'flow-type': string;
      'l7-proc': string;
      'url-en': string;
      syncookie: string;
      'host-session': string;
      'tunnel-session': string;
      'tunnel-termination': string;
      'captive-portal': string;
      'igr-if': string;
      'egr-if': string;
      'qos-class': string;
      'qos-rule': string;
      'prxy-status': string;
    };
  };
}
