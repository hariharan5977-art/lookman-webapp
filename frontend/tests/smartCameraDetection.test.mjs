import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDetectionTiles,
  filterObjectDetections,
  mapTileDetections,
  mapBoxToOverlay,
  suppressDuplicateDetections,
  stabilizeDetections
} from '../src/utils/smartCameraDetection.js';

test('classification rejects weak detections and unrelated objects', () => {
  const detections = filterObjectDetections([
    { class: 'person', score: 0.35, bbox: [1, 2, 30, 40] },
    { class: 'Car', score: 0.34, bbox: [5, 6, 50, 60] },
    { class: 'dog', score: 0.99, bbox: [0, 0, 10, 10] },
    { class: 'person', score: 0.19, bbox: [1, 2, 30, 40] }
  ], 'classification');

  assert.deepEqual(detections.map(({ name }) => name), ['Person']);
  assert.equal(detections[0].confidence, 0.35);
});

test('vehicle detection filters out people but accepts vehicle classes', () => {
  const detections = filterObjectDetections([
    { class: 'person', score: 0.9, bbox: [0, 0, 10, 10] },
    { class: 'truck', score: 0.8, bbox: [10, 10, 30, 30] }
  ], 'anpr');

  assert.deepEqual(detections.map(({ name }) => name), ['Truck']);
});

test('overlapping detection tiles map their boxes back to video coordinates', () => {
  const tiles = createDetectionTiles(1600, 672);

  assert.equal(tiles.length, 4);
  assert.deepEqual(tiles[0], { x: 0, y: 0, width: 960, height: 404 });
  assert.deepEqual(tiles[3], { x: 640, y: 268, width: 960, height: 404 });
  assert.deepEqual(
    mapTileDetections([{ class: 'car', bbox: [10, 20, 30, 40] }], tiles[3])[0].bbox,
    [650, 288, 30, 40]
  );
});

test('duplicate tile detections are suppressed without merging different objects or classes', () => {
  const detections = suppressDuplicateDetections([
    { class: 'car', score: 0.8, bbox: [10, 10, 40, 40] },
    { class: 'car', score: 0.9, bbox: [12, 12, 40, 40] },
    { class: 'car', score: 0.7, bbox: [80, 10, 40, 40] },
    { class: 'person', score: 0.75, bbox: [12, 12, 40, 40] }
  ]);

  assert.deepEqual(
    detections.map(({ class: objectClass, score }) => [objectClass, score]),
    [['car', 0.9], ['person', 0.75], ['car', 0.7]]
  );
});

test('video boxes are clipped to the visible object-cover frame', () => {
  const overlay = mapBoxToOverlay(
    [0, 0, 1920, 1080],
    { videoWidth: 1920, videoHeight: 1080 },
    { clientWidth: 1000, clientHeight: 1000 }
  );

  assert.deepEqual(overlay, { left: 0, top: 0, width: 100, height: 100 });
  assert.equal(
    mapBoxToOverlay(
      [0, 0, 10, 10],
      { videoWidth: 1920, videoHeight: 1080 },
      { clientWidth: 1000, clientHeight: 1000 }
    ),
    null
  );
});

test('overlapping detections are smoothed while new targets remain unchanged', () => {
  const previous = [{
    featureId: 'classification',
    name: 'Person',
    left: 10,
    top: 20,
    width: 20,
    height: 30
  }];
  const current = [
    { ...previous[0], left: 14, top: 24 },
    { featureId: 'classification', name: 'Car', left: 60, top: 40, width: 15, height: 20 }
  ];

  const stabilized = stabilizeDetections(previous, current);
  assert.ok(Math.abs(stabilized[0].left - 12.8) < 1e-10);
  assert.ok(Math.abs(stabilized[0].top - 22.8) < 1e-10);
  assert.equal(stabilized[1], current[1]);
});
