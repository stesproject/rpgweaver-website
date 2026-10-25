import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const enPath = path.join(rootDir, 'src/i18n/en.json');
const itPath = path.join(rootDir, 'src/i18n/it.json');
const mediaDir = path.join(rootDir, 'public/media');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const it = JSON.parse(fs.readFileSync(itPath, 'utf8'));

function flattenKeys(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flattenKeys(v, nextKey));
    } else {
      result[nextKey] = v;
    }
  }
  return result;
}

const enFlat = flattenKeys(en);
const itFlat = flattenKeys(it);

const enKeys = Object.keys(enFlat).sort();
const itKeys = Object.keys(itFlat).sort();

assert.deepEqual(enKeys, itKeys, 'i18n key mismatch between en.json and it.json');

for (const k of enKeys) {
  assert.equal(typeof enFlat[k], 'string', `en.json key ${k} must be a string`);
  assert.ok(enFlat[k].trim().length > 0, `en.json key ${k} must not be empty`);
  assert.equal(typeof itFlat[k], 'string', `it.json key ${k} must be a string`);
  assert.ok(itFlat[k].trim().length > 0, `it.json key ${k} must not be empty`);
}

// Verify all 22 feature keys exist
const expectedFeatures = [
  'pixelMovement',
  'eventFollow',
  'eventTouch',
  'eventTransfer',
  'cameraTarget',
  'eventTemplates',
  'multiAreaEvents',
  'stackedEvents',
  'savePosition',
  'cropPicture',
  'picturePreview',
  'messageTypewriting',
  'controlFogs',
  'infiniteLayers',
  'autotilesAnimated',
  'characterSlicing',
  'filterableLists',
  'easyDebug',
  'customInputs',
  'customTileSize',
  'customViewport',
  'pixiPerformance',
];

for (const feat of expectedFeatures) {
  for (const field of ['badge', 'replaces', 'title', 'description', 'b1', 'b2', 'b3', 'caption']) {
    const fullKey = `features.${feat}.${field}`;
    assert.ok(fullKey in enFlat, `Missing feature translation key: ${fullKey}`);
  }
}

// Verify expected media files exist and are non-empty
const expectedMediaFiles = [
  'hero-main.png',
  'hero-main.webp',
  'hero-demo.webm',
  'feat-pixel-movement.webp',
  'feat-pixel-movement.webm',
  'feat-event-follow.webp',
  'feat-event-touch.webp',
  'feat-event-transfer.webp',
  'feat-camera-target.webp',
  'feat-event-templates.webp',
  'feat-multi-area.webp',
  'feat-stacked-events.webp',
  'feat-save-position.webp',
  'feat-crop-picture.webp',
  'feat-picture-preview.webp',
  'feat-message-typewriting.webp',
  'feat-control-fogs.webp',
  'feat-control-fogs.webm',
  'feat-infinite-layers.webp',
  'feat-infinite-layers.webm',
  'feat-autotiles-animated.webp',
  'feat-autotiles-animated.webm',
  'feat-character-slicing.webp',
  'feat-filterable-lists.webp',
  'feat-filterable-lists.webm',
  'feat-easy-debug.webp',
  'feat-custom-inputs.webp',
  'feat-tile-size.webp',
  'feat-viewport-dimensions.webp',
  'feat-pixi-performance.webp',
  'feat-pixi-performance.webm',
];

for (const file of expectedMediaFiles) {
  const filePath = path.join(mediaDir, file);
  assert.ok(fs.existsSync(filePath), `Missing media asset: public/media/${file}`);
  const stat = fs.statSync(filePath);
  assert.ok(stat.size > 1000, `Media asset is unexpectedly small (${stat.size}B): public/media/${file}`);
}

console.log(`✓ Verified ${enKeys.length} translation keys across EN/IT and ${expectedMediaFiles.length} real media assets.`);
