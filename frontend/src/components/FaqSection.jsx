import React, { useState } from 'react';
import { Sparkles, ChevronDown, Phone, Mail, ShieldCheck } from './Icons';

export default function FaqSection({ onOpenContact }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is the warranty period for Lookman CCTV equipment?",
      a: "All Lookman IP cameras, HD cameras, and SNVR recorders come with a comprehensive 3-Year On-Site Manufacturer Warranty and dedicated pan-India technical support."
    },
    {
      q: "Can I access live camera feeds on my smartphone?",
      a: "Yes! Our iOS and Android mobile applications provide AES-256 encrypted multi-camera live streaming, PTZ remote control, and instant intruder push alert playback."
    },
    {
      q: "How many days of video retention does an NVR support?",
      a: "Depending on your selected SATA hard drive bay capacity (e.g., 4TB to 64TB RAID arrays), Lookman NVRs store 15, 30, 60, or 90+ days of continuous 4K H.265+ optimized footage."
    },
    {
      q: "Do Lookman cameras operate during power outages?",
      a: "Yes. When connected to PoE switches with backup UPS systems or solar-powered battery units, surveillance feeds operate 24/7 without interruption."
    }
  ];

  return (
    <section className="section-padding bg-[#F8FAFC] border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start perspective-container">
          
          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
                <Sparkles size={14} /> Help & Guidance
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Answers To Frequently Asked <span className="text-[#E63946]">Customer Questions</span>
              </h2>
              <p className="text-slate-600 text-sm">
                Everything you need to know about Lookman CCTV equipment, mobile apps, and warranty support.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="glass-card border border-gray-200 overflow-hidden transition-all bg-white shadow-sm"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left font-bold text-slate-900 text-base flex items-center justify-between gap-4 hover:text-[#E63946] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`shrink-0 transition-transform duration-300 text-[#E63946] ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Assistance Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-8 border border-gray-200 shadow-xl space-y-6 bg-white card-3d">
              <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 text-[#E63946] flex items-center justify-center font-bold">
                <ShieldCheck size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Need Further Technical Help?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our surveillance engineers are available 24/7 to answer your camera layout questions and calculate custom NVR storage setups.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-mono-code">
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
                  <Phone size={16} className="text-[#E63946]" />
                  <span className="font-bold text-slate-900">+91 44 4798 2947</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
                  <Mail size={16} className="text-[#E63946]" />
                  <span className="font-bold text-slate-900">contact@lookman.xyz</span>
                </div>
              </div>

              <button
                onClick={onOpenContact}
                className="w-full glow-btn font-extrabold py-3.5 text-xs uppercase tracking-wider whitespace-nowrap"
              >
                Contact Support Desk
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
