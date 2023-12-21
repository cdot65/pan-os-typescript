// src/interfaces/ResourceMonitorResponse.ts

/**
 * `ResourceMonitorResponse` outlines the structure for the response received
 * from the resource monitoring endpoint. It provides detailed insights into
 * resource usage, such as CPU load, across different data processors.
 */
export interface ResourceMonitorResponse {
  response: {
    status: string; // Status of the resource monitoring request.
    result: {
      'resource-monitor': {
        'data-processors': {
          dp0: {
            minute: {
              'cpu-load-average': Array<{
                entry: {
                  coreid: string; // Identifier for the CPU core.
                  value: string; // Average CPU load for the core.
                };
              }>;
              // Additional resource monitoring fields can be added.
            };
          };
        };
      };
    };
  };
}
