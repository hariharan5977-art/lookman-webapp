import React from 'react';
import { Sparkles, Users, CheckCircle2, Shield } from './Icons';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Rajesh K. Sharma",
      role: "Head of Logistics",
      company: "Apex Warehousing India",
      quote: "Lookman SNVR AI system gave us full perimeter tracking with zero false alarms. The 4K resolution clarity is extraordinary even in dark dock yards.",
      stars: 5
    },
    {
      name: "Ananya Deshmukh",
      role: "Operations Director",
      company: "Vanguard Commercial Towers",
      quote: "We deployed 64 Lookman IP cameras across our IT park. The 360 PTZ speed domes and instant mobile app alerts transformed our security management.",
      stars: 5
    },
    {
      name: "Vikramaditya Rao",
      role: "Security Chief",
      company: "State Financial Bank",
      quote: "Compliance and encrypted RAID storage were critical for our bank vault monitoring. Lookman delivered robust hardware with 99.9% uptime reliability.",
      stars: 5
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
            <Sparkles size={14} /> Client Trust & Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Our Customers Share Their <span className="text-[#E63946]">Success Stories</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Trusted by logistics hubs, banking vaults, educational institutions, and retail chains across the country.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 perspective-container">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="glass-card card-3d p-8 border border-gray-200 hover:border-red-300 transition-all flex flex-col justify-between bg-slate-50 shadow-sm hover:shadow-xl"
            >
              <div className="space-y-4">
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed font-medium">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 text-[#E63946] font-black flex items-center justify-center text-sm font-mono-code">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{rev.name}</div>
                  <div className="text-[11px] text-[#E63946] font-bold">{rev.role} • {rev.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Counter Bar */}
        <div className="glass-panel p-8 border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 shadow-lg card-3d">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="space-y-1 py-2">
              <div className="text-4xl font-black text-slate-900 font-mono-code">130+</div>
              <div className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider">Completed Projects</div>
              <p className="text-[11px] text-slate-600">Industrial & Enterprise Deployments</p>
            </div>

            <div className="space-y-1 py-2">
              <div className="text-4xl font-black text-[#E63946] font-mono-code">99%</div>
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Client Satisfaction Rate</div>
              <p className="text-[11px] text-slate-600">Continuous Uptime Performance</p>
            </div>

            <div className="space-y-1 py-2">
              <div className="text-4xl font-black text-slate-900 font-mono-code">10K+</div>
              <div className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider">Active Installed Cameras</div>
              <p className="text-[11px] text-slate-600">24/7 Live Monitoring Active</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
