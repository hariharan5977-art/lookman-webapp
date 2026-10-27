import React, { useState, useEffect } from 'react';
import { ChevronRight } from './Icons';
import SolutionFlowChart from './SolutionFlowChart';

// ─── LOOKMAN ENTERPRISE SOLUTIONS DATASET (MATCHING TVT SOLUTION PATTERN) ───
export const SOLUTIONS_DATA = [
  {
    id: 'school',
    name: 'School & Campus',
    shortName: 'School',
    title: 'Safe School Solution',
    backgrounds: 'With rapid technology development and expanding school footprints, institutional surveillance governance for personal and property safety over whole school has become essential. Modern schools present features like multi-branch campus sites, insufficient campus security personnel, and large student populations.',
    solutionOverview: 'This solution includes video surveillance system, vehicle management system, access control system, and alarm system, integrating all into one unified system with linkage together, thus effectively improving school security management:',
    solutionModules: [
      { label: 'Video Surveillance System', desc: 'Installs HD cameras at entrances, perimeter fences, and academic hallways; deploys centralized storage and VMS control matrix.' },
      { label: 'Vehicle Management System', desc: 'LPR and VCA technology automatically monitors and regulates all vehicle traffic inside school grounds.' },
      { label: 'Access Control System', desc: 'Controls entrances of teaching buildings, dormitories, and office wings with fast biometric verification.' },
      { label: 'Alarm Linkage System', desc: 'Deploys panic buttons and boundary tripwire deterrence at key areas together with instant guard room popups.' }
    ],
    benefits: [
      'Improves the safety precaution and management level across academic institutions.',
      'Enforces multi-building security systems across classrooms, dormitories, and sports fields.',
      'Prevents unauthorized intrusion with automated LPR barrier gate and perimeter tripwires.',
      'Enables parents and administrative boards to audit campus safety operations smoothly.'
    ],
    applications: [
      { src: '/cctv_school_view.jpg', title: 'Main Campus Entrance' },
      { src: '/cctv_school_hallway_view.jpg', title: 'Academic Corridor Wing' },
      { src: '/cctv_school_1.jpg', title: 'Perimeter Defense Zone' },
      { src: '/cctv_school_2.jpg', title: 'Student Dormitory Entry' }
    ]
  },
  {
    id: 'hospital',
    name: 'Healthcare & Hospital',
    shortName: 'Hospital',
    title: 'Safe Hospital Solution',
    backgrounds: 'Healthcare centers handle continuous 24/7 patient traffic, emergency triage halls, sterile operating theaters, and pharmaceutical vaults. Safeguarding patients, medical staff, and sensitive pharmaceuticals requires specialized forensic audio-video capture and touchless access control.',
    solutionOverview: 'The Safe Hospital Solution unifies sterile zone access governance, emergency ambulance lane ANPR, cashier counter dispute archiving, and pharmaceutical vault protection into a central VMS matrix:',
    solutionModules: [
      { label: 'Forensic Video & Audio System', desc: 'High-sensitivity two-way audio dome cameras archiving interactions at triage, admissions, and cashier counters.' },
      { label: 'Touchless Access Control', desc: 'Hands-free facial verification terminals granting sterile entry into ICUs, operating rooms, and newborn wards.' },
      { label: 'Emergency Vehicle ANPR', desc: 'Priority license plate recognition ensuring ambulance lanes and emergency triage bays remain unobstructed.' },
      { label: 'Vault & Pharmacy Security', desc: 'Dual-credential biometric verification logging access to narcotics vaults and biological laboratories.' }
    ],
    benefits: [
      'Resolves patient and billing disputes with indisputable two-way audio-video evidence.',
      'Maintains sterile protocol compliance with touchless facial recognition access.',
      'Ensures continuous 24/7 protection of pharmaceutical vaults and surgical assets.',
      'Provides real-time emergency triage visibility to medical directors.'
    ],
    applications: [
      { src: '/cctv_hospital_view.jpg', title: 'ER Admissions & Triage' },
      { src: '/cctv_hospital_ward_view.jpg', title: 'Intensive Care Unit Wing' },
      { src: '/cctv_hotel_1.jpg', title: 'Hospital Main Atrium' },
      { src: '/cctv_hotel_2.jpg', title: 'Pharmacy Vault Corridor' }
    ]
  },
  {
    id: 'bank',
    name: 'Banking & Financial',
    shortName: 'Bank',
    title: 'Safe Bank Solution',
    backgrounds: 'Commercial banks, credit unions, and financial branches require mission-critical security that exceeds regulatory auditing standards. Protecting teller transaction counters, 24/7 ATM lobbies, and multi-door cash vaults demands forensic resolution and zero-latency failover.',
    solutionOverview: 'The Financial Bank Vault Matrix unifies POS text overlay, ATM lobby micro-cameras, biometric multi-factor vault interlocks, and multi-branch central command into one system:',
    solutionModules: [
      { label: 'Teller Counter Forensic Capture', desc: 'High-framerate 4K optical sensors recording currency transactions and teller operations with zero motion blur.' },
      { label: 'ATM POS Transaction Overlay', desc: 'Synchronizes ATM card insertion events and transaction totals directly onto live and recorded video feeds.' },
      { label: 'Vault Multi-Door Interlock', desc: 'Biometric multi-factor authentication with anti-tailgating protocols for high-security bank vaults.' },
      { label: 'Multi-Branch HQ Command', desc: 'Consolidates live feeds, silent alarm triggers, and access logs from hundreds of regional branches.' }
    ],
    benefits: [
      'Prevents financial fraud by synchronizing video footage with POS/ATM transaction logs.',
      'Deters branch robbery with silent under-counter duress buttons and instant VMS matrix popup.',
      'Ensures compliance with financial auditing regulations via tamper-proof AES-256 storage.',
      'Enables centralized multi-branch oversight from regional banking headquarters.'
    ],
    applications: [
      { src: '/cctv_bank_view.jpg', title: 'Banking Hall & Teller Desks' },
      { src: '/cctv_atm_view.jpg', title: '24/7 Self-Service ATM Lobby' },
      { src: '/app_bank_branch1.jpg', title: 'Cashier Transaction Counter' },
      { src: '/app_bank_branch2.jpg', title: 'Central Financial Command' }
    ]
  },
  {
    id: 'industrial-park',
    name: 'Industrial & Logistics',
    shortName: 'Industrial Park',
    title: 'Safe Industrial Park Solution',
    backgrounds: 'Manufacturing plants, chemical storage complexes, and freight logistics yards cover massive perimeter boundaries with harsh environmental conditions. Overseeing high-bay storage racks, weighbridges, and loading docks demands industrial-grade hardware and long-range optical thermal surveillance.',
    solutionOverview: 'The Industrial Park Solution combines long-range 150m IR speed domes, automated weighbridge LPR, thermal perimeter tripwires, and centralized VMS command:',
    solutionModules: [
      { label: 'Heavy Industrial Perimeter Domes', desc: 'Ruggedized IP67/IK10 speed domes with 150m IR night vision monitoring extensive boundary fences.' },
      { label: 'Automated Weighbridge ANPR', desc: 'Captures truck license plates, container numbers, and gross weight records automatically at freight gates.' },
      { label: 'High-Bay Storage Surveillance', desc: 'Narrow-angle optical sensors maintaining top-to-bottom visibility across vertical warehouse racks.' },
      { label: 'Thermal & Hazardous Zone Alerts', desc: 'Early thermal heat detection identifying machinery overheating and chemical storage anomalies.' }
    ],
    benefits: [
      'Eliminates cargo theft across vast logistics yards and high-bay storage aisles.',
      'Accelerates freight turnaround time with automated weighbridge license plate logging.',
      'Operates reliably under extreme weather, dust, and electrical surge conditions.',
      'Protects perimeter boundaries against trespassers with long-range thermal tripwires.'
    ],
    applications: [
      { src: '/cctv_industrial_view.jpg', title: 'Logistics Warehouse Aisle' },
      { src: '/cctv_outdoor_1.jpg', title: 'Perimeter Speed Dome View' },
      { src: '/cctv_outdoor_2.jpg', title: 'Heavy Freight Gate ANPR' },
      { src: '/cctv_industrial_1.jpg', title: 'Manufacturing Assembly Line' }
    ]
  },
  {
    id: 'community',
    name: 'Gated Community & Living',
    shortName: 'Community',
    title: 'Safe Community Solution',
    backgrounds: 'Residential gated communities, luxury apartment towers, and housing estates require a seamless balance between resident convenience and uncompromised perimeter security. Protecting perimeter fences, underground parking garages, and community amenities ensures resident peace of mind.',
    solutionOverview: 'The Community Living Solution integrates smart ANPR vehicle barrier gates, resident facial recognition turnstiles, video intercom door stations, and perimeter tripwires:',
    solutionModules: [
      { label: 'Smart Resident ANPR Barriers', desc: 'Fast, automated vehicle barrier opening for registered resident vehicles with guest QR code logging.' },
      { label: 'Building Entrance Intercoms', desc: 'Multi-tenant SIP video door stations enabling residents to verify visitors via smartphone app.' },
      { label: 'Underground Parking Surveillance', desc: 'High-dynamic-range low-light cameras eliminating blind spots in multi-level parking basements.' },
      { label: 'Perimeter Intrusion Defense', desc: 'AI smart tripwires distinguishing humans from pets and swaying trees to eliminate false alarms.' }
    ],
    benefits: [
      'Delivers frictionless access for residents while logging all visitor vehicle entry.',
      'Enhances resident safety with video intercom verification and remote app unlock.',
      'Eliminates false intrusion alarms across residential boundary fences.',
      'Provides property management with centralized multi-tower VMS monitoring.'
    ],
    applications: [
      { src: '/cctv_residential_view.jpg', title: 'Residential Main Gate ANPR' },
      { src: '/cctv_residential_park_view.jpg', title: 'Community Park & Playground' },
      { src: '/cctv_hotel_1.jpg', title: 'Residential Lobby Atrium' },
      { src: '/cctv_hotel_2.jpg', title: 'Underground Parking Garage' }
    ]
  },
  {
    id: 'commercial-complex',
    name: 'Commercial & Retail Mall',
    shortName: 'Commercial Complex',
    title: 'Safe Commercial Complex Solution',
    backgrounds: 'Shopping malls, corporate office towers, and mixed-use commercial centers experience heavy foot traffic, multi-tenant lease spaces, and multi-level parking. Managing public safety, emergency evacuations, and tenant access requires a flexible multi-tenant VMS architecture.',
    solutionOverview: 'The Commercial Complex Security Matrix unifies 360-degree fisheye atrium coverage, occupant heat mapping, tenant access control, and centralized guard room monitoring:',
    solutionModules: [
      { label: '360° Panoramic Atrium Fisheye', desc: 'Single-sensor panoramic fisheye cameras providing total situational coverage of main plaza halls.' },
      { label: 'Commercial Parking Management', desc: 'Automated guidance cameras indicating vacant parking spots and logging vehicle license plates.' },
      { label: 'Tenant Access Partitioning', desc: 'Independent access privileges for anchor tenants while retaining master control in the main guard room.' },
      { label: 'Crowd Density & Heat Mapping', desc: 'Analytics tracking customer flow and peak congestion hours across shopping corridors.' }
    ],
    benefits: [
      'Eliminates blind spots in vast atrium spaces with 360° dewarping fisheye coverage.',
      'Streamlines mall parking with real-time vacant space guidance and LPR auditing.',
      'Provides multi-tenant partitioning for office tower security managers.',
      'Enhances public safety during emergency evacuations with centralized VMS alert linkage.'
    ],
    applications: [
      { src: '/cctv_commercial_view.jpg', title: 'Grand Atrium 360 View' },
      { src: '/cctv_commercial_1.jpg', title: 'Shopping Promenade Hall' },
      { src: '/cctv_commercial_2.jpg', title: 'Multi-Level Mall Parking' },
      { src: '/cctv_hotel_1.jpg', title: 'Corporate Tower Lobby' }
    ]
  },
  {
    id: 'chain-store',
    name: 'Retail Chain & Franchise',
    shortName: 'Chain Store',
    title: 'Safe Chain Store Solution',
    backgrounds: 'Multi-city retail chains and store franchises face inventory shrinkage, checkout cashier errors, and after-hours break-ins across hundreds of branch locations. Overseeing cash registers and store stockrooms remotely requires cloud-connected multi-branch VMS dashboards.',
    solutionOverview: 'The Chain Store Solution combines POS receipt text overlay, edge AI active deterrence sirens, stockroom surveillance, and centralized cloud oversight:',
    solutionModules: [
      { label: 'POS Receipt Text Sync', desc: 'Overlays scanned item barcodes, prices, and register transaction totals directly onto checkout video streams.' },
      { label: 'After-Hours Active Deterrence', desc: 'Intruder detection cameras triggering loud voice sirens and flashing red/blue strobe lights.' },
      { label: 'Stockroom Inventory Defense', desc: '24/7 motion-triggered video archiving protecting merchandise loading bays and storage shelves.' },
      { label: 'Multi-Store Cloud Dashboard', desc: 'Regional managers auditing live video, transaction logs, and customer counts across all branches.' }
    ],
    benefits: [
      'Prevents cashier sweethearting and inventory shrinkage with POS video receipt overlays.',
      'Deters night break-ins instantly with edge AI strobe lights and audible sirens.',
      'Enables regional managers to audit store operations remotely from mobile devices.',
      'Provides foot traffic and queue length analytics to optimize store staffing.'
    ],
    applications: [
      { src: '/cctv_retail_view.jpg', title: 'POS Cashier Checkout Desk' },
      { src: '/cctv_commercial_1.jpg', title: 'Franchise Storefront Entrance' },
      { src: '/cctv_industrial_view.jpg', title: 'Store Stockroom & Loading Bay' },
      { src: '/cctv_commercial_2.jpg', title: 'Regional Cloud VMS Dashboard' }
    ]
  }
];

export default function SolutionsPage({ initialSolutionId = 'school', onSelectProduct, onOpenQuote }) {
  const [activeSolutionId, setActiveSolutionId] = useState(initialSolutionId);

  useEffect(() => {
    if (initialSolutionId) {
      setActiveSolutionId(initialSolutionId);
    }
  }, [initialSolutionId]);

  const activeSolution = SOLUTIONS_DATA.find(s => s.id === activeSolutionId) || SOLUTIONS_DATA[0];

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">
        
        {/* ── MOBILE HORIZONTAL SOLUTION CHIPS (< md) ── */}
        <div className="md:hidden w-full overflow-x-auto pb-3 mb-4 scrollbar-none anim-card-slide-left">
          <div className="flex items-center gap-2 min-w-max px-0.5">
            {SOLUTIONS_DATA.map((sol) => {
              const isActive = activeSolutionId === sol.id;
              return (
                <button
                  key={sol.id}
                  onClick={() => {
                    setActiveSolutionId(sol.id);
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-heading font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:text-[#ea0004]'
                  }`}
                  style={isActive ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
                >
                  {sol.shortName || sol.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TVT TWO-COLUMN LAYOUT: LEFT SIDEBAR (DESKTOP) + RIGHT CONTENT ── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* ── 1. LEFT SIDEBAR NAVIGATION (Desktop Only) ── */}
          <div className="hidden md:block w-full md:w-60 lg:w-64 min-[2000px]:w-72 shrink-0 border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-lg anim-card-slide-left">
            {/* Sidebar Header */}
            <div className="bg-[#f8fafd] text-[#101f46] px-4 py-3 text-sm font-heading font-bold border-b border-slate-200/90 text-left">
              Solution
            </div>
            
            {/* Sidebar Menu Items */}
            <div className="divide-y divide-slate-200/60">
              {SOLUTIONS_DATA.map((sol) => {
                const isActive = activeSolutionId === sol.id;
                return (
                  <button
                    key={sol.id}
                    onClick={() => {
                      setActiveSolutionId(sol.id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`w-full text-left pl-5 pr-4 py-3 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#fcfdfe] shadow-2xs font-bold'
                        : 'bg-white text-slate-700 font-medium hover:bg-slate-50 hover:text-[#ea0004]'
                    }`}
                  >
                    {/* Double-Shaded Gradient Selection Marker Line at Left Edge */}
                    {isActive && (
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xs"
                        style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                      />
                    )}

                    {/* Double-Shaded Gradient Selected Text Color */}
                    <span className={isActive ? 'hero-title-gradient font-bold' : ''}>
                      {sol.shortName || sol.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 2. RIGHT MAIN CONTENT AREA ── */}
          <div className="flex-1 w-full space-y-8 text-left bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-8 lg:p-10 shadow-lg border border-slate-100 anim-card-slide-right">
            
            {/* Main Title with Double-Shaded Gradient Accent Bar */}
            <div className="pb-2 border-b border-slate-100">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#101f46] flex items-center gap-2">
                <span>{activeSolution.title || activeSolution.name}</span>
                <span className="hero-title-gradient font-bold">|</span>
              </h1>
            </div>

            {/* Backgrounds Section */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                Backgrounds
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body font-normal">
                {activeSolution.backgrounds}
              </p>
            </div>

            {/* Solution Section */}
            <div className="space-y-2.5">
              <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                Solution
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body font-normal mb-2">
                {activeSolution.solutionOverview}
              </p>

              {/* Solution Modules Breakdown */}
              <div className="space-y-1.5">
                {activeSolution.solutionModules.map((mod, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed">
                    <strong className="font-heading font-bold text-[#101f46]">{mod.label}:</strong>{' '}
                    <span>{mod.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topography Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                Topography
              </h2>
              
              {/* Interactive Network Topology Diagram */}
              <div className="w-full">
                <SolutionFlowChart solutionId={activeSolutionId} />
              </div>
            </div>

            {/* Customer Benefits Section */}
            <div className="space-y-2 pt-2">
              <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                Customer Benefits
              </h2>

              <div className="space-y-1.5">
                {activeSolution.benefits.map((b, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed">
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Application Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-sm sm:text-base font-heading font-bold text-[#101f46]">
                Typical Application
              </h2>

              {/* Grid of Application Images */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 min-[2000px]:gap-8">
                {activeSolution.applications.map((app, idx) => (
                  <div key={idx} className="group flex flex-col items-center">
                    <div className="w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs group-hover:shadow-md transition-all">
                      <img 
                        src={app.src} 
                        alt={app.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-body text-slate-600 mt-2 text-center line-clamp-1">
                      {app.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
