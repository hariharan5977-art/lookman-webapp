import React, { useState, useEffect } from 'react';

export default function HeroSection({ currentSlide: parentSlide, onSlideChange, onOpenContact }) {
  const [internalSlide, setInternalSlide] = useState(0);

  const activeSlide = parentSlide !== undefined ? parentSlide : internalSlide;

  const slides = [
    { id: 1, capturedImg: "/hero_slide1_anpr.png" },
    { id: 2, capturedImg: "/hero_slide2_makeinindia.png" },
    { id: 3, capturedImg: "/hero_slide3_smartersecurity.png" },
    { id: 4, capturedImg: "/hero_slide4_solar.png" },
  ];

  useEffect(() => {
    if (parentSlide !== undefined) return;
    const timer = setInterval(() => {
      setInternalSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [parentSlide, slides.length]);

  const handleDotClick = (dotIdx) => {
    let targetSlide = dotIdx;
    if (slides.length === 4) {
      if (dotIdx === 0) targetSlide = 0;
      else if (dotIdx === 1) targetSlide = activeSlide === 1 ? 3 : 1;
      else if (dotIdx === 2) targetSlide = 2;
    } else if (slides.length > 4) {
      if (dotIdx === 0) targetSlide = 0;
      else if (dotIdx === 2) targetSlide = slides.length - 1;
      else targetSlide = Math.floor(slides.length / 2);
    }
    if (onSlideChange) {
      onSlideChange(targetSlide);
    } else {
      setInternalSlide(targetSlide);
    }
  };

  return (
    <>
      <style>{`
        .hero-slider {
          position: relative;
          overflow: visible;
        }

        /* overall faded overlay on image */
        .hero-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.10) 45%,
            rgba(255, 255, 255, 0.50) 75%,
            rgba(255, 255, 255, 0.92) 100%
          );
        }

        /* hump shape with smooth flowing curve */
        .slider-hump {
          position: absolute;
          left: 50%;
          bottom: 8px;
          /* mobile: smaller hump to match reduced 4px dots */
          transform: translateX(-50%);
          width: clamp(72px, 22vw, 96px);
          height: clamp(16px, 3.8vw, 20px);
          clip-path: url(#hump-flow-clip);
          -webkit-clip-path: url(#hump-flow-clip);
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 2px;
          z-index: 3;

          /* blend effect — fades to full transparent before clip-path bottom so edges/baseline are invisible */
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0.30) 8%,
            rgba(255, 255, 255, 0.08) 18%,
            rgba(255, 255, 255, 0.00) 28%,
            rgba(255, 255, 255, 0.00) 100%
          );

          border: none;
        }

        /* mobile: below 640px */
        @media (max-width: 639px) {
          .slider-hump {
            bottom: 4px;
            transform: translateX(-50%);
            width: clamp(72px, 20vw, 92px);
            height: clamp(14px, 3.5vw, 18px);
          }
        }

        /* sm tablet: 640px+ — standard dot size resumes, hump grows back */
        @media (min-width: 640px) {
          .slider-hump {
            bottom: 14px;
            transform: translateX(-50%);
            width: 120px;
            height: 25px;
          }
        }

        /* md tablet: 768px+ */
        @media (min-width: 768px) {
          .slider-hump {
            bottom: 18px;
            transform: translateX(-50%);
            width: 136px;
            height: 28px;
          }
        }

        /* desktop: 1024px+ */
        @media (min-width: 1024px) {
          .slider-hump {
            bottom: 22px;
            transform: translateX(-50%);
            width: 150px;
            height: 30px;
          }
        }

        /* dots: scaled proportionally for mobile to prevent hitting hump line */
        .slider-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
          z-index: 2;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #64748b;
          opacity: 0.95;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          width: 6px;
          height: 6px;
          background: #ef476f;
          box-shadow: 0 0 0 2px rgba(239, 71, 111, 0.22);
        }

        /* sm tablet & desktop: 640px+ standard sizing */
        @media (min-width: 640px) {
          .slider-dots {
            gap: 10px;
          }
          .dot {
            width: 6px;
            height: 6px;
          }
          .dot.active {
            width: 10px;
            height: 10px;
            box-shadow: 0 0 0 4px rgba(239, 71, 111, 0.22);
          }
        }
      `}</style>

      <section className="hero-section hero-slider w-full max-w-[2000px] mx-auto h-full flex flex-col justify-between select-none">

        {/* Empty Spacer Content for Clean Background Visibility */}
        <div className="flex-1" />

        {/* SVG definition for the seamless flowing hump curve */}
        <svg width="0" height="0" className="absolute pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath id="hump-flow-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0 1 C 0.12 1, 0.20 0.92, 0.24 0.60 C 0.28 0.25, 0.32 0, 0.40 0 L 0.60 0 C 0.68 0, 0.72 0.25, 0.76 0.60 C 0.80 0.92, 0.88 1, 1 1 Z" />
            </clipPath>
            <linearGradient id="hump-border-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="30%" stopColor="rgba(59,130,246,0.55)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.85)" />
              <stop offset="70%" stopColor="rgba(59,130,246,0.55)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── Slide dots hump matching exact user specification ── */}
        <div className="slider-hump">
          {/* Fading top border arc */}
          <svg
            className="pointer-events-none"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              zIndex: 1,
            }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {/* Top dome arc only — same curve as clip-path but as a stroke */}
            <path
              d="M 0 100 C 12 100, 20 92, 24 60 C 28 25, 32 0, 40 0 L 60 0 C 68 0, 72 25, 76 60 C 80 92, 88 100, 100 100"
              fill="none"
              stroke="url(#hump-border-grad)"
              strokeWidth="0.5"
            />
          </svg>
          <div className="slider-dots">
            {[0, 1, 2].map((dotIdx) => {
              const activeDot = slides.length <= 3
                ? (activeSlide % slides.length)
                : slides.length === 4
                ? [0, 1, 2, 1][activeSlide % 4]
                : activeSlide === 0
                ? 0
                : activeSlide === slides.length - 1
                ? 2
                : 1;
              const isActive = activeDot === dotIdx;
              return (
                <button
                  key={dotIdx}
                  onClick={() => handleDotClick(dotIdx)}
                  className={`dot ${isActive ? 'active' : ''}`}
                  aria-label={`Slide indicator ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        </div>

      </section>
    </>
  );
}




