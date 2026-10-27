import React from 'react';
import { Shield, ChevronRight, Zap, Eye, Sun, Sparkles, Video, ArrowRight } from 'lucide-react';

export default function BrandsPage({ onSelectCategory, onOpenQuote }) {
  const COLOR_ON_FEATURES = [
    {
      title: 'F1.0 Super Aperture Optics',
      desc: 'Engineered with massive F1.0 aperture lenses that capture over 400% more ambient light than conventional F2.0 security cameras.',
      icon: Eye
    },
    {
      title: 'Starlight Color Reproduction',
      desc: 'Pristine 24/7 daytime-like color surveillance in zero-lux pitch darkness without dropping into grainy black-and-white infrared.',
      icon: Sun
    },
    {
      title: 'Warm Auxiliary Illumination',
      desc: 'Soft, anti-glare warm lighting activates intelligently to illuminate dark corridors and perimeters without blinding drivers or residents.',
      icon: Sparkles
    },
    {
      title: 'Edge AI Target Analytics',
      desc: 'Next-generation neural processor separates humans and vehicles from false triggers with optional active siren and strobe deterrents.',
      icon: Zap
    }
  ];

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">
        
        {/* ── SINGLE OFFICIAL BRAND SHOWCASE: COLOR ON ── */}
        <div className="w-full space-y-8 text-left bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-100 anim-card-slide-right">
          
          {/* Header Bar */}
          <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea0004] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block">
                  Official Surveillance Brand
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Lookman National Distribution
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#101f46] flex items-center gap-2">
                <span>Color On Surveillance Systems</span>
                <span className="hero-title-gradient font-black">|</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                24/7 Full Color High-Definition Surveillance &amp; AI Hardware
              </p>
            </div>

            {/* Brand Status Pill */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-[#ea0004] border border-rose-200 self-start sm:self-auto shadow-2xs">
              <Shield size={14} className="text-[#ea0004]" />
              <span>Authorized National Partner</span>
            </span>
          </div>

          {/* Hero Showcase Card with Video Background */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-800 p-6 sm:p-10 lg:p-12 shadow-lg min-h-[260px] flex items-center">
            
            {/* Autoplaying background video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25 scale-105"
              src="/videos/sol_commercial.mp4"
            />

            {/* Gradient overlay for contrast */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 55%, rgba(255,255,255,0.75) 100%)'
              }}
            />

            {/* Foreground content and brand logo */}
            <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl xl:max-w-3xl text-left">
                <span className="text-[11px] font-bold text-[#ea0004] uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
                  24/7 Vivid Spectrum Optics
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-[#101f46] tracking-tight leading-snug">
                  Full Spectrum Color Optics, Even in Zero Light.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Color On is an industry-leading security technology brand engineered to deliver vivid, full-spectrum color video capture 24 hours a day, 7 days a week. Equipped with advanced F1.0 super-large apertures, cutting-edge starlight optical sensors, and warm auxiliary illumination, Color On cameras ensure pristine clarity even in zero-lux pitch darkness.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onSelectCategory && onSelectCategory('HD IP Camera')}
                    className="px-6 py-3 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                  >
                    <span>Explore Color On Products</span>
                    <ArrowRight size={14} />
                  </button>

                  {onOpenQuote && (
                    <button
                      onClick={onOpenQuote}
                      className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold text-xs transition-colors cursor-pointer"
                    >
                      Request Brand Quotation
                    </button>
                  )}
                </div>
              </div>

              {/* Brand Logo Presentation */}
              <div className="flex flex-col items-center justify-center shrink-0 w-auto bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
                <img 
                  src="/color_on_logo.png" 
                  alt="Color On Surveillance Systems" 
                  className="h-16 sm:h-20 max-w-[180px] w-auto object-contain mb-2 select-none"
                />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Brand Partner
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                  ✓ Available Across All India
                </span>
              </div>
            </div>

          </div>

          {/* 4 Core Pillars of Color On Technology */}
          <div className="space-y-4 pt-4">
            <h3 className="text-base sm:text-lg font-heading font-black text-[#101f46] tracking-tight">
              Color On Core Optical Technologies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {COLOR_ON_FEATURES.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 hover:bg-white hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ea0004] border border-red-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComponent size={20} />
                      </div>
                      <h4 className="font-heading font-bold text-[#101f46] text-sm">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-[#ea0004]">
                      <span>24/7 Color Certified</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
