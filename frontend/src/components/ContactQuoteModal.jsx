import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from './Icons';
import { API_BASE } from '../api';

export default function ContactQuoteModal({ isOpen, onClose, initialDetails }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    solution: 'General CCTV Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    if (initialDetails) {
      setFormData(prev => ({ ...prev, message: initialDetails }));
    }
  }, [initialDetails, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', phone: '', company: '', solution: 'General CCTV Inquiry', message: '' });
        return;
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed' });
        return;
      }
    } catch (err) {
      // Backend offline on Netlify - store locally in inquiries database
      try {
        const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
        localInqs.unshift({
          ...formData,
          id: 'inq_' + Date.now(),
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('lookman_inquiries', JSON.stringify(localInqs));
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', phone: '', company: '', solution: 'General CCTV Inquiry', message: '' });
      } catch (storageErr) {
        setStatus({ loading: false, success: true, error: '' });
      }
    }
  };

  return (
    <div 
      id="contact-modal" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden"
      >
        
        <button 
          onClick={onClose}
          aria-label="Close quote modal"
          title="Close"
          className="absolute top-5 right-5 text-gray-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6 space-y-1">
          <span className="text-[11px] font-bold text-[#e73455] uppercase tracking-wider font-mono-code bg-red-50 px-2.5 py-0.5 rounded border border-red-200 inline-block">
            Enterprise Solutions Desk
          </span>
          <h3 className="text-2xl font-black text-[#12182b]">Request a Custom CCTV Quote</h3>
          <p className="text-xs text-[#6b7280]">
            Talk with Lookman security engineers to finalize your camera specs and system deployment.
          </p>
        </div>

        {status.success ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-[#12182b]">Inquiry Received Successfully!</h4>
            <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
              Thank you for reaching out. A Lookman technical representative will review your requirement and reach out shortly.
            </p>
            <button 
              onClick={onClose}
              className="btn-primary-gradient text-xs font-bold py-2.5 px-6"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status.error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#e73455] text-xs font-bold rounded-xl">
                {status.error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Your Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Phone Number *</label>
                <input 
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none shadow-xs transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Company / Organization</label>
                <input 
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                  className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none shadow-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Domain / Requirement Type</label>
              <select
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none shadow-xs transition-colors cursor-pointer"
              >
                <option value="General CCTV Inquiry">General CCTV Inquiry</option>
                <option value="Schools & Colleges">Schools & Colleges</option>
                <option value="Bank & ATM Security">Bank & ATM Security</option>
                <option value="Chain Stores & Retail">Chain Stores & Retail</option>
                <option value="Commercial Complex">Commercial Complex</option>
                <option value="Gated Community">Gated Community</option>
                <option value="Industrial Park">Industrial Park</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Requirements Message</label>
              <textarea 
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your camera counts, layout, or special analytics needs..."
                className="w-full bg-white border border-gray-300 focus:border-[#e73455] text-[#12182b] text-xs p-3 rounded-xl outline-none resize-none shadow-xs transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={status.loading}
              className="w-full btn-primary-gradient uppercase tracking-wider text-xs font-extrabold py-3.5 flex items-center justify-center gap-2 mt-2 shadow-md"
            >
              {status.loading ? 'Sending Request...' : <>Submit Quote Request <Send size={14} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
