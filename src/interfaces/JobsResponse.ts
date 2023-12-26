// src/interfaces/JobsResponse.ts

/**
 * Describes the details of an individual job as returned by the PAN-OS API, including its status and various timestamps.
 */
export interface Job {
  /**
   * The enqueue timestamp of the job.
   */
  tenq: string;

  /**
   * The dequeue timestamp of the job.
   */
  tdeq: string;

  /**
   * The unique identifier of the job.
   */
  id: string;

  /**
   * The user that initiated the job.
   */
  user: string;

  /**
   * The type of the job.
   */
  type: string;

  /**
   * The current status of the job.
   */
  status: string;

  /**
   * The timestamp when the job was queued.
   */
  queued: string;

  /**
   * Indicates whether the job is stoppable.
   */
  stoppable: string;

  /**
   * The result of the job.
   */
  result: string;

  /**
   * The finish timestamp of the job.
   */
  tfin: string;

  /**
   * A description of the job.
   */
  description: string;

  /**
   * The job's position in the queue.
   */
  positionInQ: string;

  /**
   * The progress of the job, typically as a percentage.
   */
  progress: string;

  /**
   * Details of the job, potentially containing multiple lines of information.
   */
  details: {
    /**
     * An array of strings with line-by-line details.
     */
    line: string[];
  };

  /**
   * Warnings associated with the job, if any.
   */
  warnings: {
    /**
     * An optional array of strings with line-by-line warnings.
     */
    line?: string[];
  };
}

/**
 * Describes the structure of the response for a request to show jobs via the PAN-OS API.
 * Contains status information and an array or a single `Job` object, depending on the result.
 */
export interface JobsResponse {
  /**
   * The response wrapper containing the status and result properties.
   */
  response: {
    /**
     * The response status, typically indicating success or failure of the jobs fetch request.
     */
    status: string;

    /**
     * The result object containing job details. It may include a single `Job` object or an array of `Job` objects.
     */
    result: {
      /**
       * A single `Job` object or an array thereof. The structure depends on the number of jobs returned by the API.
       */
      job: Job | Job[]; // Can be an array of jobs or a single job
    };
  };
}
