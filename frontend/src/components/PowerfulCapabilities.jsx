import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function PowerfulCapabilities() {
  const [capRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const leftCapabilities = [
    {
      iconImg: "/exact_icon_realtime.png",
      title: 'Real-Time Monitoring',
      desc: 'Real-Time Monitoring'
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

  return (
    <section ref={capRef} className="capabilities-section w-full bg-[#f8f9fc] relative overflow-hidden py-1 sm:py-2 border-none flex justify-center">
      {/* Whole Tab Container (Fixed to the width of the 360 tab, not stretched when zoomed out) */}
      <div className="w-full max-w-[2000px] mx-auto px-0 relative overflow-hidden bg-slate-900 border border-slate-200/60 rounded-none shadow-xs pt-6 pb-4 sm:pt-7 sm:pb-5">

        {/* CCTV Security Surveillance Video Wall Background (Constrained within tab width with strong black tint) */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/capabilities_cctv_bg.jpg"
            alt="CCTV Security Surveillance Operations Wall"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-115"
          />
          {/* Strong Black Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/78 to-black/88 backdrop-blur-[0.5px]"></div>
        </div>

        {/* =========================================================================
            DIGITAL MATRIX BUS LINES GROWING FROM ZERO DIRECTLY FROM CAMERA TO CARDS
            ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 flex items-center justify-center">
          <svg
            viewBox="0 0 1440 640"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
          >
            <defs>
              {/* Double Shade Gradient (Neon Rose/Red to Vibrant Electric Azure/Cyan) */}
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
              {/* Channel 1A: Top Matrix Bus to Real-Time Monitoring */}
              <path
                d="M 680,260 H 570 V 160 H 460"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-lead"
              />
              {/* Channel 1B: Parallel Micro-Trace */}
              <path
                d="M 680,245 H 590 V 135 H 490"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-mid"
              />
              {/* Channel 1C: Matrix Step Branch */}
              <path
                d="M 570,195 H 510 V 180 H 470"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-sub"
              />

              {/* Channel 2A: Middle Matrix Bus to Motion Detection */}
              <path
                d="M 670,320 H 530 V 305 H 460 V 320 H 430"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-mid"
              />
              {/* Channel 2B: Parallel Micro-Trace */}
              <path
                d="M 670,335 H 550 V 345 H 450"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-trail"
              />
              {/* Channel 2C: Cross-Grid Matrix Spur */}
              <path
                d="M 530,305 V 275 H 480"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-lead"
              />

              {/* Channel 3A: Bottom Matrix Bus to Cloud Storage */}
              <path
                d="M 680,380 H 570 V 480 H 460"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-lead"
              />
              {/* Channel 3B: Parallel Micro-Trace */}
              <path
                d="M 680,395 H 590 V 505 H 490"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-trail"
              />
              {/* Channel 3C: Matrix Step Branch */}
              <path
                d="M 570,445 H 510 V 460 H 470"
                pathLength="100"
                stroke="url(#matrix-grad-left)"
                className="circuit-grow-mid"
              />

              {/* === RIGHT MATRIX CHANNELS (Camera to Right Cards) === */}
              {/* Channel 4A: Top Matrix Bus to Alarm Integration */}
              <path
                d="M 760,260 H 870 V 160 H 980"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-lead"
              />
              {/* Channel 4B: Parallel Micro-Trace */}
              <path
                d="M 760,245 H 850 V 135 H 950"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-mid"
              />
              {/* Channel 4C: Matrix Step Branch */}
              <path
                d="M 870,195 H 930 V 180 H 970"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-sub"
              />

              {/* Channel 5A: Middle Matrix Bus to Remote Access */}
              <path
                d="M 770,320 H 910 V 305 H 980 V 320 H 1010"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-mid"
              />
              {/* Channel 5B: Parallel Micro-Trace */}
              <path
                d="M 770,335 H 890 V 345 H 990"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-trail"
              />
              {/* Channel 5C: Cross-Grid Matrix Spur */}
              <path
                d="M 910,305 V 275 H 960"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-lead"
              />

              {/* Channel 6A: Bottom Matrix Bus to Multi-Camera View */}
              <path
                d="M 760,380 H 870 V 480 H 980"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-lead"
              />
              {/* Channel 6B: Parallel Micro-Trace */}
              <path
                d="M 760,395 H 850 V 505 H 950"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-trail"
              />
              {/* Channel 6C: Matrix Step Branch */}
              <path
                d="M 870,445 H 930 V 460 H 970"
                pathLength="100"
                stroke="url(#matrix-grad-right)"
                className="circuit-grow-mid"
              />
            </g>

            {/* MATRIX DATA NODES & SOLDER TERMINALS (At Card Margins with Double Shade Glow) */}
            <g fill="#38bdf8" stroke="#ff2d55" strokeWidth="1.8">
              {/* Left Terminal Matrix Pads */}
              <circle cx="460" cy="160" r="4.5" className="node-pulse-lead" />
              <circle cx="490" cy="135" r="3.5" className="node-pulse-mid" />
              <circle cx="470" cy="180" r="3" className="node-pulse-trail" />

              <circle cx="430" cy="320" r="4.5" className="node-pulse-mid" />
              <circle cx="450" cy="345" r="3.5" className="node-pulse-trail" />
              <circle cx="480" cy="275" r="3" className="node-pulse-lead" />

              <circle cx="460" cy="480" r="4.5" className="node-pulse-lead" />
              <circle cx="490" cy="505" r="3.5" className="node-pulse-trail" />
              <circle cx="470" cy="460" r="3" className="node-pulse-mid" />

              {/* Right Terminal Matrix Pads */}
              <circle cx="980" cy="160" r="4.5" className="node-pulse-lead" />
              <circle cx="950" cy="135" r="3.5" className="node-pulse-mid" />
              <circle cx="970" cy="180" r="3" className="node-pulse-trail" />

              <circle cx="1010" cy="320" r="4.5" className="node-pulse-mid" />
              <circle cx="990" cy="345" r="3.5" className="node-pulse-trail" />
              <circle cx="960" cy="275" r="3" className="node-pulse-lead" />

              <circle cx="980" cy="480" r="4.5" className="node-pulse-lead" />
              <circle cx="950" cy="505" r="3.5" className="node-pulse-trail" />
              <circle cx="970" cy="460" r="3" className="node-pulse-mid" />
            </g>
          </svg>
        </div>

        <div className="site-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Capsule Pill & Two-Line Heading with Reduced Margin */}
          <div className="flex flex-col items-center justify-center text-center mb-5 sm:mb-6 relative z-10">
            {/* Outlined Capsule Pill */}
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-[#ff2d55]/50 bg-slate-900/80 backdrop-blur-md shadow-2xs mb-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#ff2d55]">
              // WHY CHOOSE US
              </span>
            </div>

            {/* Heading (White texts with double shade gradient) */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.12] tracking-tight max-w-2xl text-center">
              Smart <span className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent">Security.</span> Powerful<br className="hidden sm:inline" /> Capabilities.
            </h2>
          </div>

          {/* 3-Column Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center pt-1 relative z-10 overflow-hidden">

            {/* Left Column - 3 Feature Cards (Clean Light Theme Cards) */}
            <div className={`lg:col-span-4 flex flex-col gap-4 sm:gap-5 py-1 ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
              {leftCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  className={`capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#ff2d55]/50 hover:-translate-y-1 ${idx === 0 || idx === 2 ? 'lg:translate-x-5' : 'lg:-translate-x-2'
                    }`}
                  style={{
                    animation: `orbit-minimal-${idx + 1} ${6.5 + idx * 0.9}s ease-in-out infinite`,
                    animationDelay: `-${idx * 1.6}s`
                  }}
                >
                  {/* Floating Icon without square background card */}
                  <div className="capability-icon shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                    <img src={item.iconImg} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="capability-content">
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Column - Camera Pole Visual (Reduced Size) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[340px] sm:min-h-[380px] py-1">
              <div className="relative z-10 flex flex-col items-center justify-end w-full h-full mt-auto">
                <img
                  src="/exact_user_camera_cleaned.png"
                  alt="Multi-camera CCTV surveillance system"
                  className="w-full max-w-[290px] sm:max-w-[340px] lg:max-w-[380px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-103 mt-auto"
                />
              </div>
            </div>

            {/* Right Column - 3 Feature Cards (Clean Light Theme Cards) */}
            <div className={`lg:col-span-4 flex flex-col gap-4 sm:gap-5 py-1 ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
              {rightCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  className={`capability-card bg-white/92 backdrop-blur-md border border-slate-200/80 rounded-xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all duration-300 shadow-md hover:shadow-lg hover:border-[#38bdf8]/50 hover:-translate-y-1 ${idx === 0 || idx === 2 ? 'lg:-translate-x-5' : 'lg:translate-x-2'
                    }`}
                  style={{
                    animation: `orbit-minimal-${((idx + 2) % 4) + 1} ${7.2 + idx * 0.8}s ease-in-out infinite`,
                    animationDelay: `-${(idx + 2) * 1.4}s`
                  }}
                >
                  {/* Floating Icon without square background card */}
                  <div className="capability-icon shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                    <img src={item.iconImg} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="capability-content">
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#273752] leading-tight mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#717d96] font-normal leading-relaxed">{item.desc}</p>
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
