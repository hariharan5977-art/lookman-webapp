import React, { useState, useEffect } from 'react';
import { Shield, Search, Menu, X, UserCheck, ChevronDown, ChevronRight } from './Icons';

// ─── BRAND-CATEGORIZED LOOKMAN PRODUCTS TAXONOMY ───
const MEGA_BRANDS = [
  {
    id: 'color-on',
    name: 'Color On',
    badge: 'Authorized National Partner',
    accentColor: '#e73455',
    tag: '24/7 Full Color'
  }
];

const BRAND_MEGA_CATALOG = {
  'color-on': {
    id: 'color-on',
    name: 'Color On',
    badge: 'Authorized National Partner',
    tagline: '24/7 Full Color Vivid Clarity & AI Starlight Video Hardware',
    tag: '24/7 Full Color',
    rows: [
      [
        {
          title: 'Full Color IP Cameras',
          categoryKey: 'HD IP Camera',
          items: [
            { name: 'F1.0 Super Aperture', filterKey: 'Color Audio' },
            { name: 'Warm Light Bullets', filterKey: 'Color Audio' },
            { name: 'Starlight Color Domes', filterKey: 'Color Audio' },
            { name: '4K Color Night Vision', filterKey: 'Color Audio' },
            { name: 'Special IP Panoramic', filterKey: 'PANA' },
            { name: 'More IP Models', filterKey: 'all', isMore: true },
          ]
        },
        {
          title: 'Color Speed Domes (PTZ)',
          categoryKey: 'PTZ Cameras',
          items: [
            { name: '24/7 Full Color PTZ', filterKey: 'PTZ' },
            { name: '2MP Speed Dome', filterKey: '2MP' },
            { name: '4MP Speed Dome', filterKey: '4MP' },
            { name: '8MP 4K Speed Dome', filterKey: '8MP' },
            { name: 'Auto-Tracking Optical Zoom', filterKey: 'PTZ' },
          ]
        },
        {
          title: 'Color On AI Series',
          categoryKey: 'AI Product',
          items: [
            { name: 'Active Strobe & Siren', filterKey: 'FD' },
            { name: 'Smart Vehicle Detection', filterKey: 'FD' },
            { name: 'Face Capture Camera', filterKey: 'FD' },
            { name: 'AI Perimeter Shield', filterKey: 'FD' },
            { name: 'More AI Solutions', filterKey: 'FD', isMore: true },
          ]
        },
        {
          title: 'Color-Optimized NVRS',
          categoryKey: 'NVRS',
          items: [
            { name: '1 HDD Network Recorder', filterKey: 'SNVR Series' },
            { name: '2 HDD Network Recorder', filterKey: 'SNVR Series' },
            { name: '4 HDD Enterprise NVR', filterKey: 'AI NVR' },
            { name: 'Color-Optimized AI NVR', filterKey: 'AI NVR' },
            { name: 'More NVRS', filterKey: 'all', isMore: true },
          ]
        }
      ],
      [
        {
          title: 'HD Analog Color Cameras',
          categoryKey: 'HD Analog Cameras',
          items: [
            { name: 'Full Color Turret Series', filterKey: 'Color Audio' },
            { name: 'Warm Light Bullet Series', filterKey: 'Color Audio' },
            { name: 'Built-in Audio Analog', filterKey: 'Color Audio' },
          ]
        },
        {
          title: 'PoE Switches & Power',
          categoryKey: 'Switch',
          items: [
            { name: '4/8 Port Gigabit PoE Switch', filterKey: 'all' },
            { name: '16/24 Port PoE Switch', filterKey: 'all' },
            { name: 'PoE Injectors & Power', filterKey: 'all' },
          ]
        },
        {
          title: 'Hybrid Color DVR',
          categoryKey: 'Hybrid DVR',
          items: [
            { name: 'H.265+ Hybrid Series', filterKey: '2MP LITE' },
            { name: '5MP Lite Real-Time Series', filterKey: '5MP Lite' },
          ]
        },
        {
          title: 'Mounts & Accessories',
          categoryKey: 'Accessories',
          items: [
            { name: 'Brackets & Junction Mounts', filterKey: 'all' },
            { name: 'Enterprise Video VMS', filterKey: 'all' },
            { name: 'Network Storage Server', filterKey: 'all' },
          ]
        }
      ]
    ]
  }
};

// ─── EXACT TVT INDIA SOLUTIONS TAXONOMY ───
const TVT_SOLUTIONS_MENU = [
  { id: 'school', title: 'School', desc: 'Campus Perimeter & Classroom AI Safety' },
  { id: 'hospital', title: 'Hospital', desc: '24/7 Forensic & Restricted Ward Security' },
  { id: 'bank', title: 'Bank', desc: 'Financial Compliance & Teller Desk Encryption' },
  { id: 'industrial-park', title: 'Industrial Park', desc: 'Long-Range Optical & Warehouse Logistics' },
  { id: 'community', title: 'Community', desc: 'Gated Residential & Video Intercom Access' },
  { id: 'commercial-complex', title: 'Commercial Complex', desc: 'People Counting, Heatmaps & Mall Safety' },
  { id: 'chain-store', title: 'Chain Store', desc: 'Multi-Branch POS Video Overlay' },
];

export default function Header({
  activeCategory,
  onSelectCategory,
  onSelectSolution,
  onOpenContact,
  onOpenAdmin,
  onOpenCalculator,
  onOpenLogoReveal,
  onSearchClick,
  user,
  isDarkSlide = true
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileBrandTab, setMobileBrandTab] = useState('color-on');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeMegaBrand, setActiveMegaBrand] = useState('color-on');
  const [solutionsMenuOpen, setSolutionsMenuOpen] = useState(false);
  const [isShining, setIsShining] = useState(false);
  const [shineKey, setShineKey] = useState(0);

  const currentBrandData = BRAND_MEGA_CATALOG[activeMegaBrand] || BRAND_MEGA_CATALOG['color-on'];

  useEffect(() => {
    let timeoutId;
    let animTimeoutId;
    let isMounted = true;

    const triggerShine = () => {
      if (!isMounted) return;
      setShineKey((k) => k + 1);
      setIsShining(true);
      animTimeoutId = setTimeout(() => {
        if (!isMounted) return;
        setIsShining(false);
        // Sparse random delay: 16s to 32s (fewer times & randomly)
        const nextDelay = Math.floor(Math.random() * 16000) + 16000;
        timeoutId = setTimeout(triggerShine, nextDelay);
      }, 2400);
    };

    // Initial shine after 1.2s on page load
    timeoutId = setTimeout(triggerShine, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(animTimeoutId);
    };
  }, []);

  const handleProductSelect = (catKey, subKey) => {
    setMegaMenuOpen(false);
    onSelectCategory(catKey);
  };

  const handleSolutionSelect = (solId) => {
    setSolutionsMenuOpen(false);
    if (onSelectSolution) {
      onSelectSolution(solId);
    }
  };

  // High-contrast white text styles over cyan blue top gradient
  const textColor = 'text-white';
  const textHover = 'hover:text-[#a5f3fc]';
  const iconColor = 'text-white/85';
  const searchBtnBg = 'bg-white/15 text-white hover:bg-white/25 border border-white/25 backdrop-blur-sm shadow-xs';

  return (
    <header
      className="header-glass-bar relative z-50 w-full h-[60px] lg:h-[64px] flex items-center transition-all pointer-events-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
      }}
      onMouseLeave={() => {
        setMegaMenuOpen(false);
        setSolutionsMenuOpen(false);
        setActiveMegaBrand('color-on');
      }}
    >
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-2 relative z-10 flex items-center justify-between">

        {/* Left: Official Lookman Logo */}
        <div
          onClick={() => onSelectCategory('home')}
          className="relative inline-flex items-center justify-center cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.03]"
          title="Lookman - Channeling Growth"
        >
          {/* Authentic Logo Image */}
          <img
            src="/lookman_logo.png"
            alt="Lookman - Channeling Growth"
            className="h-8.5 sm:h-9.5 lg:h-11 w-auto object-contain block"
          />

          {/* Glass Shine Sheen Effect (appears randomly & fewer times) */}
          <div
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden logo-glass-shine-mask"
            aria-hidden="true"
          >
            <div
              key={shineKey}
              className={`logo-glass-shine-beam ${isShining ? 'is-shining' : ''}`}
            />
          </div>
        </div>

        {/* Center: Navigation Links (Lookman Double Gradient Border Edge) */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 font-semibold">

          {/* Home */}
          <button
            onClick={() => onSelectCategory('home')}
            className={`cursor-pointer font-heading header-nav-item ${activeCategory === 'home' || activeCategory === 'all' ? 'is-active' : ''
              }`}
          >
            Home
          </button>

          {/* About Us */}
          <button
            onClick={() => onSelectCategory('about')}
            className={`cursor-pointer font-heading header-nav-item ${activeCategory === 'about' ? 'is-active' : ''
              }`}
          >
            About Us
          </button>

          {/* PRODUCTS WITH BRAND-CATEGORIZED TWO-PANEL MEGA DROPDOWN */}
          <div
            className="py-3 sm:py-3.5 relative"
            onMouseEnter={() => {
              setActiveMegaBrand('color-on');
              setMegaMenuOpen(true);
              setSolutionsMenuOpen(false);
            }}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <button
              onClick={() => {
                setMegaMenuOpen(false);
                onSelectCategory('products');
              }}
              className={`flex items-center gap-1.5 cursor-pointer font-heading header-nav-item ${activeCategory === 'products' || megaMenuOpen ? 'is-active' : ''
                }`}
            >
              <span>Products</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-[#8c0006] ${megaMenuOpen ? 'rotate-180 text-[#ea0004]' : ''}`}
              />
            </button>
          </div>

          {/* SOLUTIONS WITH EXACT TVT-STYLE VERTICAL SINGLE-COLUMN DROPDOWN */}
          <div
            className="py-3 sm:py-3.5 relative"
            onMouseEnter={() => {
              setSolutionsMenuOpen(true);
              setMegaMenuOpen(false);
            }}
            onMouseLeave={() => setSolutionsMenuOpen(false)}
          >
            <button
              onClick={() => handleSolutionSelect('school')}
              className={`flex items-center gap-1.5 cursor-pointer font-heading header-nav-item ${activeCategory === 'solutions' || solutionsMenuOpen ? 'is-active' : ''
                }`}
            >
              <span>Solutions</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-[#8c0006] ${solutionsMenuOpen ? 'rotate-180 text-[#ea0004]' : ''}`}
              />
            </button>

            {/* ── VERTICAL SINGLE-COLUMN SOLUTIONS DROPDOWN ── */}
            {solutionsMenuOpen && (
              <div
                className="absolute top-full left-0 w-52 bg-[#f5f6f8] rounded-2xl border border-gray-200/80 shadow-xl z-[100] animate-in fade-in duration-150 p-2 mt-1"
                onMouseEnter={() => setSolutionsMenuOpen(true)}
                onMouseLeave={() => setSolutionsMenuOpen(false)}
              >
                <div className="flex flex-col gap-0.5">
                  {TVT_SOLUTIONS_MENU.map((sol) => (
                    <button
                      key={sol.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSolutionSelect(sol.id);
                      }}
                      className="group relative text-[13px] text-slate-700 hover:text-[#e73455] px-3 py-2.5 text-left font-medium transition-all rounded-xl hover:bg-white hover:shadow-sm cursor-pointer flex items-center gap-2.5"
                    >
                      <span className="w-[3px] h-4 rounded-full bg-[#e73455] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {sol.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brands (Direct Navigation Link — No Dropdown) */}
          <button
            onClick={() => onSelectCategory('brands')}
            className={`cursor-pointer font-heading header-nav-item ${activeCategory === 'brands' ? 'is-active' : ''
              }`}
          >
            Brands
          </button>

          {/* Contact */}
          <button
            onClick={() => onSelectCategory('contact')}
            className={`font-heading cursor-pointer header-nav-item ${activeCategory === 'contact' ? 'is-active' : ''
              }`}
          >
            Contact
          </button>
        </nav>

        {/* Right: Search Icon, User/Admin Icon & CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          {/* Search Icon (Hidden on Solutions Page) */}
          {activeCategory !== 'solutions' && (
            <button
              onClick={onSearchClick}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 text-[#12182b] hover:text-[#e73455] hover:border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Search Products"
            >
              <Search size={15} />
            </button>
          )}


          {/* CTA Quote Button - Lookman Signature Double-Shade Gradient */}
          <button
            onClick={onOpenContact}
            className="text-white text-xs font-heading font-bold px-5 py-2 rounded-full hover:opacity-95 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
          >
            Get In Touch
          </button>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenContact}
            className="text-white text-[9.5px] sm:text-[11px] font-heading font-bold py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full active:scale-95 transition-transform cursor-pointer shrink-0"
            style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
          >
            Get In Touch
          </button>
          <button
            id="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 hover:opacity-85 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="lookmanMenuGrad" x1="4" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ea0004" />
                  <stop offset="100%" stopColor="#6a0006" />
                </linearGradient>
              </defs>
              {mobileMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="url(#lookmanMenuGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="url(#lookmanMenuGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* ── 1. PRODUCTS MEGA DROPDOWN BOX (SIDE-BY-SIDE BRANDS & PRODUCTS) ── */}
      {megaMenuOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-[1220px] px-4 sm:px-6 z-[100] animate-in fade-in duration-150 pointer-events-auto mt-1"
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => {
            setMegaMenuOpen(false);
            setActiveMegaBrand('color-on');
          }}
        >
          <div className="bg-[#f8f9fa] border border-slate-200/90 shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-stretch">

            {/* ── LEFT SIDEBAR: BRANDS LIST ── */}
            <div className="w-full md:w-56 lg:w-60 shrink-0 border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0 md:pr-4 flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1 text-left">
                Surveillance Brands
              </div>

              <div className="flex flex-col gap-1.5">
                {MEGA_BRANDS.map((brand) => {
                  const isActive = activeMegaBrand === brand.id;
                  return (
                    <button
                      key={brand.id}
                      onClick={() => setActiveMegaBrand(brand.id)}
                      onMouseEnter={() => setActiveMegaBrand(brand.id)}
                      className={`relative w-full text-left py-2 px-3 transition-all flex items-center justify-between cursor-pointer group ${isActive
                          ? 'font-bold'
                          : 'text-slate-600 hover:text-slate-900 font-medium'
                        }`}
                    >
                      {/* Double Gradient Active Indicator Marker */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-xs"
                          style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                        />
                      )}

                      <div className="pl-1 text-left">
                        <div className={`text-[13px] font-heading font-bold ${isActive ? 'hero-title-gradient' : 'text-slate-800'}`}>
                          {brand.name}
                        </div>
                      </div>

                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-150 ${isActive
                            ? 'text-[#ea0004] translate-x-0.5'
                            : 'text-slate-300 group-hover:text-slate-400'
                          }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* View Brands Page Link */}
              <div className="pt-2 mt-auto">
                <button
                  onClick={() => {
                    setMegaMenuOpen(false);
                    onSelectCategory('brands');
                  }}
                  className="w-full text-left text-xs font-semibold text-[#ea0004] hover:text-[#6a0006] py-2 px-3 rounded-lg hover:bg-rose-50/70 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <span>Explore Brands</span>
                  <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* ── RIGHT PANEL: SELECTED BRAND'S PRODUCTS ── */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">

              {/* Brand Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-5 border-b border-slate-200/70 text-left">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-[15px] font-heading font-bold text-slate-800 flex items-center gap-2">
                    <span className="hero-title-gradient">{currentBrandData.name}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-xs font-normal text-slate-600 hidden sm:inline">{currentBrandData.tagline}</span>
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#ea0004] bg-rose-50 border border-rose-100/80 px-2.5 py-0.5 rounded-full shrink-0">
                  {currentBrandData.tag}
                </span>
              </div>

              {/* Brand Categories Grids */}
              <div className="space-y-6">
                {currentBrandData.rows.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left items-start">
                    {row.map((sec) => (
                      <div key={sec.title} className="space-y-2">
                        <h4
                          onClick={() => handleProductSelect(sec.categoryKey, 'all')}
                          className="text-[13px] font-heading font-bold hero-title-gradient cursor-pointer tracking-tight inline-block hover:opacity-80 transition-opacity"
                        >
                          {sec.title}
                        </h4>

                        {sec.items.length > 0 && (
                          <ul className="space-y-0.5 text-xs">
                            {sec.items.map((item) => (
                              <li key={item.name}>
                                <button
                                  onClick={() => handleProductSelect(sec.categoryKey, item.filterKey)}
                                  className={`group relative flex items-center gap-1.5 w-full text-left px-2 py-1 rounded-lg transition-all hover:bg-white hover:shadow-xs hover:text-[#e73455] ${item.isMore ? 'text-[#e73455] font-semibold' : 'text-slate-600'
                                    }`}
                                >
                                  <span className="w-[3px] h-3 rounded-full bg-[#e73455] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                  <span className="whitespace-nowrap">{item.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[60px] bg-black/45 z-40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer (Solid White, Zero Bleed-Through, Full Accordion Navigation) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 right-0 max-h-[calc(100vh-60px)] overflow-y-auto bg-white border-b border-slate-200 py-3 px-4 flex flex-col gap-1 text-sm shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">

          {/* Home */}
          <button
            id="mobile-nav-home"
            onClick={() => { onSelectCategory('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-heading font-semibold text-[15px] transition-colors flex items-center justify-between cursor-pointer ${activeCategory === 'home' || activeCategory === 'all'
                ? 'bg-rose-50 text-[#ea0004]'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Home</span>
            {(activeCategory === 'home' || activeCategory === 'all') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004]" />
            )}
          </button>

          {/* About Us */}
          <button
            id="mobile-nav-about"
            onClick={() => {
              onSelectCategory('about');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-heading font-semibold text-[15px] transition-colors flex items-center justify-between cursor-pointer ${activeCategory === 'about'
                ? 'bg-rose-50 text-[#ea0004]'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>About Us</span>
            {activeCategory === 'about' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004]" />
            )}
          </button>

          {/* PRODUCTS WITH MOBILE ACCORDION (COLOR ON) */}
          <div className="border-y border-slate-100 py-1 my-0.5">
            <div className={`w-full flex items-center justify-between py-1 px-1 rounded-xl transition-colors ${
              activeCategory === 'products' ? 'bg-rose-50' : 'hover:bg-slate-50'
            }`}>
              <button
                id="mobile-nav-products-direct"
                onClick={() => {
                  onSelectCategory('products');
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 text-left py-1.5 px-2 font-heading font-semibold text-[15px] cursor-pointer flex items-center gap-2 ${
                  activeCategory === 'products' ? 'text-[#ea0004]' : 'text-slate-800'
                }`}
              >
                <span>Products</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#ea0004] border border-rose-100">
                  Color On 24/7
                </span>
              </button>
              <button
                id="mobile-nav-products-toggle"
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="p-2 text-slate-500 hover:text-[#ea0004] cursor-pointer"
                aria-label="Toggle products categories"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 text-[#8c0006] ${mobileProductsOpen ? 'rotate-180 text-[#ea0004]' : ''
                    }`}
                />
              </button>
            </div>

            {mobileProductsOpen && (
              <div className="pl-1 pr-1 pb-2 pt-1 space-y-2.5 animate-in fade-in duration-150">
                {/* Categories list for Color On */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {BRAND_MEGA_CATALOG['color-on'].rows.flat().map((grp, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSelectCategory(grp.categoryKey);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left p-2 rounded-lg bg-slate-50/80 hover:bg-rose-50/60 hover:text-[#ea0004] text-[12px] font-medium text-slate-700 transition-colors flex items-center justify-between border border-slate-100 cursor-pointer"
                    >
                      <span className="truncate">{grp.title}</span>
                      <ChevronRight size={11} className="text-slate-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between px-1">
                  <button
                    onClick={() => {
                      onSelectCategory('products');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-heading font-bold text-[#ea0004] hover:underline cursor-pointer"
                  >
                    Explore Complete Catalog →
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory('brands');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-heading font-medium text-slate-500 hover:text-[#ea0004] cursor-pointer"
                  >
                    Official Brand
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SOLUTIONS WITH MOBILE ACCORDION (ALL 8 VERTICALS) */}
          <div className="border-b border-slate-100 py-1 my-0.5">
            <button
              id="mobile-nav-solutions-toggle"
              onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
              className={`w-full text-left py-2.5 px-3 rounded-xl font-heading font-semibold text-[15px] transition-colors flex items-center justify-between cursor-pointer ${activeCategory === 'solutions' || mobileSolutionsOpen
                  ? 'text-[#ea0004]'
                  : 'text-slate-800 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-2">
                <span>Solutions</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#ea0004] border border-rose-100">
                  8 Sectors
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 text-[#8c0006] ${mobileSolutionsOpen ? 'rotate-180 text-[#ea0004]' : ''
                  }`}
              />
            </button>

            {mobileSolutionsOpen && (
              <div className="grid grid-cols-1 gap-1 pl-1 pr-1 pb-2 pt-1 animate-in fade-in duration-150">
                {TVT_SOLUTIONS_MENU.map((sol) => (
                  <button
                    key={sol.id}
                    id={`mobile-sol-${sol.id}`}
                    onClick={() => {
                      handleSolutionSelect(sol.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 rounded-xl hover:bg-rose-50/60 hover:text-[#ea0004] transition-colors flex items-center justify-between border border-transparent hover:border-rose-100 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-[13px]">{sol.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{sol.desc}</div>
                    </div>
                    <ChevronRight size={13} className="text-slate-400 shrink-0 ml-2" />
                  </button>
                ))}
                <div className="pt-2 px-1">
                  <button
                    id="mobile-sol-explore-all"
                    onClick={() => {
                      onSelectCategory('solutions');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-heading font-bold text-[#ea0004] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Explore All Solutions Overview →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Brands */}
          <button
            id="mobile-nav-brands"
            onClick={() => { onSelectCategory('brands'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-heading font-semibold text-[15px] transition-colors flex items-center justify-between cursor-pointer ${activeCategory === 'brands'
                ? 'bg-rose-50 text-[#ea0004]'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Brands</span>
            {activeCategory === 'brands' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004]" />
            )}
          </button>

          {/* Contact */}
          <button
            id="mobile-nav-contact"
            onClick={() => { onSelectCategory('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-3 rounded-xl font-heading font-semibold text-[15px] transition-colors flex items-center justify-between cursor-pointer ${activeCategory === 'contact'
                ? 'bg-rose-50 text-[#ea0004]'
                : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Contact</span>
            {activeCategory === 'contact' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004]" />
            )}
          </button>

          {/* Mobile Drawer Quick Search & Quote Action */}
          <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                if (onSearchClick) onSearchClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search size={14} />
              <span>Search Products</span>
            </button>
            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer text-center"
              style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
            >
              Get In Touch
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
