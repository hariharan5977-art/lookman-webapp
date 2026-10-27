import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Sun, Moon, HomeIcon, Building2, Shield, GraduationCap } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function DayNightSection({ onOpenQuoteWithDetails }) {
  const [dayNightRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const environments = [
    {
      id: 0,
      title: "Residential Villa & Living",
      desc: "Vivid 4K color by day, crystal-clear starlight infrared tracking by night.",
      icon: HomeIcon,
      images: [
        "/day_vision_cctv.jpg",
        "/night_vision_cctv.jpg",
        "/hero_cctv_slide1.jpg",
      ]
    },
    {
      id: 1,
      title: "Perimeter Driveways & Patios",
      desc: "Long-range thermal contrast detecting motion up to 150ft in pitch darkness.",
      icon: Sun,
      images: [
        "/day_vision_cctv.jpg",
        "/hero_cctv_slide1.jpg",
        "/night_vision_cctv.jpg",
      ]
    },
    {
      id: 2,
      title: "Commercial Storefronts & Parking",
      desc: "License plate recognition and high-contrast night vision for retail security.",
      icon: Building2,
      images: [
        "/hero_cctv_slide2.jpg",
        "/day_vision_cctv.jpg",
        "/night_vision_cctv.jpg",
      ]
    },
    {
      id: 3,
      title: "Warehouse & Logistics Hubs",
      desc: "24/7 continuous low-light monitoring for high-value inventory vaults.",
      icon: Shield,
      images: [
        "/action360_slide2.jpg",
        "/day_vision_cctv.jpg",
        "/night_vision_cctv.jpg",
      ]
    },
    {
      id: 4,
      title: "School & Campus Grounds",
      desc: "Zero motion blur 60 FPS night capture for outdoor walkways and fields.",
      icon: GraduationCap,
      images: [
        "/day_vision_cctv.jpg",
        "/night_vision_cctv.jpg",
        "/hero_cctv_slide1.jpg",
      ]
    }
  ];

  const currentEnv = environments[activeTab];
  const totalSlides = currentEnv.images.length;
  const currentImage = currentEnv.images[activeSlide];

  const goToSlide = useCallback((idx) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setSliderPos(50);
      setIsTransitioning(false);
    }, 150);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % totalSlides);
  }, [activeSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + totalSlides) % totalSlides);
  }, [activeSlide, totalSlides, goToSlide]);

  // Reset slide and slider when tab changes
  useEffect(() => {
    setActiveSlide(0);
    setSliderPos(50);
    setIsTransitioning(false);
  }, [activeTab]);

  // Auto-advance removed — images change ONLY when arrow controls are clicked
  useEffect(() => {
    // Auto-advance disabled per user request
  }, [activeTab, totalSlides]);

  return (
    <section ref={dayNightRef} className="day-night-section w-full bg-[#f8f9fc] relative overflow-hidden py-8 sm:py-12 border-none">
      <div className="w-full max-w-[2000px] mx-auto px-0 flex justify-center overflow-hidden">
        {/* Whole Tab Card: Natural stacked layout on mobile/tablet, 28:9 aspect ratio on desktop (lg+) */}
        <div className="bg-white border border-slate-200/60 rounded-none overflow-hidden shadow-xs w-full lg:aspect-[28/9]">
          <div className="flex flex-col lg:flex-row w-full h-full items-stretch justify-center overflow-hidden">

            {/* Left Column: Proportional Image Container */}
            <div className={`relative w-full lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[220px] sm:min-h-[280px] shrink-0 overflow-hidden bg-slate-950 select-none group ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

              <div className={`absolute inset-0 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

                {/* Day Vision Layer */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${currentImage}')` }}
                />

                {/* Night Vision Layer (clipped) */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${currentImage}')`,
                    clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                    filter: 'grayscale(100%) contrast(165%) brightness(78%) drop-shadow(0 0 1px rgba(255,255,255,0.2))'
                  }}
                >
                  <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color-dodge pointer-events-none" />
                </div>

                {/* Slider Dividing Bar */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#e73455] pointer-events-none z-20 shadow-[0_0_10px_rgba(231,52,85,0.8)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e73455] text-white font-extrabold flex items-center justify-center shadow-lg border-2 border-white text-xs pointer-events-none">
                    ↔
                  </div>
                </div>
              </div>

              {/* Invisible Range Input for Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Day and Night Comparison Slider"
              />

            </div>

            {/* Right Column: Text Content Responsive */}
            <div className={`w-full flex-1 lg:h-full p-5 sm:p-7 lg:px-10 lg:py-5 flex flex-col justify-between items-start bg-[#f8f9fc] relative overflow-hidden ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>

              <div className="flex flex-col gap-1 mb-3 lg:mb-2 shrink-0">
                <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#12182b] leading-[1.15] tracking-tight">
                  Uncompromising Clarity
                </h2>
                <div className="text-base sm:text-lg lg:text-[21px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-0.5">
                  24 Hours A Day, 7 Days A Week.
                </div>
              </div>

              {/* Environment List Spanning Height */}
              <div className="relative w-full flex-1 flex flex-col min-h-0 overflow-hidden mt-1">
                <div className="relative flex flex-col w-full h-full justify-between gap-1 overflow-y-auto no-scrollbar py-1">
                  <div className="absolute left-[1px] top-1 bottom-1 w-[2px] bg-slate-200 z-0 hidden sm:block" />


                  {environments.map((env, idx) => {
                    const IconComponent = env.icon;
                    const isActive = idx === activeTab;
                    return (
                      <button
                        key={env.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-4 py-2.5 px-4 text-left transition-all cursor-pointer border-l-[3px] relative z-10 ${isActive
                          ? 'border-l-[#e73455] text-[#12182b] bg-transparent font-semibold'
                          : 'border-l-transparent text-gray-500 hover:text-gray-800'
                          }`}
                      >
                        <div className={`shrink-0 ${isActive ? 'text-[#e73455]' : 'text-gray-400'}`}>
                          <IconComponent size={22} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className={`font-semibold text-base sm:text-[17px] ${isActive ? 'text-[#12182b]' : 'text-gray-500'}`}>
                            {env.title}
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            {env.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
