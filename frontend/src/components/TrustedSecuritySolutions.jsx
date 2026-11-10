import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Shield } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function TrustedSecuritySolutions({ onOpenQuoteWithDetails }) {
  const [sectionRevealRef, isVisible] = useScrollReveal({ threshold: 0.08 });
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef(0);
  const [leftPadding, setLeftPadding] = useState(32);
  const [maxTranslate, setMaxTranslate] = useState(0);

  const cards = [
    {
      id: 1,
      title: "Supervised Home Protection",
      subtitle: "SMART RESIDENTIAL CCTV SETUP",
      image: "/solutions/solution_home_protection.webp",
      fallbackImage: "/solutions/solution_home_protection.jpg",
      desc: "Discreet low-light dome cameras, real-time AI motion alerts, and automated cloud backup recording."
    },
    {
      id: 2,
      title: "Expert Camera Installation",
      subtitle: "CERTIFIED ENGINEERING SERVICES",
      image: "/solutions/solution_expert_installation.webp",
      fallbackImage: "/solutions/solution_expert_installation.jpg",
      desc: "Full architectural site survey, precision mounting, structured cabling, and NVR matrix configuration."
    },
    {
      id: 3,
      title: "Web/Cloud Security CCTV",
      subtitle: "ENTERPRISE 24/7 MONITORING",
      image: "/solutions/solution_web_cloud_cctv.webp",
      fallbackImage: "/solutions/solution_web_cloud_cctv.jpg",
      desc: "End-to-end encrypted multi-stream remote live feeds and instant failover localized storage."
    },
    {
      id: 4,
      title: "Industrial & Logistics Hubs",
      subtitle: "WAREHOUSE PERIMETER DEFENSE",
      image: "/solutions/solution_industrial_logistics.webp",
      fallbackImage: "/solutions/solution_industrial_logistics.jpg",
      desc: "Long-range optical zoom, automatic license plate recognition, and loading dock coverage."
    },
    {
      id: 5,
      title: "High-Security Banking Vaults",
      subtitle: "FINANCIAL ASSET PROTECTION",
      image: "/solutions/solution_banking_vaults.webp",
      fallbackImage: "/solutions/solution_banking_vaults.jpg",
      desc: "Biometric dual-authentication triggers, tamper-proof conduit lines, and ultra-high frame rate capture."
    },
    {
      id: 6,
      title: "School & Campus Safety",
      subtitle: "CAMPUS-WIDE REAL-TIME SHIELD",
      image: "/solutions/solution_school_campus.webp",
      fallbackImage: "/solutions/solution_school_campus.jpg",
      desc: "Zero blind spot walkway surveillance, emergency lockdown integrations, and parent perimeter portals."
    }
  ];

  const updateMetrics = useCallback(() => {
    if (headingRef.current) {
      const titleEl = headingRef.current.querySelector('h2') || headingRef.current;
      const headingLeft = titleEl.getBoundingClientRect().left;
      // leftPadding precisely matches the physical start of the heading text
      setLeftPadding(Math.max(0, Math.round(headingLeft)));
    }

    if (trackRef.current) {
      const trackScrollWidth = trackRef.current.scrollWidth;
      const maxScroll = Math.max(0, trackScrollWidth - window.innerWidth);
      setMaxTranslate(maxScroll);
    }
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics, { passive: true });
    
    // Automatically keep leftPadding in sync with any responsive/zoom changes on headingRef
    let ro;
    if (typeof ResizeObserver !== 'undefined' && headingRef.current) {
      ro = new ResizeObserver(() => {
        updateMetrics();
      });
      ro.observe(headingRef.current);
    }

    const timer = setTimeout(updateMetrics, 100);

    const sectionEl = containerRef.current;
    if (!sectionEl) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const diffX = touchStartX - e.touches[0].clientX;
      const diffY = touchStartY - e.touches[0].clientY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        const step = diffX / 500;
        const nextVal = Math.min(1, Math.max(0, progressRef.current + step));
        progressRef.current = nextVal;
        setScrollProgress(nextVal);
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleWheel = (e) => {
      // Only act when section is currently in the viewport
      const rect = sectionEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3;
      if (!inView) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 0 && progressRef.current < 0.99) {
          e.preventDefault();
          const step = Math.min(0.25, Math.max(0.04, e.deltaY / 800));
          const nextVal = Math.min(1, progressRef.current + step);
          progressRef.current = nextVal;
          setScrollProgress(nextVal);
        } else if (e.deltaY < 0 && progressRef.current > 0.01) {
          e.preventDefault();
          const step = Math.min(0.25, Math.max(0.04, Math.abs(e.deltaY) / 800));
          const nextVal = Math.max(0, progressRef.current - step);
          progressRef.current = nextVal;
          setScrollProgress(nextVal);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    sectionEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    sectionEl.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', updateMetrics);
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener('wheel', handleWheel);
      sectionEl.removeEventListener('touchstart', handleTouchStart);
      sectionEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, [updateMetrics]);

  const slideNext = () => {
    const nextVal = Math.min(1, progressRef.current + 0.22);
    progressRef.current = nextVal;
    setScrollProgress(nextVal);
  };

  const slidePrev = () => {
    const nextVal = Math.max(0, progressRef.current - 0.22);
    progressRef.current = nextVal;
    setScrollProgress(nextVal);
  };

  const currentTranslateX = scrollProgress * maxTranslate;

  return (
    <section
      id="solutions-section"
      ref={(el) => {
        containerRef.current = el;
        sectionRevealRef.current = el;
      }}
      className="relative w-full bg-white pt-1 pb-6 sm:pt-2 sm:pb-8 lg:pt-2 lg:pb-10 overflow-hidden"
    >
      <div className="w-full flex flex-col gap-4 sm:gap-6 overflow-hidden">

        {/* Section Header with Navigation Arrows */}
        <div ref={headingRef} className={`w-full max-w-[2000px] mx-auto wide-2000-flush shrink-0 flex items-end justify-between ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e73455]/30 bg-[#f8f9fc]">
              <Shield size={11} className="text-[#e73455]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#e73455]">DOMAIN PROTECTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#12182b] tracking-tight leading-tight">
              Trusted <span className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent">Security Solutions</span> For Every Space
            </h2>
          </div>

          {/* Navigation Arrows for smooth manual sliding */}
          <div className="flex items-center gap-2">
            <button
              onClick={slidePrev}
              disabled={scrollProgress <= 0.01}
              aria-label="Previous solution card"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#e73455] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={slideNext}
              disabled={scrollProgress >= 0.99}
              aria-label="Next solution card"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#e73455] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Cards Track — mask clips cards at the heading text margin on the left */}
        <div
          className={`w-full flex-none flex items-center overflow-hidden relative py-4 sm:py-6 ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}
          style={{
            WebkitMaskImage: leftPadding > 0
              ? `linear-gradient(to right, transparent 0px, transparent ${leftPadding - 2}px, black ${leftPadding + 1}px, black 100%)`
              : 'none',
            maskImage: leftPadding > 0
              ? `linear-gradient(to right, transparent 0px, transparent ${leftPadding - 2}px, black ${leftPadding + 1}px, black 100%)`
              : 'none'
          }}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-7 pr-12 transition-transform duration-300 ease-out will-change-transform"
            style={{
              paddingLeft: `${leftPadding}px`,
              transform: `translate3d(-${currentTranslateX}px, 0, 0)`
            }}
          >
            {cards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => {
                  if (onOpenQuoteWithDetails) {
                    onOpenQuoteWithDetails(`Inquiry regarding solution: ${card.title}`);
                  }
                }}
                className="group relative shrink-0 w-[230px] sm:w-[270px] md:w-[300px] lg:w-[320px] xl:w-[330px] h-[430px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer border border-[#eaecf0] shadow-sm hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:z-30 will-change-transform bg-slate-950 select-none"
              >
                {/* Background Photographic Image (Wide Portrait Format) */}
                <picture className="w-full h-full block">
                  <source srcSet={card.image} type="image/webp" />
                  <img
                    src={card.fallbackImage || card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (card.fallbackImage && e.currentTarget.src !== card.fallbackImage) {
                        e.currentTarget.src = card.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </picture>

                {/* Dark Gradient Overlay for perfect readability */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(10, 16, 36, 0.98) 0%, rgba(10, 16, 36, 0.65) 48%, rgba(10, 16, 36, 0.08) 100%)'
                  }}
                />

                {/* Top Number Counter Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    0{idx + 1}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute left-5 right-5 bottom-5 z-20 flex flex-col items-start justify-end gap-2.5 pointer-events-none text-white">
                  <div>
                    <span className="inline-flex items-center justify-center min-h-[22px] px-3 py-0.5 rounded-full text-[8.5px] font-extrabold text-[#e73455] uppercase tracking-wider bg-white shadow-xs border border-red-100 leading-none">
                      {card.subtitle}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-xs group-hover:text-red-200 transition-colors m-0">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-[12.5px] text-slate-200 line-clamp-3 leading-relaxed font-normal opacity-90 m-0">
                    {card.desc}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 group-hover:text-[#e73455] transition-colors pt-1">
                    <span>Explore Solution</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


