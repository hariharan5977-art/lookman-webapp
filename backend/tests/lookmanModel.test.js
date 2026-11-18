const test = require('node:test');
const assert = require('node:assert/strict');
const LookmanModel = require('../services/lookman-ai/lookmanModel');

const model = new LookmanModel();
model.apiKey = null;

function ask(content, selectedModel = 'lookman-1.0-ultra', imageBase64 = null) {
  return model.generateOfflineResponse({
    messages: [{ role: 'user', content }],
    model: selectedModel,
    imageBase64
  });
}

test('routes DORI prompts to distance estimation rather than generic calculation handling', () => {
  const response = ask('Calculate DORI distances for a 6mm lens on a 1/2.8 sensor');

  assert.match(response.content, /DORI Distance Estimate/);
  assert.match(response.content, /6 mm/);
  assert.match(response.content, /\| Identification \|/);
  assert.doesNotMatch(response.content, /CCTV Storage/);
});

test('uses camera, retention, resolution, frame rate, and codec from storage prompts', () => {
  const response = ask('Estimate storage for 12 cameras, 14 days retention, 1080p at 15 FPS using H.265');

  assert.match(response.content, /\| Camera fleet \| 12 cameras \|/);
  assert.match(response.content, /\| Resolution \/ frame rate \| 1080p @ 15 FPS \|/);
  assert.match(response.content, /\| Retention \| 14 days \|/);
  assert.match(response.content, /\| Codec \| H\.265 \|/);
  assert.match(response.content, /\| Per-camera bitrate \| 1\.20 Mbps \|/);
});

test('routes RTSP troubleshooting separately from code prompts that mention RTSP', () => {
  const streamResponse = ask('My RTSP stream keeps dropping frames');
  const codeResponse = ask('Write a Python script using OpenCV and YOLO to detect people from an RTSP feed');

  assert.match(streamResponse.content, /RTSP \/ ONVIF Stream Troubleshooting/);
  assert.match(codeResponse.content, /CCTV Software \/ Computer-Vision Assistance/);
  assert.match(codeResponse.content, /ultralytics import YOLO/);
});

test('vision mode requests an image instead of fabricating detections', () => {
  const response = ask('What is happening in the scene?', 'lookman-1.0-vision');

  assert.match(response.content, /Attach a CCTV image or frame/);
  assert.equal(response.model, 'lookman-1.0-vision');
});

test('standalone image mode does not claim to have detected objects', () => {
  const response = ask('Analyze this frame', 'lookman-1.0-vision', 'data:image/png;base64,ZmFrZQ==');

  assert.match(response.content, /visual analysis is unavailable in standalone mode/);
  assert.doesNotMatch(response.content, /Detected Entities|Threat Evaluation/);
});
