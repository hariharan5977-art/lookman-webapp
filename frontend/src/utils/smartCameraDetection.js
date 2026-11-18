const VEHICLE_CLASS_NAMES = {
  car: 'Car',
  motorcycle: 'Motorcycle',
  bicycle: 'Bicycle',
  bus: 'Bus',
  truck: 'Truck'
};
const VEHICLE_CLASSES = new Set(Object.keys(VEHICLE_CLASS_NAMES));

export function createDetectionTiles(videoWidth, videoHeight, cropScale = 0.6) {
  if (!videoWidth || !videoHeight || cropScale <= 0 || cropScale > 1) return [];

  const width = Math.ceil(videoWidth * cropScale);
  const height = Math.ceil(videoHeight * cropScale);
  const right = videoWidth - width;
  const bottom = videoHeight - height;

  return [
    { x: 0, y: 0, width, height },
    { x: right, y: 0, width, height },
    { x: 0, y: bottom, width, height },
    { x: right, y: bottom, width, height }
  ];
}

export function mapTileDetections(objects, tile) {
  return objects.map(object => ({
    ...object,
    bbox: [
      object.bbox[0] + tile.x,
      object.bbox[1] + tile.y,
      object.bbox[2],
      object.bbox[3]
    ]
  }));
}

export function suppressDuplicateDetections(objects, overlapThreshold = 0.45) {
  const sorted = [...objects].sort((first, second) => second.score - first.score);
  const kept = [];

  for (const object of sorted) {
    const [x, y, width, height] = object.bbox;
    const box = { left: x, top: y, width, height };
    const overlapsKeptDetection = kept.some(existing => {
      if (existing.class !== object.class) return false;
      const [existingX, existingY, existingWidth, existingHeight] = existing.bbox;
      return intersectionOverUnion(box, {
        left: existingX,
        top: existingY,
        width: existingWidth,
        height: existingHeight
      }) > overlapThreshold;
    });

    if (!overlapsKeptDetection) kept.push(object);
  }

  return kept;
}

export function filterObjectDetections(objects, featureId, minConfidence = 0.35) {
  return objects
    .filter(object => {
      const objectClass = String(object.class || '').toLowerCase();
      if (!Number.isFinite(object.score) || object.score < minConfidence) return false;
      if (featureId === 'anpr') return VEHICLE_CLASSES.has(objectClass);
      if (featureId === 'restriction' || featureId === 'classification') {
        return objectClass === 'person' || VEHICLE_CLASSES.has(objectClass);
      }
      return false;
    })
    .map((object, index) => {
      const objectClass = String(object.class).toLowerCase();
      return {
        id: `${objectClass}-${index}`,
        name: objectClass === 'person' ? 'Person' : VEHICLE_CLASS_NAMES[objectClass] || objectClass,
        confidence: object.score,
        box: object.bbox
      };
    });
}

export function mapBoxToOverlay(box, video, container) {
  if (!video.videoWidth || !video.videoHeight || !container.clientWidth || !container.clientHeight) {
    return null;
  }

  const scale = Math.max(
    container.clientWidth / video.videoWidth,
    container.clientHeight / video.videoHeight
  );
  const renderedWidth = video.videoWidth * scale;
  const renderedHeight = video.videoHeight * scale;
  const offsetX = (container.clientWidth - renderedWidth) / 2;
  const offsetY = (container.clientHeight - renderedHeight) / 2;
  const left = (box[0] * scale + offsetX) / container.clientWidth * 100;
  const top = (box[1] * scale + offsetY) / container.clientHeight * 100;
  const right = ((box[0] + box[2]) * scale + offsetX) / container.clientWidth * 100;
  const bottom = ((box[1] + box[3]) * scale + offsetY) / container.clientHeight * 100;
  const clippedLeft = Math.max(0, Math.min(100, left));
  const clippedTop = Math.max(0, Math.min(100, top));
  const clippedRight = Math.max(0, Math.min(100, right));
  const clippedBottom = Math.max(0, Math.min(100, bottom));

  if (clippedRight <= clippedLeft || clippedBottom <= clippedTop) return null;
  return {
    left: clippedLeft,
    top: clippedTop,
    width: clippedRight - clippedLeft,
    height: clippedBottom - clippedTop
  };
}

function intersectionOverUnion(first, second) {
  const left = Math.max(first.left, second.left);
  const top = Math.max(first.top, second.top);
  const right = Math.min(first.left + first.width, second.left + second.width);
  const bottom = Math.min(first.top + first.height, second.top + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const union = first.width * first.height + second.width * second.height - intersection;
  return union > 0 ? intersection / union : 0;
}

export function stabilizeDetections(previous, current, currentWeight = 0.7) {
  const unmatchedPrevious = new Set(previous.map((_, index) => index));
  return current.map(detection => {
    let bestIndex = -1;
    let bestOverlap = 0.15;

    for (const index of unmatchedPrevious) {
      const prior = previous[index];
      if (prior.featureId !== detection.featureId || prior.name !== detection.name) continue;
      const overlap = intersectionOverUnion(prior, detection);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestIndex = index;
      }
    }

    if (bestIndex === -1) return detection;
    unmatchedPrevious.delete(bestIndex);
    const prior = previous[bestIndex];
    return {
      ...detection,
      left: prior.left * (1 - currentWeight) + detection.left * currentWeight,
      top: prior.top * (1 - currentWeight) + detection.top * currentWeight,
      width: prior.width * (1 - currentWeight) + detection.width * currentWeight,
      height: prior.height * (1 - currentWeight) + detection.height * currentWeight
    };
  });
}
