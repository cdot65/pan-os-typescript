// src/interfaces/SessionIdResponse.ts

/**
 * Represents the structure of the direction of the session, client to server or server to client.
 */
export interface SessionDirection {
  source: string;
  dst: string;
  proto: string;
  sport: string;
  dport: string;
  type: string;
  state: string;
  ipver: string;
  'source-zone': string;
  'src-user': string;
  'dst-user': string;
}

/**
 * Represents the structure of the session info response for a specific session ID from the PAN-OS API.
 */
export interface SessionIdResponse {
  response: {
    status: string;
    result: {
      slot: string;
      cpu: string;
      c2s: SessionDirection;
      s2c: SessionDirection;
      'start-time': string;
      vsys: string;
      application: string;
      firewall: string;
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
