/**
 * Represents the structure of a single session entry in the response from the PAN-OS API.
 */
export interface SessionEntry {
  dst: string;
  xsource: string;
  source: string;
  xdst: string;
  xsport: string;
  xdport: string;
  sport: string;
  dport: string;
  proto: string;
  from: string;
  to: string;
  'start-time': string;
  nat: string;
  srcnat: string;
  dstnat: string;
  proxy: string;
  'decrypt-mirror': string;
  state: string;
  type: string;
  'total-byte-count': string;
  idx: string;
  'vsys-idx': string;
  vsys: string;
  application: string;
  'security-rule': string;
  ingress: string;
  egress: string;
  flags: string;
}

/**
 * Represents the structure of the session response from the PAN-OS API.
 */
export interface SessionResponse {
  response: {
    status: string;
    result: {
      entry: SessionEntry;
    };
  };
}
