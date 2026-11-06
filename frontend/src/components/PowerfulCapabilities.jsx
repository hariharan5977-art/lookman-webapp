import React, { useState, useRef, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function PowerfulCapabilities() {
  const [capRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const gridRef = useRef(null);
  const cameraImgRef = useRef(null);
  const cardRefs = useRef([]);
  const [wirePoints, setWirePoints] = useState(null);

  const leftCapabilities = [
    {
      iconImg: "/exact_icon_realtime.png",
      title: 'Real-Time Monitoring',
      desc: 'Live high-definition streaming with zero latency.'
    },
    {
      iconImg: "/exact_icon_motion.png",
      title: 'Motion Detection',
      desc: 'Detect movement with instant alerts.'
    },
    {
      iconImg: "/exact_icon_cloud.png",
      title: 'Cloud Storage',
      desc: 'Secure cloud backup for recorded videos.'
    }
  ];

  const rightCapabilities = [
    {
      iconImg: "/exact_icon_alarm.png",
      title: 'Alarm Integration',
      desc: 'Seamless connection with alarm systems.'
    },
    {
      iconImg: "/exact_icon_remote.png",
      title: 'Remote Access',
      desc: 'Control and view cameras on-the-go.'
    },
    {
      iconImg: "/exact_icon_multicam.png",
      title: 'Multi-Camera View',
      desc: 'Monitor multiple feeds on one screen.'
    }
  ];

  // Dynamically compute circuit connector endpoints locked to each card's edge & camera
  const calculatePoints = () => {
    if (!gridRef.current) return;
    const gRect = gridRef.current.getBoundingClientRect();
    if (gRect.width === 0) return;

    let camCenterX, camCenterY, camLeft, camRight;
    if (cameraImgRef.current) {
      const cRect = cameraImgRef.current.getBoundingClientRect();
      camCenterX = Math.round(cRect.left + cRect.width / 2 - gRect.left);
      camCenterY = Math.round(cRect.top + cRect.height / 2 - gRect.top);
      camLeft = Math.round(cRect.left - gRect.left);
      camRight = Math.round(cRect.right - gRect.left);
    } else {
      camCenterX = Math.round(gRect.width / 2);
      camCenterY = Math.round(gRect.height / 2);
      camLeft = camCenterX - 140;
      camRight = camCenterX + 140;
    }

    const cards = cardRefs.current.map((cardEl, idx) => {
      if (!cardEl) return null;
      const r = cardEl.getBoundingClientRect();
      const isLeft = idx < 3;
      return {
        // Left cards connect on their RIGHT edge, right cards connect on their LEFT edge
        x: Math.round(isLeft ? (r.right - gRect.left) : (r.left - gRect.left)),
        y: Math.round(r.top + r.height / 2 - gRect.top)
      };
    });

    setWirePoints({
      width: Math.round(gRect.width),
      height: Math.round(gRect.height),
      camCenterX,
      camCenterY,
      camLeft,
      camRight,
      cards
    });
  };

  useEffect(() => {
    calculatePoints();
    const ro = new ResizeObserver(() => {
      calculatePoints();
    });
    if (gridRef.current) ro.observe(gridRef.current);
    if (cameraImgRef.current) ro.observe(cameraImgRef.current);
    window.addEventListener('resize', calculatePoints);
    const timer1 = setTimeout(calculatePoints, 150);
    const timer2 = setTimeout(calculatePoints, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calculatePoints);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVisible]);

  const c0 = wirePoints?.cards[0];
  const c1 = wirePoints?.cards[1];
  const c2 = wirePoints?.cards[2];
  const c3 = wirePoints?.cards[3];
  const c4 = wirePoints?.cards[4];
  const c5 = wirePoints?.cards[5];
  const camL = wirePoints?.camLeft ?? 500;
  const camR = wirePoints?.camRight ?? 780;
  const camCY = wirePoints?.camCenterY ?? 210;

  return (
    <section ref={capRef} className="capabilities-section w-full bg-[#f8f9fc] relative overflow-hidden py-1 sm:py-2 border-none flex justify-center">
      {/* Whole Tab Container */}
      <div className="w-full max-w-[2000px] mx-auto px-0 relative overflow-hidden bg-slate-900 border border-slate-200/60 rounded-none shadow-xs pt-6 pb-4 sm:pt-7 sm:pb-5">

        {/* CCTV Security Surveillance Video Wall Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/capabilities_cctv_bg.jpg"
            alt="CCTV Security Surveillance Operations Wall"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-115"
          />
          {/* Strong Black Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/78 to-black/88 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="site-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Capsule Pill & Two-Line Heading */}
          <div className="flex flex-col items-center justify-center text-center mb-5 sm:mb-6 relative z-10">
            {/* Outlined Capsule Pill */}
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-[#ff2d55]/50 bg-slate-900/80 backdrop-blur-md shadow-2xs mb-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#ff2d55]">
              // WHY CHOOSE US
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.12] tracking-tight max-w-2xl text-center">
              Smart <span className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent">Security.</span> Powerful<br className="hidden sm:inline" /> Capabilities.
            </h2>
          </div>

          {/* 3-Column Desktop Grid Layout */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-center pt-1 relative z-10 overflow-visible"
          >

            {/* =========================================================================
                AUTHENTIC DIGITAL MATRIX BUS LINES WITH CONTINUOUS VISIBLE CONDUIT FLOW
                ========================================================================= */}
            {wirePoints && c0 && c1 && c2 && c3 && c4 && c5 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 hidden lg:block overflow-visible"
                width={wirePoints.width}
                height={wirePoints.height}
                viewBox={`0 0 ${wirePoints.width} ${wirePoints.height}`}
              >
                <defs>
                  {/* Original Double Shade Gradient (Neon Rose/Red to Vibrant Electric Azure/Cyan) */}
                  <linearGradient id="matrix-grad-left" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#ff2d55" stopOpacity="1" />
                    <stop offset="45%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="matrix-grad-right" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#ff2d55" stopOpacity="1" />
                    <stop offset="45%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* DYNAMIC MATRIX DATA CONDUITS (Orthogonal Double Shade Matrix Bus) */}
                <g strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none">
                  {/* === LEFT MATRIX CHANNELS (Camera to Left Cards) === */}
                  
                  {/* Channel 1: Top Matrix Bus to Real-Time Monitoring */}
                  {/* Base Track (Always 100% visible connecting conduit) */}
                  <path
                    d={`M ${camL + 40},${camCY - 45} H ${c0.x + 40} V ${c0.y} H ${c0.x}`}
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="2.2"
                    strokeOpacity="0.32"
                  />
                  {/* Flowing Laser Signal */}
                  <path
                    d={`M ${camL + 40},${camCY - 45} H ${c0.x + 40} V ${c0.y} H ${c0.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-lead"
                  />
                  {/* Parallel Micro-Trace */}
                  <path
                    d={`M ${camL + 40},${camCY - 60} H ${c0.x + 60} V ${c0.y - 25} H ${c0.x + 20}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-mid"
                  />
                  {/* Matrix Step Branch */}
                  <path
                    d={`M ${c0.x + 40},${Math.round((camCY - 45 + c0.y) / 2)} H ${c0.x + 80} V ${c0.y + 15} H ${c0.x + 10}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-sub"
                  />

                  {/* Channel 2: Middle Matrix Bus to Motion Detection (Bowed Outwards) */}
                  {/* 1) Base Direct Connecting Line (ALWAYS visible - connects left camera directly to card edge) */}
                  <path
                    d={`M ${camL + 15},${c1.y} H ${c1.x}`}
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="2.6"
                    strokeOpacity="0.45"
                  />
                  {/* 2) Continuous Active Laser Flow (visibly flowing non-stop straight into card) */}
                  <path
                    d={`M ${camL + 15},${c1.y} H ${c1.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="3.2"
                    className="circuit-flow-active"
                  />
                  {/* Camera Origin Node */}
                  <circle cx={camL + 15} cy={c1.y} r="3.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                  {/* Parallel Micro-Trace Upper */}
                  <path
                    d={`M ${camL + 25},${c1.y - 14} H ${c1.x + 45} V ${c1.y - 14} H ${c1.x + 18}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="1.6"
                    className="circuit-grow-mid"
                  />
                  {/* Parallel Micro-Trace Lower */}
                  <path
                    d={`M ${camL + 25},${c1.y + 14} H ${c1.x + 45} V ${c1.y + 14} H ${c1.x + 18}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="1.6"
                    className="circuit-grow-trail"
                  />

                  {/* Channel 3: Bottom Matrix Bus to Cloud Storage */}
                  {/* Base Track */}
                  <path
                    d={`M ${camL + 40},${camCY + 45} H ${c2.x + 40} V ${c2.y} H ${c2.x}`}
                    stroke="url(#matrix-grad-left)"
                    strokeWidth="2.2"
                    strokeOpacity="0.32"
                  />
                  {/* Flowing Laser Signal */}
                  <path
                    d={`M ${camL + 40},${camCY + 45} H ${c2.x + 40} V ${c2.y} H ${c2.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-lead"
                  />
                  {/* Parallel Micro-Trace */}
                  <path
                    d={`M ${camL + 40},${camCY + 60} H ${c2.x + 60} V ${c2.y + 25} H ${c2.x + 20}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-trail"
                  />
                  {/* Matrix Step Branch */}
                  <path
                    d={`M ${c2.x + 40},${Math.round((camCY + 45 + c2.y) / 2)} H ${c2.x + 80} V ${c2.y - 15} H ${c2.x + 10}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-left)"
                    className="circuit-grow-mid"
                  />

                  {/* === RIGHT MATRIX CHANNELS (Camera to Right Cards) === */}
                  
                  {/* Channel 4: Top Matrix Bus to Alarm Integration */}
                  {/* Base Track */}
                  <path
                    d={`M ${camR - 40},${camCY - 45} H ${c3.x - 40} V ${c3.y} H ${c3.x}`}
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="2.2"
                    strokeOpacity="0.32"
                  />
                  {/* Flowing Laser Signal */}
                  <path
                    d={`M ${camR - 40},${camCY - 45} H ${c3.x - 40} V ${c3.y} H ${c3.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-lead"
                  />
                  {/* Parallel Micro-Trace */}
                  <path
                    d={`M ${camR - 40},${camCY - 60} H ${c3.x - 60} V ${c3.y - 25} H ${c3.x - 20}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-mid"
                  />
                  {/* Matrix Step Branch */}
                  <path
                    d={`M ${c3.x - 40},${Math.round((camCY - 45 + c3.y) / 2)} H ${c3.x - 80} V ${c3.y + 15} H ${c3.x - 10}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-sub"
                  />

                  {/* Channel 5: Middle Matrix Bus to Remote Access (Bowed Outwards) */}
                  {/* 1) Base Direct Connecting Line (ALWAYS visible - connects right camera directly to card edge) */}
                  <path
                    d={`M ${camR - 15},${c4.y} H ${c4.x}`}
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="2.6"
                    strokeOpacity="0.45"
                  />
                  {/* 2) Continuous Active Laser Flow (visibly flowing non-stop straight into card) */}
                  <path
                    d={`M ${camR - 15},${c4.y} H ${c4.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="3.2"
                    className="circuit-flow-active"
                  />
                  {/* Camera Origin Node */}
                  <circle cx={camR - 15} cy={c4.y} r="3.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                  {/* Parallel Micro-Trace Upper */}
                  <path
                    d={`M ${camR - 25},${c4.y - 14} H ${c4.x - 45} V ${c4.y - 14} H ${c4.x - 18}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="1.6"
                    className="circuit-grow-mid"
                  />
                  {/* Parallel Micro-Trace Lower */}
                  <path
                    d={`M ${camR - 25},${c4.y + 14} H ${c4.x - 45} V ${c4.y + 14} H ${c4.x - 18}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="1.6"
                    className="circuit-grow-trail"
                  />

                  {/* Channel 6: Bottom Matrix Bus to Multi-Camera View */}
                  {/* Base Track */}
                  <path
                    d={`M ${camR - 40},${camCY + 45} H ${c5.x - 40} V ${c5.y} H ${c5.x}`}
                    stroke="url(#matrix-grad-right)"
                    strokeWidth="2.2"
                    strokeOpacity="0.32"
                  />
                  {/* Flowing Laser Signal */}
                  <path
                    d={`M ${camR - 40},${camCY + 45} H ${c5.x - 40} V ${c5.y} H ${c5.x}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-lead"
                  />
                  {/* Parallel Micro-Trace */}
                  <path
                    d={`M ${camR - 40},${camCY + 60} H ${c5.x - 60} V ${c5.y + 25} H ${c5.x - 20}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-trail"
                  />
                  {/* Matrix Step Branch */}
                  <path
                    d={`M ${c5.x - 40},${Math.round((camCY + 45 + c5.y) / 2)} H ${c5.x - 80} V ${c5.y - 15} H ${c5.x - 10}`}
                    pathLength="100"
                    stroke="url(#matrix-grad-right)"
                    className="circuit-grow-mid"
                  />
                </g>

                {/* MATRIX DATA NODES & SOLDER TERMINALS (At Card Margins with Double Shade Glow) */}
                <g fill="#38bdf8" stroke="#ff2d55" strokeWidth="1.8">
                  {/* Left Terminal Matrix Pads */}
                  <circle cx={c0.x} cy={c0.y} r="4.5" className="node-pulse-lead" />
                  <circle cx={c0.x + 20} cy={c0.y - 25} r="3.5" className="node-pulse-mid" />
                  <circle cx={c0.x + 10} cy={c0.y + 15} r="3" className="node-pulse-trail" />

                  {/* Motion Detection: Main Pad right on the card edge + micro pads */}
                  <circle cx={c1.x} cy={c1.y} r="5" className="node-pulse-lead" />
                  <circle cx={c1.x + 18} cy={c1.y - 14} r="3.5" className="node-pulse-mid" />
                  <circle cx={c1.x + 18} cy={c1.y + 14} r="3.5" className="node-pulse-trail" />

                  <circle cx={c2.x} cy={c2.y} r="4.5" className="node-pulse-lead" />
                  <circle cx={c2.x + 20} cy={c2.y + 25} r="3.5" className="node-pulse-trail" />
                  <circle cx={c2.x + 10} cy={c2.y - 15} r="3" className="node-pulse-mid" />

                  {/* Right Terminal Matrix Pads */}
                  <circle cx={c3.x} cy={c3.y} r="4.5" className="node-pulse-lead" />
                  <circle cx={c3.x - 20} cy={c3.y - 25} r="3.5" className="node-pulse-mid" />
                  <circle cx={c3.x - 10} cy={c3.y + 15} r="3" className="node-pulse-trail" />

                  {/* Remote Access: Main Pad right on the card edge + micro pads */}
                  <circle cx={c4.x} cy={c4.y} r="5" className="node-pulse-lead" />
                  <circle cx={c4.x - 18} cy={c4.y - 14} r="3.5" className="node-pulse-mid" />
                  <circle cx={c4.x - 18} cy={c4.y + 14} r="3.5" className="node-pulse-trail" />

                  <circle cx={c5.x} cy={c5.y} r="4.5" className="node-pulse-lead" />
                  <circle cx={c5.x - 20} cy={c5.y + 25} r="3.5" className="node-pulse-trail" />
                  <circle cx={c5.x - 10} cy={c5.y - 15} r="3" className="node-pulse-mid" />
                </g>
              </svg>
            )}

            {/* Left Column - 3 Feature Cards (Compact, Sleek, Outward Circular Arc) */}
            <div className={`lg:col-span-4 flex flex-col items-center lg:items-end gap-3.5 sm:gap-4 py-1 relative z-20 ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
              {leftCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  ref={el => { cardRefs.current[idx] = el; }}
                  className={`w-full max-w-[340px] sm:max-w-[355px] transition-all duration-300 ${
                    idx === 1
                      ? 'lg:-translate-x-5 xl:-translate-x-6' // MOTION DETECTION BOWED OUTWARDS IN A CIRCLE
                      : 'lg:translate-x-5 xl:translate-x-6'   // TOP & BOTTOM CURVED INWARDS TOWARDS CAMERA
                  }`}
                >
                  <div
                    className="capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#ff2d55]/50 hover:-translate-y-1 relative z-20"
                    style={{
                      animation: `orbit-minimal-${idx + 1} ${6.5 + idx * 0.9}s ease-in-out infinite`,
                      animationDelay: `-${idx * 1.6}s`
                    }}
                  >
                    {/* Floating Icon */}
                    <div className="capability-icon shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                      <img src={item.iconImg} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="capability-content">
                      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-[13px] text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Column - Camera Pole Visual (Proportional & Non-Overlapping) */}
            <div
              className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[360px] py-1 pointer-events-none sm:pointer-events-auto"
            >
              <div className="relative z-10 flex flex-col items-center justify-end w-full h-full mt-auto">
                <img
                  ref={cameraImgRef}
                  src="/exact_user_camera_cleaned.png"
                  alt="Multi-camera CCTV surveillance system"
                  className="w-full max-w-[210px] sm:max-w-[245px] lg:max-w-[265px] xl:max-w-[285px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-103 mt-auto select-none"
                  onLoad={calculatePoints}
                />
              </div>
            </div>

            {/* Right Column - 3 Feature Cards (Compact, Sleek, Outward Circular Arc) */}
            <div className={`lg:col-span-4 flex flex-col items-center lg:items-start gap-3.5 sm:gap-4 py-1 relative z-20 ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
              {rightCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  ref={el => { cardRefs.current[idx + 3] = el; }}
                  className={`w-full max-w-[340px] sm:max-w-[355px] transition-all duration-300 ${
                    idx === 1
                      ? 'lg:translate-x-5 xl:translate-x-6'   // REMOTE ACCESS BOWED OUTWARDS IN A CIRCLE
                      : 'lg:-translate-x-5 xl:-translate-x-6' // TOP & BOTTOM CURVED INWARDS TOWARDS CAMERA
                  }`}
                >
                  <div
                    className="capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#38bdf8]/50 hover:-translate-y-1 relative z-20"
                    style={{
                      animation: `orbit-minimal-${((idx + 2) % 4) + 1} ${7.2 + idx * 0.8}s ease-in-out infinite`,
                      animationDelay: `-${(idx + 2) * 1.4}s`
                    }}
                  >
                    {/* Floating Icon */}
                    <div className="capability-icon shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                      <img src={item.iconImg} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="capability-content">
                      <h3 className="text-[17px] sm:text-[18px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-[13px] text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end 3-col grid */}
        </div>{/* end site-container */}
      </div>{/* end outer container */}
    </section>
  );
}
