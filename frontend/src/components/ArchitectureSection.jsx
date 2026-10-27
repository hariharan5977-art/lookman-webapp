import React, { useState } from 'react';
import { Camera, Server, HardDrive, Wifi, Shield, Cpu, Activity, CheckCircle2, ArrowRight } from './Icons';

export default function ArchitectureSection() {
  const [activeNode, setActiveNode] = useState('snvr');

  const nodes = [
    {
      id: 'camera',
      title: '1. Lookman 4K IP Cameras',
      icon: <Camera size={26} className="text-[#00F0FF]" />,
      short: 'Edge Capture',
      desc: 'Starlight CMOS Sensors, H.265+ encoding & AI perimeter detection.',
      specs: ['Up to 4K Ultra HD Resolution', 'IP66 Weatherproof Housing', 'Smart IR / Color Night Vision', 'Built-in Audio Mic']
    },
    {
      id: 'switch',
      title: '2. Gigabit PoE+ Switches',
      icon: <Wifi size={26} className="text-[#00F0FF]" />,
      short: 'Transmission',
      desc: 'High-power 802.3at PoE+ switches supplying up to 250m long-distance signal.',
      specs: ['10/100/1000 Mbps Ports', '250m Extend Mode Power', 'Lightning Surge Protection', 'Zero Packet Drop Architecture']
    },
    {
      id: 'snvr',
      title: '3. Lookman SNVR AI Storage',
      icon: <Server size={26} className="text-[#00F0FF]" />,
      short: 'AI Core Engine',
      desc: 'Deep learning NVR featuring real-time face indexing, vehicle OCR & RAID redundancy.',
      specs: ['Up to 128 Channel Decoding', 'Dual SATA / SAS Hot-Swap Bays', 'Face Recognition Engine', 'AES-256 Cloud Encryption']
    },
    {
      id: 'command',
      title: '4. Command Wall & Mobile App',
      icon: <Activity size={26} className="text-[#00F0FF]" />,
      short: 'Client Dashboard',
      desc: 'Instant push alerts, remote multi-screen playback, and web portal access.',
      specs: ['iOS & Android Mobile Apps', 'Video Wall Matrix Split', 'Instant Motion Alarm Push', 'Role-Based Access Control']
    }
  ];

  const selectedNode = nodes.find(n => n.id === activeNode);

  return (
    <section className="py-20 bg-[#050814] border-b border-[#1E293B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-bold uppercase tracking-wider">
            <Cpu size={14} /> System Architecture Topology
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            End-to-End Enterprise Surveillance Infrastructure
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base">
            Click on any component in the network topology below to inspect technical specifications and data flow mechanics.
          </p>
        </div>

        {/* Topology Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 relative perspective-container">
          {nodes.map((node, idx) => (
            <div 
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`glass-panel p-6 cursor-pointer border transition-all duration-300 relative group card-3d ${
                activeNode === node.id
                  ? 'border-[#00F0FF] bg-[#00F0FF]/15 shadow-xl shadow-[#00F0FF]/20 scale-[1.02]'
                  : 'border-white/10 hover:border-white/30 bg-[#0F172A]'
              }`}
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#070B19] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {node.icon}
                </div>
                <span className="text-[10px] font-mono-code font-extrabold px-2 py-0.5 rounded bg-white/10 text-[#00F0FF] whitespace-nowrap">
                  NODE 0{idx + 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors">{node.title}</h3>
              <p className="text-xs text-[#94A3B8] line-clamp-2">{node.desc}</p>

              {/* Connecting Flow Arrow (on desktop) */}
              {idx < nodes.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF]">
                    <ArrowRight size={12} className="animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Node Specification Detail Box */}
        {selectedNode && (
          <div className="glass-panel p-6 sm:p-8 border border-[#00F0FF]/30 bg-gradient-to-r from-[#0F172A] to-[#0A0F24] shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-3">
                <div className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider font-mono-code">
                  Hardware Component Spec • {selectedNode.short}
                </div>
                <h3 className="text-2xl font-black text-white">{selectedNode.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {selectedNode.desc}
                </p>
              </div>

              <div className="md:col-span-6 bg-[#050814] p-5 rounded-xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-3">
                  Technical Capability Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedNode.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#CBD5E1]">
                      <CheckCircle2 size={14} className="text-[#00F0FF] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
