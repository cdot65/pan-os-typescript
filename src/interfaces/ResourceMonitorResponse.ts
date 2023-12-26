// src/interfaces/ResourceMonitorResponse.ts

/**
 * Outlines the structure for the response received from the resource monitoring endpoint
 * in PAN-OS, providing detailed insights into resource usage, such as CPU load, for data processors.
 */
export interface ResourceMonitorResponse {
  /**
   * The response wrapper that includes the status of the request, as well as the result data.
   */
  response: {
    /**
     * The status of the resource monitoring request, usually 'success' or 'error'.
     */
    status: string;

    /**
     * The result object, which contains detailed resource monitoring data.
     */
    result: {
      /**
       * The resource-monitor object containing information about data processors.
       */
      'resource-monitor': {
        /**
         * The data-processors object that includes statistics for different processors.
         */
        'data-processors': {
          /**
           * Represents the first data processor (dp0) and contains its minute-level statistics.
           */
          dp0: {
            /**
             * Minute-level resource statistics including CPU load averages.
             */
            minute: {
              /**
               * An array of objects containing CPU load average information per core.
               */
              'cpu-load-average': Array<{
                /**
                 * An entry representing the CPU load average for a specific core.
                 */
                entry: {
                  /**
                   * The identifier for the individual CPU core.
                   */
                  coreid: string;

                  /**
                   * The average CPU load value for the core, typically as a percentage.
                   */
                  value: string;
                };
              }>;
              // Additional resource monitoring data can be documented as necessary.
            };
          };
          // Additional data processors can be documented as necessary.
        };
      };
    };
  };
}
