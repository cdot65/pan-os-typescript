// src/interfaces/JobsResponse.ts

/**
 * Represents the structure of a job as returned by the PAN-OS API.
 */
export interface Job {
  tenq: string;
  tdeq: string;
  id: string;
  user: string;
  type: string;
  status: string;
  queued: string;
  stoppable: string;
  result: string;
  tfin: string;
  description: string;
  positionInQ: string;
  progress: string;
  details: {
    line: string[];
  };
  warnings: {
    line?: string[];
  };
}

/**
 * Represents the structure of the 'show jobs' response from the PAN-OS API.
 */
export interface JobsResponse {
  response: {
    status: string;
    result: {
      job: Job | Job[]; // Can be an array of jobs or a single job
    };
  };
}
