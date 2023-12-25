// src/interfaces/SessionInfoResponse.ts

/**
 * Represents the structure of the session information response from the PAN-OS API.
 */
export interface SessionInfoResponse {
  response: {
    status: string;
    result: {
      'age-accel-en': string;
      'age-accel-thresh': string;
      'age-accel-tsf': string;
      'age-scan-ssf': string;
      'age-scan-thresh': string;
      'age-scan-tmo': string;
      cps: string;
      'dis-def': string;
      'dis-sctp': string;
      'dis-tcp': string;
      'dis-udp': string;
      'hw-offload': string;
      'hw-udp-offload': string;
      'icmp-unreachable-rate': string;
      'ipv6-fw': string;
      kbps: string;
      'max-pending-mcast': string;
      'num-active': string;
      'num-bcast': string;
      'num-gtpc': string;
      'num-gtpu-active': string;
      'num-gtpu-pending': string;
      'num-http2-5gc': string;
      'num-icmp': string;
      'num-imsi': string;
      'num-installed': string;
      'num-max': string;
      'num-mcast': string;
      'num-pfcpc': string;
      'num-predict': string;
      'num-sctp-assoc': string;
      'num-sctp-sess': string;
      'num-tcp': string;
      'num-udp': string;
      'oor-action': string;
      pps: string;
      'run-tc': string;
      'strict-checksum': string;
      'sw-cutthrough': string;
      'tcp-cong-ctrl': string;
      'tcp-diff-syn-rej': string;
      'tcp-no-refresh-fin-rst': string;
      'tcp-nonsyn-rej': string;
      'tcp-reject-siw-enable': string;
      'tcp-reject-siw-thresh': string;
      'tcp-strict-rst': string;
      'tmo-5gcdelete': string;
      'tmo-cp': string;
      'tmo-def': string;
      'tmo-icmp': string;
      'tmo-sctp': string;
      'tmo-sctpcookie': string;
      'tmo-sctpinit': string;
      'tmo-sctpshutdown': string;
      'tmo-tcp': string;
      'tmo-tcp-delayed-ack': string;
      'tmo-tcp-unverif-rst': string;
      'tmo-tcphalfclosed': string;
      'tmo-tcphandshake': string;
      'tmo-tcpinit': string;
      'tmo-tcptimewait': string;
      'tmo-udp': string;
      'tunnel-accel': string;
      'vardata-rate': string;
      dp: string;
    };
  };
}
