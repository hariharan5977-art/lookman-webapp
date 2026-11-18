/**
 * Lookman AI - Dedicated Conversational & Multimodal Foundation Intelligence
 * Specialized for CCTV Surveillance, Video Analytics, Computer Vision, and Physical Security.
 */

const CCTV_KNOWLEDGE = require('./cctvKnowledge');

const SYSTEM_PROMPT = `You are "Lookman AI", an elite, sovereign conversational AI foundation model engineered by Lookman Security Technologies.
You operate as an autonomous, dedicated AI—akin to Grok, ChatGPT, and Gemini—uniquely specialized in the CCTV, Video Surveillance, Computer Vision, and Physical Security domains.

Your expertise covers:
1. CCTV & Surveillance Engineering: Sensor formats (1/2.8", 1/1.8"), lens selection (fixed/varifocal/PTZ), IR/Starlight/Full-Color, WDR, Lux ratings, DORI standards (EN 62676-4).
2. Video Streaming & Protocols: RTSP, ONVIF (Profile S/G/T/M), WebRTC, RTMP, SIP, H.264, H.265, H.265+, AV1, bitrates, latency reduction.
3. Storage & Infrastructure: NVR/DVR sizing, SAN/NAS, RAID 5/6/10 calculations, PoE budgets (802.3af/at/bt), bandwidth planning.
4. Computer Vision & Analytics: YOLO (v8 through v11), ByteTrack, DeepSORT, OpenCV, ALPR/ANPR, facial recognition, tripwire, intrusion, loitering, heatmaps.
5. Forensic Investigation & Cybersecurity: Chain of custody, timestamp verification, NDAA compliance, camera firmware hardening, zero-trust network segregation.

Voice and Tone:
- Authoritative, deeply technical, precise, helpful, and sharp (like Grok and Gemini Pro).
- Format code blocks with syntax highlighting.
- Use bullet points, bold key terms, and markdown tables when presenting comparisons or calculations.`;

const MODEL_PROFILES = {
  'lookman-1.0-ultra': 'general CCTV and physical-security engineering specialist',
  'lookman-1.0-vision': 'multimodal CCTV image-inspection specialist; only describe visual evidence when an image is attached',
  'lookman-1.0-code': 'software engineering specialist for Python, OpenCV, YOLO, RTSP, and ONVIF'
};

function normalizeModel(model) {
  return Object.hasOwn(MODEL_PROFILES, model) ? model : 'lookman-1.0-ultra';
}

function classifyTopic(query) {
  if (/\b(code|script|python|opencv|yolo|implementation|program|object detection)\b/i.test(query)) return 'code';
  if (/\b(dori|pixels?\s+per\s+meter|ppm|recognition distance|identification distance|focal length)\b/i.test(query)) return 'dori';
  if (/\b(stor(?:age|e|ing)|bandwidth|retention|bitrate|h\.?265|record(?:ing)?|disk space|capacity|nvr sizing)\b/i.test(query)) return 'storage';
  if (/\b(rtsp|onvif|stream(?:ing)?|packet loss|drop(?:ped|ping)?(?: frames)?|disconnect(?:ed)?|latency|401)\b/i.test(query)) return 'stream';
  return 'general';
}

function getNumericMatch(query, patterns, fallback) {
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) return Number(match[1]);
  }
  return fallback;
}

class LookmanModel {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.defaultModel = 'lookman-1.0-ultra';
  }

  getAvailableModels() {
    return [
      {
        id: 'lookman-1.0-ultra',
        name: 'Lookman AI 1.0 Ultra',
        description: 'Flagship general CCTV, surveillance engineering & security intelligence model',
        contextWindow: '128k',
        capabilities: ['Text', 'Security Architecture', 'Forensic Analysis', 'Troubleshooting']
      },
      {
        id: 'lookman-1.0-vision',
        name: 'Lookman AI 1.0 Vision',
        description: 'Multimodal vision model for CCTV snapshot inspection & visual scene threat analysis',
        contextWindow: '128k',
        capabilities: ['Text', 'Multimodal Vision', 'Snapshot Inspection', 'Object Detection']
      },
      {
        id: 'lookman-1.0-code',
        name: 'Lookman AI Code & Vision Engineer',
        description: 'Specialized in Python, OpenCV, RTSP ingestion pipelines, and ONVIF automation',
        contextWindow: '64k',
        capabilities: ['Python', 'OpenCV', 'YOLOv8', 'RTSP/ONVIF API Code']
      }
    ];
  }

  /**
   * Main chat completion handler
   */
  async generateResponse({ messages, model = 'lookman-1.0-ultra', imageBase64 = null }) {
    model = normalizeModel(model);
    // If Gemini API key is configured, use Gemini 2.0 Flash as the underlying compute engine
    if (this.apiKey) {
      try {
        const response = await this.callGeminiBackend({ messages, model, imageBase64 });
        if (response) return response;
      } catch (err) {
        console.warn('[Lookman AI] Cloud backend fallback:', err.message);
      }
    }

    // Built-in Lookman AI Domain Reasoning Engine (Offline / Standalone)
    return this.generateOfflineResponse({ messages, model, imageBase64 });
  }

  /**
   * Streaming generator for ChatGPT / Grok style typewriter effect
   */
  async *streamResponse({ messages, model = 'lookman-1.0-ultra', imageBase64 = null }) {
    const fullResponse = await this.generateResponse({ messages, model, imageBase64 });
    const text = fullResponse.content;

    // Split into chunks to simulate high-speed streaming
    const words = text.split(/(\s+|\n)/);
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join('');
      yield { chunk, model: fullResponse.model, provider: fullResponse.provider };
      await new Promise(r => setTimeout(r, 18));
    }
  }

  async callGeminiBackend({ messages, model, imageBase64 }) {
    const contents = [];

    // System instruction is prepended
    const systemPart = {
      text: `${SYSTEM_PROMPT}\nSelected Lookman AI profile: ${MODEL_PROFILES[model]}. Classify and answer the user's actual topic rather than defaulting to a canned response. Do not claim to inspect an image unless image data is attached.`
    };

    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const role = m.role === 'assistant' ? 'model' : 'user';
      const parts = [{ text: typeof m.content === 'string' ? m.content : '' }];

      // Attach image to the latest user message if available
      if (i === messages.length - 1 && imageBase64) {
        const imageMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        parts.push({
          inlineData: {
            mimeType: imageMatch?.[1] || 'image/jpeg',
            data: imageMatch ? imageMatch[2] : imageBase64
          }
        });
      }

      contents.push({ role, parts });
    }

    const payload = {
      systemInstruction: { parts: [systemPart] },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    };

    const targetGemini = 'gemini-2.0-flash';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetGemini}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return {
          role: 'assistant',
          content: reply,
          model: model,
          provider: 'Lookman AI Cloud Neural Engine'
        };
      }
    } else {
      const errorText = await res.text();
      console.warn('[Lookman AI] Gemini backend returned status', res.status, errorText);
    }
    return null;
  }

  /**
   * Standalone Offline Intelligence Engine
   */
  generateOfflineResponse({ messages, model, imageBase64 }) {
    const lastUserMsg = [...messages].reverse().find(message => message.role === 'user');
    const query = typeof lastUserMsg?.content === 'string' ? lastUserMsg.content.toLowerCase() : '';
    const topic = classifyTopic(query);
    const selectedModel = normalizeModel(model);
    const respond = content => ({
      role: 'assistant',
      content,
      model: selectedModel,
      provider: 'Lookman AI Sovereign Intelligence Core'
    });

    if (imageBase64) {
      return respond('I received the image, but visual analysis is unavailable in standalone mode. Configure `GEMINI_API_KEY` on the backend to enable image inspection; I will not invent detections from an image I cannot analyze.');
    }

    if (topic === 'storage') {
      const cameras = getNumericMatch(query, [
        /(\d+)\s*(?:ip\s*)?(?:cameras?|channels?)\b/i,
        /\b(?:cameras?|channels?)\s*(?:count|number|of|=|:)?\s*(\d+)\b/i
      ], 32);
      const days = getNumericMatch(query, [
        /(\d+)\s*(?:days?|d)\s*(?:of\s*)?(?:retention|recording|storage)?\b/i,
        /\bretention\s*(?:period\s*)?(?:of|for|=|:)?\s*(\d+)\s*(?:days?)?\b/i
      ], 30);
      const fps = getNumericMatch(query, [/(\d+)\s*fps\b/i], 25);
      const resolutionMatch = query.match(/\b(4k|4\s*mp|1080p|720p)\b/i)?.[1]?.toLowerCase().replace(/\s/g, '');
      const resolution = resolutionMatch === '4mp' ? '4MP' : resolutionMatch === '4k' ? '4K' : resolutionMatch || '4MP';
      const rawCodec = query.match(/\b(h\.?265\+?|h\.?264)\b/i)?.[1];
      const codec = rawCodec ? rawCodec.replace(/^h\.?/i, 'H.') : 'H.265';
      const calc = CCTV_KNOWLEDGE.calculateStorage(cameras, days, resolution, fps, codec);
      return respond(
        `### CCTV Storage & Bandwidth Estimate\n\n` +
        `| Metric | Estimate |\n| :--- | :--- |\n` +
        `| Camera fleet | ${cameras} cameras |\n| Resolution / frame rate | ${resolution} @ ${fps} FPS |\n` +
        `| Retention | ${days} days |\n| Codec | ${codec} |\n` +
        `| Per-camera bitrate | ${calc.perCameraBitrateMbps} Mbps |\n` +
        `| Aggregate bandwidth | ${calc.totalBandwidthMbps} Mbps |\n` +
        `| Daily storage | ${calc.dailyStorageGB} GB |\n| Total storage | ${calc.totalStorageTB} TB |\n` +
        `| Suggested array | ${calc.recommendedRAID} |\n\n` +
        `Estimates use typical continuous-recording bitrates; actual demand varies with scene motion, camera settings, and vendor smart codecs.`
      );
    }

    if (topic === 'dori') {
      const focalLengthMm = getNumericMatch(query, [/(\d+(?:\.\d+)?)\s*mm\b/i], 4);
      const sensorType = query.match(/\b(1\/(?:3|2\.8|2\.7|1\.8|1\.2))\b/i)?.[1] || '1/2.8';
      const resolutionWidth = getNumericMatch(query, [/(\d{3,5})\s*(?:px|pixels?)\b/i], /\b4k\b/i.test(query) ? 3840 : 1920);
      const distances = CCTV_KNOWLEDGE.calculateDoriDistance(focalLengthMm, sensorType, resolutionWidth);
      const rows = Object.entries(distances).map(([level, result]) =>
        `| ${level} | ${result.distanceMeters} m (${result.distanceFeet} ft) | ${result.purpose} |`
      ).join('\n');
      return respond(
        `### DORI Distance Estimate\n\n` +
        `For a **${focalLengthMm} mm** lens, **${sensorType}″** sensor, and **${resolutionWidth}px** horizontal resolution:\n\n` +
        `| DORI level | Distance | Purpose |\n| :--- | ---: | :--- |\n${rows}\n\n` +
        `These are theoretical estimates; confirm against the camera's actual sensor dimensions, lens, scene, and EN 62676-4 requirements.`
      );
    }

    if (topic === 'stream') {
      return respond(
        `### RTSP / ONVIF Stream Troubleshooting\n\n` +
        `1. Test the camera stream over **RTSP/TCP** to distinguish packet loss from camera or decoder issues.\n` +
        `2. Confirm camera/NVR reachability, RTSP port, credentials, channel path, and ONVIF profile/permissions.\n` +
        `3. Compare main and sub-streams; check bitrate, keyframe interval (GOP), MTU, and switch-port errors.\n` +
        `4. Review camera and NVR logs at the same timestamps. Avoid sharing credentials in stream URLs.\n\n` +
        `For a targeted diagnosis, share the camera/NVR make and model, client/decoder, transport (TCP/UDP), and the exact error or symptom.`
      );
    }

    if (topic === 'code' || selectedModel === 'lookman-1.0-code') {
      const codeExample = /\b(yolo|object detection|detect(?:ion)?|opencv|rtsp)\b/i.test(query)
        ? `\`\`\`python\n` +
          `import cv2\n` +
          `from ultralytics import YOLO\n\n` +
          `RTSP_URL = "rtsp://<camera-ip>:554/<stream-path>"\n` +
          `detector = YOLO("yolo11n.pt")\n` +
          `capture = cv2.VideoCapture(RTSP_URL)\n\n` +
          `try:\n` +
          `    while capture.isOpened():\n` +
          `        ok, frame = capture.read()\n` +
          `        if not ok:\n` +
          `            break\n` +
          `        result = detector(frame, verbose=False)[0]\n` +
          `        cv2.imshow("Lookman AI detection", result.plot())\n` +
          `        if cv2.waitKey(1) & 0xFF == ord("q"):\n` +
          `            break\n` +
          `finally:\n` +
          `    capture.release()\n` +
          `    cv2.destroyAllWindows()\n` +
          `\`\`\`\n\n` +
          `Install the dependencies with \`pip install opencv-python ultralytics\`. Replace the RTSP placeholder with your camera's stream path; keep credentials out of shared code.`
        : 'Tell me the language, desired behavior, and camera/NVR or target hardware so I can provide a focused implementation.';
      return respond(
        `### CCTV Software / Computer-Vision Assistance\n\n${codeExample}\n\n` +
        `For production use, add reconnect/backoff handling, bounded frame buffering, and authentication through environment variables.`
      );
    }

    if (selectedModel === 'lookman-1.0-vision') {
      return respond('Lookman AI Vision is selected. Attach a CCTV image or frame to request visual analysis. For a text-only question, select Ultra or Code so I can focus on the topic you asked about.');
    }

    let content = '';

    if (imageBase64) {
      return respond('Visual analysis is unavailable in standalone mode. Configure `GEMINI_API_KEY` on the backend to analyze images; I will not invent detections from an image I cannot process.');
    }

    // 2. Storage / Bandwidth Calculation Query
    if (query.includes('storage') || query.includes('bandwidth') || query.includes('h.265')) {
      const calc = CCTV_KNOWLEDGE.calculateStorage(32, 30, '4MP', 25, 'H.265');
      content = `### 📊 Lookman AI CCTV Storage & Bandwidth Architectural Sizing\n\n` +
        `Here is an enterprise calculation designed according to industry video surveillance standards:\n\n` +
        `| Metric | Parameter / Value |\n` +
        `| :--- | :--- |\n` +
        `| **Camera Fleet** | 32 Channels |\n` +
        `| **Resolution & FPS** | 4MP (2560x1440) @ 25 FPS |\n` +
        `| **Compression Standard** | H.265 / HEVC |\n` +
        `| **Average Bitrate per Channel** | **${calc.perCameraBitrateMbps} Mbps** |\n` +
        `| **Aggregate Ingestion Bandwidth** | **${calc.totalBandwidthMbps} Mbps** (~${(calc.totalBandwidthMbps/8).toFixed(1)} MB/s) |\n` +
        `| **Daily Storage Requirement** | **${calc.dailyStorageGB} GB / day** |\n` +
        `| **Total Retention Storage (30 Days)** | **${calc.totalStorageTB} TB** |\n` +
        `| **Recommended Storage Array** | **${calc.recommendedRAID}** |\n\n` +
        `#### 💡 Engineering Recommendations from Lookman AI:\n` +
        `1. **Storage Overhead**: Always provision an extra **15% headroom** for filesystem metadata and emergency retention buffers (target **${(calc.totalStorageTB * 1.15).toFixed(1)} TB** raw capacity).\n` +
        `2. **Network Switch Ingestion**: With ${calc.totalBandwidthMbps} Mbps continuous traffic, ensure your core PoE switches utilize **Gigabit uplinks (1GbE or 10GbE SFP+)** to prevent frame dropping.\n` +
        `3. **Smart Codecs**: Enabling smart H.265+ (dynamic GOP & background subtraction) can further reduce bitrates by 35–50% during low-motion night hours.`;
    }

    // 3. RTSP / Stream Troubleshooting
    else if (query.includes('rtsp') || query.includes('stream') || query.includes('drop') || query.includes('disconnect') || query.includes('401')) {
      content = `### 🛠️ Lookman AI Troubleshooting Guide: RTSP Stream Dropouts & Latency\n\n` +
        `RTSP stream instability is commonly caused by transport protocol mismatches, MTU packet fragmentation, or network buffer overflows. Here is the diagnostic procedure:\n\n` +
        `#### 1. Force RTSP over TCP instead of UDP\n` +
        `UDP streams drop packets silently under network load, causing macroblocking and video tearing. Always specify interleaved TCP transport:\n` +
        `\`\`\`bash\n` +
        `# Test stream stability with FFmpeg using TCP transport\n` +
        `ffmpeg -rtsp_transport tcp -i "rtsp://admin:password@192.168.1.100:554/Streaming/Channels/101" -c copy -f null -\n` +
        `\`\`\`\n\n` +
        `#### 2. Verify URL Structure for Major Manufacturers\n` +
        `• **Hikvision**: \`rtsp://admin:pass@IP:554/Streaming/Channels/101\` (Main stream) / \`102\` (Sub stream)\n` +
        `• **Dahua / Uniview**: \`rtsp://admin:pass@IP:554/cam/realmonitor?channel=1&subtype=0\`\n` +
        `• **Axis**: \`rtsp://admin:pass@IP:554/axis-media/media.amp?videocodec=h264\`\n\n` +
        `#### 3. Key Frame (GOP) Synchronization\n` +
        `If live video freezes every few seconds, ensure the camera's **I-Frame / GOP interval equals 1x or 2x the FPS rate** (e.g., at 25 FPS, set GOP = 25 or 50). A GOP that is too long delays recovery after packet loss.\n\n` +
        `#### 4. MTU & Switch Buffer Sizing\n` +
        `High-bitrate 4K streams generate large I-Frames. Ensure switch ports connected to IP cameras have standard 1500 MTU and do not have Energy Efficient Ethernet (EEE / 802.3az) enabled, which causes latency spikes.`;
    }

    // 4. Code Generation (Python / OpenCV / YOLO)
    else if (query.includes('code') || query.includes('python') || query.includes('opencv') || query.includes('yolo') || query.includes('script')) {
      content = `### 💻 Lookman AI Production Python Script: RTSP Ingestion + Real-time YOLOv8\n\n` +
        `Here is a production-grade, multi-threaded Python implementation that reads an RTSP camera stream and executes real-time person & vehicle intrusion detection:\n\n` +
        `\`\`\`python\n` +
        `import cv2\n` +
        `import threading\n` +
        `import time\n` +
        `from ultralytics import YOLO\n\n` +
        `class VideoStreamReader:\n` +
        `    """Decoupled RTSP thread to eliminate buffer lag and frame latency."""\n` +
        `    def __init__(self, rtsp_url):\n` +
        `        self.cap = cv2.VideoCapture(rtsp_url, cv2.CAP_FFMPEG)\n` +
        `        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)\n` +
        `        self.ret, self.frame = False, None\n` +
        `        self.running = True\n` +
        `        self.thread = threading.Thread(target=self._update, daemon=True)\n` +
        `        self.thread.start()\n\n` +
        `    def _update(self):\n` +
        `        while self.running:\n` +
        `            ret, frame = self.cap.read()\n` +
        `            if ret:\n` +
        `                self.ret, self.frame = ret, frame\n` +
        `            else:\n` +
        `                time.sleep(0.01)\n\n` +
        `    def read(self):\n` +
        `        return self.ret, self.frame\n\n` +
        `    def stop(self):\n` +
        `        self.running = False\n` +
        `        self.cap.release()\n\n` +
        `# --- Lookman AI Detection Loop ---\n` +
        `RTSP_FEED = "rtsp://admin:password@192.168.1.100:554/stream1"\n` +
        `model = YOLO("yolov8n.pt")  # Fast edge model\n` +
        `stream = VideoStreamReader(RTSP_FEED)\n\n` +
        `print("[*] Lookman AI Computer Vision pipeline initialized.")\n` +
        `while True:\n` +
        `    ret, frame = stream.read()\n` +
        `    if not ret or frame is None:\n` +
        `        continue\n\n` +
        `    # Run inference specifically for persons (0) and vehicles (2)\n` +
        `    results = model(frame, classes=[0, 2], conf=0.5, verbose=False)\n` +
        `    annotated_frame = results[0].plot()\n\n` +
        `    cv2.imshow("Lookman AI - Realtime Stream", annotated_frame)\n` +
        `    if cv2.waitKey(1) & 0xFF == ord('q'):\n` +
        `        break\n\n` +
        `stream.stop()\n` +
        `cv2.destroyAllWindows()\n` +
        `\`\`\`\n\n` +
        `#### Key Features of this Architecture:\n` +
        `• **Threaded Frame Decoupling**: Prevents the OpenCV input buffer from lagging behind when deep learning inference takes longer than frame intervals.\n` +
        `• **Targeted Class Filtering**: Inference is restricted to classes \`[0, 2]\` (Person, Car) to maximize GPU FPS.`;
    }

    // 5. General CCTV & Security Architecture Query
    else {
      content = `### 🛡️ Lookman AI Intelligence Response\n\n` +
        `I am **Lookman AI**, your company's dedicated conversational intelligence system specialized in CCTV engineering, video analytics, and physical security architecture.\n\n` +
        `I can assist you with:\n` +
        `• **Camera Sizing & DORI Analysis**: Calculate detection, observation, recognition, and identification distances based on lens focal length (mm) and sensor format.\n` +
        `• **Storage & Bandwidth Calculators**: Sizing NVRs, SAN/NAS arrays, H.265/H.265+ bitrates, and RAID configurations.\n` +
        `• **RTSP & ONVIF Stream Diagnostics**: Resolving packet loss, latency, dropped frames, and manufacturer-specific integration (Hikvision, Dahua, Axis, Hanwha).\n` +
        `• **Computer Vision Pipelines**: Writing and debugging YOLOv8–v11, OpenCV, ALPR, and tracking algorithms in Python/C++.\n` +
        `• **Multimodal Frame Inspection**: Upload any CCTV snapshot, blueprint, or footage frame directly to this chat for immediate forensic threat audit.\n\n` +
        `What specific CCTV challenge, camera calculation, or system design would you like to solve?`;
    }

    return {
      role: 'assistant',
      content,
      model: selectedModel,
      provider: 'Lookman AI Sovereign Intelligence Core'
    };
  }
}

module.exports = LookmanModel;

