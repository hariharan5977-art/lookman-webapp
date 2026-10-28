import React, { useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BRAND_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'ptz-cameras', name: 'PTZ Cameras' },
  { id: 'hd-ip-camera', name: 'HD IP Camera' },
  { id: 'hd-analog-cameras', name: 'HD Analog Cameras' },
  { id: 'hybrid-dvr', name: 'Hybrid DVR' },
  { id: 'ai-product', name: 'AI Product' },
  { id: 'switch', name: 'Switch' },
  { id: 'nvrs', name: 'NVRS' }
];

export default function BrandsPage({ onSelectCategory, onOpenQuote }) {
  const [selectedCat, setSelectedCat] = useState('All');

  const handleCategoryClick = (categoryName) => {
    setSelectedCat(categoryName);
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
  };

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">
        
        {/* Mobile Category Horizontal Strip */}
        <div className="block md:hidden mb-4 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {BRAND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-heading transition-all cursor-pointer border ${
                  selectedCat.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#ea0004] text-white border-[#ea0004] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 font-medium'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: Left Category Sidebar & Right Color On Card */}
        <div className="w-full flex flex-col md:flex-row items-stretch gap-6 text-left">
          
          {/* Left Column: Category Sidebar */}
          <aside className="w-full md:w-60 lg:w-64 min-[2000px]:w-72 shrink-0 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-md self-start">
            <div className="bg-[#f8fafd] text-[#101f46] px-5 py-3.5 text-sm font-heading font-bold border-b border-slate-200/80 text-left">
              Category
            </div>
            <div className="divide-y divide-slate-100">
              {BRAND_CATEGORIES.map((cat) => {
                const isActive = selectedCat.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left pl-5 pr-4 py-3 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
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
                      {cat.name}
                    </span>
                    <ChevronRight size={14} className={isActive ? 'text-[#ea0004]' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Clean Color On Card Alone */}
          <main className="flex-1 min-w-0 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col justify-between anim-card-slide-right">
            
            {/* Subtle background surveillance video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-20 scale-105"
              src="/videos/sol_commercial.mp4"
            />

            {/* Gradient wash overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 55%, rgba(255,255,255,0.85) 100%)'
              }}
            />

            <div className="relative z-10 space-y-6">
              
              {/* Header: Title and Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-[#101f46] tracking-tight">
                    Color On Surveillance Systems
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                    24/7 Full Color High-Definition Surveillance &amp; AI Hardware
                  </p>
                </div>
                <img 
                  src="/color_on_logo.png" 
                  alt="Color On Surveillance Systems" 
                  className="h-14 sm:h-16 w-auto object-contain select-none self-start sm:self-auto"
                />
              </div>

              {/* Main Body */}
              <div className="space-y-4 max-w-3xl text-left">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-[#101f46] tracking-tight">
                  Full Spectrum Color Optics, Even in Zero Light.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Color On is an industry-leading security technology brand engineered to deliver vivid, full-spectrum color video capture 24 hours a day, 7 days a week. Equipped with advanced F1.0 super-large apertures, cutting-edge optical sensors, and warm auxiliary illumination, Color On cameras ensure pristine clarity even in zero-lux pitch darkness.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('HD IP Camera')}
                  className="px-6 py-3 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <span>Explore Color On Products</span>
                  <ArrowRight size={14} />
                </button>

                {onOpenQuote && (
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs transition-colors cursor-pointer"
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
