import React, { useState, useEffect, useRef } from 'react';
import indiaMapData from '@svg-maps/india';

// Extract the locations array safely across ES / CJS builds
const rawMap = indiaMapData.locations ? indiaMapData : (indiaMapData.default || indiaMapData);
const LOCATIONS = rawMap.locations || [];
const VIEW_BOX = rawMap.viewBox || '0 0 612 696';

// Precise city coordinates, dealer phone numbers & majestic cubic bezier conduits
const HUBS = {
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    label: 'Chennai HQ',
    state: 'Tamil Nadu',
    stateId: 'tn',
    phone: '+91 44 4798 2947',
    x: 242,
    y: 564,
    isHQ: true,
    labelPos: 'right',
  },
  gujarat: {
    id: 'gujarat',
    name: 'Gujarat',
    label: 'Gujarat',
    state: 'Gujarat',
    stateId: 'gj',
    phone: '+91 79 4798 2941',
    x: 78,
    y: 352,
    c1: { x: 145, y: 505 },
    c2: { x: 95, y: 430 },
    labelPos: 'left',
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi',
    label: 'Delhi',
    state: 'Delhi NCR',
    stateId: 'dl',
    phone: '+91 11 4798 2940',
    x: 186,
    y: 210,
    c1: { x: 175, y: 460 },
    c2: { x: 160, y: 320 },
    labelPos: 'top',
  },
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    label: 'Bengaluru',
    state: 'Karnataka',
    stateId: 'ka',
    phone: '+91 80 4798 2942',
    x: 192,
    y: 565,
    c1: { x: 228, y: 584 },
    c2: { x: 206, y: 584 },
    labelPos: 'bottom-left',
  },
  kerala: {
    id: 'kerala',
    name: 'Kerala',
    label: 'Kerala',
    state: 'Kerala',
    stateId: 'kl',
    phone: '+91 484 4798 2944',
    x: 164,
    y: 620,
    c1: { x: 226, y: 595 },
    c2: { x: 190, y: 630 },
    labelPos: 'left',
  },
  odisha: {
    id: 'odisha',
    name: 'Odisha',
    label: 'Odisha',
    state: 'Odisha',
    stateId: 'or',
    phone: '+91 674 4798 2945',
    x: 352,
    y: 415,
    c1: { x: 295, y: 535 },
    c2: { x: 340, y: 480 },
    labelPos: 'right',
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    label: 'Hyderabad',
    state: 'Telangana',
    stateId: 'tg',
    phone: '+91 40 4798 2943',
    x: 232,
    y: 468,
    c1: { x: 262, y: 524 },
    c2: { x: 256, y: 488 },
    labelPos: 'right',
  },
};

const CONNECTED_CITY_KEYS = ['gujarat', 'delhi', 'bengaluru', 'kerala', 'odisha', 'hyderabad'];

const CITY_PULSE_DELAYS = {
  delhi: 0,
  gujarat: 0.85,
  hyderabad: 1.7,
  bengaluru: 2.55,
  odisha: 3.4,
  kerala: 4.25,
};

const STATE_TO_HUB_KEY = {
  tn: 'chennai',
  gj: 'gujarat',
  dl: 'delhi',
  hr: 'delhi', // Haryana / Delhi NCR territory
  ka: 'bengaluru',
  kl: 'kerala',
  or: 'odisha',
  tg: 'hyderabad',
};

const HUB_TO_STATE_IDS = {
  chennai: ['tn'],
  gujarat: ['gj'],
  delhi: ['dl', 'hr'],
  bengaluru: ['ka'],
  kerala: ['kl'],
  odisha: ['or'],
  hyderabad: ['tg'],
};

export default function IndiaDistributionMap() {
  const [inView, setInView] = useState(false);
  const [activeHubKey, setActiveHubKey] = useState(null);
  const leaveTimerRef = useRef(null);
  const containerRef = useRef(null);

  const handleEnter = (hubKey) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (hubKey) {
      setActiveHubKey(hubKey);
    }
  };

  const handleLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setActiveHubKey(null);
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const hq = HUBS.chennai;
  const isAnyHovered = Boolean(activeHubKey);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* ─── Map Canvas (Transparent, Clean, No Background) ─── */}
      <div className="relative w-full max-w-[840px] lg:max-w-[900px] xl:max-w-[960px] mx-auto bg-transparent border-0 shadow-none p-0 overflow-visible">

        {/* ─── Real India SVG Map Container ─── */}
        <div className="relative w-full flex items-center justify-center py-0">
          <svg
            viewBox={VIEW_BOX}
            className="w-full h-auto max-h-[640px] lg:max-h-[700px] xl:max-h-[740px] select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="hqRadialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea0004" />
                <stop offset="100%" stopColor="#7a0006" />
              </linearGradient>

              {/* Ultra-smooth fiber conduit gradient */}
              <linearGradient id="laserCoreGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ea0004" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#dc2626" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.78" />
              </linearGradient>

              <radialGradient id="hqGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ea0004" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#ea0004" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ea0004" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="destGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ea0004" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ea0004" stopOpacity="0" />
              </radialGradient>

              {/* Premium Optical Bloom Filters */}
              <filter id="neonBloomFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Premium luminous ruby glass-fill gradient for highlighted states */}
              <linearGradient id="premiumStateHoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea0004" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#7a0006" stopOpacity="0.08" />
              </linearGradient>

              {/* Premium soft outer glow aura for highlighted state boundary */}
              <filter id="premiumStateGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ea0004" floodOpacity="0.55" />
              </filter>

              {/* Ultra-calm, slow keyframe animations (5.4s & 5.2s) */}
              <style>{`
                @keyframes pulseHQRing {
                  0%   { r: 8px; opacity: 0.9; stroke-width: 2px; }
                  50%  { r: 22px; opacity: 0.3; stroke-width: 1.2px; }
                  100% { r: 34px; opacity: 0; stroke-width: 0.4px; }
                }
                @keyframes pulseCityRing {
                  0%   { r: 6px; opacity: 0.85; stroke-width: 1.5px; }
                  60%  { r: 16px; opacity: 0.25; stroke-width: 1px; }
                  100% { r: 22px; opacity: 0; stroke-width: 0.4px; }
                }
                @keyframes slowLineBreathe {
                  0%, 100% { opacity: 0.18; }
                  50%      { opacity: 0.32; }
                }
                .hq-pulse-1 {
                  animation: pulseHQRing 5.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }
                .hq-pulse-2 {
                  animation: pulseHQRing 5.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                  animation-delay: 2.7s;
                }
                .city-pulse-anim {
                  animation: pulseCityRing 5.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }
                .ambient-line-breathe {
                  animation: slowLineBreathe 6.5s ease-in-out infinite;
                }
              `}</style>
            </defs>

            {/* ─── REAL INDIA STATES (Uniform Dark Outlines, ONLY Dealer States Highlight) ─── */}
            <g id="india-states-layer">
              {LOCATIONS.map((loc) => {
                const hubKey = STATE_TO_HUB_KEY[loc.id];
                const isDealerState = Boolean(hubKey);
                const isHighlighted = Boolean(
                  activeHubKey && HUB_TO_STATE_IDS[activeHubKey]?.includes(loc.id)
                );

                return (
                  <path
                    key={loc.id}
                    id={`state-${loc.id}`}
                    d={loc.path}
                    fill={isHighlighted ? 'url(#premiumStateHoverGrad)' : 'transparent'}
                    stroke={isHighlighted ? '#ea0004' : '#475569'}
                    strokeWidth={isHighlighted ? '1.8' : '1.1'}
                    strokeLinejoin="round"
                    style={{
                      transition: 'fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease',
                      filter: isHighlighted ? 'url(#premiumStateGlow)' : 'none',
                    }}
                    className={isDealerState ? 'cursor-pointer' : 'cursor-default'}
                    onMouseEnter={() => {
                      if (isDealerState) {
                        handleEnter(hubKey);
                      }
                    }}
                    onMouseLeave={() => {
                      if (isDealerState) {
                        handleLeave();
                      }
                    }}
                  >
                    <title>{loc.name}</title>
                  </path>
                );
              })}
            </g>

            {/* ─── ULTRA-PREMIUM CONNECTING LINES FROM CHENNAI HQ (NO RUNNING DOTS) ─── */}
            <g id="connection-lines-layer" pointerEvents="none">
              {CONNECTED_CITY_KEYS.map((cityKey) => {
                const city = HUBS[cityKey];
                const dPath = `M ${hq.x} ${hq.y} C ${city.c1.x} ${city.c1.y}, ${city.c2.x} ${city.c2.y}, ${city.x} ${city.y}`;
                const isHovered = activeHubKey === cityKey;
                const isDimmed = isAnyHovered && !isHovered;

                return (
                  <g key={`conn-${cityKey}`} className="transition-all duration-300">
                    {/* Layer 1: Atmospheric Soft Neon Bloom Glow */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke="#ea0004"
                      strokeWidth={isHovered ? '6' : '3.6'}
                      strokeOpacity={isHovered ? '0.5' : isDimmed ? '0.06' : '0.22'}
                      strokeLinecap="round"
                      filter="url(#neonBloomFilter)"
                      className="ambient-line-breathe transition-all duration-300"
                    />

                    {/* Layer 2: Precision Fiber Laser Core */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke="url(#laserCoreGrad)"
                      strokeWidth={isHovered ? '2.4' : '1.6'}
                      strokeOpacity={isHovered ? '1' : isDimmed ? '0.22' : '0.82'}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    {/* Layer 3: Ultra-fine Luminous Optical Fiber Core */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={isHovered ? '1.0' : '0.6'}
                      strokeOpacity={isHovered ? '0.85' : isDimmed ? '0.1' : '0.45'}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </g>

            {/* ─── DESTINATION CITY NODES & LABELS ─── */}
            <g id="destination-cities-layer">
              {CONNECTED_CITY_KEYS.map((cityKey) => {
                const city = HUBS[cityKey];
                const isHovered = activeHubKey === cityKey;

                // Label positioning calculation
                let tx = city.x + 10;
                let ty = city.y + 4;
                let anchor = 'start';

                if (city.labelPos === 'left') {
                  tx = city.x - 10;
                  anchor = 'end';
                } else if (city.labelPos === 'top') {
                  tx = city.x;
                  ty = city.y - 10;
                  anchor = 'middle';
                } else if (city.labelPos === 'bottom-left') {
                  tx = city.x - 10;
                  ty = city.y + 12;
                  anchor = 'end';
                }

                return (
                  <g
                    key={`node-${cityKey}`}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => handleEnter(cityKey)}
                    onMouseLeave={handleLeave}
                    onClick={() => {
                      window.location.href = `tel:${city.phone.replace(/\s+/g, '')}`;
                    }}
                  >
                    {/* Generous invisible hover target */}
                    <circle cx={city.x} cy={city.y} r="25" fill="transparent" />

                    {/* Radial aura glow */}
                    <circle cx={city.x} cy={city.y} r={isHovered ? '20' : '16'} fill="url(#destGlowGrad)" opacity={inView ? 0.95 : 0} pointerEvents="none" />

                    {/* Pulsing beacon ring (Slow 5.2s breathing ripple) */}
                    {inView && (
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="6"
                        fill="none"
                        stroke="#ea0004"
                        strokeWidth="1.3"
                        className="city-pulse-anim"
                        style={{ animationDelay: `${CITY_PULSE_DELAYS[cityKey]}s` }}
                        pointerEvents="none"
                      />
                    )}

                    {/* Solid node outer ring */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isHovered ? '7.5' : '6.5'}
                      fill="#ffffff"
                      stroke="#ea0004"
                      strokeWidth={isHovered ? 3 : 2.2}
                      style={{
                        filter: isHovered ? 'drop-shadow(0 0 10px rgba(234,0,4,0.85))' : 'none',
                      }}
                      pointerEvents="none"
                    />

                    {/* Inner core dot */}
                    <circle cx={city.x} cy={city.y} r={isHovered ? '3.5' : '3'} fill="#ea0004" pointerEvents="none" />

                    {/* Default City Label (Only shown when not showing the phone tooltip) */}
                    {!isHovered && (
                      <g transform={`translate(${tx}, ${ty})`} pointerEvents="none">
                        <rect
                          x={anchor === 'end' ? -68 : anchor === 'middle' ? -34 : -4}
                          y="-12"
                          width="72"
                          height="17"
                          rx="4"
                          fill="white"
                          fillOpacity="0.9"
                          stroke="#e2e8f0"
                          strokeWidth="0.5"
                        />
                        <text
                          x={anchor === 'end' ? -32 : anchor === 'middle' ? 2 : 32}
                          y="0"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="800"
                          fontFamily="'Outfit', sans-serif"
                          fill="#12182b"
                          letterSpacing="0.2"
                        >
                          {city.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ─── CHENNAI HQ CENTRAL BEACON (PROMINENT) ─── */}
            <g
              id="chennai-hq-layer"
              className="cursor-pointer"
              onMouseEnter={() => handleEnter('chennai')}
              onMouseLeave={handleLeave}
              onClick={() => {
                window.location.href = `tel:${hq.phone.replace(/\s+/g, '')}`;
              }}
            >
              {/* Generous invisible hover target */}
              <circle cx={hq.x} cy={hq.y} r="34" fill="transparent" />

              {/* Massive Outer Radial Glow */}
              <circle cx={hq.x} cy={hq.y} r="34" fill="url(#hqGlowGrad)" pointerEvents="none" />

              {/* Pulsing Concentric Rings */}
              {inView && (
                <>
                  <circle cx={hq.x} cy={hq.y} r="10" fill="none" stroke="#ea0004" className="hq-pulse-1" pointerEvents="none" />
                  <circle cx={hq.x} cy={hq.y} r="10" fill="none" stroke="#ea0004" className="hq-pulse-2" pointerEvents="none" />
                </>
              )}

              {/* HQ Outer Solid Disc */}
              <circle
                cx={hq.x}
                cy={hq.y}
                r="10"
                fill="url(#hqRadialGrad)"
                stroke="#ffffff"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(234,0,4,0.6))',
                }}
                pointerEvents="none"
              />

              {/* HQ White Inner Center Core */}
              <circle cx={hq.x} cy={hq.y} r="3.5" fill="#ffffff" pointerEvents="none" />

              {/* Default HQ Label (Only shown when not hovered) */}
              {activeHubKey !== 'chennai' && (
                <g transform={`translate(${hq.x + 16}, ${hq.y - 4})`} pointerEvents="none">
                  <rect
                    x="-2"
                    y="-14"
                    width="88"
                    height="28"
                    rx="6"
                    fill="#12182b"
                    stroke="#ea0004"
                    strokeWidth="1.2"
                    style={{
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
                    }}
                  />
                  <text
                    x="42"
                    y="-1"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="900"
                    fontFamily="'Outfit', sans-serif"
                    fill="#ffffff"
                  >
                    CHENNAI HQ
                  </text>
                  <text
                    x="42"
                    y="10"
                    textAnchor="middle"
                    fontSize="7.5"
                    fontWeight="600"
                    fontFamily="'Inter', sans-serif"
                    fill="#fca5a5"
                  >
                    Dispatch Center
                  </text>
                </g>
              )}
            </g>

            {/* ─── HOVER TOOLTIP: ONLY THE DEALER'S PHONE NUMBER ALONE AT THAT POINT ─── */}
            {activeHubKey && HUBS[activeHubKey] && (() => {
              const hub = HUBS[activeHubKey];
              // Position tooltip cleanly above the point
              const isTop = hub.y < 240;
              const tipY = isTop ? hub.y + 28 : hub.y - 24;
              const arrowPoints = isTop
                ? `${hub.x - 5},${tipY - 14} ${hub.x + 5},${tipY - 14} ${hub.x},${tipY - 19}`
                : `${hub.x - 5},${tipY + 14} ${hub.x + 5},${tipY + 14} ${hub.x},${tipY + 19}`;

              return (
                <g
                  id="dealer-phone-tooltip"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => handleEnter(activeHubKey)}
                  onMouseLeave={handleLeave}
                  onClick={() => {
                    window.location.href = `tel:${hub.phone.replace(/\s+/g, '')}`;
                  }}
                  style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.32))' }}
                >
                  {/* Arrow pointer toward the city point */}
                  <polygon points={arrowPoints} fill="#12182b" />

                  {/* Dark high-contrast pill */}
                  <rect
                    x={hub.x - 72}
                    y={tipY - 14}
                    width="144"
                    height="28"
                    rx="14"
                    fill="#12182b"
                    stroke="#ea0004"
                    strokeWidth="1.5"
                  />

                  {/* Phone icon */}
                  <g transform={`translate(${hub.x - 58}, ${tipY - 6.5})`}>
                    <path
                      d="M2.5 1 C2 1 1.5 1.5 1.5 2 C1.5 7.8 6.2 12.5 12 12.5 C12.5 12.5 13 12 13 11.5 L11 8.8 C10.8 8.5 10.4 8.4 10.1 8.6 L8.8 9.5 C7 8.4 5.6 7 4.5 5.2 L5.4 3.9 C5.6 3.6 5.5 3.2 5.2 3 L2.5 1 Z"
                      fill="#ea0004"
                    />
                  </g>

                  {/* ONLY THE PHONE NUMBER */}
                  <text
                    x={hub.x + 8}
                    y={tipY + 4}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="800"
                    fontFamily="'Outfit', sans-serif"
                    fill="#ffffff"
                    letterSpacing="0.4"
                  >
                    {hub.phone}
                  </text>
                </g>
              );
            })()}

          </svg>
        </div>

      </div>
    </div>
  );
}
