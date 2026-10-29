import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustedSecuritySolutions from './components/TrustedSecuritySolutions';
import DayNightSection from './components/DayNightSection';
import PowerfulCapabilities from './components/PowerfulCapabilities';
import ActionCamera360 from './components/ActionCamera360';
import CustomerStories from './components/CustomerStories';
import ContactQuoteModal from './components/ContactQuoteModal';
import AdminPage from './components/AdminPage';
import ProductCatalog from './components/ProductCatalog';
import SolutionCalculator from './components/SolutionCalculator';
import SolutionsPage from './components/SolutionsPage';
import BrandsPage from './components/BrandsPage';
import AboutUsPage from './components/AboutUsPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import AchievementsStrip from './components/AchievementsStrip';
import WhatsAppButton from './components/WhatsAppButton';
import LogoReveal from './components/LogoReveal';
import { API_BASE } from './api';
import ALL_LOOKMAN_PRODUCTS from './data/allProducts.json';
import { resolveProductCode, resolveProductName } from './utils/productUtils';

// ── SPA BROWSER ROUTING & HISTORY SYNCHRONIZER ──
const parseRouteFromHash = (hashString) => {
  const hash = typeof hashString === 'string' ? hashString : (typeof window !== 'undefined' ? window.location.hash : '');
  // Normalize leading hash and optional slash: e.g. '#admin', '#/admin', etc.
  let clean = hash.replace(/^#[/]?/, '').trim();

  // If hash is empty, check pathname (e.g. user typed /admin or /admin/ in address bar)
  if (!clean && typeof window !== 'undefined') {
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().trim();
    if (rawPath === 'admin') {
      return { view: 'admin' };
    }
    if (rawPath) {
      clean = rawPath;
    }
  }

  if (!clean) return { view: 'home' };

  const [pathPart, queryPart] = clean.split('?');
  const path = (pathPart || '').toLowerCase().trim().replace(/^\/+|\/+$/g, '');
  const searchParams = new URLSearchParams(queryPart || '');

  if (path === 'admin') {
    return { view: 'admin' };
  }
  if (path === 'products' || path === 'catalog') {
    return {
      view: 'catalog',
      category: searchParams.get('category') || undefined,
      model: searchParams.get('model') || undefined
    };
  }
  if (path === 'solutions') {
    return {
      view: 'solutions',
      solutionId: searchParams.get('id') || 'school'
    };
  }
  if (path === 'brands') {
    return { view: 'brands' };
  }
  if (path === 'about') {
    return { view: 'about' };
  }
  if (path === 'contact') {
    return { view: 'contact' };
  }
  if (path === 'calculator') {
    return { view: 'calculator' };
  }
  if (path === 'home') {
    return { view: 'home' };
  }

  return { view: 'home' };
};

const buildHashForView = (view, options = {}) => {
  if (view === 'admin') return '#admin';
  if (view === 'catalog') {
    const params = new URLSearchParams();
    if (options.category && options.category !== 'all') {
      params.set('category', options.category);
    }
    if (options.model) {
      params.set('model', options.model);
    }
    const qs = params.toString();
    return qs ? `#products?${qs}` : '#products';
  }
  if (view === 'solutions') {
    if (options.solutionId && options.solutionId !== 'school') {
      return `#solutions?id=${encodeURIComponent(options.solutionId)}`;
    }
    return '#solutions';
  }
  if (view === 'brands') return '#brands';
  if (view === 'about') return '#about';
  if (view === 'contact') return '#contact';
  if (view === 'calculator') return '#calculator';
  return '#home';
};

export default function App() {
  const [products, setProducts] = useState([]);

  // Initialize navigation state directly from current URL hash
  const [selectedProductModel, setSelectedProductModel] = useState(() => {
    if (typeof window !== 'undefined') {
      const initRoute = parseRouteFromHash();
      return initRoute.model || null;
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const initRoute = parseRouteFromHash();
      return initRoute.category || 'all';
    }
    return 'all';
  });

  const [selectedSolutionId, setSelectedSolutionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const initRoute = parseRouteFromHash();
      return initRoute.solutionId || 'school';
    }
    return 'school';
  });

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const initRoute = parseRouteFromHash();
      return initRoute.view || 'home';
    }
    return 'home';
  });

  const [contactOpen, setContactOpen] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [logoRevealOpen, setLogoRevealOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const heroBgs = [
    '/hero_slide1_anpr.png',
    '/hero_slide2_makeinindia.png',
    '/hero_slide3_smartersecurity.png',
    '/hero_slide4_solar.png'
  ];

  useEffect(() => {
    if (viewMode !== 'home' || contactOpen || adminOpen || logoRevealOpen) return;
    const timer = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [viewMode, heroBgs.length, contactOpen, adminOpen, logoRevealOpen]);

  // ── COMPREHENSIVE BROWSER HISTORY (BACK/FORWARD ARROWS) ENGINE ──
  useEffect(() => {
    // Check if initial URL was accessed via direct path e.g. /admin
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().trim();
    if (rawPath === 'admin') {
      window.history.replaceState({ view: 'admin' }, '', '#admin');
      setViewMode('admin');
    } else if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState({ view: 'home' }, '', '#home');
    }

    const handleBrowserNavigation = () => {
      const route = parseRouteFromHash();
      setContactOpen(false);

      if (route.view === 'catalog') {
        if (route.category) {
          setSelectedCategory(route.category);
        }
        setSelectedProductModel(route.model || null);
        setViewMode('catalog');
      } else if (route.view === 'solutions') {
        if (route.solutionId) {
          setSelectedSolutionId(route.solutionId);
        }
        setSelectedProductModel(null);
        setViewMode('solutions');
      } else if (route.view === 'admin') {
        setSelectedProductModel(null);
        setViewMode('admin');
      } else {
        if (route.view === 'home') {
          setSelectedCategory('all');
        }
        setSelectedProductModel(null);
        setViewMode(route.view);
      }

      if (!route.model) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handleBrowserNavigation);
    window.addEventListener('hashchange', handleBrowserNavigation);

    return () => {
      window.removeEventListener('popstate', handleBrowserNavigation);
      window.removeEventListener('hashchange', handleBrowserNavigation);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
    const savedUser = localStorage.getItem('lookman_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { }
    }

    // Prevent blinking text insertion caret on static contents/components (e.g. from Caret Browsing)
    const handleCaretOutside = (e) => {
      const isInput = e.target && e.target.closest && e.target.closest('input, textarea, [contenteditable="true"]');
      if (!isInput) {
        const sel = window.getSelection();
        if (sel && sel.isCollapsed && sel.rangeCount > 0) {
          sel.removeAllRanges();
        }
      }
    };

    const handleProductsUpdated = () => fetchProducts();
    window.addEventListener('lookman_products_updated', handleProductsUpdated);

    document.addEventListener('mouseup', handleCaretOutside);
    document.addEventListener('click', handleCaretOutside);
    return () => {
      window.removeEventListener('lookman_products_updated', handleProductsUpdated);
      document.removeEventListener('mouseup', handleCaretOutside);
      document.removeEventListener('click', handleCaretOutside);
    };
  }, []);

  // ── 2000PX FLUID ZOOM-OUT & 100% ZOOM PADDING ENGINE ──
  useEffect(() => {
    const updateZoomPad = () => {
      const innerW = window.innerWidth;
      const outerW = window.outerWidth;
      const zoomRatio = (outerW && innerW) ? (outerW / innerW) : 1;
      let pad = 260;

      if (innerW < 640) {
        pad = 20;
      } else if (innerW < 1024) {
        pad = 32;
      } else {
        // At 100% zoom (ratio >= 0.96): full padding (260px on desktop)
        const basePad = innerW >= 1366 ? 260 : Math.min(260, Math.max(36, Math.round((innerW - 840) / 2)));
        if (zoomRatio >= 0.96) {
          pad = basePad;
        } else if (zoomRatio <= 0.28) {
          // In the last 25% zoom (minimum browser zoom level): no padding (0px)
          pad = 0;
        } else {
          // Reduced step-by-step as you zoom out from 100% towards 25%
          const progress = (zoomRatio - 0.28) / (0.96 - 0.28);
          pad = Math.max(0, Math.round(basePad * progress));
        }
      }

      document.documentElement.style.setProperty('--wide-pad-left', `${pad}px`);
      document.documentElement.style.setProperty('--wide-pad-right', `${pad}px`);
    };

    updateZoomPad();
    window.addEventListener('resize', updateZoomPad, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateZoomPad, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', updateZoomPad);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateZoomPad);
      }
    };
  }, []);

  const fetchProducts = async () => {
    let prods = [];
    let backendDeleted = [];
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        prods = data.products;
        if (data.deletedProductIds && Array.isArray(data.deletedProductIds)) {
          backendDeleted = data.deletedProductIds;
        }
      }
    } catch (err) {
      // Backend offline on Netlify
    }

    // Helper to identify Secura serial cameras
    const isSecuraSerial = (p) => {
      if (!p) return false;
      const m = String(p.model || p.name || '').toUpperCase().trim();
      const b = String(p.brand || '').toLowerCase().trim();
      return m.startsWith('SIP-') || m.startsWith('SHD-') || m.startsWith('SNVR-') || m.startsWith('SXVR-') || b === 'secura';
    };

    // Helper to identify obsolete sample / placeholder products
    const isObsoleteSample = (p) => {
      if (!p) return false;
      const m = String(p.model || p.productCode || p.id || '').toUpperCase().trim();
      const obsoleteCodes = [
        'CO-IP-401FDA', 'CO-IP-201FDMA', 'CO-PTZ-8032AI', 'CO-PTZ-2025AI', 
        'CO-NVR-0432AI', 'CO-NVR-0216', 'CO-XVR-1615L', 'CO-SW-0802POE',
        'CO-IP-4AIFDS', 'CO-IP-2AIFDRA', 'CO-PTZ-8R12AI'
      ];
      return obsoleteCodes.some(c => m.includes(c));
    };

    // Clean up local storage from old Secura & placeholder items
    const rawCustom = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const cleanedCustom = rawCustom.filter(p => !isSecuraSerial(p) && !isObsoleteSample(p));
    if (cleanedCustom.length !== rawCustom.length) {
      localStorage.setItem('lookman_custom_products', JSON.stringify(cleanedCustom));
    }

    // Merge backend deleted list and local deleted list permanently
    const localDeleted = JSON.parse(localStorage.getItem('lookman_deleted_product_ids') || '[]');
    let allDeleted = [...new Set([...localDeleted, ...backendDeleted])].filter(Boolean);

    // If backend returned active products, purge any stale tombstones
    if (prods && prods.length > 0) {
      const activeKeys = new Set();
      prods.forEach(p => {
        if (p.id) activeKeys.add(String(p.id).toLowerCase().trim());
        if (p.model) activeKeys.add(String(p.model).toLowerCase().trim());
        if (p.productCode) activeKeys.add(String(p.productCode).toLowerCase().trim());
        if (p.name) activeKeys.add(String(p.name).toLowerCase().trim());
        if (p.slug) activeKeys.add(String(p.slug).toLowerCase().trim());
        const stripped = String(p.model || p.productCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (stripped) activeKeys.add(stripped);
      });
      allDeleted = allDeleted.filter(d => {
        const dl = String(d || '').toLowerCase().trim();
        const dlStripped = dl.replace(/[^a-z0-9]/g, '');
        return !activeKeys.has(dl) && !activeKeys.has(dlStripped);
      });
      localStorage.setItem('lookman_deleted_product_ids', JSON.stringify(allDeleted));
    }

    // Purge custom products from allDeleted so user added/imported items are never hidden
    if (cleanedCustom.length > 0) {
      const customKeys = new Set();
      cleanedCustom.forEach(p => {
        if (p.id) customKeys.add(String(p.id).toLowerCase().trim());
        if (p.model) customKeys.add(String(p.model).toLowerCase().trim());
        if (p.productCode) customKeys.add(String(p.productCode).toLowerCase().trim());
        if (p.name) customKeys.add(String(p.name).toLowerCase().trim());
        if (p.slug) customKeys.add(String(p.slug).toLowerCase().trim());
        const stripped = String(p.model || p.productCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (stripped) customKeys.add(stripped);
      });
      allDeleted = allDeleted.filter(d => {
        const dl = String(d || '').toLowerCase().trim();
        const dlStripped = dl.replace(/[^a-z0-9]/g, '');
        return !customKeys.has(dl) && !customKeys.has(dlStripped);
      });
      localStorage.setItem('lookman_deleted_product_ids', JSON.stringify(allDeleted));
    }

    // Combine custom products and base products (custom products always first on top)
    const combined = [...cleanedCustom];

    // Merge backend products from MongoDB / db.json
    const activeBackendProds = prods.filter(p => !isSecuraSerial(p) && !isObsoleteSample(p));
    activeBackendProds.forEach(bp => {
      const bpModel = (bp.model || bp.productCode || bp.name || '').toLowerCase().trim();
      const bpId = String(bp.id || '');
      const already = combined.some(cp => 
        (bpId && String(cp.id) === bpId) || 
        (bpModel && (cp.model || cp.productCode || '').toLowerCase().trim() === bpModel) || 
        (bpModel && (cp.name || '').toLowerCase().trim() === bpModel)
      );
      if (!already) {
        combined.push(bp);
      }
    });

    // If combined is empty, fallback to ALL_LOOKMAN_PRODUCTS baseline
    if (combined.length === 0) {
      ALL_LOOKMAN_PRODUCTS.forEach(bp => {
        if (!isSecuraSerial(bp) && !isObsoleteSample(bp)) {
          combined.push(bp);
        }
      });
    }

    const normalized = combined.map(p => {
      const code = resolveProductCode(p);
      const name = resolveProductName(p);
      return {
        ...p,
        productCode: code,
        name: name,
        title: name
      };
    });

    setProducts(normalized);
  };

  const handleAdminLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('lookman_user', JSON.stringify(userData));
    localStorage.setItem('lookman_token', token);
  };

  const handleAdminLogout = () => {
    setUser(null);
    localStorage.removeItem('lookman_user');
    localStorage.removeItem('lookman_token');
  };

  const navigateTo = (view, options = {}, replace = false) => {
    const targetHash = buildHashForView(view, options);
    setContactOpen(false);

    if (view === 'catalog') {
      if (options.category) {
        setSelectedCategory(options.category);
      }
      setSelectedProductModel(options.model || null);
      setViewMode('catalog');
    } else if (view === 'solutions') {
      if (options.solutionId) {
        setSelectedSolutionId(options.solutionId || 'school');
      }
      setSelectedProductModel(null);
      setViewMode('solutions');
    } else if (view === 'admin') {
      setSelectedProductModel(null);
      setViewMode('admin');
    } else {
      if (view === 'home') {
        setSelectedCategory('all');
      }
      setSelectedProductModel(null);
      setViewMode(view);
    }

    if (window.location.hash !== targetHash) {
      if (replace) {
        window.history.replaceState({ view, ...options }, '', targetHash);
      } else {
        window.history.pushState({ view, ...options }, '', targetHash);
      }
    }

    if (!options.model) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToWebsite = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('home');
    }
  };

  const handleOpenAdmin = () => {
    navigateTo('admin');
  };

  const handleOpenQuoteWithDetails = (detailsMsg) => {
    setQuoteDetails(typeof detailsMsg === 'string' ? detailsMsg : '');
    setContactOpen(true);
  };

  const handleCategorySelect = (cat) => {
    if (cat === 'home') {
      navigateTo('home');
    } else if (cat === 'all' || cat === 'products' || cat === 'catalog') {
      navigateTo('catalog', { category: 'All' });
    } else if (cat === 'admin') {
      navigateTo('admin');
    } else if (cat === 'solutions') {
      navigateTo('solutions', { solutionId: 'school' });
    } else if (cat === 'brands') {
      navigateTo('brands');
    } else if (cat === 'about') {
      navigateTo('about');
    } else if (cat === 'contact') {
      navigateTo('contact');
    } else if (cat === 'calculator') {
      navigateTo('calculator');
    } else {
      navigateTo('catalog', { category: cat });
    }
  };

  const handleSolutionSelect = (solId) => {
    navigateTo('solutions', { solutionId: solId || 'school' });
  };

  return (
    <div className="min-h-screen bg-white text-[#12182b] flex flex-col selection:bg-[#e73455] selection:text-white">
      {/* ── UNIFIED HEADER & HERO TOP BLOCK (MATCHING HOMEPAGE SPECIFICATION) ── */}
      {viewMode !== 'calculator' && viewMode !== 'admin' ? (
        <div
          className={`relative bg-transparent z-30 w-full flex flex-col hero-top-container ${
            viewMode === 'home' ? 'view-home' : 'view-subpage'
          }`}
        >

          {/* Hero image layer: Full-width edge-to-edge preserving aspect ratio & fade effect on zoom */}
          <div className="absolute inset-0 w-full pointer-events-none z-0 overflow-hidden hero-mask-layer">
            {viewMode === 'home' ? (
              heroBgs.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full hero-slide-bg transition-opacity duration-1000 ease-in-out ${
                    idx === heroBgIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundImage: `url('${imgUrl}')`
                  }}
                />
              ))
            ) : (
              <div
                className="absolute inset-0 w-full h-full bg-cover transition-all duration-700"
                style={{
                  backgroundImage: `url('${
                    viewMode === 'catalog'
                      ? '/products_hero_bg.png'
                      : viewMode === 'solutions'
                      ? '/solutions_architects_hero.webp'
                      : viewMode === 'brands'
                      ? '/brands_hero_bg.png'
                      : viewMode === 'contact'
                      ? '/contact_hero_bg.webp'
                      : viewMode === 'about'
                      ? '/about_corporate_hero.webp'
                      : '/hero_light_slide1.jpg'
                  }')`,
                  backgroundPosition:
                    viewMode === 'contact'
                      ? 'right 38%'
                      : viewMode === 'solutions'
                      ? 'right 20%'
                      : viewMode === 'catalog'
                      ? 'center center'
                      : viewMode === 'brands'
                      ? 'center 40%'
                      : 'center top'
                }}
              />
            )}
          </div>

          {/* 100% Full Width Transparent Header Layer with Adaptive Opposite Text Contrast */}
          <Header
            activeCategory={
              viewMode === 'catalog'
                ? 'products'
                : viewMode === 'solutions'
                ? 'solutions'
                : viewMode === 'brands'
                ? 'brands'
                : viewMode === 'about'
                ? 'about'
                : viewMode === 'contact'
                ? 'contact'
                : 'home'
            }
            onSelectCategory={handleCategorySelect}
            onSelectSolution={handleSolutionSelect}
            onOpenContact={() => handleOpenQuoteWithDetails('')}
            onOpenAdmin={handleOpenAdmin}
            onOpenCalculator={() => navigateTo('calculator')}
            onOpenLogoReveal={() => setLogoRevealOpen(true)}
            onSearchClick={() => navigateTo('catalog')}
            user={user}
            isDarkSlide={viewMode === 'home' ? [true, true, false, true][heroBgIndex % 4] : true}
          />

          {/* 100% Full Screen Width Baseline for Hero Content */}
          <div className="w-full flex-1 flex flex-col relative z-10">
            {viewMode === 'home' && (
              <HeroSection
                currentSlide={heroBgIndex}
                onSlideChange={setHeroBgIndex}
                onOpenContact={() => handleOpenQuoteWithDetails('')}
                onExploreProducts={() => navigateTo('catalog')}
                onOpenCalculator={() => navigateTo('calculator')}
              />
            )}

            {(viewMode === 'catalog' || viewMode === 'solutions' || viewMode === 'about' || viewMode === 'contact' || viewMode === 'brands') && (
              <div className={`w-full max-w-[2000px] mx-auto pt-10 sm:pt-16 pb-2 select-none ${
                viewMode === 'about' ? 'wide-2000-flush' : 'wide-2000-symmetric'
              }`}>
                <div>
                  <h1
                    className="text-2xl sm:text-3xl lg:text-[36px] font-heading font-semibold tracking-tight leading-[1.1]"
                    style={{
                      background: 'linear-gradient(to right, #ea0004 0%, #6a0006 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    {viewMode === 'catalog'
                      ? 'Products'
                      : viewMode === 'solutions'
                      ? 'Solutions'
                      : viewMode === 'about'
                      ? 'About Us'
                      : viewMode === 'brands'
                      ? 'Brands'
                      : 'Contact'}
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CALCULATOR & ADMIN PAGES HEADER */
        <div className="relative bg-[#f8f9fc] border-b border-[#eaecf0] z-40">
          <Header
            activeCategory={viewMode === 'admin' ? 'admin' : 'calculator'}
            onSelectCategory={handleCategorySelect}
            onSelectSolution={handleSolutionSelect}
            onOpenContact={() => handleOpenQuoteWithDetails('')}
            onOpenAdmin={handleOpenAdmin}
            onOpenCalculator={() => navigateTo('calculator')}
            onSearchClick={() => navigateTo('catalog')}
            user={user}
          />
        </div>
      )}

      {/* ── MAIN CONTENT WORKSPACE (ALL BODY CONTENTS IN PURE WHITE SPACE) ── */}
      <main id="main-content" className="flex-1 w-full relative z-0 bg-white">
        {viewMode === 'admin' ? (
          <AdminPage
            user={user}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            onBackToHome={handleBackToWebsite}
          />
        ) : viewMode === 'catalog' ? (
          <div className="w-full bg-transparent pt-8 pb-16">
            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              selectedModel={selectedProductModel}
              onSelectModel={(model) => navigateTo('catalog', { category: selectedCategory, model })}
              onClearModel={() => {
                if (window.history.length > 1 && window.location.hash.includes('model=')) {
                  window.history.back();
                } else {
                  navigateTo('catalog', { category: selectedCategory });
                }
              }}
              onSelectCategory={handleCategorySelect}
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />
          </div>
        ) : viewMode === 'solutions' ? (
          <div className="w-full pt-8 pb-16">
            <SolutionsPage
              initialSolutionId={selectedSolutionId}
              onSelectProduct={(p) => {
                navigateTo('catalog', { category: p.category || 'HD IP Camera' });
              }}
              onOpenQuote={handleOpenQuoteWithDetails}
            />
          </div>
        ) : viewMode === 'brands' ? (
          <div className="w-full pt-8 pb-16">
            <BrandsPage
              onSelectCategory={handleCategorySelect}
              onOpenQuote={handleOpenQuoteWithDetails}
            />
          </div>
        ) : viewMode === 'about' ? (
          <div className="w-full pb-0">
            <AboutUsPage
              onOpenQuote={handleOpenQuoteWithDetails}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        ) : viewMode === 'contact' ? (
          <div className="w-full pt-8 pb-16">
            <ContactPage
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />
          </div>
        ) : viewMode === 'calculator' ? (
          /* Solution Calculator View */
          <div className="site-container py-12">
            <button
              onClick={handleBackToWebsite}
              className="mb-6 text-xs font-bold text-[#0070ba] hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Homepage
            </button>
            <SolutionCalculator
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />
          </div>
        ) : (
          /* ORIGINAL COMPLETE HOMEPAGE FLOW */
          <>
            {/* 0. Our Impact Achievements Strip (Body Component) */}
            <AchievementsStrip
              onOpenContact={() => handleOpenQuoteWithDetails('')}
            />

            {/* 1. Trusted Security Solutions */}
            <TrustedSecuritySolutions
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />

            {/* 2. Day & Night Vision Interactive Split Slider Mode */}
            <DayNightSection
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />

            {/* 3. Smart Security Powerful Capabilities */}
            <PowerfulCapabilities />

            {/* 4. 360° Action Camera Section */}
            <ActionCamera360
              onOpenQuoteWithDetails={handleOpenQuoteWithDetails}
            />

            {/* 5. Customer Stories & Metrics */}
            <CustomerStories />
          </>
        )}
      </main>

      {/* Contact & Quote Modal */}
      <ContactQuoteModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        initialDetails={quoteDetails}
        products={products}
      />

      {/* ── ORIGINAL LOOKMAN HOMEPAGE FOOTER ── */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onOpenContact={() => handleOpenQuoteWithDetails('')}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ── PERMANENT FLOATING WHATSAPP BUTTON (VISIBLE ON ALL PAGES) ── */}
      <WhatsAppButton />
    </div>
  );
}
