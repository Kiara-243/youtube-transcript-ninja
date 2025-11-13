js/**
 * Validates a YouTube URL and normalizes it.
 *
 * @param {string} urlString
 * @returns {{ isValid: boolean, reason: string | null, url?: string }}
 */
function validateYouTubeUrl(urlString) {
  if (typeof urlString !== 'string' || !urlString.trim()) {
    return { isValid: false, reason: 'URL must be a non-empty string.' };
  }

  let url;
  try {
    url = new URL(urlString.trim());
  } catch (err) {
    return { isValid: false, reason: 'Invalid URL format.' };
  }

  const host = url.hostname.toLowerCase();

  const isYouTubeHost =
    host === 'www.youtube.com' ||
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtu.be';

  if (!isYouTubeHost) {
    return { isValid: false, reason: 'URL must point to youtube.com or youtu.be.' };
  }

  if (host === 'youtu.be') {
    if (!url.pathname || url.pathname === '/') {
      return {
        isValid: false,
        reason: 'Short YouTube URLs must include a video ID path.',
      };
    }
  } else if (host.includes('youtube.com')) {
    const hasVideoId = url.searchParams.has('v') || url.pathname.startsWith('/shorts/');
    if (!hasVideoId) {
      return {
        isValid: false,
        reason: 'YouTube URL must include a video ID (?v=) or /shorts/ path.',
      };
    }
  }

  return { isValid: true, reason: null, url: url.toString() };
}

module.exports = {
  validateYouTubeUrl,
};