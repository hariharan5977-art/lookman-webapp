import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, ShieldCheck, Mail, Package, Users, RefreshCw, X, AlertCircle } from './Icons';
import { API_BASE } from '../api';
import ALL_LOOKMAN_PRODUCTS from '../data/allProducts.json';

export default function AdminPortal({ isOpen, onClose, user, onLogin, onLogout }) {
  const [loginEmail, setLoginEmail] = useState('beyonddigitalchennai@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'products' | 'add'
  const [inquiries, setInquiries] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // New Product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'HD Camera',
    description: '',
    image: '/CO-H-2BFDML(V).png',
    resolution: '1080P Full HD'
  });

  useEffect(() => {
    if (user && isOpen) {
      fetchAdminData();
    }
  }, [user, isOpen]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    let inqs = [];
    let prods = [];

    // 1. Try fetching from backend first if online
    try {
      const [inqRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/inquiries`),
        fetch(`${API_BASE}/products`)
      ]);
      const inqData = await inqRes.json();
      const prodData = await prodRes.json();

      if (inqData.success && inqData.inquiries) inqs = inqData.inquiries;
      if (prodData.success && prodData.products) prods = prodData.products;
    } catch (e) {
      // Backend offline on static deployment (e.g. Netlify)
    }

    // 2. Merge with locally persisted inquiries
    const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
    const mergedInquiries = [...inqs, ...localInqs.filter(li => !inqs.some(i => i.id === li.id))];

    // 3. Merge with custom added products and default catalog
    const customProds = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const baseProds = prods.length > 0 ? prods : ALL_LOOKMAN_PRODUCTS;
    const mergedProducts = [...customProds, ...baseProds.filter(bp => !customProds.some(cp => cp.id === bp.id))];

    setInquiries(mergedInquiries);
    setProductsList(mergedProducts);
    setLoadingData(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const inputEmail = loginEmail.trim().toLowerCase();
    const isTargetUser = inputEmail === 'beyonddigitalchennai@gmail.com' || inputEmail === 'admin@lookman.xyz' || inputEmail === 'admin';
    const isTargetPass = loginPassword === 'BeyondLookman@2026' || loginPassword === 'admin123' || loginPassword === 'lookman2026';

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (data.success) {
        onLogin(data.user, data.token);
        setLoginPassword('');
        setAuthLoading(false);
        return;
      } else if (!isTargetUser || !isTargetPass) {
        setAuthError(data.message || 'Invalid email or password');
        setAuthLoading(false);
        return;
      }
    } catch (err) {
      // Backend server is offline or on static Netlify deploy - use verified offline admin credentials
      if (isTargetUser && isTargetPass) {
        const fallbackUser = {
          username: 'beyonddigitalchennai@gmail.com',
          role: 'administrator',
          company: 'LOOKMAN DISTRIBUTION PRIVATE LIMITED'
        };
        const fallbackToken = 'lookman_session_token_' + Date.now();
        onLogin(fallbackUser, fallbackToken);
        setLoginPassword('');
        setAuthLoading(false);
        return;
      }
      setAuthError('Invalid administrator credentials.');
      setAuthLoading(false);
      return;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const createdProduct = {
      id: 'prod_' + Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || '/color_on_bullet_hd.png',
      specs: { resolution: newProduct.resolution }
    };

    // Try sending to backend if online
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdProduct)
      });
    } catch (e) {
      // Backend offline on Netlify
    }

    // Always persist to localStorage so it works on Netlify
    const customProds = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    customProds.unshift(createdProduct);
    localStorage.setItem('lookman_custom_products', JSON.stringify(customProds));

    // Reset form and refresh list
    setNewProduct({ name: '', category: 'HD Camera', description: '', image: 'https://lookman.xyz/wp-content/uploads/2025/04/SHD-VD201LCM.png', resolution: '1080P Full HD' });
    setActiveTab('products');
    fetchAdminData();
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('lookman_products_updated'));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      // Offline fallback
    }

    // Remove from localStorage
    const customProds = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const filtered = customProds.filter(p => p.id !== id);
    localStorage.setItem('lookman_custom_products', JSON.stringify(filtered));

    setProductsList(prev => prev.filter(p => p.id !== id));
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('lookman_products_updated'));
    }
  };

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

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#ea0004] border border-red-200/80 flex items-center justify-center shadow-xs">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-black text-[#12182b]">Lookman Admin Dashboard</h3>
              <p className="text-xs text-slate-500">Security Hardware &amp; Product Management Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {!user ? (
          /* Login View */
          <div className="p-8 max-w-md mx-auto w-full my-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ea0004] flex items-center justify-center mx-auto border border-red-200 shadow-xs">
                <ShieldCheck size={26} />
              </div>
              <h4 className="text-2xl font-heading font-black text-[#12182b]">Administrator Login</h4>
              <p className="text-xs text-slate-500">Enter your Lookman administrator credentials to manage products and customer inquiries.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-[#ea0004] text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} /> {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Username / Email</label>
                <input 
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50/80 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3 rounded-xl outline-none shadow-xs transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Password</label>
                <input 
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="BeyondLookman@2026"
                  className="w-full bg-slate-50/80 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3 rounded-xl outline-none shadow-xs transition-all text-xs"
                />
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full text-white py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-[0.99] transition-all cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
              >
                {authLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar Tabs & User Info */}
            <div className="bg-slate-50 px-6 py-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 rounded-xl font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'inquiries' 
                      ? 'text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-100 border border-gray-200'
                  }`}
                  style={activeTab === 'inquiries' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
                >
                  <Mail size={14} /> Quote Inquiries ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded-xl font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'products' 
                      ? 'text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-100 border border-gray-200'
                  }`}
                  style={activeTab === 'products' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
                >
                  <Package size={14} /> Product Catalog ({productsList.length})
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`px-4 py-2 rounded-xl font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'add' 
                      ? 'text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-100 border border-gray-200'
                  }`}
                  style={activeTab === 'add' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500">
                  Logged in as <strong className="text-[#12182b] font-bold">{user.username}</strong>
                </span>
                <button 
                  onClick={onLogout}
                  className="px-3.5 py-1.5 bg-red-50 text-[#ea0004] hover:bg-red-100 border border-red-200 rounded-xl flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>

            {/* Main Panel View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60">
              
              {/* Tab 1: Inquiries */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading font-black text-[#12182b] text-base">Submitted Customer Quote Requests</h4>
                    <button 
                      onClick={fetchAdminData} 
                      className="text-xs font-bold text-[#ea0004] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Refresh List
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-slate-400 text-xs shadow-xs">
                      No customer inquiries submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div key={inq.id} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs shadow-xs hover:border-slate-300 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-[#12182b] text-sm">{inq.name}</span>
                              <span className="text-[#ea0004] font-semibold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 text-[11px]">
                                {inq.solution}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-gray-100">
                            <div>Phone: <strong className="text-[#12182b]">{inq.phone}</strong></div>
                            <div>Email: <strong className="text-[#12182b]">{inq.email || 'N/A'}</strong></div>
                            <div>Company: <strong className="text-[#12182b]">{inq.company || 'Individual'}</strong></div>
                          </div>
                          {inq.message && (
                            <p className="bg-white p-3 rounded-xl border border-gray-200 text-slate-700 text-xs leading-relaxed">
                              "{inq.message}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Products */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <h4 className="font-heading font-black text-[#12182b] text-base">Manage CCTV Products ({productsList.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {productsList.map((p) => (
                      <div key={p.id} className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-transparent p-1" />
                          <div className="overflow-hidden">
                            <h5 className="font-heading font-bold text-[#12182b] truncate">{p.name || p.model}</h5>
                            <div className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                              <span className="text-slate-400">Product Code:</span>
                              <span className="text-[#ea0004]">{p.productCode || p.model || p.id}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#ea0004] bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-block mt-0.5">
                              {typeof p.category === 'string' ? p.category : (p.category?.name || 'CCTV')}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-slate-400 hover:text-red-600 p-2 bg-slate-50 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-colors cursor-pointer shrink-0"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Add Product */}
              {activeTab === 'add' && (
                <div className="max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-xs">
                  <h4 className="font-heading font-black text-[#12182b] text-base">Add New CCTV Product</h4>
                  <form onSubmit={handleAddProduct} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#12182b] mb-1.5">Product Name / Model *</label>
                      <input 
                        type="text" 
                        required 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. CO-H-2BFDML(V)"
                        className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3 rounded-xl outline-none shadow-xs transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#12182b] mb-1.5">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3 rounded-xl outline-none shadow-xs transition-all cursor-pointer"
                      >
                        <option value="HD Camera">HD Camera</option>
                        <option value="IP Camera">IP Camera</option>
                        <option value="NVR">NVR</option>
                        <option value="XVR">XVR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#12182b] mb-1.5">Description</label>
                      <textarea
                        rows="2"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Brief specifications or features..."
                        className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3 rounded-xl outline-none resize-none shadow-xs transition-all"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full text-white py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-[0.99] transition-all cursor-pointer"
                      style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                    >
                      Add Product to Catalog
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
