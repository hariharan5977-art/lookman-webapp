import React from 'react';
import { Cpu, Video, ShieldCheck, Eye, CloudLightning, Activity, Sparkles } from './Icons';

export default function Capabilities3DSection() {
  const leftFeatures = [
    {
      icon: <Eye size={20} className="text-[#E63946]" />,
      title: 'Motion Detection AI',
      desc: 'Real-time human & vehicle perimeter tracking with 0ms alert delay.'
    },
    {
      icon: <Video size={20} className="text-[#E63946]" />,
      title: 'Starlight Night Vision',
      desc: 'Full color clarity even in 0.001 Lux deep night environments.'
    },
    {
      icon: <Activity size={20} className="text-[#E63946]" />,
      title: '24/7 Remote Access',
      desc: 'Seamless live viewing & multi-screen playback on iOS, Android & PC.'
    }
  ];

  const rightFeatures = [
    {
      icon: <Cpu size={20} className="text-[#E63946]" />,
      title: 'Deep Analytics Engine',
      desc: 'Automated facial recognition matching & license plate OCR.'
    },
    {
      icon: <ShieldCheck size={20} className="text-[#E63946]" />,
      title: 'Weatherproof IP66',
      desc: 'IK10 vandal-proof metal casing resistant to dust & heavy rainfall.'
    },
    {
      icon: <CloudLightning size={20} className="text-[#E63946]" />,
      title: 'Multi-Bay RAID Storage',
      desc: 'AES-256 encrypted NVR recording with dual Gigabit network backup.'
    }
  ];

  return (
    <section className="py-20 bg-[#F8FAFC] border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
            <Sparkles size={14} /> Next-Gen Hardware Power
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Smart Security. <span className="text-[#E63946]">Powerful Capabilities.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Integrated multi-sensor intelligence designed for zero blind spot coverage and proactive defense.
          </p>
        </div>

        {/* 3D Capabilities Layout: Left Features | Center Pole Image | Right Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center perspective-container">
          
          {/* Left Feature Column */}
          <div className="lg:col-span-4 space-y-6">
            {leftFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="glass-card card-3d p-5 border border-gray-200 hover:border-red-300 transition-all flex items-start gap-4 animate-float-3d bg-white shadow-sm hover:shadow-md"
                style={{ animationDelay: `${idx * 1.2}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Center 3D Surveillance Camera Graphic */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-red-100/50 blur-[90px] absolute pointer-events-none" />
            <div className="relative z-10 glass-panel p-8 border border-red-200 rounded-3xl shadow-xl flex flex-col items-center text-center card-3d bg-white">
              <img 
                src="https://lookman.xyz/wp-content/uploads/2025/04/SHD-VD201LCM.png" 
                alt="3D Multi-Camera Surveillance Cluster"
                className="max-h-64 object-contain filter drop-shadow-[0_15px_25px_rgba(230,57,70,0.2)] animate-pulse"
              />
              <div className="mt-4 font-mono-code font-bold text-xs text-[#E63946] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                LOOKMAN 4K MULTI-SENSOR POLE
              </div>
            </div>
          </div>

          {/* Right Feature Column */}
          <div className="lg:col-span-4 space-y-6">
            {rightFeatures.map((feat, idx) => (
              <div 
                key={idx}
                className="glass-card card-3d p-5 border border-gray-200 hover:border-red-300 transition-all flex items-start gap-4 animate-float-3d bg-white shadow-sm hover:shadow-md"
                style={{ animationDelay: `${idx * 1.5 + 0.5}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
