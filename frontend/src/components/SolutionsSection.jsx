import React from 'react';
import { Building2, Landmark, ShoppingBag, School, ShieldAlert, Factory, CheckCircle2, ChevronRight, Sparkles } from './Icons';

export default function SolutionsSection({ solutions, onOpenQuoteWithDetails }) {
  const iconMap = {
    school: <School size={28} className="text-[#00F0FF]" />,
    bank: <Landmark size={28} className="text-[#00F0FF]" />,
    'chain-store': <ShoppingBag size={28} className="text-[#00F0FF]" />,
    commercial: <Building2 size={28} className="text-[#00F0FF]" />,
    community: <ShieldAlert size={28} className="text-[#00F0FF]" />,
    industrial: <Factory size={28} className="text-[#00F0FF]" />
  };

  return (
    <section id="solutions-section" className="py-20 bg-cyber-grid border-b border-[#1E293B] relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Domain-Engineered Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Specialized Enterprise Surveillance Architectures
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base">
            From financial vaults and educational campuses to logistics hubs and retail chains, Lookman delivers custom end-to-end security deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
          {solutions.map((sol) => (
            <div 
              key={sol.id}
              className="glass-card card-3d p-8 border border-white/10 hover:border-[#00F0FF]/50 transition-all flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {iconMap[sol.id] || <Building2 size={28} className="text-[#00F0FF]" />}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">{sol.title}</h3>
                  <p className="text-xs text-[#00F0FF] font-bold mt-0.5 font-mono-code">{sol.subtitle}</p>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {sol.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  {sol.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                      <CheckCircle2 size={14} className="text-[#00F0FF] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (onOpenQuoteWithDetails) {
                    onOpenQuoteWithDetails(`Specialized Solution Inquiry for: ${sol.title}`);
                  }
                }}
                className="mt-8 w-full py-3 px-4 bg-[#1E293B] hover:bg-[#00F0FF] hover:text-black text-white text-xs font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-md whitespace-nowrap"
              >
                Inquire Solution Deployment <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
