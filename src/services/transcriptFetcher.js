onst { YoutubeTranscript } = require('youtube-transcript');
const { attachTimestamps, joinSegmentsText } = require('../services/timestampFormatter');

/**
* Fetches a transcript for a single YouTube URL.
*
* @param {string} url - YouTube video URL
* @param {Object} options
* @param {string} [options.language='en'] - Language code to request
* @param {boolean} [options.includeTimestamps=true] - Whether to return timestamped output
* @returns {Promise<{url: string, transcript: string | Array<{timestamp: string, text: string}>}>}
*/
async function fetchTranscriptForUrl(url, options = {}) {
const { language = 'en', includeTimestamps = true } = options;

let segments;
try {
segments = await YoutubeTranscript.fetchTranscript(url, { lang: language });
} catch (err) {
throw new Error(`Unable to fetch transcript: ${err.message || String(err)}`);
}

if (!Array.isArray(segments) || !segments.length) {
throw new Error('Transcript is empty or unavailable for this video.');
}

if (includeTimestamps) {
const transcriptWithTimestamps = attachTimestamps(segments);
return {
url,
transcript: transcriptWithTimestamps,
};
}

const plainText = joinSegmentsText(segments);
return {
url,
transcript: plainText,
};
}

module.exports = {
fetchTranscriptForUrl,
};