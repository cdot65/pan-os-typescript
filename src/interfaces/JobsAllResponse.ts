// src/interfaces/JobsAllResponse.ts

import { JobDetail } from './JobDetail';

/**
 * Interface representing the structure of the response for 'show jobs all' command.
 */
export interface JobsAllResponse {
  response: {
    status: string;
    result: {
      job: JobDetail[];
    };
  };
}
