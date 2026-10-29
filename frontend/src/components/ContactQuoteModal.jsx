import React, { useState, useEffect, useMemo } from 'react';
import { X, Send, CheckCircle2, Check, Plus, Package } from './Icons';
import { Minus } from 'lucide-react';
import { API_BASE } from '../api';
import ALL_LOOKMAN_PRODUCTS from '../data/allProducts.json';
import { resolveProductCode, resolveProductName } from '../utils/productUtils';

const INSTALLATION_AREAS = [
  { id: 'school', name: 'School', desc: 'Campuses, Classrooms & Hallways', emoji: '🏫' },
  { id: 'housing', name: 'Housing', desc: 'Gated Communities & Apartments', emoji: '🏡' },
  { id: 'parking', name: 'Parking', desc: 'Basements, Entry Gates & Lots', emoji: '🚗' },
  { id: 'commercial', name: 'Commercial', desc: 'Malls, Plazas & Complexes', emoji: '🏬' },
  { id: 'industries', name: 'Industries', desc: 'Factories, Plants & Warehouses', emoji: '🏭' },
  { id: 'office', name: 'Office', desc: 'Corporate Floors & Workspaces', emoji: '🏢' },
  { id: 'company', name: 'Company', desc: 'Headquarters & Facilities', emoji: '🏛️' },
  { id: 'shop', name: 'Shop', desc: 'Retail Showrooms & Stores', emoji: '🛍️' }
];

export default function ContactQuoteModal({ isOpen, onClose, initialDetails, products }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  // Derive available equipment dynamically from active catalog products
  const equipmentList = useMemo(() => {
    const sourceList = Array.isArray(products) && products.length > 0 ? products : ALL_LOOKMAN_PRODUCTS;
    const obsoleteCodes = [
      'CO-IP-401FDA', 'CO-IP-201FDMA', 'CO-PTZ-8032AI', 'CO-PTZ-2025AI', 
      'CO-NVR-0432AI', 'CO-NVR-0216', 'CO-XVR-1615L', 'CO-SW-0802POE',
      'CO-IP-4AIFDS', 'CO-IP-2AIFDRA', 'CO-PTZ-8R12AI'
    ];
    const filtered = sourceList.filter(p => {
      if (!p) return false;
      const m = String(p.model || p.name || p.productCode || p.id || '').toUpperCase().trim();
      const b = String(p.brand || '').toLowerCase().trim();
      const isSecura = m.startsWith('SIP-') || m.startsWith('SHD-') || m.startsWith('SNVR-') || m.startsWith('SXVR-') || b === 'secura';
      const isObsolete = obsoleteCodes.some(c => m.includes(c));
      return !isSecura && !isObsolete;
    }).map(p => {
      const code = resolveProductCode(p);
      const name = resolveProductName(p);
      const isBullet = code.toUpperCase().includes('BFD') || name.toLowerCase().includes('bullet');
      return {
        id: p.id || code,
        name: name,
        code: code,
        type: p.category || (isBullet ? 'Analog HD Bullet' : 'Analog HD Turret'),
        image: p.image || (isBullet ? '/color_on_bullet_hd.png' : '/color_on_turret_hd.png')
      };
    });

    // Deduplicate by product code so each camera appears exactly once in quotation list
    const seenCodes = new Set();
    const uniqueList = [];
    for (const item of filtered) {
      const cleanCode = item.code.toUpperCase().trim();
      if (!seenCodes.has(cleanCode)) {
        seenCodes.add(cleanCode);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  }, [products]);

  // Selection mode: 'products' (+ and - cameras) vs 'area' (installation site)
  const [selectionMode, setSelectionMode] = useState('products');

  // Quantities for each camera product (dynamic per product ID)
  const [quantities, setQuantities] = useState({});

  // Selected installation areas
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [areaCameraCount, setAreaCameraCount] = useState(4);

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  // Pre-fill if coming from a specific product or area
  useEffect(() => {
    if (initialDetails && typeof initialDetails === 'string') {
      const lower = initialDetails.toLowerCase();
      
      // Check if matches an equipment model
      let matchedModel = null;
      for (const eq of equipmentList) {
        if (
          lower.includes(eq.code.toLowerCase()) || 
          lower.includes(eq.name.toLowerCase()) || 
          lower.includes(String(eq.id).toLowerCase())
        ) {
          matchedModel = eq.id;
          break;
        }
      }

      if (matchedModel) {
        setSelectionMode('products');
        setQuantities(prev => ({
          ...prev,
          [matchedModel]: Math.max(1, prev[matchedModel] || 1)
        }));
      } else {
        // Check if matches an installation area
        const matchedArea = INSTALLATION_AREAS.find(a => lower.includes(a.id) || lower.includes(a.name.toLowerCase()));
        if (matchedArea) {
          setSelectionMode('area');
          setSelectedAreas([matchedArea.name]);
        }
      }

      setFormData(prev => ({
        ...prev,
        message: prev.message || initialDetails
      }));
    }
  }, [initialDetails, isOpen, equipmentList]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleDirectQuantitySet = (productId, val) => {
    const parsed = parseInt(val, 10);
    const next = isNaN(parsed) || parsed < 0 ? 0 : Math.min(999, parsed);
    setQuantities(prev => ({ ...prev, [productId]: next }));
  };

  const toggleArea = (areaName) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaName)) {
        return prev.filter(a => a !== areaName);
      }
      return [...prev, areaName];
    });
  };

  const totalEquipmentQty = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      // Build structured summary
      let solutionTag = 'General CCTV Quote';
      let structuredNotes = '';

      if (selectionMode === 'products') {
        const selectedEquipment = equipmentList
          .filter(eq => (quantities[eq.id] || 0) > 0)
          .map(eq => ({ ...eq, qty: quantities[eq.id] }));

        if (selectedEquipment.length > 0) {
          solutionTag = `Equipment: ${selectedEquipment.map(eq => `${eq.qty}x ${eq.code}`).join(', ')}`;
          structuredNotes = `[SELECTED EQUIPMENT & QUANTITIES]\n` +
            selectedEquipment.map(eq => `• ${eq.name} (${eq.code}): ${eq.qty} units`).join('\n') +
            `\nTotal Equipment: ${totalEquipmentQty} units\n\n`;
        } else {
          solutionTag = 'Camera Equipment Inquiry';
        }
      } else {
        if (selectedAreas.length > 0) {
          solutionTag = `Installation: ${selectedAreas.join(', ')} (${areaCameraCount} Cams)`;
          structuredNotes = `[INSTALLATION AREA & FACILITY]\n` +
            `• Target Area(s): ${selectedAreas.join(', ')}\n` +
            `• Estimated Camera Count: ${areaCameraCount} cameras\n\n`;
        } else {
          solutionTag = `Facility Installation (${areaCameraCount} Cams)`;
          structuredNotes = `[INSTALLATION REQUIREMENT]\n• Estimated Camera Count: ${areaCameraCount} cameras\n\n`;
        }
      }

      const finalMessage = `${structuredNotes}${formData.message ? `[CLIENT MESSAGE]\n${formData.message}` : ''}`.trim();

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        solution: solutionTag,
        message: finalMessage,
        selectionMode,
        selectedProducts: equipmentList
          .filter(eq => (quantities[eq.id] || 0) > 0)
          .map(eq => ({ id: eq.id, name: eq.name, code: eq.code, qty: quantities[eq.id] })),
        selectedAreas,
        cameraCount: selectionMode === 'products' ? totalEquipmentQty : areaCameraCount
      };

      // Always also save to local storage immediately so it appears instantly in admin panel
      try {
        const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
        localInqs.unshift({
          ...payload,
          id: 'inq_' + Date.now(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lookman_inquiries', JSON.stringify(localInqs));
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new Event('lookman_inquiries_updated'));
        }
      } catch (e) {
        // Local storage warning
      }

      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed' });
      }
    } catch (err) {
      console.warn('Network inquiry error, saved to local cache:', err);
      // Saved locally in the try block above, treat as success for user
      setStatus({ loading: false, success: true, error: '' });
    }
  };

  const handleResetForm = () => {
    setStatus({ loading: false, success: false, error: '' });
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    setQuantities({});
    setSelectedAreas([]);
    setAreaCameraCount(4);
    onClose();
  };

  return (
    <div 
      id="contact-modal" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-5 sm:p-7 relative shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close quote modal"
          title="Close"
          className="absolute top-5 right-5 text-gray-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-20"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8 space-y-1">
          <span className="text-[10px] font-bold text-[#ea0004] uppercase tracking-wider font-mono bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-block">
            Lookman Official Quotation Desk
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#101f46] tracking-tight">
            Request a Custom CCTV Quote
          </h3>
          <p className="text-xs text-slate-500">
            Select specific camera quantities with <strong className="text-slate-700">+ and -</strong>, or pick your installation area for customized system sizing.
          </p>
        </div>

        {status.success ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-[#101f46]">Quote Request Received!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for choosing Lookman. Our CCTV technical engineers will analyze your specifications and respond with wholesale project pricing within 24 hours.
            </p>
            <button 
              type="button"
              onClick={handleResetForm}
              className="text-white font-heading text-xs font-bold py-2.5 px-6 rounded-full shadow-md cursor-pointer hover:opacity-95 transition-all"
              style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#ea0004] text-xs font-bold rounded-xl">
                {status.error}
              </div>
            )}

            {/* Client Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1">
                  Full Name <span className="text-[#ea0004]">*</span>
                </label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#ea0004] focus:bg-white text-[#101f46] text-xs p-2.5 rounded-xl outline-none shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1">
                  Phone Number <span className="text-[#ea0004]">*</span>
                </label>
                <input 
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98400 00000"
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#ea0004] focus:bg-white text-[#101f46] text-xs p-2.5 rounded-xl outline-none shadow-2xs transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1">
                  Email Address
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#ea0004] focus:bg-white text-[#101f46] text-xs p-2.5 rounded-xl outline-none shadow-2xs transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1">
                  Company / Organization
                </label>
                <input 
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company or Facility Name"
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#ea0004] focus:bg-white text-[#101f46] text-xs p-2.5 rounded-xl outline-none shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* ── REQUIREMENT SELECTION MODE TOGGLE ── */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1.5">
                How would you like to build your quote?
              </label>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setSelectionMode('products')}
                  className={`py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectionMode === 'products'
                      ? 'bg-white text-[#ea0004] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package size={14} />
                  <span>Select Cameras (+ / -)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionMode('area')}
                  className={`py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectionMode === 'area'
                      ? 'bg-white text-[#ea0004] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🏢 Select by Area / Facility</span>
                </button>
              </div>
            </div>

            {/* ── MODE 1: PRODUCT + / - CAMERA SELECTION ── */}
            {selectionMode === 'products' && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600 uppercase tracking-wider">
                    Adjust Hardware Quantities:
                  </span>
                  <span className="font-bold text-[#ea0004] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Total: {totalEquipmentQty} units
                  </span>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 rounded-2xl border border-slate-200/80 p-2 bg-slate-50/50">
                  {equipmentList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No cameras currently available for quotation.
                    </div>
                  ) : (
                    equipmentList.map((eq) => {
                      const qty = quantities[eq.id] || 0;
                      const isSelected = qty > 0;

                    return (
                      <div
                        key={eq.id}
                        className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-white border-rose-300 shadow-2xs'
                            : 'bg-white/80 border-slate-200/70 hover:border-slate-300'
                        }`}
                      >
                        {/* Camera Info */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={eq.image} 
                            alt={eq.name} 
                            className="w-9 h-9 object-contain bg-slate-100 rounded-lg p-0.5 shrink-0" 
                          />
                          <div className="min-w-0">
                            <h5 className="font-heading font-bold text-xs text-[#101f46] truncate">
                              {eq.name}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                              <span className="text-[#ea0004] font-bold">{eq.code}</span>
                              <span>•</span>
                              <span>{eq.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* +/- Stepper Controls */}
                        <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(eq.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Decrease ${eq.name} quantity`}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          >
                            <Minus size={12} />
                          </button>

                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={qty}
                            onChange={(e) => handleDirectQuantitySet(eq.id, e.target.value)}
                            aria-label={`${eq.name} quantity input`}
                            className="w-10 text-center font-mono font-bold text-xs bg-transparent outline-none text-[#101f46]"
                          />

                          <button
                            type="button"
                            onClick={() => handleQuantityChange(eq.id, 1)}
                            aria-label={`Increase ${eq.name} quantity`}
                            className="w-7 h-7 rounded-lg bg-[#ea0004] hover:bg-[#c80004] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </div>
            )}

            {/* ── MODE 2: INSTALLATION AREA SELECTION ── */}
            {selectionMode === 'area' && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600 uppercase tracking-wider">
                    Select Installation Site / Facility:
                  </span>
                  <span className="text-slate-400">
                    {selectedAreas.length > 0 ? `${selectedAreas.length} selected` : 'Select one or more'}
                  </span>
                </div>

                {/* 8 Installation Areas Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INSTALLATION_AREAS.map((area) => {
                    const isSelected = selectedAreas.includes(area.name);
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleArea(area.name)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-rose-50/80 border-[#ea0004] text-[#ea0004] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base select-none">{area.emoji}</span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#ea0004] text-white flex items-center justify-center">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div className="font-heading font-bold text-xs leading-snug">{area.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{area.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Estimated Camera Quantity Counter */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#101f46] block">
                      Estimated Cameras Needed:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      We'll tailor the lens, optics &amp; DVR storage based on this count.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAreaCameraCount(prev => Math.max(1, prev - 1))}
                      aria-label="Decrease estimated camera count"
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-2xs"
                    >
                      <Minus size={13} />
                    </button>

                    <div className="w-12 text-center font-mono font-bold text-sm text-[#ea0004] bg-white py-1.5 px-2 rounded-lg border border-slate-200">
                      {areaCameraCount}
                    </div>

                    <button
                      type="button"
                      onClick={() => setAreaCameraCount(prev => prev + 1)}
                      aria-label="Increase estimated camera count"
                      className="w-8 h-8 rounded-lg bg-[#ea0004] text-white hover:bg-[#c80004] flex items-center justify-center cursor-pointer shadow-2xs"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Message / Special Notes */}
            <div>
              <label className="block text-[11px] font-bold text-[#101f46] uppercase tracking-wide mb-1">
                Additional Project Notes (Optional)
              </label>
              <textarea 
                rows="2"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention special requirements like night vision range, storage retention days, or mobile app access..."
                className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#ea0004] focus:bg-white text-[#101f46] text-xs p-2.5 rounded-xl outline-none resize-none shadow-2xs transition-all"
              />
            </div>

            {/* Submit Action */}
            <button 
              type="submit"
              disabled={status.loading}
              className="w-full text-white font-heading text-xs font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
              style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
            >
              {status.loading ? 'Submitting Quote Request...' : (
                <>
                  <span>Submit Custom Quote Request</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
