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

          {/* 3-Column Desktop Grid Layout with Dynamic Connected Circuit Lines */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-center pt-1 relative z-10 overflow-visible"
          >

            {/* =========================================================================
                DYNAMIC RUNNING MATRIX BUS LINES DIRECTLY LOCKED TO CARDS & CAMERA
                ========================================================================= */}
            {wirePoints && wirePoints.cards[0] && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 hidden lg:block overflow-visible"
                width={wirePoints.width}
                height={wirePoints.height}
                viewBox={`0 0 ${wirePoints.width} ${wirePoints.height}`}
              >
                <defs>
                  {/* Neon Glow Filter */}
                  <filter id="circuit-neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Dual Neon Gradients */}
                  <linearGradient id="matrix-grad-left" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#ff2d55" stopOpacity="1" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="matrix-grad-right" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#ff2d55" stopOpacity="1" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* === CAMERA CENTRAL MOUNT JUNCTION BUS === */}
                <g strokeWidth="2" strokeLinecap="round" fill="none">
                  <line
                    x1={wirePoints.camCenterX}
                    y1={wirePoints.camCenterY - 45}
                    x2={wirePoints.camCenterX}
                    y2={wirePoints.camCenterY + 45}
                    stroke="url(#matrix-grad-left)"
                    strokeOpacity="0.4"
                  />
                  {/* Glowing center hub dot */}
                  <circle
                    cx={wirePoints.camCenterX}
                    cy={wirePoints.camCenterY}
                    r="4"
                    fill="#ff2d55"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                </g>

                {/* =====================================================================
                    LEFT CHANNELS: Camera -> Cards 0, 1, 2
                    ===================================================================== */}
                <g strokeLinecap="round" strokeLinejoin="round" fill="none">
                  {/* Channel 0: Real-Time Monitoring (Top Left) */}
                  {wirePoints.cards[0] && (
                    <g key="ch-0">
                      {/* Base Track (Always 100% visible connection) */}
                      <path
                        d={`M ${wirePoints.camLeft + 35},${wirePoints.camCenterY - 45} H ${wirePoints.cards[0].x + 35} V ${wirePoints.cards[0].y} H ${wirePoints.cards[0].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="1.8"
                        strokeOpacity="0.32"
                      />
                      {/* Running Pulse (Continuously flows into card) */}
                      <path
                        d={`M ${wirePoints.camLeft + 35},${wirePoints.camCenterY - 45} H ${wirePoints.cards[0].x + 35} V ${wirePoints.cards[0].y} H ${wirePoints.cards[0].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="2.8"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-lead"
                      />
                      {/* Secondary Decorative Micro-Line */}
                      <path
                        d={`M ${wirePoints.camLeft + 50},${wirePoints.camCenterY - 60} H ${wirePoints.cards[0].x + 55} V ${wirePoints.cards[0].y - 12} H ${wirePoints.cards[0].x + 18}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camLeft + 35} cy={wirePoints.camCenterY - 45} r="3.5" fill="#ff2d55" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Channel 1: Motion Detection (Middle Left - Bowed Outwards) */}
                  {wirePoints.cards[1] && (
                    <g key="ch-1">
                      {/* Base Track (Straight Laser Bus) */}
                      <path
                        d={`M ${wirePoints.camLeft + 15},${wirePoints.cards[1].y} H ${wirePoints.cards[1].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="2.2"
                        strokeOpacity="0.35"
                      />
                      {/* Running Pulse */}
                      <path
                        d={`M ${wirePoints.camLeft + 15},${wirePoints.cards[1].y} H ${wirePoints.cards[1].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="3.2"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-mid"
                      />
                      {/* Secondary Micro-Line */}
                      <path
                        d={`M ${wirePoints.camLeft + 35},${wirePoints.cards[1].y + 14} H ${wirePoints.cards[1].x + 30} V ${wirePoints.cards[1].y + 14} H ${wirePoints.cards[1].x + 10}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camLeft + 15} cy={wirePoints.cards[1].y} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Channel 2: Cloud Storage (Bottom Left) */}
                  {wirePoints.cards[2] && (
                    <g key="ch-2">
                      {/* Base Track */}
                      <path
                        d={`M ${wirePoints.camLeft + 35},${wirePoints.camCenterY + 45} H ${wirePoints.cards[2].x + 35} V ${wirePoints.cards[2].y} H ${wirePoints.cards[2].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="1.8"
                        strokeOpacity="0.32"
                      />
                      {/* Running Pulse */}
                      <path
                        d={`M ${wirePoints.camLeft + 35},${wirePoints.camCenterY + 45} H ${wirePoints.cards[2].x + 35} V ${wirePoints.cards[2].y} H ${wirePoints.cards[2].x}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="2.8"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-trail"
                      />
                      {/* Secondary Micro-Line */}
                      <path
                        d={`M ${wirePoints.camLeft + 50},${wirePoints.camCenterY + 60} H ${wirePoints.cards[2].x + 55} V ${wirePoints.cards[2].y + 12} H ${wirePoints.cards[2].x + 18}`}
                        stroke="url(#matrix-grad-left)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camLeft + 35} cy={wirePoints.camCenterY + 45} r="3.5" fill="#ff2d55" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}
                </g>

                {/* =====================================================================
                    RIGHT CHANNELS: Camera -> Cards 3, 4, 5
                    ===================================================================== */}
                <g strokeLinecap="round" strokeLinejoin="round" fill="none">
                  {/* Channel 3: Alarm Integration (Top Right) */}
                  {wirePoints.cards[3] && (
                    <g key="ch-3">
                      {/* Base Track */}
                      <path
                        d={`M ${wirePoints.camRight - 35},${wirePoints.camCenterY - 45} H ${wirePoints.cards[3].x - 35} V ${wirePoints.cards[3].y} H ${wirePoints.cards[3].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="1.8"
                        strokeOpacity="0.32"
                      />
                      {/* Running Pulse */}
                      <path
                        d={`M ${wirePoints.camRight - 35},${wirePoints.camCenterY - 45} H ${wirePoints.cards[3].x - 35} V ${wirePoints.cards[3].y} H ${wirePoints.cards[3].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="2.8"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-lead"
                      />
                      {/* Secondary Micro-Line */}
                      <path
                        d={`M ${wirePoints.camRight - 50},${wirePoints.camCenterY - 60} H ${wirePoints.cards[3].x - 55} V ${wirePoints.cards[3].y - 12} H ${wirePoints.cards[3].x - 18}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camRight - 35} cy={wirePoints.camCenterY - 45} r="3.5" fill="#ff2d55" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Channel 4: Remote Access (Middle Right - Bowed Outwards) */}
                  {wirePoints.cards[4] && (
                    <g key="ch-4">
                      {/* Base Track (Straight Laser Bus) */}
                      <path
                        d={`M ${wirePoints.camRight - 15},${wirePoints.cards[4].y} H ${wirePoints.cards[4].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="2.2"
                        strokeOpacity="0.35"
                      />
                      {/* Running Pulse */}
                      <path
                        d={`M ${wirePoints.camRight - 15},${wirePoints.cards[4].y} H ${wirePoints.cards[4].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="3.2"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-mid"
                      />
                      {/* Secondary Micro-Line */}
                      <path
                        d={`M ${wirePoints.camRight - 35},${wirePoints.cards[4].y + 14} H ${wirePoints.cards[4].x - 30} V ${wirePoints.cards[4].y + 14} H ${wirePoints.cards[4].x - 10}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camRight - 15} cy={wirePoints.cards[4].y} r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Channel 5: Multi-Camera View (Bottom Right) */}
                  {wirePoints.cards[5] && (
                    <g key="ch-5">
                      {/* Base Track */}
                      <path
                        d={`M ${wirePoints.camRight - 35},${wirePoints.camCenterY + 45} H ${wirePoints.cards[5].x - 35} V ${wirePoints.cards[5].y} H ${wirePoints.cards[5].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="1.8"
                        strokeOpacity="0.32"
                      />
                      {/* Running Pulse */}
                      <path
                        d={`M ${wirePoints.camRight - 35},${wirePoints.camCenterY + 45} H ${wirePoints.cards[5].x - 35} V ${wirePoints.cards[5].y} H ${wirePoints.cards[5].x}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="2.8"
                        filter="url(#circuit-neon-glow)"
                        className="circuit-pulse-running-trail"
                      />
                      {/* Secondary Micro-Line */}
                      <path
                        d={`M ${wirePoints.camRight - 50},${wirePoints.camCenterY + 60} H ${wirePoints.cards[5].x - 55} V ${wirePoints.cards[5].y + 12} H ${wirePoints.cards[5].x - 18}`}
                        stroke="url(#matrix-grad-right)"
                        strokeWidth="1.2"
                        strokeOpacity="0.25"
                      />
                      {/* Camera Origin Node */}
                      <circle cx={wirePoints.camRight - 35} cy={wirePoints.camCenterY + 45} r="3.5" fill="#ff2d55" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}
                </g>

                {/* Solder Terminals directly on the cards' connection edge */}
                <g fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5">
                  {wirePoints.cards.map((c, i) => c && (
                    <g key={i}>
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="5"
                        fill={i === 1 || i === 4 ? "#38bdf8" : (i < 3 ? "#38bdf8" : "#ff2d55")}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className={i % 3 === 0 ? "node-pulse-lead" : (i % 3 === 1 ? "node-pulse-mid" : "node-pulse-trail")}
                      />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="8"
                        fill="none"
                        stroke={i < 3 ? "#38bdf8" : "#ff2d55"}
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    </g>
                  ))}
                </g>
              </svg>
            )}

            {/* Left Column - 3 Feature Cards (Circular Orbit: Middle Card Moved OUTWARDS) */}
            <div className={`lg:col-span-4 flex flex-col gap-4 sm:gap-5 py-1 relative z-20 ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
              {leftCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  ref={el => { cardRefs.current[idx] = el; }}
                  className={`transition-all duration-300 ${
                    idx === 1
                      ? 'lg:-translate-x-6 xl:-translate-x-8' // MOTION DETECTION BOWED OUTWARDS IN A CIRCLE
                      : 'lg:translate-x-8 xl:translate-x-10'  // TOP & BOTTOM CURVED INWARDS TOWARDS CAMERA
                  }`}
                >
                  <div
                    className="capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#ff2d55]/50 hover:-translate-y-1 relative z-20"
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
                      <h3 className="text-[18px] sm:text-[19px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
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

            {/* Right Column - 3 Feature Cards (Circular Orbit: Middle Card Moved OUTWARDS) */}
            <div className={`lg:col-span-4 flex flex-col gap-4 sm:gap-5 py-1 relative z-20 ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
              {rightCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  ref={el => { cardRefs.current[idx + 3] = el; }}
                  className={`transition-all duration-300 ${
                    idx === 1
                      ? 'lg:translate-x-6 xl:translate-x-8'   // REMOTE ACCESS BOWED OUTWARDS IN A CIRCLE
                      : 'lg:-translate-x-8 xl:-translate-x-10' // TOP & BOTTOM CURVED INWARDS TOWARDS CAMERA
                  }`}
                >
                  <div
                    className="capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#38bdf8]/50 hover:-translate-y-1 relative z-20"
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
                      <h3 className="text-[18px] sm:text-[19px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
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
