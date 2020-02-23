
export interface ResponseGetGlobalStat{
/**
 * Overall download speed (byte/sec).
 */
downloadSpeed: number;
/**
 * Overall upload speed(byte/sec).
 */
uploadSpeed: number;
/**
 * The number of active downloads.
 */
numActive: number;
/**
 * The number of waiting downloads.
 */
numWaiting: number;
/**
 * The number of stopped downloads in the current session. This value is capped by the --max-download-result option.
 */
numStopped: number;
/**
 * The number of stopped downloads in the current session and not capped by the --max-download-result option.
 */
numStoppedTotal: number;

}
