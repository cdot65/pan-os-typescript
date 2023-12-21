// src/interfaces/JobDetail.ts

/**
 * Interface representing details of a single job.
 */
export interface JobDetail {
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
  filepath?: string;
  details: {
    line: string[];
  };
  warnings: {
    line?: string[];
  };
}
