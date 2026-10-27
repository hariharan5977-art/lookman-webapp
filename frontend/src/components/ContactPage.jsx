import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Headphones,
  Radio,
  Sparkles
} from 'lucide-react';
import { API_BASE } from '../api';

export default function ContactPage({ onOpenQuoteWithDetails }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    projectType: 'Commercial CCTV Architecture',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.city ? `Customer from ${formData.city}` : 'Direct Contact',
      solution: formData.projectType || 'Commercial CCTV Architecture',
      message: formData.message || (formData.city ? `Inquiry from ${formData.city}` : 'Contact inquiry')
    };

    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('Backend inquiry submission note, saving to local inquiries:', err);
      try {
        const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
        localInqs.unshift({
          ...payload,
          id: 'inq_' + Date.now(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lookman_inquiries', JSON.stringify(localInqs));
      } catch (storageErr) {
        // Safe fallback
      }
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const PROJECT_TYPES = [
    'Commercial CCTV Architecture',
    'Enterprise AI & Facial Recognition',
    'Campus / School Safety Solutions',
    'Residential & Gated Communities',
    'Industrial & Warehouse Security',
    'Wholesale / Dealership Inquiries'
  ];

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">

        {/* ── TWO-COLUMN CONTACT WORKSPACE ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-start">

          {/* ── 1. LEFT COLUMN: DIRECT CONTACT DETAILS & OFFICIAL HEADQUARTERS ── */}
          <div className="w-full lg:w-[330px] xl:w-[350px] 2xl:w-[370px] min-[2000px]:w-[400px] shrink-0 space-y-6 anim-card-slide-left">

            {/* Lookman Official Office Card */}
            <div className="relative border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-lg p-5 sm:p-6 lg:p-6 xl:p-7">
              {/* Animated Background: Style 1 — Luminous Ambient Halo & Gentle Floating Security Emblems */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
                {/* Top-Right Glowing Ambient Radial Halo */}
                <div 
                  className="absolute -top-16 -right-16 w-56 h-56 rounded-full anim-halo-pulse pointer-events-none blur-xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(234,0,4,0.14) 0%, rgba(0,112,186,0.08) 50%, transparent 70%)'
                  }}
                />

                {/* Concentric Water Ripple Aura Rings */}
                <div className="absolute -top-10 -right-10 w-44 h-44 flex items-center justify-center">
                  <div className="absolute w-36 h-36 rounded-full border border-[#ea0004]/20 anim-concentric-1" />
                  <div className="absolute w-36 h-36 rounded-full border border-[#0070ba]/15 anim-concentric-2" />
                  <div className="absolute w-28 h-28 rounded-full border border-dashed border-[#ea0004]/15 anim-frame-spin" />
                  
                  {/* Center Floating Shield Check Icon */}
                  <div className="relative text-[#ea0004]/30 anim-emblem-float">
                    <ShieldCheck size={42} strokeWidth={1.4} />
                  </div>
                </div>

                {/* Floating Head Office Building Watermark (Bottom Right) */}
                <div className="absolute -bottom-8 -right-6 text-slate-400/[0.09] anim-emblem-float" style={{ animationDelay: '2s' }}>
                  <Building2 size={130} strokeWidth={0.9} />
                </div>

                {/* Floating Location Pin Watermark (Center Left) */}
                <div className="absolute top-1/2 -left-4 text-[#ea0004]/[0.08] anim-emblem-float" style={{ animationDelay: '3.5s' }}>
                  <MapPin size={60} strokeWidth={1.2} />
                </div>

                {/* Micro Sparkle Shimmers */}
                <div className="absolute top-12 left-10 text-amber-500/[0.18] anim-emblem-float">
                  <Sparkles size={18} strokeWidth={1.5} />
                </div>
              </div>

              {/* Card Foreground Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1.5 h-6 rounded-full bg-[#ea0004]" />
                  <h2 className="font-heading text-base sm:text-lg font-bold text-[#101f46]">
                    Head Office Information
                  </h2>
                </div>

                <div className="space-y-5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#ea0004] flex items-center justify-center shrink-0 mt-0.5 border border-rose-100">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Office Address</span>
                      <p className="font-semibold text-slate-800 leading-snug mt-0.5">
                        Lookman Distribution Private Ltd
                      </p>
                      <p className="text-slate-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
                        Ground Floor, New No.15, Old No.3, 2nd Street Extension, 3rd Main Road CIT Nagar, Nandanam, Chennai – 600035, Tamil Nadu, India.
                      </p>
                      <a
                        href="https://maps.google.com/?q=Lookman+Distribution+Private+Ltd+CIT+Nagar+Nandanam+Chennai"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#ea0004] hover:underline mt-2 cursor-pointer"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070ba] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Hotline &amp; Landline</span>
                      <a 
                        href="tel:+914447982947" 
                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-[#ea0004] transition-colors block mt-0.5"
                      >
                        +91 44 4798 2947
                      </a>
                      <a 
                        href="tel:+919840012345" 
                        className="text-xs text-slate-500 hover:text-[#ea0004] transition-colors block"
                      >
                        +91 98400 12345 (Sales Support)
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 border border-purple-100">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Email Inquiries</span>
                      <a 
                        href="mailto:contact@lookman.xyz" 
                        className="font-bold text-slate-900 text-sm hover:text-[#ea0004] transition-colors block mt-0.5"
                      >
                        contact@lookman.xyz
                      </a>
                      <a 
                        href="mailto:sales@lookman.xyz" 
                        className="text-xs text-slate-500 hover:text-[#ea0004] transition-colors block"
                      >
                        sales@lookman.xyz (Enterprise Quotes)
                      </a>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-100">
                      <Clock size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Business Hours</span>
                      <p className="font-semibold text-slate-800 text-xs sm:text-sm mt-0.5">
                        Monday – Saturday: 9:30 AM – 6:30 PM IST
                      </p>
                      <p className="text-xs text-slate-500">
                        Sunday: Closed (Critical System Support on Hotline)
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Quick Action Button */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <a
                    href="https://wa.me/919840012345?text=Hello%20Lookman%20Team%2C%20I%20am%20interested%20in%20your%20CCTV%20Security%20Solutions."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-white font-heading font-bold text-sm bg-[#25D366] hover:bg-[#20ba5a] transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare size={17} />
                    <span>Chat Immediately on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ── 2. RIGHT COLUMN: INTERACTIVE GET IN TOUCH / QUOTE FORM ── */}
          <div className="relative overflow-hidden flex-1 w-full bg-white border border-slate-200/90 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 xl:p-12 anim-card-slide-right">
            {/* Animated Background: Style 2 — Orbital Message Satellite & Tilted Elliptical Rings */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
              {/* Ambient Rotating Pastel Mesh Aura */}
              <div 
                className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full anim-aurora-mesh blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,112,186,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)'
                }}
              />
              <div 
                className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full anim-aurora-mesh blur-3xl pointer-events-none"
                style={{
                  animationDirection: 'reverse',
                  background: 'radial-gradient(circle, rgba(234,0,4,0.08) 0%, rgba(0,112,186,0.05) 50%, transparent 70%)'
                }}
              />

              {/* Tilted Elliptical Orbital Ring Track System (Top-Right) */}
              <div className="absolute -top-8 -right-8 w-60 h-60 flex items-center justify-center">
                {/* Orbital Track 1: Tilted Cyan Ellipse */}
                <div 
                  className="absolute w-52 h-28 rounded-[50%] border border-[#0070ba]/20 anim-orbit-ring-1"
                  style={{ transform: 'rotate(-25deg)' }}
                />

                {/* Orbital Track 2: Tilted Violet Dashed Ellipse */}
                <div 
                  className="absolute w-44 h-24 rounded-[50%] border border-dashed border-purple-500/20 anim-orbit-ring-2"
                  style={{ transform: 'rotate(35deg)' }}
                />

                {/* Orbital Center Core: Glowing Pulse Sparkle */}
                <div className="relative text-purple-600/25 anim-signal-core">
                  <Sparkles size={26} strokeWidth={1.4} />
                </div>

                {/* Orbiting Message Satellite: Send Glider following orbit */}
                <div className="absolute anim-satellite-glide text-[#0070ba]/35 drop-shadow-[0_0_8px_rgba(0,112,186,0.4)]">
                  <Send size={24} strokeWidth={1.6} />
                </div>
              </div>

              {/* Floating Large Dialogue Bubble Watermark (Bottom Right) */}
              <div className="absolute bottom-6 right-10 text-purple-600/[0.08] anim-badge-float">
                <MessageSquare size={115} strokeWidth={0.9} />
              </div>

              {/* Floating Technical Support Headset Watermark (Middle Left) */}
              <div className="absolute top-1/3 -left-5 text-[#0070ba]/[0.08] anim-badge-float" style={{ animationDelay: '2.5s' }}>
                <Headphones size={75} strokeWidth={1.1} />
              </div>

              {/* Floating Radio Signal Broadcast (Center Right) */}
              <div className="absolute top-1/2 right-8 text-amber-500/[0.12] anim-badge-float" style={{ animationDelay: '4s' }}>
                <Radio size={36} strokeWidth={1.3} />
              </div>

              {/* Soft Floating Starlight Sparkles */}
              <div className="absolute top-24 left-1/3 text-amber-500/[0.16] anim-badge-float" style={{ animationDelay: '1.5s' }}>
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-24 left-1/4 text-[#ea0004]/[0.10] anim-badge-float" style={{ animationDelay: '3.5s' }}>
                <Sparkles size={18} strokeWidth={1.5} />
              </div>
            </div>

            {/* Card Foreground Content */}
            <div className="relative z-10">
              <div className="border-b border-slate-100 pb-6 mb-8">
                <span className="inline-block text-xs font-bold text-[#ea0004] uppercase tracking-wider mb-1.5">
                  Send Us A Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#101f46]">
                  Speak with Our Surveillance Architects
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl">
                  Whether you need a full enterprise security design, wholesale dealership rates, or technical product datasheets, our dedicated engineers are ready to help.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 px-6 text-center bg-emerald-50/70 border border-emerald-200 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-emerald-900 mb-2">
                    Thank You! Your Inquiry Has Been Received.
                  </h3>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto mb-6">
                    A Lookman surveillance specialist will review your requirement and connect with you shortly via phone or email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        city: '',
                        projectType: 'Commercial CCTV Architecture',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-heading font-bold text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name <span className="text-[#ea0004]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Phone Number <span className="text-[#ea0004]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98400 00000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address <span className="text-[#ea0004]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Chennai, Bengaluru, Hyderabad"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Project / Solution Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Interest / Solution Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Requirement Details / Notes
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about camera count, resolution needs, storage retention, or project timeline..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#ea0004] focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full font-heading font-bold text-white text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                    >
                      {loading ? (
                        <span>Sending Request...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Send Official Inquiry</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-slate-400">
                      🔒 Strictly Confidential &amp; Direct to Technical Desk
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
