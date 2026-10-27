import React from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Phone } from './Icons';

export default function DedicatedSafetySection({ onOpenContact }) {
  const safetyPoints = [
    { title: "24/7 Live Monitoring Support", desc: "Round-the-clock technical helpline and automated incident response." },
    { title: "AI Facial & License Plate Analytics", desc: "Automated perimeter intruder indexing with zero false alarm triggers." },
    { title: "Zero Latency Smartphone Push Alarms", desc: "Instant alert notifications sent directly to your iOS & Android devices." },
    { title: "Comprehensive AMC & Maintenance Plans", desc: "Scheduled lens calibration, firmware updates, and hard drive health checks." }
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center perspective-container">
          
          {/* Left Column: Image of CCTV Technician */}
          <div className="lg:col-span-6 relative">
            <div className="glass-panel p-4 border border-gray-200 shadow-xl rounded-3xl overflow-hidden card-3d bg-slate-50">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                  alt="Lookman Professional CCTV Installation Engineer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-[#E63946] flex items-center justify-center font-bold">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Certified Installation Teams</div>
                      <div className="text-[11px] text-slate-500 font-mono-code">Pan-India Support Network</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full font-mono-code">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checklist */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
              <Sparkles size={14} /> Certified Technician Service
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              We Are Dedicated To Your <br />
              <span className="text-[#E63946] underline decoration-red-200 underline-offset-4">
                Absolute Safety
              </span>
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              From site surveys and lens positioning to cable routing and central AI NVR configuration, Lookman engineers deliver turn-key CCTV surveillance infrastructure.
            </p>

            <div className="space-y-4 pt-2">
              {safetyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-gray-200 hover:border-red-200 transition-colors">
                  <CheckCircle2 size={20} className="text-[#E63946] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{pt.title}</div>
                    <div className="text-slate-600 text-xs mt-0.5">{pt.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button 
                onClick={onOpenContact}
                className="glow-btn font-extrabold py-3.5 px-8 text-xs sm:text-sm whitespace-nowrap"
              >
                Schedule Site Assessment <ChevronRight size={16} />
              </button>
              
              <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-slate-700">
                <Phone size={14} className="text-[#E63946]" /> Helpline: +91 44 4798 2947
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
