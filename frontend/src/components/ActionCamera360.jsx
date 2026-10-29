import React, { useState, useEffect, useRef } from 'react';
import { Camera, ShieldAlert, UserCheck, MotionTargetIcon, Play, Pause, Activity } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ActionCamera360({ onOpenQuoteWithDetails }) {
  const [actionRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const videoRef = useRef(null);

  const AI_FEATURES = [
    {
      id: 'face',
      title: "AI Face Detection & Recognition",
      tag: "Biometric 99.2% Accuracy",
      desc: "Real-time facial landmark scanning, multi-face tracking, VIP/blocklist alerts, and touchless attendance verification.",
      icon: UserCheck,
      videoSrc: "/videos/sol_commercial.mp4",
      fallbackImage: "/cctv_indian_society_lobby.jpg",
      cameraLabel: "CAM-01 • AI FACIAL BIOMETRIC SCANNER",
      stats: { latency: "8 ms", confidence: "99.2%", target: "Face & Biometrics", status: "VERIFIED" }
    },
    {
      id: 'anpr',
      title: "Number Plate Recognition (ANPR / LPR)",
      tag: "Automated Barrier Linkage",
      desc: "High-speed optical OCR license plate scanner capturing Indian number plates in motion with automated boom barrier opening.",
      icon: Camera,
      videoSrc: "/videos/sol_community.mp4",
      fallbackImage: "/cctv_indian_society_gate.jpg",
      cameraLabel: "CAM-04 • ANPR HIGH-SPEED LPR SENSOR",
      stats: { latency: "12 ms", confidence: "99.4%", target: "Indian Plate OCR", status: "AUTHORIZED" }
    },
    {
      id: 'restriction',
      title: "Area Restriction & Perimeter Defense",
      tag: "Active Deterrence Sirens",
      desc: "Custom virtual polygonal restricted zones and directional tripwires triggering instant strobe sirens and guard room alerts.",
      icon: ShieldAlert,
      videoSrc: "/videos/sol_community.mp4",
      fallbackImage: "/cctv_indian_society_parking.jpg",
      cameraLabel: "CAM-02 • RESTRICTED ZONE TRIPWIRE",
      stats: { latency: "5 ms", confidence: "99.7%", target: "Perimeter Breach", status: "ALERT TRIGGERED" }
    },
    {
      id: 'classification',
      title: "Human & Vehicle Target Classification",
      tag: "Zero False Alarms",
      desc: "Deep-learning target classifier distinguishing humans and vehicles from pets, rain, shadows, and swaying tree foliage.",
      icon: MotionTargetIcon,
      videoSrc: "/videos/sol_school.mp4",
      fallbackImage: "/cctv_indian_society_park.jpg",
      cameraLabel: "CAM-08 • DEEP LEARNING TARGET VCA",
      stats: { latency: "10 ms", confidence: "98.9%", target: "Human / Vehicle", status: "ACTIVE FILTER" }
    }
  ];

  const currentFeature = AI_FEATURES[activeTab] || AI_FEATURES[0];

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section ref={actionRef} className="ai-camera-features-section w-full bg-[#f8f9fc] relative overflow-hidden py-8 sm:py-12 border-none">
      <div className="w-full max-w-[2000px] mx-auto px-0 flex justify-center overflow-hidden">
        {/* Whole Tab Card: Natural stacked layout on mobile/tablet, 28:9 aspect ratio on desktop */}
        <div className="bg-white border border-slate-200/60 rounded-none overflow-hidden shadow-xs w-full lg:aspect-[28/9]">
          <div className="flex flex-col lg:flex-row w-full h-full items-stretch justify-center overflow-hidden">

            {/* Left Column: Live AI Video Feed with Dynamic Overlays */}
            <div className={`relative w-full lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[320px] shrink-0 overflow-hidden bg-slate-950 select-none group ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
              
              {/* HTML5 Live CCTV Video Loop */}
              <video
                key={currentFeature.id}
                ref={videoRef}
                src={currentFeature.videoSrc}
                poster={currentFeature.fallbackImage}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Subtle CRT / Security Scanline Texture */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 pointer-events-none" />

              {/* Top Security CCTV Status Header */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/80 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/10 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-black/70 text-slate-200 backdrop-blur-md border border-white/10">
                    {currentFeature.cameraLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setShowAiOverlay(!showAiOverlay)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    title="Toggle AI Bounding Box Overlays"
                  >
                    <Activity size={12} className={showAiOverlay ? "text-emerald-400" : "text-gray-400"} />
                    <span className="hidden sm:inline">AI Overlay:</span>
                    <span className={showAiOverlay ? "text-emerald-400" : "text-gray-400"}>
                      {showAiOverlay ? "ON" : "OFF"}
                    </span>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="w-7 h-7 rounded-md bg-black/75 hover:bg-black text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* DYNAMIC AI FEATURE OVERLAYS (Applied based on selected feature) */}
              {showAiOverlay && (
                <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-300">

                  {/* ──────────────── 1. FACE DETECTION & RECOGNITION OVERLAY ──────────────── */}
                  {currentFeature.id === 'face' && (
                    <>
                      {/* Primary Face Target Box */}
                      <div className="absolute top-[28%] left-[44%] w-[22%] sm:w-[18%] aspect-square border-2 border-emerald-400/90 rounded-sm shadow-[0_0_15px_rgba(52,211,153,0.4)] transition-all duration-300">
                        {/* Corner Reticles */}
                        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300" />
                        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300" />
                        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300" />

                        {/* Animated Laser Scanning Beam */}
                        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_8px_#34d399] animate-pulse" style={{ top: '45%' }} />

                        {/* Top Detection Tag */}
                        <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-emerald-500/90 text-black text-[10px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap shadow-sm">
                          FACE DETECTED 99.2%
                        </div>

                        {/* Floating Biometric HUD Info Card */}
                        <div className="absolute top-full mt-2 left-0 min-w-[140px] bg-black/85 backdrop-blur-md border border-emerald-400/40 rounded p-2 text-white text-[10px] space-y-0.5 shadow-lg">
                          <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-white/10 pb-1 mb-1">
                            <span>ID #IN-8492</span>
                            <span className="text-[9px] bg-emerald-500/20 px-1 rounded">MATCH</span>
                          </div>
                          <div className="text-slate-300">Target: <span className="text-white font-medium">Resident Verified</span></div>
                          <div className="text-slate-300">Confidence: <span className="text-emerald-400 font-bold">99.2%</span></div>
                          <div className="text-slate-300">Access: <span className="text-emerald-400 font-bold">GRANTED</span></div>
                        </div>
                      </div>

                      {/* Secondary Face Tracking in background */}
                      <div className="absolute top-[32%] left-[18%] w-[15%] sm:w-[12%] aspect-square border border-dashed border-cyan-400/70 rounded-xs">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-cyan-600/80 text-white text-[9px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          SCANNING 96.4%
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 2. NUMBER PLATE RECOGNITION (ANPR / LPR) OVERLAY ──────────────── */}
                  {currentFeature.id === 'anpr' && (
                    <>
                      {/* Vehicle Bounding Box */}
                      <div className="absolute top-[26%] left-[32%] w-[48%] sm:w-[42%] aspect-[16/10] border border-white/40 rounded-sm">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-blue-600/90 text-white text-[9px] font-bold tracking-wider rounded-xs">
                          VEHICLE [SUV] 98.9%
                        </div>

                        {/* High-Precision License Plate Scanner Box */}
                        <div className="absolute bottom-[16%] left-[22%] w-[42%] h-[26%] border-2 border-emerald-400 rounded-sm shadow-[0_0_18px_rgba(52,211,153,0.5)]">
                          {/* Corner Reticles */}
                          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-200" />
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-200" />
                          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-200" />
                          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-200" />

                          {/* Sweeping Laser Scanner Bar */}
                          <div className="absolute inset-x-0 h-0.5 bg-emerald-300 shadow-[0_0_8px_#34d399] animate-pulse" style={{ top: '50%' }} />

                          {/* ANPR Live Tag */}
                          <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                            ANPR OCR: 99.4%
                          </div>
                        </div>

                        {/* Floating Plate Data Readout Card */}
                        <div className="absolute -right-36 top-2 hidden sm:block min-w-[150px] bg-black/90 backdrop-blur-md border border-emerald-400/50 rounded p-2.5 text-white text-[10px] space-y-1 shadow-xl">
                          <div className="text-[11px] font-black text-amber-300 font-mono tracking-widest border-b border-white/10 pb-1">
                            DL 4C AF 4943
                          </div>
                          <div className="text-slate-300">State: <span className="text-white font-medium">Delhi (DL)</span></div>
                          <div className="text-slate-300">Auth: <span className="text-emerald-400 font-bold">Resident Whitelist</span></div>
                          <div className="text-slate-300">Gate: <span className="text-emerald-400 font-bold">BARRIER OPEN</span></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 3. AREA RESTRICTION & INTRUSION TRIPWIRE OVERLAY ──────────────── */}
                  {currentFeature.id === 'restriction' && (
                    <>
                      {/* Polygon Restricted Zone Box */}
                      <div className="absolute top-[22%] left-[16%] w-[68%] h-[58%] border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-sm shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                        
                        {/* Zone Header Banner */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          RESTRICTED ZONE INTRUSION DETECTED
                        </div>

                        {/* Diagonal Tripwire Laser Line */}
                        <div className="absolute top-1/2 -left-4 -right-4 h-0.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 shadow-[0_0_12px_#ef4444]" />

                        {/* Tripwire Directional Indicator */}
                        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/85 text-amber-300 text-[9px] font-mono font-bold uppercase rounded border border-amber-500/40">
                          ◄ TRIPWIRE BREACH: DIRECTION A → B ►
                        </div>

                        {/* Intruder Target Box */}
                        <div className="absolute top-[25%] left-[58%] w-[20%] h-[55%] border-2 border-red-500 rounded-sm animate-pulse">
                          <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                            INTRUDER ALERT
                          </div>
                        </div>

                        {/* Active Security Linkage Status */}
                        <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-md border border-red-500/40 rounded px-2.5 py-1.5 text-white text-[10px] flex items-center justify-between">
                          <span className="text-red-400 font-bold">Linkage: Active Siren ON • Flashing Strobe ACTIVE</span>
                          <span className="text-slate-300 font-mono">Response: Guard Room Notified</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 4. HUMAN & VEHICLE TARGET CLASSIFICATION OVERLAY ──────────────── */}
                  {currentFeature.id === 'classification' && (
                    <>
                      {/* Human Target 1 */}
                      <div className="absolute top-[22%] left-[26%] w-[18%] sm:w-[14%] h-[60%] border-2 border-cyan-400 rounded-sm shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          HUMAN 99.1%
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 bg-black/80 text-[8px] text-cyan-300 font-mono px-1 py-0.5 rounded text-center">
                          Dwell: 14s
                        </div>
                      </div>

                      {/* Human Target 2 */}
                      <div className="absolute top-[25%] left-[44%] w-[16%] sm:w-[13%] h-[56%] border-2 border-cyan-400 rounded-sm shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          HUMAN 98.4%
                        </div>
                      </div>

                      {/* Vehicle Target */}
                      <div className="absolute top-[34%] left-[64%] w-[32%] sm:w-[28%] h-[42%] border-2 border-amber-400 rounded-sm shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          VEHICLE 98.7%
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/80 text-[8px] text-amber-300 font-mono px-1.5 py-0.5 rounded">
                          Speed: 14 km/h
                        </div>
                      </div>

                      {/* False Alarm Filter Badge at bottom */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/85 backdrop-blur-md border border-white/15 rounded-full text-white text-[10px] font-medium flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>False Alarm Filter: <strong className="text-emerald-400">Trees, Rain & Shadows Ignored</strong></span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom Camera Telemetry Bar */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none text-white text-[10px] font-mono">
                <div className="px-2 py-1 rounded bg-black/75 backdrop-blur-sm border border-white/10 hidden sm:block">
                  AI ENGINE: <span className="text-emerald-400 font-bold">NEURAL VPU 4.0</span> • LATENCY: <span className="text-white font-bold">{currentFeature.stats.latency}</span>
                </div>
                <div className="px-2 py-1 rounded bg-black/75 backdrop-blur-sm border border-white/10 ml-auto">
                  ACCURACY: <span className="text-emerald-400 font-bold">{currentFeature.stats.confidence}</span>
                </div>
              </div>

            </div>

            {/* Right Column: AI Camera Features List */}
            <div className={`w-full flex-1 lg:h-full p-5 sm:p-7 lg:px-10 lg:py-5 flex flex-col justify-between items-start bg-[#f8f9fc] relative overflow-hidden ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>

              <div className="relative z-10 w-full flex flex-col items-start h-full justify-between">
                
                {/* Section Header */}
                <div className="flex flex-col gap-1 mb-3 lg:mb-2 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200/60 w-fit mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    Edge AI Vision Intelligence
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#12182b] leading-[1.15] tracking-tight">
                    Smart AI Camera Features
                  </h2>
                  <div className="text-base sm:text-lg lg:text-[21px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-0.5">
                    Real-Time Detection, Zero False Alarms.
                  </div>
                </div>

                {/* AI Features Selection List */}
                <div className="relative w-full flex-1 flex flex-col min-h-0 overflow-hidden mt-1">
                  <div className="relative flex flex-col w-full h-full justify-between gap-1.5 overflow-y-auto no-scrollbar py-1">
                    <div className="absolute left-[1px] top-1 bottom-1 w-[2px] bg-slate-200 z-0 hidden sm:block" />

                    {AI_FEATURES.map((feature, idx) => {
                      const IconComponent = feature.icon;
                      const isActive = idx === activeTab;
                      return (
                        <button
                          key={feature.id}
                          onClick={() => {
                            setActiveTab(idx);
                            setIsPlaying(true);
                          }}
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

                {/* Bottom Action / Inquiry Button */}
                {onOpenQuoteWithDetails && (
                  <div className="w-full pt-3 mt-1 border-t border-slate-200/80 shrink-0 flex items-center justify-between">
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Includes 4K optical sensors with on-board VPU processing
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
