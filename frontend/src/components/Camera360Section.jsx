import React, { useState } from 'react';
import { Camera, Radio, CheckCircle2, ChevronRight, Sliders, RefreshCw } from './Icons';

export default function Camera360Section({ onOpenQuoteWithDetails }) {
  const [angle, setAngle] = useState(180);

  const features = [
    { title: "Motion Tracking AI", desc: "Auto follows moving objects across the room" },
    { title: "360° Panoramic Coverage", desc: "Zero blind spot dual-motor pan & tilt mechanism" },
    { title: "Wireless Wi-Fi / 4G", desc: "Easy plug-and-play installation without drilling" },
    { title: "Two-Way Audio Mic", desc: "Real-time voice intercom through mobile app" },
    { title: "Ultra HD Night Color", desc: "Built-in LED spotlight & infrared LEDs" }
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center perspective-container">

          {/* Left Column: Interactive 360 Camera Viewport */}
          <div className="lg:col-span-6">
            <div className="glass-panel p-6 border border-gray-200 space-y-5 card-3d relative bg-slate-50 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Radio size={18} className="text-[#E63946] animate-pulse" />
                  <span className="text-xs font-black text-slate-900 uppercase font-mono-code">
                    360° PAN-TILT LIVE SIMULATOR
                  </span>
                </div>
                <span className="text-xs font-mono-code font-extrabold text-[#E63946] bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                  {angle}° Angle View
                </span>
              </div>

              {/* Viewport Box */}
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-300 bg-slate-900 shadow-inner">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')`,
                    transform: `scale(1.15) translateX(${(angle - 180) / 6}px) rotate(${(angle - 180) / 40}deg)`
                  }}
                />

                <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[#E63946] opacity-80 animate-ping">
                  <RefreshCw size={40} />
                </div>

                <div className="absolute bottom-3 left-4 text-[11px] font-mono-code bg-slate-900/80 px-3 py-1 rounded-lg border border-white/10 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>PTZ DOME: ROTATING ({angle}°)</span>
                </div>
              </div>

              {/* Angle Rotation Control Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono-code text-slate-600 font-bold">
                  <span>0° Left Pan</span>
                  <span className="text-[#E63946] font-extrabold">Drag Angle: {angle}°</span>
                  <span>360° Right Pan</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-[#E63946] cursor-pointer h-2 bg-slate-200 rounded-lg border border-gray-300"
                />
              </div>

            </div>
          </div>

          {/* Right Column: Specifications & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-[#E63946] text-xs font-black uppercase tracking-wider font-mono-code shadow-sm">
              <Camera size={14} /> Home 2 Featured Product
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              360° <span className="text-[#E63946]">Action Camera</span> <br />
              Complete Panoramic Freedom.
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate blind spots entirely. The Lookman 360° Action Camera rotates seamlessly on dual axis motors, providing auto-tracking motion response and instant smartphone notifications.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3.5 bg-slate-50 pl-5 pr-8 py-3 rounded-2xl border border-gray-200 w-full max-w-md">
                  <CheckCircle2 size={18} className="text-[#E63946] shrink-0 self-center my-auto" />
                  <div className="flex flex-col justify-center gap-0.5 pr-2">
                    <div className="font-bold text-slate-900 text-sm leading-snug">{feat.title}</div>
                    <div className="text-slate-600 text-xs leading-relaxed">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (onOpenQuoteWithDetails) {
                  onOpenQuoteWithDetails("Inquiry regarding 360° Action Camera PTZ model");
                }
              }}
              className="glow-btn font-extrabold py-3.5 px-8 text-xs sm:text-sm whitespace-nowrap"
            >
              Inquire 360° Action Camera <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
