import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Award,
  CheckCircle2,
  Play,
  X,
  ArrowRight,
  Building2,
  Users,
  Cpu,
  MapPin,
  Layers,
  ShieldCheck,
  UserCheck,
  Clock,
  Lock,
  FileCheck,
  BadgeCheck,
  ExternalLink,
  Eye,
  Wifi,
  Camera,
  Zap,
  Radio,
  Truck,
  Wrench,
  PackageCheck,
  Headphones
} from 'lucide-react';
import ConnectedSecurityNetwork from './ConnectedSecurityNetwork';
import IndiaDistributionMap from './IndiaDistributionMap';
import PorterDeliveryMap from './PorterDeliveryMap';
import useScrollReveal from '../hooks/useScrollReveal';

// Smooth animated running counter matching lookman.xyz Divi number counters
function RunningCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const hasAnimated = React.useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startCounting = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      let startTime = null;
      const animate = (now) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        setCount(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      requestAnimationFrame(animate);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startCounting();
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      startCounting();
    }
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums font-black">
      {count}{suffix}
    </span>
  );
}

const CERTIFICATES_LIST = [
  {
    icon: ShieldCheck,
    title: 'BIS Certified (Bureau of Indian Standards)',
    desc: 'Fully compliant with IS 13252 electronic safety regulations for critical video hardware.',
  },
  {
    icon: Award,
    title: 'ISO 9001:2015 Quality Management',
    desc: 'Strict precision fabrication, lens calibration, and multi-stage burn-in test protocols.',
  },
  {
    icon: Cpu,
    title: 'FCC & CE Electromagnetic Safety',
    desc: 'Zero electromagnetic interference with server rooms, aviation, or banking grids.',
  },
  {
    icon: FileCheck,
    title: 'RoHS Eco-Compliant Industrial Engineering',
    desc: 'Hazard-free materials engineered for extended 24/7 continuous operation in harsh climates.',
  },
  {
    icon: CheckCircle2,
    title: 'UL Certified Electronic & Fire Safety',
    desc: 'Underwriters Laboratories certified surge protection and electrical fire prevention.',
  },
  {
    icon: Layers,
    title: 'ONVIF Compliant Interoperability',
    desc: 'Universal Profile S/G/T interoperability across enterprise NVRs, VMS, and network switches.',
  },
  {
    icon: Lock,
    title: 'ISO 27001 Information Security & Privacy',
    desc: 'Stringent firmware encryption, tamper-proof streams, and zero unauthorized backdoor access.',
  },
  {
    icon: Shield,
    title: 'IP67 & IK10 Weather & Vandal-Proof Rating',
    desc: 'Hermetic dust and monsoon rain sealing combined with 20-Joule impact-resistant housing.',
  },
];

export default function AboutUsPage({ onOpenQuote, onSelectCategory }) {
  const [trustRef, trustVisible] = useScrollReveal({ threshold: 0.1 });
  const [certRef, certVisible] = useScrollReveal({ threshold: 0.1 });
  const [networkRef, networkVisible] = useScrollReveal({ threshold: 0.1 });
  const [installRef, installVisible] = useScrollReveal({ threshold: 0.1 });
  const [porterRef, porterVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="w-full bg-transparent font-body text-slate-800">

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO INTRODUCTION
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-[2000px] mx-auto wide-2000-flush pt-4 pb-10 sm:pb-14 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-20 w-full">

          {/* Left Column: Core Narrative — Widened for spacious horizontal presentation */}
          <div className="w-full flex-1 max-w-4xl space-y-6 text-left anim-card-slide-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-[#ea0004] border border-rose-100/80 text-xs font-heading font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ea0004] animate-pulse" />
              <span>35+ Years of Proven Excellence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-heading font-black text-[#12182b] tracking-tight leading-[1.14]">
              35+ Years of Trusted{' '}
              <span 
                className="hero-title-gradient"
                style={{
                  background: 'linear-gradient(to right, #ea0004 0%, #6a0006 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                }}
              >
                Surveillance Solutions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl xl:max-w-3xl">
              Delivering precision-engineered CCTV systems that secure industries, businesses, and institutions across India.
            </p>

            <div className="pt-1">
              <button
                onClick={() => onOpenQuote('')}
                className="group inline-flex items-center gap-3 text-white text-sm sm:text-base font-heading font-bold px-7 py-3 rounded-full shadow-md hover:shadow-xl hover:opacity-95 transition-all cursor-pointer transform active:scale-98"
                style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
              >
                <span>Let's Connect</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Client logos */}
            <div className="pt-5 border-t border-slate-200/80 flex flex-wrap md:flex-nowrap items-center gap-4 sm:gap-6">
              <div className="flex items-center -space-x-1.5 sm:space-x-2 shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#ea0004] p-1 flex items-center justify-center shadow-xs overflow-hidden" title="Tamil Nadu Police">
                  <img src="/logo_tn_police_hd.png" alt="Tamil Nadu Police Logo" className="w-full h-full object-contain" />
                </div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#ea0004] p-1 flex items-center justify-center shadow-xs overflow-hidden" title="Reserve Bank of India (RBI)">
                  <img src="/logo_rbi.svg" alt="Reserve Bank of India Logo" className="w-full h-full object-contain" />
                </div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#ea0004] p-1 flex items-center justify-center shadow-xs overflow-hidden" title="ISRO">
                  <img src="/logo_isro.svg" alt="ISRO Logo" className="w-full h-full object-contain" />
                </div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#ea0004] p-1 flex items-center justify-center shadow-xs overflow-hidden" title="Greater Chennai Police">
                  <img src="/logo_chennai_police_hd.png" alt="Greater Chennai Police Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm sm:text-base font-heading font-black text-[#ea0004] tracking-tight leading-tight">
                  35+ Years. Countless Installations. One Trusted Name.
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Trusted by state police, national reserves, space agencies &amp; metropolitan grids.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Camera + focus circle — positioned cleanly without shrinking left text */}
          <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end anim-card-slide-right">
            <div className="relative w-[230px] sm:w-[300px] lg:w-[380px] h-[230px] sm:h-[300px] lg:h-[380px] flex items-center justify-center select-none group">

              {/* Background Animated Circle Focus Lines — fills the square box */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                aria-hidden="true"
              >
                {/* SVG Concentric Focus Reticle Lines — Light Grey */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 1. Outermost Focal Degree/Measurement Dial (Rotating CW) */}
                  <g className="anim-focus-cw">
                    <circle cx="250" cy="250" r="235" stroke="#d1d5db" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="4 8" />
                    {[...Array(24)].map((_, i) => {
                      const angle = (i * 15) * (Math.PI / 180);
                      const isMajor = i % 2 === 0;
                      const r1 = 235;
                      const r2 = isMajor ? 223 : 228;
                      const x1 = 250 + r1 * Math.cos(angle);
                      const y1 = 250 + r1 * Math.sin(angle);
                      const x2 = 250 + r2 * Math.cos(angle);
                      const y2 = 250 + r2 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="#d1d5db"
                          strokeOpacity={isMajor ? 0.7 : 0.4}
                          strokeWidth={isMajor ? 1.5 : 1}
                        />
                      );
                    })}
                    <circle cx="250" cy="15" r="3" fill="#d1d5db" fillOpacity="0.8" />
                    <circle cx="485" cy="250" r="3" fill="#d1d5db" fillOpacity="0.8" />
                    <circle cx="250" cy="485" r="3" fill="#d1d5db" fillOpacity="0.8" />
                    <circle cx="15" cy="250" r="3" fill="#d1d5db" fillOpacity="0.8" />
                  </g>

                  {/* 2. Middle Segmented Reticle Ring (Rotating CCW) */}
                  <g className="anim-focus-ccw">
                    <circle cx="250" cy="250" r="195" stroke="#d1d5db" strokeOpacity="0.55" strokeWidth="1.75" strokeDasharray="60 40 80 40" />
                    <circle cx="250" cy="250" r="185" stroke="#e5e7eb" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="4 12" />
                  </g>

                  {/* 3. Pulsing Auto-Focus Target Rings */}
                  <g className="anim-focus-pulse">
                    <circle cx="250" cy="250" r="140" stroke="#d1d5db" strokeOpacity="0.65" strokeWidth="1.5" />
                    <circle cx="250" cy="250" r="115" stroke="#d1d5db" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="8 6" />
                    <circle cx="250" cy="250" r="80" stroke="#d1d5db" strokeOpacity="0.55" strokeWidth="1.25" />
                  </g>

                  {/* 4. Precision Crosshairs and Viewfinder Brackets */}
                  <g className="anim-focus-ping">
                    <line x1="250" y1="40" x2="250" y2="105" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="250" y1="105" x2="250" y2="170" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1.5" />
                    <line x1="250" y1="330" x2="250" y2="395" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1.5" />
                    <line x1="250" y1="395" x2="250" y2="460" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="40" y1="250" x2="105" y2="250" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="105" y1="250" x2="170" y2="250" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1.5" />
                    <line x1="330" y1="250" x2="395" y2="250" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1.5" />
                    <line x1="395" y1="250" x2="460" y2="250" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 170 195 L 170 170 L 195 170" stroke="#9ca3af" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M 305 170 L 330 170 L 330 195" stroke="#9ca3af" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M 170 305 L 170 330 L 195 330" stroke="#9ca3af" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M 305 330 L 330 330 L 330 305" stroke="#9ca3af" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>

                  {/* 5. Center Reticle */}
                  <circle cx="250" cy="250" r="16" stroke="#d1d5db" strokeOpacity="0.7" strokeWidth="1" />
                  <circle cx="250" cy="250" r="3" fill="#9ca3af" fillOpacity="0.9" />
                </svg>

              </div>

              {/* PTZ Dome Camera — absolutely centered over the focus circle */}
              <img
                src="/camera_unbranded.png"
                alt="Lookman Surveillance PTZ Speed Dome Camera"
                className="absolute inset-0 m-auto z-10 w-[58%] h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.13)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2 (moved up): WHY PROFESSIONALS TRUST LOOKMAN?
          - Animated floating icons on the LEFT side of the tab
          - Running counters and stats on the RIGHT
          - Full section background image
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={trustRef}
        className="w-full max-w-[2000px] mx-auto relative overflow-hidden"
        style={{
          backgroundImage: 'url(/about_ptz_trust_hd.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Right-side overlay for text readability - vertically adapted on mobile, horizontally on desktop */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b lg:bg-gradient-to-r from-[#f5f5f5]/80 sm:from-[#f5f5f5]/85 via-[#f5f5f5]/95 to-[#f5f5f5] lg:from-[rgba(245,245,245,0.15)] lg:via-[rgba(245,245,245,0.65)] lg:to-[#f5f5f5]"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[440px] sm:min-h-[520px] overflow-hidden">

          {/* LEFT: Premium Animated Connected Security Network Graphic */}
          <div className={`flex items-center justify-center relative overflow-hidden py-4 sm:py-6 lg:py-0 w-full ${trustVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
            <ConnectedSecurityNetwork />
          </div>

          {/* RIGHT: Heading + Stats */}
          <div className={`flex items-center px-4 sm:px-10 lg:px-12 py-8 sm:py-16 lg:py-20 ${trustVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
            <div className="w-full space-y-6 sm:space-y-8 text-left">

              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-heading font-black text-[#12182b] tracking-tight leading-[1.15]">
                Why Professionals <br className="hidden sm:inline" />
                Trust Lookman?
              </h2>

              {/* 3 Stats: Compact 3-Column Grid on Mobile for Instant Glanceability */}
              <div className="grid grid-cols-3 gap-2 sm:gap-8 lg:gap-12 pt-1 items-start">

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-[#ea0004]">
                    <Award className="w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl sm:text-4xl lg:text-[56px] font-heading font-black text-[#ea0004] tracking-tight leading-none">
                    <RunningCounter target={35} suffix="+" duration={1800} />
                  </div>
                  <p className="text-[10.5px] sm:text-sm lg:text-[15px] font-body font-semibold text-slate-700 leading-snug">
                    years of<br className="hidden sm:inline" /> surveillance<br className="hidden sm:inline" /> expertise
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-[#ea0004]">
                    <Users className="w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl sm:text-4xl lg:text-[56px] font-heading font-black text-[#ea0004] tracking-tight leading-none">
                    <RunningCounter target={500} suffix="+" duration={2200} />
                  </div>
                  <p className="text-[10.5px] sm:text-sm lg:text-[15px] font-body font-semibold text-slate-700 leading-snug">
                    businesses &amp;<br className="hidden sm:inline" /> industries<br className="hidden sm:inline" /> secured
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-[#ea0004]">
                    <ShieldCheck className="w-7 h-7 sm:w-10 sm:h-10 lg:w-11 lg:h-11" strokeWidth={1.5} />
                  </div>
                  <div className="text-2xl sm:text-4xl lg:text-[56px] font-heading font-black text-[#ea0004] tracking-tight leading-none">
                    <RunningCounter target={10} suffix="K+" duration={2000} />
                  </div>
                  <p className="text-[10.5px] sm:text-sm lg:text-[15px] font-body font-semibold text-slate-700 leading-snug">
                    CCTV units<br className="hidden sm:inline" /> deployed<br className="hidden sm:inline" /> across India
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CERTIFICATIONS WE HAVE DONE
          (Positioned below Why Professionals Trust Lookman)
      ───────────────────────────────────────────────────────────── */}
      <section ref={certRef} className="w-full max-w-[2000px] mx-auto wide-2000-flush pt-6 sm:pt-8 pb-10 sm:pb-14 overflow-hidden">
        <div className={`w-full bg-transparent border-0 shadow-none text-left ${certVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

          <div className="w-full">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-[#ea0004] border border-rose-100/80 text-xs font-heading font-bold uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#ea0004] animate-pulse" />
              <span>We Have Done</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-heading font-black text-[#12182b] leading-[1.15] tracking-tight">
              Quality Standards &amp; Certifications We Have Done
            </h2>

            <div className="text-base sm:text-lg lg:text-[20px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-1">
              Validated for High-Security Deployments Across India
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-3.5 mb-7 sm:mb-8 max-w-3xl">
              Our surveillance products are tested and manufactured to meet India's highest quality, electrical safety, and tamper-resistance specifications.
            </p>

            {/* Each certificate in a separate individual card with premium floating badge outside */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-12 sm:gap-y-14 w-full pt-8 pb-4">
              {CERTIFICATES_LIST.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="group relative bg-white rounded-2xl pt-10 sm:pt-11 pb-5 sm:pb-6 px-5 sm:px-6 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between items-center text-center"
                  >
                    {/* Premium Floating Medal / Badge outside the card on top center */}
                    <div className="absolute -top-7 sm:-top-7.5 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#ff3337] via-[#ea0004] to-[#a00003] text-white flex items-center justify-center shadow-[0_10px_24px_-4px_rgba(234,0,4,0.38),0_4px_10px_rgba(0,0,0,0.06)] ring-[5px] ring-white group-hover:scale-110 group-hover:rotate-1 group-hover:shadow-[0_16px_32px_-4px_rgba(234,0,4,0.55)] transition-all duration-300">
                        {/* High-end specular gloss overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
                        <IconComp size={24} className="relative z-10 text-white drop-shadow-xs" />
                      </div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#12182b] group-hover:text-[#ea0004] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-2.5">
                        {item.desc}
                      </p>
                    </div>

                    <div className="w-full pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Verified Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full pt-5 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 size={16} /> 100% Lab Tested &amp; Approved
            </span>
            <span className="font-semibold text-slate-600">Lookman Surveillance</span>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: DISTRIBUTOR & DEALER NETWORK ACROSS INDIA
          Text content on the LEFT, authentic India Map on the RIGHT
      ───────────────────────────────────────────────────────────── */}
      <section ref={networkRef} className="w-full max-w-[2000px] mx-auto pb-8 sm:pb-12 overflow-hidden">
        <div className={`w-full bg-[#f8f9fc] border-0 shadow-none rounded-none sm:rounded-2xl lg:rounded-3xl py-6 sm:py-8 lg:py-10 px-6 sm:px-10 lg:px-12 xl:px-14 text-left ${networkVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

            {/* LEFT SIDE: Text Contents */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-4.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#ea0004] border border-rose-100/80 text-xs font-heading font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#ea0004] animate-pulse" />
                <span>Pan-India Distribution Network</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[35px] font-heading font-black text-[#12182b] leading-[1.18] tracking-tight">
                We Have Distributor &amp; Dealer Network of{' '}
                <span
                  style={{
                    background: 'linear-gradient(to right, #ea0004 0%, #6a0006 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Surveillance Products
                </span>{' '}
                Across India
              </h2>

              <p className="text-xs sm:text-sm lg:text-[14.5px] text-slate-600 leading-relaxed">
                Operating from our Chennai headquarters, Lookman Distribution manufactures, distributes, and supplies precision-engineered CCTV surveillance systems with direct supply routes and authorized dealer networks connecting Gujarat, Delhi, Bengaluru, Kerala, Odisha, and Hyderabad.
              </p>

              {/* Key Network Highlights - Clean & Seamless (No white space / No bulky card containers) */}
              <div className="space-y-2.5 pt-0.5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200/70 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    HQ
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b]">Central HQ: Chennai</div>
                    <div className="text-[11px] text-slate-500 font-normal">Direct dispatch &amp; master inventory warehouse</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200/70 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    6
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b]">6 Key Regional Corridors</div>
                    <div className="text-[11px] text-slate-500 font-normal">Gujarat • Delhi • Bengaluru • Kerala • Odisha • Hyderabad</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b]">500+ Authorized Dealer Partners</div>
                    <div className="text-[11px] text-slate-500 font-normal">Rapid equipment dispatch &amp; local technical service</div>
                  </div>
                </div>
              </div>

              {/* Interactive Hover Hint */}
              <div className="flex items-center gap-2 text-slate-500 text-[11px] sm:text-xs font-medium pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004] shrink-0 animate-pulse" />
                <span>Hover over any city point or state on the map to view dealer phone number.</span>
              </div>
            </div>

            {/* RIGHT SIDE: India Map */}
            <div className="lg:col-span-7 xl:col-span-7 flex justify-center items-center w-full">
              <IndiaDistributionMap />
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: CCTV INSTALLATION (END-TO-END SOLUTIONS & SERVICE)
      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: CCTV INSTALLATION (END-TO-END SOLUTIONS & SERVICE)
          Fully fitted 2000px, rounded-none (no border radius), wide 16:9 photo with right fade,
          and next-to-next points on the right
      ───────────────────────────────────────────────────────────── */}
      <section ref={installRef} className="w-full max-w-[2000px] mx-auto pb-8 sm:pb-12 overflow-hidden">
        <div className={`w-full bg-[#f8f9fc] border-0 shadow-none rounded-none text-left relative overflow-hidden ${installVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

          {/* Desktop Left Image - Wide 16:9 cinematic photo spanning left & center, fading smoothly towards right */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[52%] xl:w-[50%] pointer-events-none overflow-hidden z-0">
            <img
              src="/cctv_installation_technician_wide.jpg"
              alt="Professional Indian CCTV Installation Technician"
              className="w-full h-full object-cover object-left"
              style={{
                maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent 58% via-[#f8f9fc]/40 76% to-[#f8f9fc] pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center relative z-10 py-6 sm:py-8 lg:py-10 px-6 sm:px-10 lg:px-12 xl:px-14">

            {/* Left Spacer for Desktop */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-full min-h-[480px]" />

            {/* Mobile Fallback Image (Wide 16:9 format) */}
            <div className="block lg:hidden w-full h-[260px] sm:h-[340px] overflow-hidden relative">
              <img
                src="/cctv_installation_technician_wide.jpg"
                alt="Professional Indian CCTV Installation Technician"
                className="w-full h-full object-cover object-left block"
                style={{
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent 70% to-[#f8f9fc] pointer-events-none" />
            </div>

            {/* RIGHT SIDE: Text Contents & Next-to-Next Points */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-5 sm:space-y-6">

              {/* Tab Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-[#ea0004] text-xs font-heading font-bold uppercase tracking-wider mb-2.5">
                  <Wrench size={13} className="text-[#ea0004]" />
                  <span>End-to-End Customer Solutions</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-black text-[#12182b] leading-[1.15] tracking-tight">
                  CCTV Installation &amp; Complete Customer Service
                </h2>

                <div className="text-base sm:text-lg lg:text-[20px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-1">
                  Turnkey Site Feasibility, Precision Mounting &amp; 24/7 After-Sales Support
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-2.5">
                  Lookman provides complete turnkey surveillance deployment for residences, retail chains, factories, and enterprise campuses. We handle the entire lifecycle so you get flawless, uninterrupted coverage with zero hassle.
                </p>
              </div>

              {/* Next-to-Next Points (No Box Cards, No Borders) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4.5 sm:gap-y-5 w-full pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    <Camera size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Comprehensive Site Survey &amp; Lens Planning
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      In-depth blind-spot mapping, focal length calculation, ambient lighting assessment, and neat cable routing layout.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Industrial-Grade Mounting &amp; Cabling
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Concealed wiring, weatherproof IP66 junction boxes, high-gauge RG59/Cat6 shielded conduits, and tamper-resistant fixtures.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    <Wifi size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      NVR Network Setup &amp; Remote Mobile View
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Secure DDNS/static IP configuration, motion-detection zones, cloud backup, and multi-user live streaming on iOS &amp; Android.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-[#ea0004] shrink-0 font-bold text-xs mt-0.5">
                    <Headphones size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Preventative AMC &amp; Priority Customer Service
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Annual maintenance contracts, scheduled lens cleaning, firmware security patches, rapid breakdown visits, and direct telephone support.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area (No Card, No Borders) */}
              <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-[#12182b]">
                    <ShieldCheck size={16} className="text-[#ea0004]" /> 10,000+ Completed Installations
                  </span>
                  <span>•</span>
                  <span>Certified Installation Engineers</span>
                  <span>•</span>
                  <span>100% Workmanship Warranty</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenQuote('CCTV Installation & Service')}
                  className="inline-flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-heading font-bold px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md hover:opacity-95 transition-all cursor-pointer shrink-0 border-0"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <span>Book Installation / Service</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: PORTER SERVICE DELIVERED ALL OVER INDIA
          Fully fitted 2000px, rounded-none (no border radius), wide 16:9 photo on the right with left fade,
          and contents & next-to-next points on the left
      ───────────────────────────────────────────────────────────── */}
      <section ref={porterRef} className="w-full max-w-[2000px] mx-auto pb-14 sm:pb-20 overflow-hidden">
        <div className={`w-full bg-[#f8f9fc] border-0 shadow-none rounded-none text-left relative overflow-hidden ${porterVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>

          {/* Desktop Right Visual - Wide 16:9 animated logistics map with running Tata Ace goods vans & Chennai dispatch */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[70%] xl:w-[67%] 2xl:w-[65%] pointer-events-none overflow-hidden z-0">
            <PorterDeliveryMap />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center relative z-10 py-6 sm:py-8 lg:py-10 px-6 sm:px-10 lg:px-12 xl:px-14">

            {/* LEFT SIDE: Text Contents & Next-to-Next Points (Fitting perfectly across 6 columns) */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6">

              {/* Tab Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-heading font-bold uppercase tracking-wider mb-2.5">
                  <Truck size={13} className="text-amber-700" />
                  <span>Pan-India Logistics Partner</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-black text-[#12182b] leading-[1.15] tracking-tight">
                  Porter Service Delivered All Over India
                </h2>

                <div className="text-base sm:text-lg lg:text-[20px] font-bold bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent leading-[1.15] tracking-tight mt-1">
                  Fast, Insured &amp; Tamper-Proof Doorstep Logistics Across Every Pincode
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-2.5">
                  Powered by Porter on-demand logistics and certified express freight carriers, Lookman guarantees safe, timely dispatch of CCTV cameras, recorders, cables, and accessories directly to dealer hubs and client sites nationwide.
                </p>
              </div>

              {/* Next-to-Next Points (No Box Cards, No Borders) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4.5 sm:gap-y-5 w-full pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs mt-0.5">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Same-Day &amp; Priority Warehouse Dispatch
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Immediate dispatch from our Chennai master distribution warehouse with intra-city Porter instant vans and dedicated cargo lines.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs mt-0.5">
                    <PackageCheck size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      100% Insured &amp; Shock-Proof Packaging
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Electrostatic-safe bubble wrapping, reinforced corrugated cartons, fragile shock absorbers, and tamper-evident security tape.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Direct Doorstep Reach Across All Indian Pincodes
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      Coverage spanning Tier-1 metros, regional commercial centers, upcountry dealer outlets, and remote industrial project facilities.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-[13px] text-[#12182b] leading-snug">
                      Real-Time Consignment Tracking &amp; Coordination
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed mt-1">
                      SMS &amp; WhatsApp airway bill updates, live GPS transit tracking, and proactive logistics coordinators for zero-delay delivery.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area (No Card, No Borders) */}
              <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-[#12182b]">
                    <Truck size={16} className="text-amber-700" /> Porter Delivery Partner
                  </span>
                  <span>•</span>
                  <span>Express Freight Corridors</span>
                  <span>•</span>
                  <span>100% Insured Cargo</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenQuote('Porter Express Delivery')}
                  className="inline-flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-heading font-bold px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md hover:opacity-95 transition-all cursor-pointer shrink-0 border-0"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <span>Book Express Dispatch</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

            {/* Right Spacer for Desktop (6 columns reserved so content and map fit perfectly without excess gap) */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 h-full min-h-[500px]" />

            {/* Mobile Fallback Visual (Animated Logistics Map) */}
            <div className="block lg:hidden w-full h-[320px] sm:h-[400px] overflow-hidden relative">
              <PorterDeliveryMap />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
