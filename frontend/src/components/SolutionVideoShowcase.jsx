import React, { useRef, useEffect } from 'react';
import { Shield, Eye, Check } from './Icons';

// ─── 7 DEDICATED REAL LIVE MOTION CCTV SURVEILLANCE VIDEOS ───
const TOPIC_SOLUTIONS_CONFIG = {
  school: {
    id: 'school',
    name: 'School & Campus',
    camId: 'CAM-04 SCHOOL HALLWAY',
    videoSrc: '/videos/sol_school.mp4',
    badge: 'EDUCATIONAL CCTV SURVEILLANCE',
    camModel: 'LOOKMAN SIP-VPS8032AI [4K Ultra Smart PTZ]',
    desc: 'Real CCTV surveillance footage of students walking through campus corridors with live facial detection, tracking tags, and hallway flow monitoring.',
    features: [
      { title: 'Student Facial Recognition', desc: 'Real-time deep learning facial identification with confidence ratings up to 99%.' },
      { title: 'Corridor Flow Tracking', desc: 'Continuous pedestrian movement trajectory mapping across school corridors.' },
      { title: 'Restricted Area AI Alert', desc: 'Instant event alerts when unauthorized individuals approach staff-only doorways.' }
    ]
  },
  hospital: {
    id: 'hospital',
    name: 'Healthcare & Hospital',
    camId: 'CAM-04 HEALTHCARE CORRIDOR',
    videoSrc: '/videos/sol_hospital.mp4',
    badge: 'HEALTHCARE 24/7 CCTV DEFENSE',
    camModel: 'LOOKMAN SHD-VD201LCM [2-Way Audio Dome]',
    desc: 'Real CCTV surveillance video of nurse and patient walking through hospital corridors with live AI bounding box tracking and access compliance monitoring.',
    features: [
      { title: 'Triage Admissions AI', desc: 'High-definition 2-way audio surveillance and staff detection at triage intake stations.' },
      { title: 'Sterile Touchless Access', desc: 'Touchless facial recognition biometric door release for surgical and ICU suites.' },
      { title: 'Patient Safety Monitoring', desc: 'Continuous 24/7 staff & patient movement surveillance with zero blindspots.' }
    ]
  },
  bank: {
    id: 'bank',
    name: 'Banking & Financial',
    camId: 'CAM-04 BANK PERIMETER & VAULT',
    videoSrc: '/videos/sol_bank.mp4',
    badge: 'BANKING FORENSIC CCTV SYSTEM',
    camModel: 'LOOKMAN SHD-VD201LCM [4K POS Sync]',
    desc: 'Real high-security CCTV night surveillance footage demonstrating perimeter defense, automated vehicle license plate recognition, and gate access control.',
    features: [
      { title: 'Night Perimeter Defense', desc: 'Infrared AI tripwires detect unauthorized after-hours perimeter approach.' },
      { title: 'Automated ANPR Gate Access', desc: 'Instant optical character recognition reads approaching vehicle plates in 0.001 Lux.' },
      { title: 'Vault Dual Biometrics', desc: 'Seismic shock sensors with dual-officer interlock authentication.' }
    ]
  },
  'industrial-park': {
    id: 'industrial-park',
    name: 'Industrial & Logistics',
    camId: 'CAM-04 WAREHOUSE FLOOR',
    videoSrc: '/videos/sol_industrial.mp4',
    badge: 'INDUSTRIAL HIGH-BAY CCTV',
    camModel: 'LOOKMAN SIP-VPS8032AI [32X 150m PTZ]',
    desc: 'Real industrial warehouse CCTV surveillance video demonstrating moving forklift vehicle detection, worker PPE compliance tracking, and loading bay safety.',
    features: [
      { title: 'Forklift Vehicle AI', desc: 'Real-time vehicle detection (95% confidence) monitoring operating speed and paths.' },
      { title: 'Worker PPE Tracking', desc: 'Person detected at 98% confidence with helmet and safety vest verification.' },
      { title: 'Proximity Hazard Warning', desc: 'Dynamic safety zones alert forklift operators when pedestrians enter blindspots.' }
    ]
  },
  community: {
    id: 'community',
    name: 'Gated Community & Living',
    camId: 'CAM-04 GATED COMMUNITY GATE',
    videoSrc: '/videos/sol_community.mp4',
    badge: 'GATED COMMUNITY ANPR CCTV',
    camModel: 'LOOKMAN ANPR Starlight Bullet Cam',
    desc: 'Real gated community CCTV night surveillance footage demonstrating moving vehicle license plate recognition (Plate: 7XYZ89) and pedestrian tracking.',
    features: [
      { title: 'Night ANPR Recognition', desc: 'Reads vehicle license plates in nighttime with infrared OCR for zero-wait gate entry.' },
      { title: 'Pedestrian Night Vision', desc: 'Detects pedestrians and residents at night with 0.001 Lux starlight color clarity.' },
      { title: 'Perimeter Intrusion Guard', desc: '24/7 boundary monitoring around residential perimeters.' }
    ]
  },
  'commercial-complex': {
    id: 'commercial-complex',
    name: 'Commercial Complex & Mall',
    camId: 'CAM-04 SHOPPING MALL ATRIUM',
    videoSrc: '/videos/sol_commercial.mp4',
    badge: 'COMMERCIAL ATRIUM CCTV',
    camModel: 'LOOKMAN 12MP Fisheye Panoramic Cam',
    desc: 'Real commercial shopping mall atrium CCTV surveillance footage demonstrating high-volume pedestrian footfall monitoring and crowd flow analysis.',
    features: [
      { title: 'Crowd Footfall Density AI', desc: 'Stereoscopic high-angle cameras track multi-level mall shopper volume in real time.' },
      { title: 'Footpath Trajectory Flow', desc: 'Visualizes customer movement pathways across the shopping mall floor.' },
      { title: 'Loss Prevention AI', desc: 'Detects unattended items and monitors high-value retail zones.' }
    ]
  },
  'chain-store': {
    id: 'chain-store',
    name: 'Retail Chain & Franchise',
    camId: 'CAM-04 RETAIL CHAIN STORE',
    videoSrc: '/videos/sol_retail.mp4',
    badge: 'RETAIL CHAIN CCTV ANALYTICS',
    camModel: 'LOOKMAN 4K POS Text Overlay Cam',
    desc: 'Real retail store CCTV surveillance footage showing customer browsing behavior, dwell time tracking, and store traffic analytics.',
    features: [
      { title: 'Customer Behavior Analytics', desc: 'Tracks shopper movement and interest across store aisles in real time.' },
      { title: 'Trajectory Path Mapping', desc: 'Plots customer shopping journeys to optimize store floor layouts.' },
      { title: 'Queue & Checkout AI', desc: 'Monitors checkout congestion to ensure fast customer throughput.' }
    ]
  }
};

export default function SolutionVideoShowcase({ solutionId = 'school' }) {
  const currentConfig = TOPIC_SOLUTIONS_CONFIG[solutionId] || TOPIC_SOLUTIONS_CONFIG.school;
  const videoRef = useRef(null);

  // Auto-reload and play video whenever solution tab changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled autoplay constraint
        });
      }
    }
  }, [solutionId, currentConfig.videoSrc]);

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6 relative overflow-hidden">

      {/* ── TOP HEADER WITH LIVE CCTV BADGE & TOPIC INFO ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-mono-code font-bold px-2.5 py-0.5 rounded-full bg-[#e73455]/10 text-[#e73455] border border-[#e73455]/20 uppercase tracking-wider">
              {currentConfig.badge}
            </span>
            <span className="text-[11px] font-mono-code text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              REAL LIVE CCTV VIDEO
            </span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#162653] tracking-tight">
            {currentConfig.name} Live CCTV Solution Video
          </h2>
          <p className="font-body text-xs text-slate-500 mt-1 max-w-3xl">
            {currentConfig.desc}
          </p>
        </div>

        {/* Live Camera Model Badge */}
        <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl shrink-0">
          <span className="text-[9px] font-mono-code text-slate-400 uppercase tracking-wider block font-bold">
            SURVEILLANCE CAMERA
          </span>
          <span className="text-xs font-heading font-bold text-[#162653] block mt-0.5">
            {currentConfig.camModel}
          </span>
        </div>
      </div>

      {/* ── REAL 16:9 LIVE CCTV MOTION VIDEO PLAYER ── */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video w-full">
        <video
          ref={videoRef}
          key={`${solutionId}-${currentConfig.videoSrc}`}
          autoPlay
          loop
          muted
          playsInline
          controls
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={currentConfig.videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* ── 3 CORE ARCHITECTURAL CAPABILITY PILLARS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {currentConfig.features.map((feat, fIdx) => (
          <div key={fIdx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0070ba]/10 text-[#0070ba] flex items-center justify-center shrink-0 mt-0.5">
              {fIdx === 0 ? <Shield size={16} /> : fIdx === 1 ? <Eye size={16} /> : <Check size={16} />}
            </div>
            <div>
              <h4 className="text-xs font-heading font-bold text-[#162653]">{feat.title}</h4>
              <p className="text-[11px] font-body text-slate-500 mt-0.5">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
