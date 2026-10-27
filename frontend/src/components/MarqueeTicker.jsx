import React from 'react';
import { Sparkles } from './Icons';

export default function MarqueeTicker() {
  const items = [
    "VIDEO MONITORING",
    "HOME SECURITY",
    "CCTV INSTALLATION",
    "SAFETY NETWORK",
    "INDOOR SURVEILLANCE",
    "MAINTENANCE PLANS",
    "AI VIDEO ANALYTICS",
    "4K ULTRA HD CAMERAS"
  ];

  const marqueeContent = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-gradient-to-r from-[#ea0004] via-[#a30006] to-[#5e0005] text-white py-3.5 font-mono-code font-black text-xs uppercase tracking-widest overflow-hidden border-y-2 border-[#800006] shadow-md relative z-20">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {marqueeContent.map((text, idx) => (
          <div key={idx} className="flex items-center gap-6 shrink-0">
            <span className="hover:scale-105 transition-transform">{text}</span>
            <Sparkles size={14} className="text-white opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}
