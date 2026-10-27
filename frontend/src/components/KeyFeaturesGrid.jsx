import React from 'react';
import { Sparkles, Video, Cpu, Activity, ChevronRight } from './Icons';

export default function KeyFeaturesGrid({ onOpenContact }) {
  const features = [
    {
      icon: <Video size={28} className="text-[#E63946]" />,
      title: "Easy Installation & Setup",
      desc: "Pre-configured PoE plug-and-play setup requiring zero complex network port forwarding."
    },
    {
      icon: <Cpu size={28} className="text-[#E63946]" />,
      title: "Wide Angle 360° Lens",
      desc: "Ultra-wide optical glass lens eliminating room blind spots with zero fisheye distortion."
    },
    {
      icon: <Activity size={28} className="text-[#E63946]" />,
      title: "Remote Mobile Monitoring",
      desc: "Instant encrypted live streaming and motion playback directly on your iOS or Android app."
    }
  ];

  return (
    <section className="section-padding bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
            <Sparkles size={14} /> Core System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Smart Security <span className="text-[#E63946]">Key Features</span> System
          </h2>
          <p className="text-slate-600 text-base">
            Engineered with high-precision optics and deep AI analytics for continuous peace of mind.
          </p>
        </div>

        {/* 3-Column Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 perspective-container">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="glass-card card-3d card-spacing border border-gray-200 hover:border-red-300 transition-all flex flex-col justify-between group bg-white shadow-sm hover:shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#E63946] transition-colors">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={onOpenContact}
                  className="text-xs font-black text-[#E63946] hover:text-[#C5221F] flex items-center gap-1 uppercase tracking-wider font-mono-code transition-colors"
                >
                  Learn More Spec <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
