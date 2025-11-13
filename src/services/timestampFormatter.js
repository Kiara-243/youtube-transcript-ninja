js/**
 * Converts a number of seconds into a human-readable timestamp "M:SS".
 *
 * @param {number} totalSeconds
 * @returns {string}
 */
function secondsToTimestamp(totalSeconds) {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Attach human-readable timestamps to transcript segments.
 * The library typically exposes "offset" in seconds; this helper
 * also falls back to "start" if offset is not present.
 *
 * @param {Array<{text: string, offset?: number, start?: number}>} segments
 * @returns {Array<{timestamp: string, text: string}>}
 */
function attachTimestamps(segments) {
  return segments.map((segment) => {
    const rawOffset =
      typeof segment.offset === 'number'
        ? segment.offset
        : typeof segment.start === 'number'
        ? segment.start
        : 0;

    return {
      timestamp: secondsToTimestamp(rawOffset),
      text: segment.text || '',
    };
  });
}

/**
 * Joins transcript segments into a single plain-text transcript.
 *
 * @param {Array<{text: string}>} segments
 * @returns {string}
 */
function joinSegmentsText(segments) {
  return segments
    .map((segment) =>
      segment && typeof segment.text === 'string' ? segment.text.trim() : ''
    )
    .filter(Boolean)
    .join(' ');
}

module.exports = {
  secondsToTimestamp,
  attachTimestamps,
  joinSegmentsText,
};