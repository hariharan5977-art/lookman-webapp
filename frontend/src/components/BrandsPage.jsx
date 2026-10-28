import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BRANDS_LIST = [
  { id: 'all', name: 'All Brands' },
  { id: 'color-on', name: 'Color On' }
];

export default function BrandsPage({ onSelectCategory, onOpenQuote }) {
  const [selectedBrand, setSelectedBrand] = useState('color-on');

  const handleBrandClick = (brandId) => {
    setSelectedBrand(brandId);
  };

  return (
    <div className="w-full bg-transparent font-body text-slate-700">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-12 overflow-hidden">
        
        {/* Mobile Brands Horizontal Strip */}
        <div className="block md:hidden mb-4 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {BRANDS_LIST.map((brand) => {
              const isActive = selectedBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandClick(brand.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-heading transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#ea0004] text-white border-[#ea0004] font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 font-medium'
                  }`}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Left Brands Sidebar & Right Reduced-Size Brand Card */}
        <div className="w-full flex flex-col md:flex-row items-start gap-6 text-left">
          
          {/* Left Column: Brands Sidebar */}
          <aside className="w-full md:w-56 lg:w-60 min-[2000px]:w-64 shrink-0 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="bg-[#f8fafd] text-[#101f46] px-5 py-3 text-sm font-heading font-bold border-b border-slate-200/80 text-left">
              Brands
            </div>
            <div className="divide-y divide-slate-100">
              {BRANDS_LIST.map((brand) => {
                const isActive = selectedBrand === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => handleBrandClick(brand.id)}
                    className={`w-full text-left pl-5 pr-4 py-2.5 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#fcfdfe] text-[#101f46] font-bold shadow-2xs'
                        : 'bg-white text-slate-700 font-medium hover:bg-[#f8fafd] hover:text-[#ea0004]'
                    }`}
                  >
                    {isActive && (
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xs"
                        style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                      />
                    )}
                    <span className={isActive ? 'hero-title-gradient font-bold' : ''}>
                      {brand.name}
                    </span>
                    <ChevronRight size={14} className={isActive ? 'text-[#ea0004]' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Reduced-Size Compact Color On Card */}
          <main className="flex-1 max-w-3xl bg-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md border border-slate-200/90 relative overflow-hidden flex flex-col justify-between anim-card-slide-right">
            
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

            <div className="relative z-10 space-y-4">
              
              {/* Header: Title and Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-heading font-black text-[#101f46] tracking-tight">
                    Color On Surveillance Systems
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
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
              <div className="space-y-2 text-left">
                <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46] tracking-tight">
                  Full Spectrum Color Optics, Even in Zero Light
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Color On is an industry-leading security technology brand engineered to deliver vivid, full-spectrum color video capture 24/7. Equipped with advanced F1.0 super-large apertures, cutting-edge optical sensors, and warm auxiliary illumination, Color On cameras ensure pristine clarity even in zero-lux pitch darkness.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('HD IP Camera')}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <span>Explore Color On Products</span>
                  <ArrowRight size={13} />
                </button>

                {onOpenQuote && (
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs transition-colors cursor-pointer"
                  >
                    Request Brand Quotation
                  </button>
                )}
              </div>

            </div>

          </main>

        </div>

      </div>
    </div>
  );
}
