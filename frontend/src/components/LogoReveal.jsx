import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Moon, Sun, X } from 'lucide-react';
import lookmanContours from '../assets/lookman_contours.json';

// Authentic Vector Paths for LOOKMAN Logo
const L_BAR_PATH = "M 0.0,1.5 L 34.5,2.0 L 35.0,112.5 L 717.0,112.5 L 717.0,137.5 L 0.0,137.5 Z";
const O1_PATH = `${lookmanContours.O1_outer[0]} ${lookmanContours.O1_inner[0]}`;
const O2_PATH = `${lookmanContours.O2_outer[0]} ${lookmanContours.O2_inner[0]}`;
const K_PATH = lookmanContours.K[0];
const M_PATH = lookmanContours.M[0];
const A_PATH = lookmanContours.A[0];
const N_PATH = lookmanContours.N[0];
const SLOGAN_PATH = lookmanContours.slogan.join(" ");

// Letter Tracing Segments in Natural Sequence: L -> O -> O -> K -> M -> A -> N
const LETTER_SEGMENTS = [
  {
    id: 'L',
    name: 'L',
    path: "M 17.2,2.0 L 17.2,125.0 L 45.0,125.0",
    strokeWidth: 46,
    xRange: [0, 45]
  },
  {
    id: 'O1',
    name: 'O',
    path: "M 109.0,1.0 C 136,1 158.5,23 158.5,50 C 158.5,78 136,100.5 109.0,100.5 C 82,100.5 59.5,78 59.5,50 C 59.5,23 82,1 109.0,1.0",
    strokeWidth: 50,
    xRange: [59, 159]
  },
  {
    id: 'O2',
    name: 'O',
    path: "M 216.0,1.0 C 243,1 265.5,23 265.5,50 C 265.5,78 243,100.5 216.0,100.5 C 189,100.5 166.5,78 166.5,50 C 166.5,23 189,1 216.0,1.0",
    strokeWidth: 50,
    xRange: [166, 266]
  },
  {
    id: 'K',
    name: 'K',
    path: "M 294.0,1.5 L 294.0,98.5 L 294.0,52.0 L 372.0,1.5 L 320.0,48.0 L 375.0,98.5",
    strokeWidth: 48,
    xRange: [276, 376]
  },
  {
    id: 'M',
    name: 'M',
    path: "M 397.0,98.5 L 397.0,1.5 L 445.0,85.0 L 491.0,1.5 L 491.0,98.5",
    strokeWidth: 50,
    xRange: [381, 507]
  },
  {
    id: 'A',
    name: 'A',
    path: "M 530.0,98.5 L 564.5,1.5 L 600.0,98.5",
    strokeWidth: 50,
    xRange: [512, 617]
  },
  {
    id: 'N',
    name: 'N',
    path: "M 637.0,98.5 L 637.0,1.5 L 695.0,98.5 L 702.0,2.0",
    strokeWidth: 48,
    xRange: [621, 717]
  }
];

export default function LogoReveal({ 
  onClose, 
  autoPlay = true, 
  isModal = false,
  showControls = true 
}) {
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [duration, setDuration] = useState(2600); // default 2.6s

  // SVG references
  const svgRef = useRef(null);
  const segmentRefs = useRef({});
  const maskRefs = useRef({});
  const baselineClipRef = useRef(null);
  const sparkleRef = useRef(null);
  const trailRef = useRef(null);
  const animFrameRef = useRef(null);
  const trailHistoryRef = useRef([]);

  // Calculate segment lengths once on mount
  const segmentLengthsRef = useRef({});
  const totalLengthRef = useRef(0);

  const initPathLengths = useCallback(() => {
    let sum = 0;
    LETTER_SEGMENTS.forEach((seg) => {
      const el = segmentRefs.current[seg.id];
      if (el) {
        const len = el.getTotalLength();
        segmentLengthsRef.current[seg.id] = len;
        sum += len;
      }
    });
    totalLengthRef.current = sum;
  }, []);

  const playReveal = useCallback((animDuration = duration) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsPlaying(true);
    setIsCompleted(false);
    trailHistoryRef.current = [];

    // Ensure path lengths are initialized
    initPathLengths();
    const totalLen = totalLengthRef.current || 2400;

    // Reset all letter mask strokes to hidden
    LETTER_SEGMENTS.forEach((seg) => {
      const maskEl = maskRefs.current[seg.id];
      const segLen = segmentLengthsRef.current[seg.id] || 300;
      if (maskEl) {
        maskEl.style.strokeDasharray = `${segLen}px`;
        maskEl.style.strokeDashoffset = `${segLen}px`;
        maskEl.style.opacity = '1';
      }
    });

    // Reset baseline bar clip
    if (baselineClipRef.current) {
      baselineClipRef.current.setAttribute('width', '0');
    }

    const startTime = performance.now();

    const updateFrame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animDuration, 1.0);

      // Luxury easeInOut cubic profile
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Determine where the star is along the global sequence
      const targetDistance = ease * totalLen;

      let accumulated = 0;
      let activeSeg = LETTER_SEGMENTS[0];
      let distInSeg = 0;
      let segIndex = 0;

      for (let i = 0; i < LETTER_SEGMENTS.length; i++) {
        const seg = LETTER_SEGMENTS[i];
        const segLen = segmentLengthsRef.current[seg.id] || 300;

        if (accumulated + segLen >= targetDistance || i === LETTER_SEGMENTS.length - 1) {
          activeSeg = seg;
          distInSeg = Math.max(0, Math.min(targetDistance - accumulated, segLen));
          segIndex = i;
          break;
        }
        accumulated += segLen;
      }

      // 1. Reveal letters that have already been completely traversed
      for (let i = 0; i < segIndex; i++) {
        const prevSeg = LETTER_SEGMENTS[i];
        const prevMask = maskRefs.current[prevSeg.id];
        if (prevMask) {
          prevMask.style.strokeDashoffset = '0px';
        }
      }

      // 2. Reveal current active letter progressively
      const activeMask = maskRefs.current[activeSeg.id];
      const activeSegLen = segmentLengthsRef.current[activeSeg.id] || 300;
      if (activeMask) {
        const remainingOffset = Math.max(0, activeSegLen - distInSeg);
        activeMask.style.strokeDashoffset = `${remainingOffset}px`;
      }

      // 3. Keep future letters hidden
      for (let i = segIndex + 1; i < LETTER_SEGMENTS.length; i++) {
        const futureSeg = LETTER_SEGMENTS[i];
        const futureMask = maskRefs.current[futureSeg.id];
        const futureLen = segmentLengthsRef.current[futureSeg.id] || 300;
        if (futureMask) {
          futureMask.style.strokeDashoffset = `${futureLen}px`;
        }
      }

      // 4. Update the star's current coordinates
      const pathEl = segmentRefs.current[activeSeg.id];
      let starX = 17.2;
      let starY = 2.0;

      if (pathEl) {
        const pt = pathEl.getPointAtLength(distInSeg);
        starX = pt.x;
        starY = pt.y;
      }

      // Position the sparkle head
      if (sparkleRef.current) {
        sparkleRef.current.setAttribute('transform', `translate(${starX}, ${starY})`);
      }

      // 5. Expand the baseline bar progressively with horizontal travel
      if (baselineClipRef.current) {
        const maxX = Math.max(35, Math.min(starX + 15, 718));
        baselineClipRef.current.setAttribute('width', `${maxX}`);
      }

      // 6. Draw the fading comet light trail behind the sparkle
      if (trailRef.current) {
        const history = trailHistoryRef.current;
        history.push({ x: starX, y: starY, time: now });

        // Keep trail limited to last 160ms
        while (history.length > 1 && now - history[0].time > 160) {
          history.shift();
        }

        if (history.length >= 2) {
          const trailPoints = history.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ');
          trailRef.current.setAttribute('d', `M ${trailPoints}`);
          trailRef.current.setAttribute('opacity', '1');
        } else {
          trailRef.current.setAttribute('d', '');
        }
      }

      // Check if animation has reached completion
      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      } else {
        // Settle the star at the final apex of the letter 'N'
        if (sparkleRef.current) {
          sparkleRef.current.setAttribute('transform', 'translate(702.0, 2.0)');
        }
        // Fade out light trail
        if (trailRef.current) {
          trailRef.current.setAttribute('opacity', '0');
        }
        // Ensure baseline and all letters are 100% revealed
        if (baselineClipRef.current) {
          baselineClipRef.current.setAttribute('width', '718');
        }
        LETTER_SEGMENTS.forEach((seg) => {
          const m = maskRefs.current[seg.id];
          if (m) m.style.strokeDashoffset = '0px';
        });

        setIsPlaying(false);
        setIsCompleted(true);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);
  }, [duration, initPathLengths]);

  useEffect(() => {
    initPathLengths();
    if (autoPlay) {
      const timer = setTimeout(() => playReveal(duration), 150);
      return () => clearTimeout(timer);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoPlay, duration, initPathLengths, playReveal]);

  return (
    <div 
      className={`flex flex-col items-center justify-center select-none transition-colors duration-500 ${
        isModal 
          ? 'fixed inset-0 z-[99999] p-4 sm:p-8 backdrop-blur-2xl' 
          : 'relative w-full py-12 px-4'
      } ${
        theme === 'dark' 
          ? 'bg-[#050811]/98 text-white' 
          : 'bg-[#f8fafc]/98 text-gray-900 shadow-2xl'
      }`}
      style={isModal ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 } : {}}
    >
      {/* Optional Close Button for Modal */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          title="Close Logo Reveal"
        >
          <X size={20} />
        </button>
      )}

      {/* Subtle Ambient Background Glow */}
      <div 
        className={`absolute pointer-events-none rounded-full blur-[140px] transition-all duration-700 ${
          theme === 'dark'
            ? 'w-[550px] h-[300px] bg-[#ea0004]/12 -top-20'
            : 'w-[450px] h-[250px] bg-[#ea0004]/06 -top-10'
        }`} 
      />

      {/* Main Centered Prominent Logo Reveal Stage */}
      <div className="relative z-10 w-full max-w-[860px] mx-auto flex flex-col items-center">
        
        {/* SVG Canvas for LOOKMAN Logo */}
        <div className="relative w-full aspect-[718/197] flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 718 197"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Authentic LOOKMAN Red Gradient */}
              <linearGradient id="lookman-red-reveal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff1e22" />
                <stop offset="28%" stopColor="#ea0004" />
                <stop offset="68%" stopColor="#aa0004" />
                <stop offset="100%" stopColor="#550002" />
              </linearGradient>

              {/* Fading Light Trail Gradient */}
              <linearGradient id="comet-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>

              {/* Sparkle Radial Glow Bloom */}
              <radialGradient id="sparkle-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              {/* Baseline Horizontal Bar Progressive Clip */}
              <clipPath id="baseline-clip">
                <rect ref={baselineClipRef} x="0" y="105" width="0" height="40" />
              </clipPath>

              {/* Letter Stroke Masks for Progressive Reveal */}
              {LETTER_SEGMENTS.map((seg) => (
                <mask key={seg.id} id={`mask-${seg.id}`}>
                  <path
                    ref={(el) => (maskRefs.current[seg.id] = el)}
                    d={seg.path}
                    fill="none"
                    stroke="white"
                    strokeWidth={seg.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </mask>
              ))}

              {/* Sparkle Head Definition */}
              <g id="sparkle-star-def">
                {/* Soft Radial Ambient Aura */}
                <circle cx="0" cy="0" r="18" fill="url(#sparkle-core-glow)" />
                {/* Secondary Cyan Halo */}
                <circle cx="0" cy="0" r="8" fill="#38bdf8" opacity="0.4" filter="blur(2px)" />
                {/* Razor Sharp 4-Point Diamond Star */}
                <path
                  d="M 0,-15 L 3.2,-3.2 L 15,0 L 3.2,3.2 L 0,15 L -3.2,3.2 L -15,0 L -3.2,-3.2 Z"
                  fill="#ffffff"
                  filter="drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px #38bdf8) drop-shadow(0 0 16px rgba(234,0,4,0.6))"
                />
                {/* Super-bright White Core Point */}
                <circle cx="0" cy="0" r="2" fill="#ffffff" />
              </g>
            </defs>

            {/* Hidden Guide Paths for Coordinate Mathematics */}
            <g opacity="0" pointerEvents="none">
              {LETTER_SEGMENTS.map((seg) => (
                <path
                  key={seg.id}
                  ref={(el) => (segmentRefs.current[seg.id] = el)}
                  d={seg.path}
                  fill="none"
                  stroke="none"
                />
              ))}
            </g>

            {/* 1. Baseline Foundation Underline (revealed progressively with star X) */}
            <g clipPath="url(#baseline-clip)">
              <path d={L_BAR_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 2. Letter 'L' Vertical Stem */}
            <g mask="url(#mask-L)">
              <path d={L_BAR_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 3. Letter 'O' (First) */}
            <g mask="url(#mask-O1)">
              <path d={O1_PATH} fill="url(#lookman-red-reveal-grad)" fillRule="evenodd" />
            </g>

            {/* 4. Letter 'O' (Second) */}
            <g mask="url(#mask-O2)">
              <path d={O2_PATH} fill="url(#lookman-red-reveal-grad)" fillRule="evenodd" />
            </g>

            {/* 5. Letter 'K' */}
            <g mask="url(#mask-K)">
              <path d={K_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 6. Letter 'M' */}
            <g mask="url(#mask-M)">
              <path d={M_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 7. Letter 'A' (Chevron Λ) */}
            <g mask="url(#mask-A)">
              <path d={A_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 8. Letter 'N' */}
            <g mask="url(#mask-N)">
              <path d={N_PATH} fill="url(#lookman-red-reveal-grad)" />
            </g>

            {/* 9. Fading Light Trail behind Sparkle */}
            <path
              ref={trailRef}
              d=""
              fill="none"
              stroke="url(#comet-trail-grad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px #38bdf8)"
              className="pointer-events-none transition-opacity duration-300"
            />

            {/* 10. The Moving Shooting Star / Settling Glint */}
            <g
              ref={sparkleRef}
              transform="translate(17.2, 2.0)"
              className="pointer-events-none"
            >
              <g className={isCompleted ? 'logo-stationary-glint' : ''}>
                <use href="#sparkle-star-def" />
              </g>
            </g>

            {/* 11. Slogan 'CHANNELING GROWTH' (Fades in with luxury glow upon completion) */}
            <g 
              className={`transition-all duration-1000 ${
                isCompleted 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <path d={SLOGAN_PATH} fill="#b00004" />
            </g>
          </svg>
        </div>

        {/* Minimal Control Bar */}
        {showControls && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5 z-20">
            {/* Replay Standard (2.6s) */}
            <button
              onClick={() => {
                setDuration(2600);
                playReveal(2600);
              }}
              disabled={isPlaying}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#ea0004] hover:bg-[#ff1f24] text-white shadow-lg shadow-red-900/30 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={15} className={isPlaying ? 'animate-spin' : ''} />
              Replay Reveal (2.6s)
            </button>

            {/* Slow Motion (4.5s) */}
            <button
              onClick={() => {
                setDuration(4500);
                playReveal(4500);
              }}
              disabled={isPlaying}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'
              }`}
            >
              <Play size={14} />
              Slow Motion (4.5s)
            </button>

            {/* Background Minimal Mode Switch */}
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-yellow-300'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
              }`}
              title="Toggle Minimal Background (Dark / Light)"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
