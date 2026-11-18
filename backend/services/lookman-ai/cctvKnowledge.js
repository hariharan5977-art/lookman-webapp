/**
 * Lookman AI - CCTV & Physical Security Domain Knowledge Base
 * Provides specialized calculators, DORI distance tables, protocol specs, and forensic guides.
 */

const CCTV_KNOWLEDGE = {
  // DORI Standards (EN 62676-4) in pixels per meter (PPM)
  DORI: {
    Detection: { ppm: 25, description: 'Determine whether a person or vehicle is present.' },
    Observation: { ppm: 62, description: 'See characteristic details such as clothing color or vehicle type.' },
    Recognition: { ppm: 125, description: 'Recognize with high confidence whether an individual was seen before.' },
    Identification: { ppm: 250, description: 'Identify beyond a reasonable doubt (court-admissible facial clarity).' }
  },

  // Calculate required storage (in GB/TB)
  calculateStorage: (cameras, days, resolution = '1080p', fps = 25, codec = 'H.265') => {
    // Typical bitrates in Mbps
    const bitrates = {
      '720p': { 'H.264': 2.0, 'H.265': 1.0, 'H.265+': 0.6 },
      '1080p': { 'H.264': 4.0, 'H.265': 2.0, 'H.265+': 1.2 },
      '4MP': { 'H.264': 8.0, 'H.265': 4.0, 'H.265+': 2.4 },
      '4K': { 'H.264': 16.0, 'H.265': 8.0, 'H.265+': 4.5 }
    };

    const rateMbps = (bitrates[resolution]?.[codec] || 2.0) * (fps / 25);
    const totalMbps = cameras * rateMbps;
    // Megabits per second -> Gigabytes per day: (Mbps * 3600 * 24) / 8000
    const gbPerDay = (totalMbps * 86400) / 8000;
    const totalGB = gbPerDay * days;
    const totalTB = (totalGB / 1024).toFixed(2);

    return {
      cameras,
      days,
      resolution,
      fps,
      codec,
      perCameraBitrateMbps: rateMbps.toFixed(2),
      totalBandwidthMbps: totalMbps.toFixed(2),
      dailyStorageGB: gbPerDay.toFixed(1),
      totalStorageTB: totalTB,
      recommendedRAID: totalTB > 20 ? 'RAID 6 (Dual parity with hot spare)' : 'RAID 5'
    };
  },

  // DORI distance calculator: Distance (meters) = (SensorWidth * PPM) / (ResolutionWidth * FocalLength)
  calculateDoriDistance: (focalLengthMm = 4.0, sensorType = '1/2.8', resolutionWidth = 1920) => {
    // Sensor horizontal width in mm
    const sensorWidths = {
      '1/3': 4.8,
      '1/2.8': 5.18,
      '1/2.7': 5.37,
      '1/1.8': 7.18,
      '1/1.2': 10.67
    };
    const sw = sensorWidths[sensorType] || 5.18;

    // PPM formula: PPM = (resolutionWidth * focalLengthMm) / (distanceMeters * sensorWidthMm)
    // distanceMeters = (resolutionWidth * focalLengthMm) / (PPM * sensorWidthMm)
    const result = {};
    for (const [level, data] of Object.entries(CCTV_KNOWLEDGE.DORI)) {
      const distance = (resolutionWidth * focalLengthMm) / (data.ppm * sw);
      result[level] = {
        distanceMeters: distance.toFixed(1),
        distanceFeet: (distance * 3.28084).toFixed(1),
        ppm: data.ppm,
        purpose: data.description
      };
    }
    return result;
  }
};

module.exports = CCTV_KNOWLEDGE;

