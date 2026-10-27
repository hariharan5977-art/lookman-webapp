import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

/* Gradient icon wrappers matching the exact Icons.jsx style */
function UsersGradIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#achGrad1)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="achGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E66D82" />
          <stop offset="50%" stopColor="#D67B9B" />
          <stop offset="100%" stopColor="#7895CD" />
        </linearGradient>
      </defs>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CameraGradIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#achGrad2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="achGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E66D82" />
          <stop offset="50%" stopColor="#D67B9B" />
          <stop offset="100%" stopColor="#7895CD" />
        </linearGradient>
      </defs>
      {/* Camera body - rounded rectangle */}
      <rect x="2" y="8" width="14" height="8" rx="2" />
      {/* Camera lens barrel */}
      <path d="M16 10.5l5-2.5v8l-5-2.5" />
      {/* Mounting bracket at bottom */}
      <path d="M7 16v2" />
      <path d="M5 18h4" />
      {/* Lens indicator dot */}
      <circle cx="8" cy="12" r="1.2" fill="url(#achGrad2)" stroke="none" />
    </svg>
  );
}

function ShieldGradIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#achGrad3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="achGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea0004" />
          <stop offset="100%" stopColor="#6a0006" />
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function HeadsetGradIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#achGrad4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="achGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E66D82" />
          <stop offset="50%" stopColor="#D67B9B" />
          <stop offset="100%" stopColor="#7895CD" />
        </linearGradient>
      </defs>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

const stats = [
  { Icon: UsersGradIcon, value: '4,100+', label: 'Happy Clients', animClass: 'anim-ach-rotate' },
  { Icon: CameraGradIcon, value: '31K+', label: 'Cameras Installed', animClass: 'anim-ach-slideup' },
  { Icon: ShieldGradIcon, value: '99.9%', label: 'Clients Secured', animClass: 'anim-ach-twist' },
  { Icon: HeadsetGradIcon, value: '24/7', label: 'Expert Support', animClass: 'anim-ach-popup' },
];

export default function AchievementsStrip({ onOpenContact }) {
  const [achieveRef, isVisible] = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      ref={achieveRef}
      className="relative z-10 w-full bg-white pt-16 pb-8 sm:pb-10 lg:pt-20 lg:pb-12 overflow-hidden"
      style={{
        position: 'relative',
        borderTop: 'none',
        boxShadow: 'none'
      }}
    >
      {/* Distinct Slideshow Animations for each Icon */}
      <style>{`
        /* 1. Rotate & Show (Spin 360° flourish + settle) */
        @keyframes ach-rotate-show {
          0% { transform: rotate(0deg) scale(1); }
          12% { transform: rotate(180deg) scale(1.24); }
          24% { transform: rotate(360deg) scale(1); }
          30% { transform: rotate(360deg) scale(1.08); }
          36% { transform: rotate(360deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .anim-ach-rotate {
          animation: ach-rotate-show 4.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          animation-delay: 0s;
          transform-origin: center center;
        }

        /* 2. Slide Up & Show (Drop down and elastic spring slide up) */
        @keyframes ach-slideup-show {
          0% { transform: translateY(0px) scale(1); }
          8% { transform: translateY(16px) scale(0.7); opacity: 0.4; }
          20% { transform: translateY(-10px) scale(1.2); opacity: 1; }
          30% { transform: translateY(3px) scale(0.95); }
          38% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        .anim-ach-slideup {
          animation: ach-slideup-show 4.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          animation-delay: 1.1s;
          transform-origin: center center;
        }

        /* 3. Twist & Show (3D dynamic perspective twist with glow) */
        @keyframes ach-twist-show {
          0% { transform: perspective(400px) rotateY(0deg) rotateZ(0deg) scale(1); filter: drop-shadow(0 0 0px transparent); }
          14% { transform: perspective(400px) rotateY(-180deg) rotateZ(-14deg) scale(1.26); filter: drop-shadow(0 0 8px rgba(231,52,85,0.6)); }
          26% { transform: perspective(400px) rotateY(-360deg) rotateZ(0deg) scale(1); filter: drop-shadow(0 0 0px transparent); }
          34% { transform: perspective(400px) scale(1.1); }
          40% { transform: perspective(400px) scale(1); }
          100% { transform: perspective(400px) rotateY(-360deg) rotateZ(0deg) scale(1); }
        }
        .anim-ach-twist {
          animation: ach-twist-show 4.5s cubic-bezier(0.34, 1.4, 0.64, 1) infinite;
          animation-delay: 2.2s;
          transform-origin: center center;
        }

        /* 4. Pop Up & Show (Elastic zoom explosion & wobble) */
        @keyframes ach-popup-show {
          0% { transform: scale(1); }
          8% { transform: scale(0.2) rotate(-15deg); opacity: 0.3; }
          20% { transform: scale(1.32) rotate(10deg); opacity: 1; }
          28% { transform: scale(0.88) rotate(-5deg); }
          36% { transform: scale(1.1) rotate(0deg); }
          42% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        /* 5. Distinct Pop-Up, Rotating, and Circling Sparkle Keyframes */
        
        /* Circular Orbit Revolution (Clockwise) with Pop-up Pulse */
        @keyframes ach-orbit-cw {
          0% { transform: rotate(0deg) translateX(22px) rotate(0deg) scale(0.5); opacity: 0.3; }
          25% { transform: rotate(90deg) translateX(22px) rotate(-90deg) scale(1.35); opacity: 1; }
          50% { transform: rotate(180deg) translateX(22px) rotate(-180deg) scale(0.8); opacity: 0.7; }
          75% { transform: rotate(270deg) translateX(22px) rotate(-270deg) scale(1.3); opacity: 1; }
          100% { transform: rotate(360deg) translateX(22px) rotate(-360deg) scale(0.5); opacity: 0.3; }
        }
        .anim-circle-orbit-1 { animation: ach-orbit-cw 4.5s ease-in-out infinite; }
        .anim-circle-orbit-2 { animation: ach-orbit-cw 4.5s ease-in-out infinite 2.25s; }

        /* Circular Orbit Revolution (Counter-Clockwise) */
        @keyframes ach-orbit-ccw {
          0% { transform: rotate(180deg) translateX(21px) rotate(-180deg) scale(0.5); opacity: 0.3; }
          25% { transform: rotate(90deg) translateX(21px) rotate(-90deg) scale(1.35); opacity: 1; }
          50% { transform: rotate(0deg) translateX(21px) rotate(0deg) scale(0.8); opacity: 0.7; }
          75% { transform: rotate(-90deg) translateX(21px) rotate(90deg) scale(1.3); opacity: 1; }
          100% { transform: rotate(-180deg) translateX(21px) rotate(180deg) scale(0.5); opacity: 0.3; }
        }
        .anim-circle-orbit-ccw1 { animation: ach-orbit-ccw 5s ease-in-out infinite; }
        .anim-circle-orbit-ccw2 { animation: ach-orbit-ccw 5s ease-in-out infinite 2.5s; }

        /* Elastic Pop-Up with 360 Spin */
        @keyframes ach-popup-spin {
          0%, 100% { transform: scale(0.3) rotate(0deg); opacity: 0.2; }
          35% { transform: scale(1.4) rotate(180deg); opacity: 1; }
          70% { transform: scale(0.9) rotate(360deg); opacity: 0.7; }
        }
        .anim-pop-spin-1 { animation: ach-popup-spin 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        .anim-pop-spin-2 { animation: ach-popup-spin 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 1.5s; }
        .anim-pop-spin-3 { animation: ach-popup-spin 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 0.75s; }

        /* Orbit Ring Rotation */
        @keyframes ach-ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-ring-spin { animation: ach-ring-spin 8s linear infinite; }
      `}</style>

      <div className="w-full max-w-[2000px] mx-auto wide-2000-flush">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 overflow-hidden">

          {/* LEFT: Heading + description + CTA */}
          <div className={`flex-shrink-0 lg:w-[340px] xl:w-[380px] flex flex-col items-start gap-5 ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e73455]/30 bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e73455] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#e73455]">Our Impact</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-black text-[#12182b] leading-[1.12] tracking-tight">
              Securing{' '}
              <span className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent">More.</span>
              <br />Every Single Day.
            </h2>

            {/* Sub description */}
            <p className="text-sm sm:text-base text-[#6b7280] leading-relaxed">
              Our solutions deliver reliability, clarity, and complete peace of mind for homes and enterprises alike.
            </p>

            {/* Get Quote CTA */}
            <button
              onClick={() => onOpenContact && onOpenContact()}
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#f0f1f4] hover:bg-[#e5e6ea] text-[#12182b] font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Get a Quote
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #ea0004 0%, #6a0006 100%)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* RIGHT: 4 horizontal stat cards in one ultra-light card */}
          <div className={`flex-1 w-full max-w-[850px] lg:ml-auto ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 relative">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center justify-center gap-2 py-4.5 sm:py-5 px-3 sm:px-4 hover:bg-white transition-colors duration-200 group"
                  >
                    {/* Shortened Vertical Divider Line (Centered, reduced height) */}
                    {idx < stats.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-[42%] w-[1px] bg-[#e2e4ea] z-20 pointer-events-none" />
                    )}

                    {/* Mobile 2x2 Grid Shortened Dividers */}
                    {idx % 2 === 0 && idx < stats.length - 1 && (
                      <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] bg-[#e2e4ea] z-20 pointer-events-none" />
                    )}
                    {idx < 2 && (
                      <div className="sm:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-[#e2e4ea] z-20 pointer-events-none" />
                    )}

                    {/* Icon wrapper with Background Circling, Rotating, Pop-Up Sparkles */}
                    <div className="relative flex items-center justify-center w-12 h-12">

                      {/* ── BACKGROUND SPARKLES (LAYERED AT Z-0 BEHIND ICON) ── */}
                      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">

                        {/* ── ICON 0: Floating Hearts & Orbiting Ringlets (Clients/Users) ── */}
                        {idx === 0 && (
                          <>
                            {/* Orbiting Red Heart */}
                            <div className="anim-circle-orbit-1 absolute text-[#e73455]">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </div>

                            {/* Counter-Orbiting Purple Heart */}
                            <div className="anim-circle-orbit-2 absolute text-[#9333ea]">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </div>

                            {/* Pop-Up Spinning Ringlet Bubble */}
                            <div className="anim-pop-spin-1 absolute -top-1 -right-1 text-[#e73455]">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <circle cx="12" cy="12" r="8" />
                              </svg>
                            </div>
                          </>
                        )}

                        {/* ── ICON 1: Camera Focus Crosshair & Lens Reticle Brackets (CCTV Camera) ── */}
                        {idx === 1 && (
                          <>
                            {/* Orbiting Surveillance Target Crosshair Reticle */}
                            <div className="anim-circle-orbit-ccw1 absolute text-[#e73455]">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="7" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                              </svg>
                            </div>

                            {/* Orbiting Corner Focus Box Bracket */}
                            <div className="anim-circle-orbit-ccw2 absolute text-[#3b82f6]">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                              </svg>
                            </div>

                            {/* Pop-Up Laser Scan Pulse Dot */}
                            <div className="anim-pop-spin-2 absolute -bottom-1 -left-1 text-[#9333ea]">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="8" />
                              </svg>
                            </div>
                          </>
                        )}

                        {/* ── ICON 2: Electric Lightning Bolt & Hexagon Security Badges (Shield) ── */}
                        {idx === 2 && (
                          <>
                            {/* Orbiting Electric Lightning Bolt */}
                            <div className="anim-circle-orbit-1 absolute text-[#e73455]">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                              </svg>
                            </div>

                            {/* Counter-Orbiting Security Hexagon Badge */}
                            <div className="anim-circle-orbit-2 absolute text-[#9333ea]">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
                              </svg>
                            </div>

                            {/* Pop-Up Verified Security Checkmark */}
                            <div className="anim-pop-spin-3 absolute top-0 -left-1 text-[#3b82f6]">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </div>
                          </>
                        )}

                        {/* ── ICON 3: Message Chat Bubbles & Audio Sound Frequency Waves (Headset) ── */}
                        {idx === 3 && (
                          <>
                            {/* Orbiting Customer Chat Speech Bubble */}
                            <div className="anim-circle-orbit-ccw1 absolute text-[#e73455]">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                              </svg>
                            </div>

                            {/* Counter-Orbiting Sound Wave Note */}
                            <div className="anim-circle-orbit-ccw2 absolute text-[#9333ea]">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                            </div>

                            {/* Top Pop-Up Broadcast Pulse Rings */}
                            <div className="anim-pop-spin-1 absolute -top-1 left-1 text-[#e73455]">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M2 12a10 10 0 0 1 20 0M6 12a6 6 0 0 1 12 0" strokeLinecap="round" />
                              </svg>
                            </div>
                          </>
                        )}
                      </div>

                      {/* ── FOREGROUND ICON (LAYERED AT Z-10 IN FRONT OF SPARKLES) ── */}
                      <div className={`${stat.animClass} relative z-10 flex items-center justify-center`}>
                        <stat.Icon size={28} />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="text-xl sm:text-2xl font-black text-[#12182b] leading-none tracking-tight">
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-xs sm:text-[13px] text-[#6b7280] font-medium text-center leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

