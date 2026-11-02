import React, { useState, useRef } from 'react';
import { Camera, ShieldAlert, UserCheck, MotionTargetIcon, Play, Pause, Activity } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ActionCamera360({ onOpenQuoteWithDetails }) {
  const [actionRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const videoRef = useRef(null);

  // Single Indian Society CCTV Video Feed
  const INDIAN_SOCIETY_VIDEO = "/videos/indian_society_cctv.mp4";
  const INDIAN_SOCIETY_POSTER = "/videos/indian_society_cctv_poster.jpg";

  const AI_FEATURES = [
    {
      id: 'face',
      title: "AI Face Detection & Recognition",
      tag: "Biometric 99.4% Accuracy",
      desc: "Instant facial landmark scanning on guards and residents with VIP whitelist verification and touchless gate authorization.",
      icon: UserCheck,
      cameraLabel: "CAM-01 • AI FACIAL BIOMETRIC SCANNER",
      stats: { latency: "8 ms", confidence: "99.4%", target: "Face & Biometrics", status: "VERIFIED" }
    },
    {
      id: 'anpr',
      title: "Number Plate Recognition (ANPR / LPR)",
      tag: "Automated Boom Barrier",
      desc: "High-speed optical OCR license plate scanner capturing Indian number plates in motion with automated boom barrier opening.",
      icon: Camera,
      cameraLabel: "CAM-01 • ANPR HIGH-SPEED LPR SENSOR",
      stats: { latency: "12 ms", confidence: "99.6%", target: "Indian Plate OCR", status: "AUTHORIZED" }
    },
    {
      id: 'restriction',
      title: "Area Restriction & Perimeter Defense",
      tag: "Active Deterrence Sirens",
      desc: "Virtual polygonal restricted entry zones and directional tripwires triggering instant strobe sirens and guard room alerts.",
      icon: ShieldAlert,
      cameraLabel: "CAM-01 • RESTRICTED ZONE TRIPWIRE",
      stats: { latency: "5 ms", confidence: "99.7%", target: "Perimeter Breach", status: "ACTIVE FENCE" }
    },
    {
      id: 'classification',
      title: "Human & Vehicle Target Classification",
      tag: "Zero False Alarms",
      desc: "Deep-learning target classifier distinguishing humans, cars, and two-wheelers while filtering swaying palm trees, rain, and shadows.",
      icon: MotionTargetIcon,
      cameraLabel: "CAM-01 • DEEP LEARNING TARGET VCA",
      stats: { latency: "10 ms", confidence: "99.2%", target: "Human / Vehicle", status: "ACTIVE FILTER" }
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

            {/* Left Column: Single Indian Society CCTV Video with Real-Time AI Overlays */}
            <div className={`relative w-full lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[320px] shrink-0 overflow-hidden bg-slate-950 select-none group ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
              
              {/* SINGLE CONTINUOUS INDIAN SOCIETY CCTV VIDEO LOOP (Does not reload when switching tabs) */}
              <video
                ref={videoRef}
                src={INDIAN_SOCIETY_VIDEO}
                poster={INDIAN_SOCIETY_POSTER}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Security CCTV Scanlines & Ambient Lighting */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/35 pointer-events-none" />

              {/* Top Security Header with Live Indicator & Interactive Overlay Controls */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/85 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/10 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-black/75 text-slate-200 backdrop-blur-md border border-white/10">
                    {currentFeature.cameraLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setShowAiOverlay(!showAiOverlay)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    title="Toggle AI Target Bounding Boxes"
                  >
                    <Activity size={12} className={showAiOverlay ? "text-emerald-400" : "text-gray-400"} />
                    <span className="hidden sm:inline">AI Overlay:</span>
                    <span className={showAiOverlay ? "text-emerald-400" : "text-gray-400"}>
                      {showAiOverlay ? "ON" : "OFF"}
                    </span>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="w-7 h-7 rounded-md bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* DYNAMIC AI SCENARIO OVERLAYS (Applied directly to the Indian Society CCTV Video) */}
              {showAiOverlay && (
                <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-300">

                  {/* ──────────────── 1. AI FACE DETECTION & RECOGNITION ──────────────── */}
                  {currentFeature.id === 'face' && (
                    <>
                      {/* Face Target 1: Indian Resident Riding Motorcycle */}
                      <div className="absolute top-[41.0%] left-[58.8%] w-[5.5%] aspect-square border-2 border-emerald-400 rounded-xs shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                        {/* Corner Reticles */}
                        <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-300" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-300" />
                        <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-300" />
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-300" />

                        {/* Animated Laser Scanning Beam */}
                        <div className="absolute inset-x-0 h-0.5 bg-emerald-300 shadow-[0_0_6px_#34d399] animate-pulse" style={{ top: '45%' }} />

                        {/* Top Detection Tag */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap shadow-sm">
                          FACE: 99.4%
                        </div>

                        {/* Floating Biometric Detail Card */}
                        <div className="absolute top-full mt-2 -left-20 sm:-left-28 min-w-[170px] bg-black/90 backdrop-blur-md border border-emerald-400/50 rounded p-2 text-white text-[10px] space-y-0.5 shadow-xl">
                          <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-white/10 pb-1 mb-1">
                            <span>ID: #RES-1082</span>
                            <span className="text-[9px] bg-emerald-500/20 px-1 py-0.5 rounded text-emerald-300">RESIDENT MATCH</span>
                          </div>
                          <div className="text-slate-300">Name: <span className="text-white font-medium">K. Rajesh Kumar</span></div>
                          <div className="text-slate-300">Society: <span className="text-emerald-400 font-medium">Govind Royal Nest • Apt 304</span></div>
                          <div className="text-slate-300">Helmet & Face: <span className="text-emerald-400 font-bold">COMPLIANT</span></div>
                          <div className="text-slate-300">Access: <span className="text-emerald-400 font-bold">AUTHORIZED</span></div>
                        </div>
                      </div>

                      {/* Face Target 2: Scooter Rider in Midground */}
                      <div className="absolute top-[40.5%] left-[44.5%] w-[4.0%] aspect-square border border-cyan-400/90 rounded-xs shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                        <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-cyan-300" />
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-cyan-300" />
                        <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-cyan-300" />
                        <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-cyan-300" />

                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-cyan-600 text-white text-[7px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          RIDER: 98.2%
                        </div>

                        <div className="absolute -bottom-12 left-0 min-w-[130px] bg-black/85 backdrop-blur-md border border-cyan-400/40 rounded p-1.5 text-white text-[9px] space-y-0.5 shadow-md hidden sm:block">
                          <div className="text-cyan-300 font-bold">Visitor Pass #901</div>
                          <div className="text-slate-300">Gate Status: <span className="text-emerald-400 font-semibold">PRE-APPROVED</span></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 2. NUMBER PLATE RECOGNITION (ANPR / LPR) ──────────────── */}
                  {currentFeature.id === 'anpr' && (
                    <>
                      {/* Vehicle Bounding Box Tracking Parked Blue Maruti Suzuki */}
                      <div className="absolute top-[40.5%] left-[45.0%] w-[9.0%] h-[13.0%] border-2 border-white/60 rounded-sm">
                        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-bold tracking-wider rounded-xs">
                          VEHICLE [CAR] 99.6%
                        </div>

                        {/* High-Precision License Plate Reticle */}
                        <div className="absolute top-[48.0%] left-[22.0%] w-[45.0%] h-[24.0%] border-2 border-emerald-400 rounded-xs shadow-[0_0_15px_rgba(52,211,153,0.6)]">
                          {/* Corner Reticles */}
                          <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-200" />
                          <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-200" />
                          <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-200" />
                          <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-200" />

                          {/* Sweeping Laser OCR Scanner */}
                          <div className="absolute inset-x-0 h-0.5 bg-emerald-300 shadow-[0_0_6px_#34d399] animate-pulse" style={{ top: '48%' }} />

                          {/* ANPR Tag */}
                          <div className="absolute -top-4 left-0 px-1 py-0.5 bg-emerald-500 text-black text-[7px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                            ANPR OCR: 99.6%
                          </div>
                        </div>

                        {/* Floating Indian Number Plate Readout HUD Card */}
                        <div className="absolute -right-36 sm:-right-48 -top-2 min-w-[175px] bg-black/90 backdrop-blur-md border border-emerald-400/50 rounded p-2.5 text-white text-[10px] space-y-1 shadow-2xl">
                          {/* Styled Indian Number Plate Badge */}
                          <div className="flex items-center border border-white/20 rounded bg-white text-black font-mono font-black overflow-hidden shadow-sm">
                            <span className="bg-[#003399] text-white px-1.5 py-0.5 text-[8px] font-sans font-bold flex flex-col items-center">
                              <span>IND</span>
                            </span>
                            <span className="px-2 py-0.5 text-[11px] tracking-widest text-[#111]">
                              TN 02 CD 9812
                            </span>
                          </div>

                          <div className="text-slate-300 pt-0.5">Model: <span className="text-white font-medium">Maruti Suzuki Ignis / Celerio</span></div>
                          <div className="text-slate-300">Resident: <span className="text-white font-medium">Govind Royal Nest • Block A-201</span></div>
                          <div className="text-slate-300">FastTag / ANPR: <span className="text-emerald-400 font-bold">MATCHED (#ANPR-4412)</span></div>
                          <div className="text-slate-300 border-t border-white/10 pt-1">
                            Action: <span className="text-emerald-400 font-bold">BOOM BARRIER AUTO-OPEN</span>
                          </div>
                        </div>
                      </div>

                      {/* Moving Motorcycle Number Plate Scanner */}
                      <div className="absolute top-[42.0%] left-[58.0%] w-[9.5%] h-[20.0%] border border-cyan-400/70 rounded-xs">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-cyan-600 text-white text-[7px] font-bold tracking-wider rounded-xs whitespace-nowrap">
                          MOTORCYCLE [99.2%]
                        </div>
                        <div className="absolute top-[52.0%] left-[32.0%] w-[38.0%] h-[16.0%] border-2 border-emerald-400 rounded-xs">
                          <div className="absolute -bottom-4 left-0 text-[7px] font-mono text-emerald-300 bg-black/80 px-1 rounded whitespace-nowrap">
                            TN 05 AG 3144 [98.7%]
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 3. AREA RESTRICTION & PERIMETER DEFENSE ──────────────── */}
                  {currentFeature.id === 'restriction' && (
                    <>
                      {/* Virtual Restricted Entry Zone Polygon */}
                      <div className="absolute top-[38.0%] left-[36.0%] w-[62.0%] h-[58.0%] border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-sm shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                        
                        {/* Zone Header Alert Banner */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded shadow-sm flex items-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          VIRTUAL PERIMETER FENCE ARMED • GOVIND ROYAL NEST ZONE-A
                        </div>

                        {/* Animated Laser Tripwire across road and entrance */}
                        <div 
                          className="absolute h-1 bg-gradient-to-r from-red-600 via-amber-300 to-red-600 shadow-[0_0_12px_#ef4444]"
                          style={{
                            top: '48%',
                            left: '5%',
                            width: '88%',
                            transform: 'rotate(-5deg)'
                          }}
                        />

                        {/* Directional Indicator */}
                        <div className="absolute top-[56%] left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-amber-300 text-[8px] font-mono font-bold uppercase rounded border border-amber-500/40 whitespace-nowrap">
                          ◄ STREET TRAFFIC ── PERIMETER BOUNDARY ── SOCIETY GATE ACCESS ►
                        </div>

                        {/* Active Security Linkage Status */}
                        <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-md border border-red-500/40 rounded px-2.5 py-1.5 text-white text-[10px] flex items-center justify-between">
                          <span className="text-red-400 font-bold">Linkage: 110dB Audio Siren ARMED • Auto Guard Room Alert ENGAGED</span>
                          <span className="text-slate-300 font-mono hidden sm:inline">Zero False Alarm VCA Active</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ──────────────── 4. HUMAN & VEHICLE TARGET CLASSIFICATION ──────────────── */}
                  {currentFeature.id === 'classification' && (
                    <>
                      {/* Target 1: Parked Hyundai Car in Foreground */}
                      <div className="absolute top-[42.0%] left-[0.0%] w-[53.0%] h-[55.0%] border-2 border-amber-400/90 rounded-xs shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          VEHICLE [CAR]: 99.8%
                        </div>
                      </div>

                      {/* Target 2: Parked Maruti Suzuki Car */}
                      <div className="absolute top-[40.5%] left-[45.0%] w-[9.0%] h-[13.0%] border-2 border-amber-400 rounded-xs shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-amber-500 text-black text-[7px] font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          VEHICLE [CAR]: 99.5%
                        </div>
                      </div>

                      {/* Target 3: Moving Two-Wheeler / Motorcycle */}
                      <div className="absolute top-[42.0%] left-[58.0%] w-[9.5%] h-[20.0%] border-2 border-purple-400 rounded-xs shadow-[0_0_10px_rgba(192,132,252,0.4)]">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-purple-600 text-white text-[7px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          TWO-WHEELER & RIDER: 99.4%
                        </div>
                      </div>

                      {/* Target 4: Midground Scooter */}
                      <div className="absolute top-[41.0%] left-[44.0%] w-[5.5%] h-[14.0%] border border-purple-400 rounded-xs">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-purple-600 text-white text-[7px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          MOTORCYCLE: 98.6%
                        </div>
                      </div>

                      {/* Target 5: Bus in Background (Vel Tech) */}
                      <div className="absolute top-[34.0%] left-[33.0%] w-[12.0%] h-[11.0%] border-2 border-blue-400 rounded-xs">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-blue-600 text-white text-[7px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          HEAVY VEHICLE [BUS]: 99.0%
                        </div>
                      </div>

                      {/* Target 6: Pedestrian on Sidewalk */}
                      <div className="absolute top-[40.0%] left-[38.0%] w-[2.2%] h-[7.0%] border border-cyan-400 rounded-xs">
                        <div className="absolute -top-4 left-0 px-1 py-0.5 bg-cyan-500 text-black text-[6px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                          HUMAN: 98.1%
                        </div>
                      </div>

                      {/* False Alarm Filter Pill at bottom */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 backdrop-blur-md border border-white/15 rounded-full text-white text-[10px] font-medium flex items-center gap-1.5 shadow-md whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>AI Target Classification: <strong className="text-emerald-400">6 Targets Tracked • Trees, Wind & Shadows Filtered (Zero False Alarms)</strong></span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom Camera Telemetry Bar */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none text-white text-[10px] font-mono">
                <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10 hidden sm:block">
                  AI ENGINE: <span className="text-emerald-400 font-bold">NEURAL VPU 4.0</span> • LATENCY: <span className="text-white font-bold">{currentFeature.stats.latency}</span>
                </div>
                <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10 ml-auto">
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
