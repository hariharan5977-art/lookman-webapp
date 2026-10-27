import React from 'react';
import { Shield, Building2, Eye, ChevronRight, CheckCircle2 } from './Icons';

export default function TrustedSolutionsGrid({ onExploreProducts, onOpenQuoteWithDetails }) {
  const cards = [
    {
      id: 'commercial',
      title: 'Commercial Premises',
      subtitle: 'Multi-Floor & Retail Hubs',
      image: 'https://lookman.xyz/wp-content/uploads/2025/04/SHD-VD201LCM.png',
      desc: 'High-density 4K dome cameras, entrance facial recognition, and POS register synchronization.',
      features: ['Facial Recognition AI', 'Multi-Floor Matrix', '24/7 Remote Command']
    },
    {
      id: 'home',
      title: 'Home CCTV Installation',
      subtitle: 'Smart Residential Protection',
      image: 'https://lookman.xyz/wp-content/uploads/2025/04/SNVR-V0432Ai.png',
      desc: 'Discreet night-vision dome cameras, smartphone push alarms, and cloud backup for total peace of mind.',
      features: ['Mobile App Live Stream', 'Intruder Motion Sensor', 'Encrypted Cloud Storage']
    },
    {
      id: 'wireless',
      title: 'Smart Wireless CCTV',
      subtitle: 'Zero Cable Solar & Wi-Fi',
      image: 'https://lookman.xyz/wp-content/uploads/2025/04/SHD-VD201LCM.png',
      desc: 'Long-range wireless transmission, solar-rechargeable battery power, and weatherproof IP66 casing.',
      features: ['Solar Panel Power', 'Long Range Wi-Fi/4G', 'Rugged Weatherproof']
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC] border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
            <Shield size={14} /> Comprehensive Domain Protection
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Trusted <span className="text-[#E63946]">Security Solutions</span> For Every Space
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered specifically for business headquarters, private residences, and sprawling outdoor assets.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-container">
          {cards.map((card) => (
            <div
              key={card.id}
              className="glass-card card-3d p-6 border border-gray-200 hover:border-red-300 transition-all flex flex-col justify-between group relative overflow-hidden bg-white shadow-sm hover:shadow-xl"
            >
              {/* Card Image Box */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-gray-100 flex items-center justify-center h-48 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-h-36 object-contain relative z-10 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#E63946] uppercase tracking-wider font-mono-code bg-red-50 px-2.5 py-0.5 rounded border border-red-100 inline-block">
                  {card.subtitle}
                </span>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#E63946] transition-colors">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>

                <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                  {card.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold">
                      <CheckCircle2 size={14} className="text-[#E63946] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (onOpenQuoteWithDetails) {
                    onOpenQuoteWithDetails(`Inquiry for solution: ${card.title}`);
                  }
                }}
                className="mt-6 w-full glow-btn font-extrabold py-3 text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                Explore Solution Setup <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
