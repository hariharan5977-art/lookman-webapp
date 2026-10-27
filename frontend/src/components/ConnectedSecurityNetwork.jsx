import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Users, 
  Settings, 
  Wifi, 
  Factory, 
  Building2, 
  Shield, 
  Check 
} from 'lucide-react';

export default function ConnectedSecurityNetwork() {
  const containerRef = useRef(null);
  const pathRefs = useRef([]);
  const pulseDotRef = useRef(null);
  const pulseGlowRef = useRef(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [reactingNode, setReactingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // 6 Radially Positioned Nodes
  // Coordinate Space: 560 x 500 (Center at 280, 240)
  const NODES = [
    {
      id: 'surveillance',
      label: 'Surveillance',
      isSplitLabel: false,
      Icon: Camera,
      circlePos: { x: 280, y: 52 },
      labelPos: { x: 280, y: 22 },
      connectionPoint: { x: 280, y: 76 },
      // Center (280, 196) -> Node (280, 76)
      pathD: 'M 280 196 C 274 155, 286 115, 280 76',
    },
    {
      id: 'communities',
      label: 'Communities',
      isSplitLabel: false,
      Icon: Users,
      circlePos: { x: 456, y: 112 },
      labelPos: { x: 456, y: 144 },
      connectionPoint: { x: 435, y: 126 },
      // Center (314, 214) -> Node (435, 126)
      pathD: 'M 314 214 C 365 210, 405 175, 435 126',
    },
    {
      id: 'critical-infrastructure',
      label: 'Critical Infrastructure',
      isSplitLabel: true,
      labelLine1: 'Critical',
      labelLine2: 'Infrastructure',
      Icon: Settings,
      circlePos: { x: 456, y: 368 },
      labelPos: { x: 456, y: 398 },
      connectionPoint: { x: 435, y: 354 },
      // Center (314, 266) -> Node (435, 354)
      pathD: 'M 314 266 C 365 270, 405 305, 435 354',
    },
    {
      id: 'smart-cities',
      label: 'Smart Cities',
      isSplitLabel: false,
      Icon: Wifi,
      circlePos: { x: 280, y: 428 },
      labelPos: { x: 280, y: 460 },
      connectionPoint: { x: 280, y: 404 },
      // Center (280, 284) -> Node (280, 404)
      pathD: 'M 280 284 C 286 325, 274 365, 280 404',
    },
    {
      id: 'industrial',
      label: 'Industrial',
      isSplitLabel: false,
      Icon: Factory,
      circlePos: { x: 104, y: 368 },
      labelPos: { x: 104, y: 398 },
      connectionPoint: { x: 125, y: 354 },
      // Center (246, 266) -> Node (125, 354)
      pathD: 'M 246 266 C 195 270, 155 305, 125 354',
    },
    {
      id: 'commercial',
      label: 'Commercial',
      isSplitLabel: false,
      Icon: Building2,
      circlePos: { x: 104, y: 112 },
      labelPos: { x: 104, y: 144 },
      connectionPoint: { x: 125, y: 126 },
      // Center (246, 214) -> Node (125, 126)
      pathD: 'M 246 214 C 195 210, 155 175, 125 126',
    },
  ];

  // IntersectionObserver for initial viewport entrance (trigger at 25-35%)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequential 60fps Data Pulse Animation via requestAnimationFrame
  useEffect(() => {
    if (!isRevealed) return;

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let startTime = null;
    let rafId = null;

    const TRAVEL_DUR = 1100; // ms to travel along the curved path
    const NODE_GLOW_DUR = 450; // ms node responds with glow
    const STEP_INTERVAL = 1450; // ms between each node in sequence
    const CYCLE_PAUSE = 850; // pause after all 6 finish
    const TOTAL_CYCLE = 6 * STEP_INTERVAL + CYCLE_PAUSE; // 9550ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % TOTAL_CYCLE;

      let currentPulseActive = false;
      let activeNodeIndex = -1;

      for (let i = 0; i < 6; i++) {
        const stepStart = i * STEP_INTERVAL;
        const stepEnd = stepStart + TRAVEL_DUR;
        const glowEnd = stepEnd + NODE_GLOW_DUR;

        // Pulse travelling along path i
        if (elapsed >= stepStart && elapsed < stepEnd) {
          currentPulseActive = true;
          const progress = (elapsed - stepStart) / TRAVEL_DUR;
          // Smooth biological data flow easing
          const eased =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const pathEl = pathRefs.current[i];
          if (pathEl && pulseDotRef.current && pulseGlowRef.current) {
            const totalLen = pathEl.getTotalLength();
            const point = pathEl.getPointAtLength(eased * totalLen);

            pulseDotRef.current.setAttribute('cx', point.x.toFixed(2));
            pulseDotRef.current.setAttribute('cy', point.y.toFixed(2));
            pulseDotRef.current.setAttribute('opacity', '1');

            pulseGlowRef.current.setAttribute('cx', point.x.toFixed(2));
            pulseGlowRef.current.setAttribute('cy', point.y.toFixed(2));
            pulseGlowRef.current.setAttribute('opacity', '0.6');
          }
        }

        // Destination node response window
        if (elapsed >= stepEnd - 40 && elapsed < glowEnd) {
          activeNodeIndex = i;
        }
      }

      if (!currentPulseActive && pulseDotRef.current && pulseGlowRef.current) {
        pulseDotRef.current.setAttribute('opacity', '0');
        pulseGlowRef.current.setAttribute('opacity', '0');
      }

      setReactingNode((prev) => (prev !== activeNodeIndex ? activeNodeIndex : prev));

      rafId = requestAnimationFrame(animate);
    };

    // Wait 1.4s for the outward line drawing to complete before launching data pulses
    const startTimer = setTimeout(() => {
      rafId = requestAnimationFrame(animate);
    }, 1400);

    return () => {
      clearTimeout(startTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[540px] aspect-[560/500] mx-auto select-none overflow-visible flex items-center justify-center"
    >
      {/* ── CSS Keyframe Styles for Breathing & Radar Rings ── */}
      <style>{`
        @keyframes hubShieldBreathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.05)) drop-shadow(0 0 0px rgba(239, 30, 40, 0));
          }
          40% {
            transform: scale(1.012);
            filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.06)) drop-shadow(0 0 10px rgba(239, 30, 40, 0.18));
          }
          55% {
            transform: scale(1.025);
            filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.08)) drop-shadow(0 0 18px rgba(239, 30, 40, 0.28));
          }
          70% {
            transform: scale(1.008);
            filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.06)) drop-shadow(0 0 8px rgba(239, 30, 40, 0.14));
          }
        }

        @keyframes radarExpand {
          0% {
            r: 44px;
            opacity: 0.22;
            stroke-width: 1.5px;
          }
          100% {
            r: 80px;
            opacity: 0;
            stroke-width: 0.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .no-reduced-motion {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ── SVG Master Overlay (ViewBox: 560 x 500) ── */}
      <svg
        viewBox="0 0 560 500"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Technical Grid Pattern */}
          <pattern id="tech-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="0.8" fill="#ef1e28" opacity="0.04" />
          </pattern>

          {/* Hub & Node Soft Shadow Filter */}
          <filter id="hub-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.06" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#ef1e28" floodOpacity="0.10" />
          </filter>

          <filter id="node-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.06" />
          </filter>

          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef1e28" floodOpacity="0.32" />
          </filter>

          {/* Data Pulse Glow Filter */}
          <filter id="pulse-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. SUBTLE TECHNICAL BACKGROUND (Opacity: 0.035 - 0.05) ── */}
        <rect width="560" height="500" fill="url(#tech-dots)" />

        {/* Faint Concentric Coordinate Rings around Center (280, 240) */}
        <circle cx="280" cy="240" r="130" fill="none" stroke="#ef1e28" strokeWidth="0.8" opacity="0.035" />
        <circle cx="280" cy="240" r="195" fill="none" stroke="#ef1e28" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.03" />

        {/* Subtle Crosshairs */}
        <line x1="280" y1="135" x2="280" y2="155" stroke="#ef1e28" strokeWidth="0.8" opacity="0.08" />
        <line x1="280" y1="325" x2="280" y2="345" stroke="#ef1e28" strokeWidth="0.8" opacity="0.08" />
        <line x1="175" y1="240" x2="195" y2="240" stroke="#ef1e28" strokeWidth="0.8" opacity="0.08" />
        <line x1="365" y1="240" x2="385" y2="240" stroke="#ef1e28" strokeWidth="0.8" opacity="0.08" />

        {/* ── 2. CURVED BEZIER CONNECTION LINES (Center -> Nodes) ── */}
        {NODES.map((node, i) => {
          const isHovered = hoveredNode === i;
          return (
            <path
              key={`path-${node.id}`}
              ref={(el) => (pathRefs.current[i] = el)}
              d={node.pathD}
              fill="none"
              stroke={isHovered ? 'rgba(239, 30, 40, 0.75)' : 'rgba(239, 30, 40, 0.26)'}
              strokeWidth={isHovered ? 1.8 : 1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 320,
                strokeDashoffset: isRevealed ? 0 : 320,
                transition: `stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1) ${
                  0.12 + i * 0.09
                }s, stroke 0.25s ease, stroke-width 0.25s ease`,
              }}
            />
          );
        })}

        {/* ── 3. TRAVELLING DATA PULSE (Follows curved path via requestAnimationFrame) ── */}
        {/* Outer Glow Halo */}
        <circle
          ref={pulseGlowRef}
          r="6.5"
          fill="#ef1e28"
          opacity="0"
          filter="url(#pulse-glow)"
          pointerEvents="none"
        />
        {/* Core Sharp Pulse */}
        <circle
          ref={pulseDotRef}
          r="3.2"
          fill="#ffffff"
          stroke="#ef1e28"
          strokeWidth="1.6"
          opacity="0"
          pointerEvents="none"
        />

        {/* ── 4. SMALL CONNECTION POINTS NEAR NODES ── */}
        {NODES.map((node, i) => {
          const isReacting = reactingNode === i;
          const isHovered = hoveredNode === i;
          return (
            <circle
              key={`point-${node.id}`}
              cx={node.connectionPoint.x}
              cy={node.connectionPoint.y}
              r={isReacting ? 3.4 : isHovered ? 3.2 : 2.4}
              fill="#ef1e28"
              opacity={isReacting || isHovered ? 1 : 0.5}
              style={{
                transition: 'all 0.3s ease',
                filter: isReacting || isHovered ? 'drop-shadow(0 0 4px rgba(239, 30, 40, 0.8))' : 'none',
              }}
            />
          );
        })}

        {/* ── 5. CENTER SECURITY HUB ── */}
        {/* Concentric Static Rings around Hub */}
        <circle cx="280" cy="240" r="54" fill="none" stroke="rgba(239, 30, 40, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="280" cy="240" r="68" fill="none" stroke="rgba(239, 30, 40, 0.08)" strokeWidth="1" />
        <circle cx="280" cy="240" r="82" fill="none" stroke="rgba(239, 30, 40, 0.04)" strokeWidth="1" />

        {/* Center Radar Rings (Very subtle radar transmission pulse) */}
        {isRevealed && (
          <>
            <circle
              cx="280"
              cy="240"
              r="44"
              fill="none"
              stroke="#ef1e28"
              className="no-reduced-motion"
              style={{
                animation: 'radarExpand 2.6s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
                animationDelay: '0s',
                pointerEvents: 'none',
              }}
            />
            <circle
              cx="280"
              cy="240"
              r="44"
              fill="none"
              stroke="#ef1e28"
              className="no-reduced-motion"
              style={{
                animation: 'radarExpand 2.6s cubic-bezier(0.2, 0.6, 0.35, 1) infinite',
                animationDelay: '0.9s',
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Center Security Hub Group with Soft Breathing Animation */}
        <g
          className="no-reduced-motion"
          style={{
            transformOrigin: '280px 240px',
            animation: isRevealed ? 'hubShieldBreathe 2.8s ease-in-out infinite' : 'none',
          }}
        >
          {/* Outer Hub Ring */}
          <circle
            cx="280"
            cy="240"
            r="44"
            fill="#ffffff"
            stroke="rgba(239, 30, 40, 0.18)"
            strokeWidth="1.5"
            filter="url(#hub-shadow)"
          />

          {/* Inner Circular Well */}
          <circle
            cx="280"
            cy="240"
            r="38"
            fill="#fafafb"
            stroke="rgba(239, 30, 40, 0.08)"
            strokeWidth="1"
          />

          {/* Center Shield Icon + Checkmark */}
          {/* Rendered cleanly via SVG path or embedded icons */}
          <g transform="translate(259, 219)">
            <Shield size={42} color="#ef1e28" strokeWidth={1.8} fill="rgba(239, 30, 40, 0.03)" />
          </g>
          <g transform="translate(271, 231)">
            <Check size={18} color="#ef1e28" strokeWidth={2.6} />
          </g>
        </g>

        {/* ── 6. SIX SURROUNDING NODES ── */}
        {NODES.map((node, i) => {
          const isReacting = reactingNode === i;
          const isHovered = hoveredNode === i;
          const IconComp = node.Icon;

          return (
            <g
              key={`node-${node.id}`}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
              style={{
                transformOrigin: `${node.circlePos.x}px ${node.circlePos.y}px`,
                transform: isHovered
                  ? 'translateY(-2px)'
                  : isReacting
                  ? 'scale(1.035)'
                  : 'scale(1)',
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Soft Red Glow Halo behind Node upon Data Arrival */}
              <circle
                cx={node.circlePos.x}
                cy={node.circlePos.y}
                r="28"
                fill="none"
                stroke="#ef1e28"
                strokeWidth={isReacting ? 1.5 : 0}
                opacity={isReacting ? 0.35 : 0}
                filter="url(#node-glow)"
                style={{ transition: 'opacity 0.35s ease, stroke-width 0.35s ease' }}
              />

              {/* White Circular Node Base */}
              <circle
                cx={node.circlePos.x}
                cy={node.circlePos.y}
                r="22"
                fill="#ffffff"
                stroke={isHovered || isReacting ? '#ef1e28' : 'rgba(226, 232, 240, 0.9)'}
                strokeWidth={isHovered || isReacting ? 1.5 : 1}
                filter="url(#node-shadow)"
                style={{
                  transition: 'stroke 0.25s ease, stroke-width 0.25s ease',
                }}
              />

              {/* Node Icon */}
              <g transform={`translate(${node.circlePos.x - 10}, ${node.circlePos.y - 10})`}>
                <IconComp
                  size={20}
                  color={isHovered || isReacting ? '#ef1e28' : '#475569'}
                  strokeWidth={1.8}
                  style={{ transition: 'color 0.25s ease' }}
                />
              </g>

              {/* Node Text Label */}
              {node.isSplitLabel ? (
                <text
                  x={node.labelPos.x}
                  y={node.labelPos.y}
                  textAnchor="middle"
                  className="font-heading font-bold text-[11px] select-none"
                  fill={isHovered || isReacting ? '#ef1e28' : '#1e293b'}
                  style={{ transition: 'fill 0.25s ease' }}
                >
                  <tspan x={node.labelPos.x} dy="0">
                    {node.labelLine1}
                  </tspan>
                  <tspan x={node.labelPos.x} dy="13">
                    {node.labelLine2}
                  </tspan>
                </text>
              ) : (
                <text
                  x={node.labelPos.x}
                  y={node.labelPos.y}
                  textAnchor="middle"
                  className="font-heading font-bold text-[12px] select-none"
                  fill={isHovered || isReacting ? '#ef1e28' : '#1e293b'}
                  style={{ transition: 'fill 0.25s ease' }}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* ── 7. BOTTOM-LEFT TEXT (Unanimated, Thin Vertical Red Line) ── */}
      <div className="absolute bottom-2 left-3 sm:bottom-4 sm:left-5 flex items-center gap-2.5 select-none pointer-events-none z-20">
        <div className="w-[2px] h-7 bg-[#ef1e28] rounded-full shrink-0" />
        <div className="text-left leading-tight">
          <div className="text-[12px] sm:text-[13px] font-heading font-bold text-slate-800 tracking-tight">
            Connected Security
          </div>
          <div className="text-[10px] sm:text-[11px] font-body text-slate-500 font-medium mt-0.5">
            for a Safer India
          </div>
        </div>
      </div>
    </div>
  );
}
