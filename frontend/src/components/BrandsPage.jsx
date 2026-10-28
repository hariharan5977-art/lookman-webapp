import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BRANDS_LIST = [
  { id: 'all', name: 'All Brands' },
  { id: 'color-on', name: 'Color On' }
];

export default function BrandsPage({ onSelectCategory, onOpenQuote }) {
  const [selectedBrand, setSelectedBrand] = useState('color-on');

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">
        
        {/* ── MOBILE HORIZONTAL BRAND CHIPS (< md) ── */}
        <div className="md:hidden w-full overflow-x-auto pb-3 mb-4 scrollbar-none anim-card-slide-left">
          <div className="flex items-center gap-2 min-w-max px-0.5">
            {BRANDS_LIST.map((brand) => {
              const isActive = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:text-[#ea0004]'
                  }`}
                  style={isActive ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT: LEFT SIDEBAR (DESKTOP) + RIGHT CONTENT (MATCHING SOLUTIONS PAGE) ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* ── 1. LEFT SIDEBAR NAVIGATION: BRANDS LIST (ANIM-CARD-SLIDE-LEFT) ── */}
          <div className="hidden md:block w-full md:w-60 lg:w-64 min-[2000px]:w-72 shrink-0 border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-lg anim-card-slide-left">
            {/* Sidebar Header */}
            <div className="bg-[#f8fafd] text-[#101f46] px-4 py-3 text-sm font-heading font-bold border-b border-slate-200/90 text-left">
              Brands
            </div>
            
            {/* Sidebar Menu Items */}
            <div className="divide-y divide-slate-200/60">
              {BRANDS_LIST.map((brand) => {
                const isActive = selectedBrand === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`w-full text-left pl-5 pr-4 py-3 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#fcfdfe] shadow-2xs font-bold'
                        : 'bg-white text-slate-700 font-medium hover:bg-slate-50 hover:text-[#ea0004]'
                    }`}
                  >
                    {/* Double-Shaded Gradient Selection Marker Line at Left Edge */}
                    {isActive && (
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xs"
                        style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                      />
                    )}

                    {/* Double-Shaded Gradient Selected Text Color */}
                    <span className={isActive ? 'hero-title-gradient font-bold' : ''}>
                      {brand.name}
                    </span>

                    <ChevronRight size={14} className={isActive ? 'text-[#ea0004]' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 2. RIGHT MAIN CONTENT AREA: COLOR ON CARD (EXACT SOLUTIONS PAGE CARD WIDTH & ANIM-CARD-SLIDE-RIGHT) ── */}
          <div className="flex-1 w-full space-y-6 sm:space-y-8 text-left bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-100 anim-card-slide-right relative overflow-hidden">
            
            {/* Subtle ambient surveillance video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-15 scale-105"
              src="/videos/sol_commercial.mp4"
            />

            {/* Gradient wash overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0.88) 100%)'
              }}
            />

            <div className="relative z-10 space-y-6">
              
              {/* Header: Title with Gradient Accent Bar and Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#101f46] flex items-center gap-2">
                    <span>Color On Surveillance Systems</span>
                    <span className="hero-title-gradient font-bold">|</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    24/7 Full Color High-Definition Surveillance &amp; AI Hardware
                  </p>
                </div>
                <img 
                  src="/color_on_logo.png" 
                  alt="Color On Surveillance Systems" 
                  className="h-10 sm:h-12 w-auto object-contain select-none self-start sm:self-auto"
                />
              </div>

              {/* Main Body */}
              <div className="space-y-2.5 max-w-3xl text-left">
                <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                  Full Spectrum Color Optics, Even in Zero Light
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body font-normal">
                  Color On is an industry-leading security technology brand engineered to deliver vivid, full-spectrum color video capture 24/7. Equipped with advanced F1.0 super-large apertures, cutting-edge optical sensors, and warm auxiliary illumination, Color On cameras ensure pristine clarity even in zero-lux pitch darkness.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('HD IP Camera')}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <span>Explore Color On Products</span>
                  <ArrowRight size={14} />
                </button>

                {onOpenQuote && (
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs transition-colors cursor-pointer"
                  >
                    Request Brand Quotation
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
