import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldAlert, UserCheck, MotionTargetIcon, Play, Pause, Activity } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';
import {
  createDetectionTiles,
  filterObjectDetections,
  mapTileDetections,
  mapBoxToOverlay,
  suppressDuplicateDetections,
  stabilizeDetections
} from '../utils/smartCameraDetection';

const SMART_AI_DEMO_VIDEO = '/videos/indian_society_cctv_30s.mp4';
const SMART_AI_DEMO_POSTER = '/videos/indian_society_cctv_poster.jpg';
const MEDIAPIPE_FACE_ASSETS = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229';
const DETECTION_INTERVAL_MS = 300;
const FACE_RESULT_TIMEOUT_MS = 10000;
let faceDetectionScriptPromise;

function loadFaceDetectionScript() {
  if (window.FaceDetection) return Promise.resolve(window.FaceDetection);
  if (!faceDetectionScriptPromise) {
    faceDetectionScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${MEDIAPIPE_FACE_ASSETS}/face_detection.js`;
      script.async = true;
      script.onload = () => {
        if (window.FaceDetection) resolve(window.FaceDetection);
        else reject(new Error('MediaPipe face detector did not initialize.'));
      };
      script.onerror = () => reject(new Error('Could not load MediaPipe face detector.'));
      document.head.appendChild(script);
    }).catch(error => {
      faceDetectionScriptPromise = null;
      throw error;
    });
  }
  return faceDetectionScriptPromise;
}

async function createFaceDetector() {
  const FaceDetection = await loadFaceDetectionScript();
  const detector = new FaceDetection({
    locateFile: file => `${MEDIAPIPE_FACE_ASSETS}/${file}`
  });
  detector.setOptions({ model: 'full', minDetectionConfidence: 0.4 });

  let resolveFrame;
  let rejectFrame;
  let frameVideo;
  let frameTimeoutId;
  const settleFrame = (handler, value) => {
    if (!handler) return;
    window.clearTimeout(frameTimeoutId);
    resolveFrame = null;
    rejectFrame = null;
    frameVideo = null;
    handler(value);
  };
  detector.onResults(results => {
    if (!resolveFrame) return;
    const video = frameVideo;
    const detections = (results.detections || []).flatMap((detection, index) => {
      if (!detection.boundingBox) return [];
      const { xCenter, yCenter, width, height } = detection.boundingBox;
      const score = detection.score?.[0];
      return [{
        id: `face-${index}`,
        name: 'Face',
        confidence: score === undefined ? undefined : Number(score),
        box: [
          (xCenter - width / 2) * video.videoWidth,
          (yCenter - height / 2) * video.videoHeight,
          width * video.videoWidth,
          height * video.videoHeight
        ]
      }];
    });
    settleFrame(resolveFrame, detections);
  });
  await detector.initialize();

  return {
    estimateFaces: video => new Promise((resolve, reject) => {
      if (resolveFrame) {
        reject(new Error('Face detector is already processing a frame.'));
        return;
      }
      resolveFrame = resolve;
      rejectFrame = reject;
      frameVideo = video;
      frameTimeoutId = window.setTimeout(() => {
        settleFrame(rejectFrame, new Error('Face detection timed out.'));
      }, FACE_RESULT_TIMEOUT_MS);
      detector.send({ image: video }).catch(error => {
        settleFrame(rejectFrame, error);
      });
    })
  };
}

async function detectTiledObjects(model, video) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create a canvas for object detection.');

  const detections = [];
  for (const tile of createDetectionTiles(video.videoWidth, video.videoHeight)) {
    canvas.width = tile.width;
    canvas.height = tile.height;
    context.drawImage(
      video,
      tile.x,
      tile.y,
      tile.width,
      tile.height,
      0,
      0,
      tile.width,
      tile.height
    );
    const tileDetections = await model.detect(canvas, 30, 0.25);
    detections.push(...mapTileDetections(tileDetections, tile));
  }

  return suppressDuplicateDetections(detections);
}

const AI_FEATURES = [
  {
    id: 'face',
    title: 'AI Face Detection',
    tag: 'Live face boxes',
    desc: 'Detects faces visible in the video. This demo does not identify people.',
    icon: UserCheck,
    cameraLabel: 'CAM-01 • FACE DETECTION'
  },
  {
    id: 'anpr',
    title: 'Vehicle Detection for ANPR',
    tag: 'Vehicle boxes • no OCR',
    desc: 'Detects vehicles in the video. Reading license-plate text is not available in this demo.',
    icon: Camera,
    cameraLabel: 'CAM-01 • VEHICLE DETECTION'
  },
  {
    id: 'restriction',
    title: 'Area Restriction & Perimeter',
    tag: 'Live zone activity',
    desc: 'Highlights detected people and vehicles inside the marked demo zone. No alarm is sent.',
    icon: ShieldAlert,
    cameraLabel: 'CAM-01 • DEMO RESTRICTED ZONE'
  },
  {
    id: 'classification',
    title: 'Human & Vehicle Classification',
    tag: 'Live object classes',
    desc: 'Detects people, cars, motorcycles, bicycles, buses, and trucks in the video.',
    icon: MotionTargetIcon,
    cameraLabel: 'CAM-01 • OBJECT CLASSIFICATION'
  }
];

export default function ActionCamera360({ onOpenQuoteWithDetails }) {
  const [actionRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [detections, setDetections] = useState([]);
  const [detectionStatus, setDetectionStatus] = useState('Waiting for video');
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const cocoModelRef = useRef(null);
  const cocoModelLoadRef = useRef(null);
  const faceModelRef = useRef(null);
  const faceModelLoadRef = useRef(null);
  const currentFeature = AI_FEATURES[activeTab] || AI_FEATURES[0];
  const activeDetections = showAiOverlay
    ? detections.filter(detection => detection.featureId === currentFeature.id)
    : [];
  const zoneHasActivity = currentFeature.id === 'restriction' &&
    activeDetections.some(detection => detection.inZone);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVideoVisible(entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timerId;
    let isDetecting = false;
    let retryDelay = DETECTION_INTERVAL_MS;
    let modelRetryDelay = 1000;
    let lastProcessedVideoTime = -1;

    if (!showAiOverlay || !isVisible || !isVideoVisible) return undefined;

    const loadModelAndDetect = async () => {
      if (cancelled) return;
      setDetectionStatus('Loading model…');

      try {
        let model;
        if (currentFeature.id === 'face') {
          if (!faceModelRef.current) {
            if (!faceModelLoadRef.current) {
              faceModelLoadRef.current = createFaceDetector().catch(error => {
                faceModelLoadRef.current = null;
                throw error;
              });
            }
            faceModelRef.current = await faceModelLoadRef.current;
          }
          model = faceModelRef.current;
        } else {
          if (!cocoModelRef.current) {
            if (!cocoModelLoadRef.current) {
              cocoModelLoadRef.current = (async () => {
                const tf = await import('@tensorflow/tfjs');
                await tf.ready();
                if (!tf.getBackend()) {
                  throw new Error('TensorFlow.js could not initialize a browser backend.');
                }
                const cocoSsd = await import('@tensorflow-models/coco-ssd');
                return cocoSsd.load({ base: 'mobilenet_v2' });
              })().catch(error => {
                cocoModelLoadRef.current = null;
                throw error;
              });
            }
            cocoModelRef.current = await cocoModelLoadRef.current;
          }
          model = cocoModelRef.current;
        }

        if (cancelled) return;
        modelRetryDelay = 1000;
        setDetectionStatus('Analyzing video');

        const detectFrame = async () => {
          const video = videoRef.current;
          const container = videoContainerRef.current;
          if (cancelled) return;
          if (isDetecting || document.hidden || !video || !container || video.readyState < 2 || video.paused || video.ended) {
            timerId = window.setTimeout(detectFrame, document.hidden ? 1000 : DETECTION_INTERVAL_MS);
            return;
          }
          if (video.currentTime === lastProcessedVideoTime) {
            timerId = window.setTimeout(detectFrame, DETECTION_INTERVAL_MS);
            return;
          }

          isDetecting = true;
          try {
            const frameTime = video.currentTime;
            let results;
            if (currentFeature.id === 'face') {
              results = await model.estimateFaces(video);
            } else {
              const objects = await detectTiledObjects(model, video);
              results = filterObjectDetections(objects, currentFeature.id);
            }

            if (cancelled) return;
            retryDelay = DETECTION_INTERVAL_MS;
            lastProcessedVideoTime = frameTime;
            const nextDetections = results.flatMap(result => {
              const position = mapBoxToOverlay(result.box, video, container);
              if (!position) return [];
              const centerX = position.left + position.width / 2;
              const centerY = position.top + position.height / 2;
              return [{
                ...result,
                featureId: currentFeature.id,
                ...position,
                inZone: centerX >= 36 && centerX <= 98 && centerY >= 38 && centerY <= 96
              }];
            });
            setDetections(previous => stabilizeDetections(
              previous.filter(detection => detection.featureId === currentFeature.id),
              nextDetections
            ));
            setDetectionStatus(nextDetections.length ? 'Analyzing video' : 'No matching targets');
          } catch (error) {
            console.error('Smart AI video detection failed:', error);
            setDetectionStatus('Detection error');
            setDetections([]);
            retryDelay = Math.min(retryDelay * 2, 4000);
          } finally {
            isDetecting = false;
            if (!cancelled) timerId = window.setTimeout(detectFrame, retryDelay);
          }
        };
        timerId = window.setTimeout(detectFrame, 0);
      } catch (error) {
        console.error('Could not load Smart AI detection model:', error);
        if (!cancelled) {
          setDetectionStatus('Model unavailable - retrying');
          timerId = window.setTimeout(loadModelAndDetect, modelRetryDelay);
          modelRetryDelay = Math.min(modelRetryDelay * 2, 10000);
        }
      }
    };

    loadModelAndDetect();
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [currentFeature.id, isVideoVisible, isVisible, showAiOverlay]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(error => {
        console.error('Could not resume Smart AI demo video:', error);
      });
    } else {
      video.pause();
    }
  };

  return (
    <section ref={actionRef} className="ai-camera-features-section w-full bg-[#f8f9fc] relative overflow-hidden py-8 sm:py-12 border-none">
      <div className="w-full max-w-[2000px] mx-auto px-0 flex justify-center overflow-hidden">
        <div className="bg-white border border-slate-200/60 rounded-none overflow-hidden shadow-xs w-full lg:aspect-[28/9]">
          <div className="flex flex-col lg:flex-row w-full h-full items-stretch justify-center overflow-hidden">
            <div
              ref={videoContainerRef}
              className={`relative w-full lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[320px] shrink-0 overflow-hidden bg-slate-950 select-none group ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}
            >
              <video
                ref={videoRef}
                src={SMART_AI_DEMO_VIDEO}
                poster={SMART_AI_DEMO_POSTER}
                autoPlay
                loop
                muted
                playsInline
                onPlay={() => {
                  setIsPlaying(true);
                  setDetectionStatus('Analyzing video');
                }}
                onPause={() => {
                  setIsPlaying(false);
                  setDetectionStatus('Video paused');
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/35 pointer-events-none" />

              {showAiOverlay && currentFeature.id === 'restriction' && (
                <div className={`absolute top-[38%] left-[36%] w-[62%] h-[58%] border-2 border-dashed pointer-events-none z-10 ${
                  zoneHasActivity
                    ? 'border-red-400 bg-red-500/15'
                    : 'border-amber-300/80 bg-amber-300/5'
                }`}>
                  <span className={`absolute top-2 left-2 px-2 py-1 text-[9px] font-bold uppercase rounded ${
                    zoneHasActivity ? 'bg-red-600 text-white' : 'bg-black/80 text-amber-200'
                  }`}>
                    {zoneHasActivity ? 'Detected target in zone' : 'Demo restricted zone'}
                  </span>
                </div>
              )}

              {activeDetections.map(detection => (
                <div
                  key={detection.id}
                  className={`absolute border-2 pointer-events-none z-20 ${
                    currentFeature.id === 'restriction' && detection.inZone
                      ? 'border-red-400'
                      : currentFeature.id === 'anpr'
                        ? 'border-cyan-300'
                        : 'border-emerald-400'
                  }`}
                  style={{
                    left: `${detection.left}%`,
                    top: `${detection.top}%`,
                    width: `${detection.width}%`,
                    height: `${detection.height}%`
                  }}
                >
                  <span className="absolute -top-5 left-0 max-w-[180px] truncate rounded-sm bg-black/85 px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap">
                    {detection.confidence === undefined
                      ? detection.name
                      : `${detection.name} ${Math.round(detection.confidence * 100)}%`}
                  </span>
                </div>
              ))}

              <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/85 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    VIDEO DEMO
                  </span>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-black/75 text-slate-200 backdrop-blur-md border border-white/10">
                    {currentFeature.cameraLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setShowAiOverlay(value => !value)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    title="Toggle live detections"
                  >
                    <Activity size={12} className={showAiOverlay ? 'text-emerald-400' : 'text-gray-400'} />
                    <span className="hidden sm:inline">Detection:</span>
                    <span className={showAiOverlay ? 'text-emerald-400' : 'text-gray-400'}>
                      {showAiOverlay ? 'ON' : 'OFF'}
                    </span>
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="w-7 h-7 rounded-md bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none text-white text-[10px] font-mono">
                <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10">
                  IN-BROWSER MODEL:                   <span className="text-emerald-300 font-bold">
                    {(showAiOverlay ? detectionStatus : 'Overlay off').toUpperCase()}
                  </span>
                </div>
                <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10">
                  TARGETS: <span className="text-emerald-300 font-bold">{activeDetections.length}</span>
                </div>
              </div>
            </div>

            <div className={`w-full flex-1 lg:h-full p-5 sm:p-7 lg:px-10 lg:py-5 flex flex-col justify-between items-start bg-[#f8f9fc] relative overflow-hidden ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
              <div className="relative z-10 w-full flex flex-col items-start h-full justify-between">
                <div className="flex flex-col gap-1 mb-3 lg:mb-2 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200/60 w-fit mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    On-device video analysis
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#12182b] leading-[1.15] tracking-tight">
                    Smart AI Camera Features
                  </h2>
                  <div className="text-base sm:text-lg lg:text-[21px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-0.5">
                    Live detections from the selected video topic.
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Model weights download on first use; video frames are analyzed in this browser.
                  </p>
                </div>

                <div className="relative w-full flex-1 flex flex-col min-h-0 overflow-hidden mt-1">
                  <div className="relative flex flex-col w-full h-full justify-between gap-1.5 overflow-y-auto no-scrollbar py-1">
                    <div className="absolute left-[1px] top-1 bottom-1 w-[2px] bg-slate-200 z-0 hidden sm:block" />
                    {AI_FEATURES.map((feature, idx) => {
                      const IconComponent = feature.icon;
                      const isActive = idx === activeTab;
                      return (
                        <button
                          key={feature.id}
                          onClick={() => setActiveTab(idx)}
                          className={`flex items-start gap-3.5 py-2.5 px-3.5 text-left transition-all cursor-pointer border-l-[3px] rounded-r-lg relative z-10 ${isActive
                            ? 'border-l-[#e73455] bg-white shadow-xs font-semibold'
                            : 'border-l-transparent hover:bg-white/60 text-gray-500'
                            }`}
                        >
                          <div className={`shrink-0 mt-0.5 p-2 rounded-lg transition-colors ${isActive ? 'bg-red-50 text-[#e73455]' : 'bg-slate-100 text-gray-400'}`}>
                            <IconComponent size={20} />
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-semibold text-sm sm:text-base leading-snug ${isActive ? 'text-[#12182b]' : 'text-gray-700'}`}>
                                {feature.title}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                                {feature.tag}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                              {feature.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {onOpenQuoteWithDetails && (
                  <div className="w-full pt-3 mt-1 border-t border-slate-200/80 shrink-0 flex items-center justify-between">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Detection results depend on video quality and lighting.
                    </span>
                    <button
                      onClick={() => onOpenQuoteWithDetails({ category: 'AI Cameras', notes: `Inquiry for ${currentFeature.title}` })}
                      className="px-4 py-2 bg-[#ea0004] hover:bg-[#c90003] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer ml-auto"
                    >
                      Request AI Camera Quote →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
