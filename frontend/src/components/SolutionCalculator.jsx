import React, { useState } from 'react';
import { Calculator, HardDrive, Server, Shield, CheckCircle2, ChevronRight, Sliders, Sparkles } from './Icons';

export default function SolutionCalculator({ onOpenQuoteWithDetails }) {
  const [facilityType, setFacilityType] = useState('warehouse');
  const [indoorCount, setIndoorCount] = useState(12);
  const [outdoorCount, setOutdoorCount] = useState(8);
  const [ptzCount, setPtzCount] = useState(2);
  const [retentionDays, setRetentionDays] = useState(30);
  const [resolutionQuality, setResolutionQuality] = useState('4k');

  const facilities = [
    { id: 'warehouse', label: 'Warehouse & Logistics', desc: 'Perimeter protection, loading docks & inventory racks' },
    { id: 'bank', label: 'Banking & Financial', desc: 'High-definition vault monitoring & cashier counter facial capture' },
    { id: 'campus', label: 'University / Campus', desc: 'Wide-area coverage, parking lots & hall corridors' },
    { id: 'retail', label: 'Retail Chain Store', desc: 'Customer heatmapping, POS transaction sync & loss prevention' }
  ];

  const totalCameras = Number(indoorCount) + Number(outdoorCount) + Number(ptzCount);
  const bitrateMap = { '4k': 6, '5mp': 4, '1080p': 2.5 };
  const avgBitrateMbps = bitrateMap[resolutionQuality] || 4;
  const storageNeededTB = ((totalCameras * avgBitrateMbps * 3600 * 24 * retentionDays) / (8 * 1000 * 1000)).toFixed(1);
  
  let recommendedNvr = "Lookman SNVR-V0216 (16 CH 4K)";
  if (totalCameras > 64) {
    recommendedNvr = "Lookman SNVR-V16128 (128 CH Enterprise AI)";
  } else if (totalCameras > 32) {
    recommendedNvr = "Lookman SNVR-V0864 (64 CH 4K AI)";
  } else if (totalCameras > 16) {
    recommendedNvr = "Lookman SNVR-V0432AI (32 CH Precision AI)";
  }

  const handleRequestQuote = () => {
    const summary = `Facility: ${facilityType.toUpperCase()} | Cameras: ${totalCameras} (${indoorCount} Indoor, ${outdoorCount} Outdoor, ${ptzCount} PTZ) | Retention: ${retentionDays} Days | Resolution: ${resolutionQuality.toUpperCase()} | Storage Estimate: ${storageNeededTB} TB | Recommended: ${recommendedNvr}`;
    if (onOpenQuoteWithDetails) {
      onOpenQuoteWithDetails(summary);
    }
  };

  return (
    <section id="calculator-section" className="py-20 bg-[#F8FAFC] border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="badge-red min-h-[28px] px-4 py-1">
            <Calculator size={13} />
            <span>Interactive System Estimator</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#12182b] tracking-tight">
            <span>Smart CCTV Storage &amp; </span>
            <span className="hero-title-gradient font-bold">Hardware Calculator</span>
          </h2>
          <p className="font-body text-slate-600 text-xs sm:text-sm">
            Customize facility parameters to calculate exact NVR channel requirements and RAID hard drive storage capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start perspective-container">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-8 border border-gray-200 card-3d bg-white shadow-md">
            
            {/* Step 1: Facility Type */}
            <div>
              <label className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider block mb-3 font-mono-code">
                1. Select Facility Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => setFacilityType(fac.id)}
                    className={`p-4 rounded-xl text-left border transition-all card-3d ${
                      facilityType === fac.id
                        ? 'bg-red-50 border-[#E63946] text-slate-900 shadow-md font-bold'
                        : 'bg-slate-50 border-gray-200 text-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{fac.label}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{fac.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Camera Counts */}
            <div>
              <label className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider block mb-4 font-mono-code">
                2. Adjust Surveillance Camera Quantities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Indoor Dome */}
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 whitespace-nowrap">Indoor 4K Domes</div>
                  <div className="flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setIndoorCount(Math.max(0, indoorCount - 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >-</button>
                    <span className="text-xl font-mono-code font-black text-[#E63946]">{indoorCount}</span>
                    <button 
                      onClick={() => setIndoorCount(indoorCount + 1)}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >+</button>
                  </div>
                </div>

                {/* Outdoor Bullet */}
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 whitespace-nowrap">Outdoor IP66 Bullets</div>
                  <div className="flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setOutdoorCount(Math.max(0, outdoorCount - 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >-</button>
                    <span className="text-xl font-mono-code font-black text-[#E63946]">{outdoorCount}</span>
                    <button 
                      onClick={() => setOutdoorCount(outdoorCount + 1)}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >+</button>
                  </div>
                </div>

                {/* PTZ Cameras */}
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 whitespace-nowrap">Optical PTZ Speed Domes</div>
                  <div className="flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setPtzCount(Math.max(0, ptzCount - 1))}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >-</button>
                    <span className="text-xl font-mono-code font-black text-[#E63946]">{ptzCount}</span>
                    <button 
                      onClick={() => setPtzCount(ptzCount + 1)}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:bg-[#E63946] hover:text-white text-slate-800 font-black transition-colors flex items-center justify-center shrink-0 shadow-sm"
                    >+</button>
                  </div>
                </div>

              </div>
            </div>

            {/* Step 3: Retention Days & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider block mb-2 font-mono-code">
                  3. Retention Period (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setRetentionDays(d)}
                      className={`py-2.5 px-2 text-xs font-extrabold font-mono-code rounded-xl border transition-all whitespace-nowrap flex items-center justify-center ${
                        retentionDays === d
                          ? 'bg-[#E63946] text-white border-[#E63946] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider block mb-2 font-mono-code">
                  4. Stream Resolution Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '4k', label: '4K H.265+' },
                    { id: '5mp', label: '5MP HD' },
                    { id: '1080p', label: '1080P Std' }
                  ].map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setResolutionQuality(res.id)}
                      className={`py-2.5 px-2 text-xs font-extrabold rounded-xl border transition-all whitespace-nowrap flex items-center justify-center ${
                        resolutionQuality === res.id
                          ? 'bg-[#E63946] text-white border-[#E63946] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Output Summary Card */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 border border-red-200 space-y-6 shadow-xl relative card-3d bg-white">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#E63946] text-white font-extrabold text-[10px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-red-500/20 whitespace-nowrap">
              Live Calculated Spec
            </div>

            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Sparkles className="text-[#E63946]" /> Estimated System Blueprint
            </h3>

            {/* Spec Metrics */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#E63946]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Total Camera Count</div>
                    <div className="text-lg font-black text-slate-900 font-mono-code">{totalCameras} Units</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#E63946] bg-red-50 px-2.5 py-1 rounded-md border border-red-200 whitespace-nowrap">Active</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#E63946]">
                    <HardDrive size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Estimated Storage ({retentionDays} Days)</div>
                    <div className="text-xl font-black text-[#E63946] font-mono-code">{storageNeededTB} TB RAID</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#E63946]">
                    <Server size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Recommended NVR Hardware</div>
                    <div className="text-sm font-bold text-slate-900">{recommendedNvr}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features check */}
            <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-gray-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#E63946] shrink-0" />
                <span>Includes Smart H.265+ Compression Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#E63946] shrink-0" />
                <span>Supports Dual Gigabit Failover Network Interfaces</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#E63946] shrink-0" />
                <span>Pre-configured with Lookman AI Motion Analytics</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleRequestQuote}
              className="w-full glow-btn font-extrabold py-4 text-center flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
            >
              Get Custom Quote For This Calculation <ChevronRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
