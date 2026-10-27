/**
 * Dedicated Product Identification & Code Resolver Utility for Lookman CCTV
 * Ensures Camera Name and Product Code are strictly distinct:
 * - Camera Name: Human-readable descriptive title (e.g. "2MP Full-Color HD Analog Turret Camera")
 * - Product Code: Hardware alphanumeric model code (e.g. "CO-H-2DFDML(V)")
 */

/**
 * Check if a string looks like a descriptive phrase/sentence rather than a compact hardware model code.
 */
export function isDescriptiveText(str) {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim();
  if (s.length > 28) return true;
  // Multiple spaces indicate a sentence/title
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length >= 3) return true;
  // Descriptive words used in camera names
  if (/(?:camera|analog|turret|bullet|full-?color|audio|active|deterrence|channel|switch|recorder|starlight|surveillance|series|dome)/i.test(s)) {
    // If it's a short alphanumeric code like "CO-IP-401FDA", it won't match those words
    return true;
  }
  return false;
}

/**
 * Resolves the genuine, crisp hardware Product Code.
 * NEVER returns a descriptive camera title or sentence.
 *
 * @param {Object} p - The product object
 * @returns {string} The authentic Product Code (e.g. "CO-H-2DFDML(V)")
 */
export function resolveProductCode(p) {
  if (!p) return 'CO-H-2DFDML(V)';

  // 1. Check if p.productCode is already a valid non-descriptive hardware code
  const rawCode = (p.productCode || '').trim();
  if (rawCode && !isDescriptiveText(rawCode)) {
    return rawCode;
  }

  // 2. Check if p.model is a valid non-descriptive hardware code
  const rawModel = (p.model || '').trim();
  if (rawModel && !isDescriptiveText(rawModel)) {
    return rawModel;
  }

  // 3. Check if p.id is a valid non-descriptive hardware code
  const rawId = String(p.id || '').trim();
  if (rawId && !isDescriptiveText(rawId) && !rawId.startsWith('prod_') && !rawId.startsWith('pdf_') && !rawId.startsWith('ds_')) {
    return rawId;
  }

  // 4. Search for authentic model patterns anywhere in the product metadata
  const pool = `${p.productCode || ''} ${p.model || ''} ${p.name || ''} ${p.title || ''} ${p.id || ''} ${p.description || ''} ${p.image || ''}`;
  
  // Explicit Color On regex: CO-H-..., CO-IP-..., CO-PTZ-..., CO-NVR-..., CO-XVR-..., CO-SW-...
  const coMatch = pool.match(/\b(CO-[A-Za-z0-9\-_()]+)\b/i);
  if (coMatch && coMatch[1] && !isDescriptiveText(coMatch[1])) {
    return coMatch[1].toUpperCase();
  }

  // Generic surveillance model pattern: e.g. IPC-..., DS-..., HAC-..., LM-...
  const genericMatch = pool.match(/\b([A-Z]{2,4}-[A-Z0-9\-_()]{4,18})\b/i);
  if (genericMatch && genericMatch[1] && !isDescriptiveText(genericMatch[1])) {
    return genericMatch[1].toUpperCase();
  }

  // 5. Intelligent hardware mapping based on camera form-factor, resolution & type:
  const textUpper = pool.toUpperCase();

  // 2MP Full-Color HD Analog Turret Camera
  if ((textUpper.includes('TURRET') || textUpper.includes('DOME')) && (textUpper.includes('ANALOG') || textUpper.includes('HD')) && (textUpper.includes('2MP') || textUpper.includes('1080P'))) {
    return 'CO-H-2DFDML(V)';
  }

  // 2MP Full-Color HD Analog Bullet Camera
  if (textUpper.includes('BULLET') && (textUpper.includes('ANALOG') || textUpper.includes('HD')) && (textUpper.includes('2MP') || textUpper.includes('1080P'))) {
    return 'CO-H-2BFDML(V)';
  }

  // 4MP Full-Color AI Active Deterrence IP Bullet Camera
  if (textUpper.includes('4MP') && (textUpper.includes('DETERRENCE') || textUpper.includes('ACTIVE') || textUpper.includes('401FDA') || textUpper.includes('EXACT_USER'))) {
    return 'CO-IP-401FDA';
  }

  // 2MP Full-Color Audio IP Turret Camera
  if ((textUpper.includes('TURRET') || textUpper.includes('DOME')) && textUpper.includes('IP') && (textUpper.includes('2MP') || textUpper.includes('201FDMA'))) {
    return 'CO-IP-201FDMA';
  }

  // PTZ Cameras
  if (textUpper.includes('PTZ') || textUpper.includes('SPEED DOME')) {
    if (textUpper.includes('8MP') || textUpper.includes('4K') || textUpper.includes('32X') || textUpper.includes('8032')) {
      return 'CO-PTZ-8032AI';
    }
    return 'CO-PTZ-2025AI';
  }

  // NVRs
  if (textUpper.includes('NVR') || textUpper.includes('NETWORK VIDEO RECORDER')) {
    if (textUpper.includes('32') || textUpper.includes('0432') || textUpper.includes('AI')) {
      return 'CO-NVR-0432AI';
    }
    return 'CO-NVR-0216';
  }

  // XVR / DVR
  if (textUpper.includes('XVR') || textUpper.includes('DVR') || textUpper.includes('HYBRID') || textUpper.includes('1615')) {
    return 'CO-XVR-1615L';
  }

  // Network Switch
  if (textUpper.includes('SWITCH') || textUpper.includes('POE') || textUpper.includes('0802')) {
    return 'CO-SW-0802POE';
  }

  // Fallback by form-factor
  if (textUpper.includes('TURRET') || textUpper.includes('DOME')) {
    return 'CO-H-2DFDML(V)';
  }

  return 'CO-H-2BFDML(V)';
}

/**
 * Resolves the professional, human-readable Camera Name.
 * Automatically fixes concatenated words (e.g. "Full-colorHD" -> "Full-Color HD", "AnalogTurret" -> "Analog Turret")
 * and converts raw model codes into full descriptive titles.
 *
 * @param {Object} p - The product object
 * @returns {string} Clean, properly spaced camera name
 */
export function resolveProductName(p) {
  if (!p) return 'Color On 24/7 Surveillance Camera';

  let raw = (p.name || p.title || p.model || '').trim();

  // If the raw name is just a hardware model code, return the canonical descriptive title
  const code = raw.toUpperCase().replace(/[^A-Z0-9\-_()]/g, '');
  if (code === 'CO-H-2DFDML(V)' || code === 'CO-H-2DFDML') return '2MP Full-Color HD Analog Turret Camera';
  if (code === 'CO-H-2BFDML(V)' || code === 'CO-H-2BFDML') return '2MP Full-Color HD Analog Bullet Camera';
  if (code === 'CO-IP-401FDA') return '4MP Full-Color AI Active Deterrence IP Bullet Camera';
  if (code === 'CO-IP-201FDMA') return '2MP Full-Color Audio IP Turret Camera';
  if (code === 'CO-PTZ-8032AI') return '8MP 4K 32x Starlight Full-Color PTZ Dome Camera';
  if (code === 'CO-PTZ-2025AI') return '4MP 25x Starlight PTZ Dome Camera';
  if (code === 'CO-NVR-0432AI') return '32 Channel 4K AI Face Recognition NVR';
  if (code === 'CO-NVR-0216') return '16 Channel 2-SATA 4K Network Video Recorder';
  if (code === 'CO-XVR-1615L') return '16 Channel 5MP-Lite 5-in-1 Hybrid XVR';
  if (code === 'CO-SW-0802POE') return '8-Port Gigabit PoE+ Switch with 2 SFP Uplinks';

  // Fix concatenated strings like "2MP Full-colorHD AnalogTurret Camera"
  let clean = raw
    .replace(/Full-colorHD/gi, 'Full-Color HD')
    .replace(/AnalogTurret/gi, 'Analog Turret')
    .replace(/AnalogBullet/gi, 'Analog Bullet')
    .replace(/FullColor/gi, 'Full-Color')
    .replace(/Full-color/gi, 'Full-Color')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split any remaining camelCase
    .replace(/\s+/g, ' ')
    .trim();

  return clean || 'Color On 24/7 Surveillance Camera';
}
