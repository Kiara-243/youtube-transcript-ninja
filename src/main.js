onst fs = require('fs');
const path = require('path');
const { validateYouTubeUrl } = require('./utils/urlValidator');
const { fetchTranscriptForUrl } = require('./services/transcriptFetcher');

async function run() {
const args = process.argv.slice(2);
let inputPath = path.join(__dirname, '..', 'data', 'sample-input.json');
let outputPath = path.join(__dirname, '..', 'data', 'sample-output.json');

for (let i = 0; i < args.length; i++) {
const arg = args[i];
if ((arg === '--input' || arg === '-i') && args[i + 1]) {
inputPath = path.resolve(args[i + 1]);
i++;
} else if ((arg === '--output' || arg === '-o') && args[i + 1]) {
outputPath = path.resolve(args[i + 1]);
i++;
}
}

console.log(`[YouTube Transcript Ninja] Using input: ${inputPath}`);

let input;
try {
const raw = fs.readFileSync(inputPath, 'utf8');
input = JSON.parse(raw);
} catch (err) {
console.error(`Failed to read or parse input file at ${inputPath}: ${err.message}`);
process.exit(1);
}

const urls = Array.isArray(input.urls) ? input.urls : [];
if (!urls.length) {
console.error('Input JSON must contain a non-empty "urls" array.');
process.exit(1);
}

const includeTimestamps =
typeof input.includeTimestamps === 'boolean' ? input.includeTimestamps : true;
const language =
typeof input.language === 'string' && input.language.trim()
? input.language.trim()
: 'en';

const results = [];

for (const url of urls) {
const validation = validateYouTubeUrl(url);
if (!validation.isValid) {
console.warn(`Skipping invalid URL "${url}": ${validation.reason}`);
continue;
}

const finalUrl = validation.url;
console.log(
`Fetching transcript for ${finalUrl} (lang=${language}, timestamps=${includeTimestamps})...`
);

try {
const transcript = await fetchTranscriptForUrl(finalUrl, {
language,
includeTimestamps,
});
results.push(transcript);
console.log(`✓ Retrieved transcript for ${finalUrl}`);
} catch (err) {
console.error(`✗ Failed to retrieve transcript for ${finalUrl}: ${err.message}`);
}
}

if (!results.length) {
console.error('No transcripts could be retrieved. Exiting without writing output.');
process.exit(1);
}

try {
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Saved ${results.length} transcript result(s) to ${outputPath}`);
} catch (err) {
console.error(`Failed to write output file at ${outputPath}: ${err.message}`);
process.exit(1);
}
}

if (require.main === module) {
run().catch((err) => {
console.error('Unexpected error:', err);
process.exit(1);
});
}

module.exports = { run };