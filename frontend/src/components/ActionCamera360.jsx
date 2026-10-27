import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Sparkles, HomeIcon, Sun, GraduationCap, Hotel, Building2 } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function ActionCamera360({ onOpenQuoteWithDetails }) {
  const [actionRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState(0);
  const [panX, setPanX] = useState(0); // 0 to 100% (horizontal 360 yaw)
  const [panY, setPanY] = useState(50); // 0 to 100% (vertical pitch / tilt)
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartOffsetX = useRef(0);
  const dragStartOffsetY = useRef(50);
  const panXRef = useRef(0);
  const panYRef = useRef(50);

  const environments = [
    {
      id: 0,
      title: "Residential Homes",
      desc: "Advanced security solutions protecting your home and loved ones.",
      icon: HomeIcon,
      image: "/action360_slide1.jpg"
    },
    {
      id: 1,
      title: "Outdoor Areas",
      desc: "Comprehensive surveillance ensuring safety across gardens, driveways & patios.",
      icon: Sun,
      image: "/hero_cctv_slide1.jpg"
    },
    {
      id: 2,
      title: "Schools & Institutions",
      desc: "Secure environments for students, staff, and campus facilities safety.",
      icon: GraduationCap,
      image: "/action360_slide2.jpg"
    },
    {
      id: 3,
      title: "Hotels & Hospitality",
      desc: "Protecting guests, staff, and property with smart security solutions.",
      icon: Hotel,
      image: "/action360_slide1.jpg"
    },
    {
      id: 4,
      title: "Commercial Buildings",
      desc: "Comprehensive surveillance ensuring safety for employees and business assets.",
      icon: Building2,
      image: "/action360_slide2.jpg"
    }
  ];

  const currentEnv = environments[activeTab];

  // Mouse Drag Handlers (Omnidirectional 360° rotation)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragStartOffsetX.current = panXRef.current;
    dragStartOffsetY.current = panYRef.current;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 400;
    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - dragStartY.current;

    // Horizontal 360° pan
    const percentChangeX = (deltaX / width) * 100;
    let newPanX = (dragStartOffsetX.current - percentChangeX) % 100;
    if (newPanX < 0) newPanX += 100;
    panXRef.current = newPanX;
    setPanX(newPanX);

    // Vertical pitch / look up & down
    const percentChangeY = (deltaY / height) * 100;
    const newPanY = Math.min(100, Math.max(0, dragStartOffsetY.current - percentChangeY));
    panYRef.current = newPanY;
    setPanY(newPanY);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  // Touch Handlers (Omnidirectional 360° rotation)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartX.current = e.touches[0].clientX;
      dragStartY.current = e.touches[0].clientY;
      dragStartOffsetX.current = panXRef.current;
      dragStartOffsetY.current = panYRef.current;
    }
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !containerRef.current || e.touches.length !== 1) return;
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 400;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const deltaY = e.touches[0].clientY - dragStartY.current;

    // Horizontal 360° pan
    const percentChangeX = (deltaX / width) * 100;
    let newPanX = (dragStartOffsetX.current - percentChangeX) % 100;
    if (newPanX < 0) newPanX += 100;
    panXRef.current = newPanX;
    setPanX(newPanX);

    // Vertical pitch
    const percentChangeY = (deltaY / height) * 100;
    const newPanY = Math.min(100, Math.max(0, dragStartOffsetY.current - percentChangeY));
    panYRef.current = newPanY;
    setPanY(newPanY);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse up / touch end listener
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

  // Computed 3D perspective tilt
  const tiltX = ((panY - 50) / 50) * -8;

  return (
    <section ref={actionRef} className="camera360-section w-full bg-[#f8f9fc] relative overflow-hidden py-6 sm:py-10 border-none">
      <div className="w-full max-w-[2000px] mx-auto px-0 flex justify-center overflow-hidden">
        {/* Whole Tab Card: Natural stacked layout on mobile/tablet, 28:9 aspect ratio on desktop (lg+) */}
        <div className="bg-white border border-slate-200/60 rounded-none overflow-hidden shadow-xs w-full lg:aspect-[28/9]">
          <div className="flex flex-col lg:flex-row w-full h-full items-stretch justify-center overflow-hidden">

            {/* Left Column: 360° Omnidirectional Panoramic Viewer */}
            <div 
              ref={containerRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsDragging(false);
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className={`relative w-full lg:w-[58%] aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[220px] sm:min-h-[280px] shrink-0 overflow-hidden bg-slate-900 select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              } ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}
              style={{ perspective: '800px' }}
            >

              {/* Seamless 360 Repeating Panoramic Image Layer with 2-axis Pan & 3D Tilt */}
              <div 
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] transition-transform duration-75 ease-out will-change-[background-position,transform]"
                style={{
                  backgroundImage: `url('${currentEnv.image}')`,
                  backgroundSize: '240% 160%',
                  backgroundRepeat: 'repeat-x',
                  backgroundPosition: `${panX}% ${panY}%`,
                  transform: `rotateX(${tiltX}deg) scale(1.04)`
                }}
              />

              {/* Black Tint Overlay Behind 360 Animation (Fades out when cursor enters/drags) */}
              <div 
                className={`absolute inset-0 bg-black/40 pointer-events-none select-none z-10 transition-opacity duration-300 ${
                  isHovered || isDragging ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Center 360° Text with Orbiting 3D Arrows (Fades out when cursor enters) */}
              <div 
                className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 transition-all duration-300 ${
                  isHovered || isDragging ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                }`}
              >
                <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
                  {/* 3D Orbiting Arrows Spinning Around the 360 Text */}
                  <svg 
                    viewBox="0 0 160 160" 
                    className="absolute inset-0 w-full h-full text-white anim-3d-orbit-arrows drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  >
                    {/* Curved Arc 1 & Arrowhead */}
                    <path d="M 80,20 A 60,60 0 0,1 140,80" fill="none" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
                    <polygon points="140,66 154,86 130,86" fill="currentColor" />

                    {/* Curved Arc 2 & Arrowhead */}
                    <path d="M 80,140 A 60,60 0 0,1 20,80" fill="none" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" />
                    <polygon points="20,94 6,74 30,74" fill="currentColor" />
                  </svg>

                  {/* 360 Text with Degree Dot on Top Right of Zero */}
                  <div className="relative z-10 flex items-start text-white font-black tracking-tight leading-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                    <span className="text-4xl sm:text-5xl font-black text-white">360</span>
                    <span className="w-3.5 h-3.5 rounded-full border-3 border-white -mt-1 ml-0.5 shadow-sm" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Text Content Responsive */}
            <div className={`w-full flex-1 lg:h-full p-5 sm:p-7 lg:px-10 lg:py-5 flex flex-col justify-between items-start bg-[#f8f9fc] relative overflow-hidden ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>

              <div className="relative z-10 w-full flex flex-col items-start h-full justify-between">
                <div className="flex flex-col gap-1 mb-3 lg:mb-2 shrink-0">
                  <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#12182b] leading-[1.15] tracking-tight">
                    Complete 360° Coverage
                  </h2>
                  <div className="text-base sm:text-lg lg:text-[21px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-0.5">
                    Zero Blind Spots, Total Protection.
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
                          onClick={() => {
                            setActiveTab(idx);
                            panRef.current = 0;
                            setPanOffset(0);
                          }}
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
      </div>
    </section>
  );
}
