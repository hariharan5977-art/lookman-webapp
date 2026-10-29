import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, ChevronDown, Eye, Shield, Check, Download, Share2, FileText } from './Icons';
import ALL_LOOKMAN_PRODUCTS from '../data/allProducts.json';
import { resolveProductCode, resolveProductName, downloadProductDatasheet } from '../utils/productUtils';
import { removeWhiteBackgroundFromImage } from '../utils/imageTransparency';

// ─── LOOKMAN OFFICIAL CATEGORIES & SUB-FILTERS TAXONOMY (TVT INDIA PATTERN) ───
const LOOKMAN_TAXONOMY = [
  {
    id: 'all-products',
    name: 'All',
    isAll: true,
    subcategories: [],
    pillFilters: ['All', 'IP Camera', 'HD Camera', 'PTZ', 'NVR', 'XVR', '4K UHD']
  },
  {
    id: 'ptz-cameras',
    name: 'PTZ Cameras',
    subcategories: [
      { id: 'ptz-all', name: '- All PTZ Cameras', filterKey: 'PTZ' },
      { id: 'ptz-2mp', name: '- 2MP Speed Dome', filterKey: '2MP' },
      { id: 'ptz-4mp', name: '- 4MP Speed Dome', filterKey: '4MP' },
      { id: 'ptz-8mp', name: '- 8MP 4K Speed Dome', filterKey: '8MP' },
    ],
    pillFilters: ['All', '2MP', '4MP', '8MP']
  },
  {
    id: 'hd-ip-camera',
    name: 'HD IP Camera',
    subcategories: [
      { id: 'ip-e-pro', name: '- E- Pro Series', filterKey: 'IP PRO Series' },
      { id: 'ip-2mp', name: '- 2MP', filterKey: '2MP' },
      { id: 'ip-4mp', name: '- 4MP', filterKey: '4MP' },
      { id: 'ip-5mp', name: '- 5MP', filterKey: '5MP' },
      { id: 'ip-6mp', name: '- 6MP', filterKey: '6MP' },
      { id: 'ip-8mp', name: '- 8MP', filterKey: '8MP' },
      { id: 'ip-full-color', name: '- Full Color Cameras', filterKey: 'Color Audio' },
      { id: 'ip-s-lite', name: '- S Lite Series', filterKey: 'S Lite' },
      { id: 'ip-special', name: '- Special IP Camera', filterKey: 'PANA' },
    ],
    pillFilters: ['E3', 'E3B', 'PRO Series', '4K UHD']
  },
  {
    id: 'hybrid-dvr',
    name: 'Hybrid DVR',
    subcategories: [
      { id: 'dvr-h265', name: '- H.265 Series', filterKey: '2MP LITE' },
      { id: 'dvr-720p', name: '- 720P / 1080P Series', filterKey: '5MP Lite' },
    ],
    pillFilters: ['All', 'H.265 Series', '2MP LITE', '5MP Lite']
  },
  {
    id: 'ai-product',
    name: 'AI Product',
    subcategories: [
      { id: 'ai-face-capture', name: '- Face Capture Network Camera', filterKey: 'FD' },
      { id: 'ai-face-recog', name: '- Face Recognition Network Camera', filterKey: 'FD' },
      { id: 'ai-face-nvr', name: '- Face Recognition NVR', filterKey: 'AI NVR' },
      { id: 'ai-anpr', name: '- ANPR License Plate Camera', filterKey: 'AMPR' },
    ],
    pillFilters: ['All', 'Face Capture', 'Face Recognition', 'ANPR']
  },
  {
    id: 'switch',
    name: 'Switch',
    subcategories: [
      { id: 'switch-4-8', name: '- 4/8 PORT POE SWITCH', filterKey: 'all' },
      { id: 'switch-16-24', name: '- 16/24 PORT POE SWITCH', filterKey: 'all' },
    ],
    pillFilters: ['All', '4/8 Port', '16/24 Port']
  },
  {
    id: 'nvrs',
    name: 'NVRS',
    subcategories: [
      { id: 'nvr-1hdd', name: '- 1 HDD', filterKey: 'SNVR Series' },
      { id: 'nvr-2hdd', name: '- 2 HDD', filterKey: 'SNVR Series' },
      { id: 'nvr-4hdd', name: '- 4 HDD', filterKey: 'SNVR Series' },
      { id: 'nvr-ai', name: '- AI NVR Recorders', filterKey: 'AI NVR' },
    ],
    pillFilters: ['All', '1 HDD', '2 HDD', '4 HDD', 'AI NVR']
  },
  {
    id: 'platform-product',
    name: 'Platform Product',
    subcategories: [
      { id: 'platform-storage', name: '- Network Storage Server', filterKey: 'all' },
      { id: 'platform-vms', name: '- Enterprise VMS Platform', filterKey: 'all' },

    ],
    pillFilters: ['All', 'Storage Server', 'VMS Platform']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      { id: 'acc-keyboard', name: '- Keyboard & Controller', filterKey: 'all' },
      { id: 'acc-brackets', name: '- Mounts & Brackets', filterKey: 'all' },
      { id: 'acc-poe', name: '- PoE Power Injector', filterKey: 'all' },
    ],
    pillFilters: ['All', 'Keyboards', 'Brackets', 'Power']
  },
  {
    id: 'hd-analog-cameras',
    name: 'HD Analog Cameras',
    subcategories: [
      { id: 'analog-e-pro', name: '- E- Pro Series', filterKey: 'Color Audio' },
      { id: 'analog-s-lite', name: '- S-Lite Series', filterKey: 'IR Audio' },
    ],
    pillFilters: ['All', 'E- Pro Series', 'S-Lite Series']
  },
  {
    id: 'intercom',
    name: 'Intercom',
    subcategories: [
      { id: 'intercom-ip', name: '- IP Video Intercom', filterKey: 'all' },
      { id: 'intercom-door', name: '- Villa Door Station', filterKey: 'all' },
    ],
    pillFilters: ['All', 'IP Intercom', 'Door Station']
  }
];

function resolveProductImage(p) {
  if (!p) return '/color_on_bullet_hd.png';
  
  const m = String(p.model || p.name || p.title || p.productCode || p.rawModel || p.rawName || '').toUpperCase();
  const c = String(p.category || '').toUpperCase();
  const cats = (p.categories || []).map(x => String(x || '').toUpperCase());
  const combined = (m + ' ' + c + ' ' + cats.join(' ')).toUpperCase();

  // 1. Authentic Color On Cameras ALWAYS use the official 100% transparent PNG cutouts
  if (combined.includes('2DFDML') || (combined.includes('TURRET') && (combined.includes('ANALOG') || combined.includes('2MP') || combined.includes('FULL-COLOR') || combined.includes('FULLCOLOR')))) {
    return '/color_on_turret_hd.png';
  }
  if (combined.includes('2BFDML') || (combined.includes('BULLET') && (combined.includes('ANALOG') || combined.includes('2MP') || combined.includes('FULL-COLOR') || combined.includes('FULLCOLOR')))) {
    return '/color_on_bullet_hd.png';
  }
  if (combined.includes('401FDA') || (combined.includes('ACTIVE') && combined.includes('DETERRENCE')) || (combined.includes('4MP') && combined.includes('BULLET'))) {
    return '/color_on_bullet_hd.png';
  }
  if (combined.includes('201FDMA') || (combined.includes('IP') && (combined.includes('TURRET') || combined.includes('AUDIO')))) {
    return '/color_on_turret_hd.png';
  }
  if (combined.includes('8032')) return '/color_on_ptz_dome.png';
  if (combined.includes('2025')) return '/color_on_speed_dome.png';
  if (combined.includes('0432') || combined.includes('0216')) return '/color_on_nvr_chassis.png';
  if (combined.includes('1615')) return '/color_on_xvr_chassis.png';
  if (combined.includes('SW') || c.includes('SWITCH')) return '/color_on_nvr_chassis.png';

  // 2. Custom or uploaded camera image fallback
  const raw = (p.image || p.rawImage || '');
  if (raw && typeof raw === 'string' && raw.trim()) {
    const img = raw.trim();
    if (img.startsWith('data:') || img.startsWith('blob:') || img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    if (img.startsWith('/')) {
      return img;
    }
    return '/' + img.replace(/^\.?\//, '');
  }

  if (combined.includes('TURRET') || combined.includes('DOME')) return '/color_on_turret_hd.png';
  return '/color_on_bullet_hd.png';
}

/**
 * TransparentCameraImage component ensures that ANY image (including uploaded images with white square backgrounds)
 * is rendered 100% transparent without any white box or square background.
 */
function TransparentCameraImage({ src, alt, className = '', ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!src) return;
    setCurrentSrc(src);

    // If it's already an authentic transparent asset from public/, no processing needed
    if (src.startsWith('/color_on_') || src.startsWith('/CO-H-2')) {
      return;
    }

    if (cacheRef.current.has(src)) {
      setCurrentSrc(cacheRef.current.get(src));
      return;
    }

    let isCancelled = false;
    removeWhiteBackgroundFromImage(src, { threshold: 220 })
      .then(transparentUrl => {
        if (!isCancelled && transparentUrl) {
          cacheRef.current.set(src, transparentUrl);
          setCurrentSrc(transparentUrl);
        }
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={{
        background: 'transparent',
        backgroundColor: 'transparent'
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/color_on_bullet_hd.png';
      }}
      {...rest}
    />
  );
}

export default function ProductCatalog({ 
  products = [], 
  selectedCategory, 
  selectedModel,
  onSelectModel,
  onClearModel,
  onSelectCategory, 
  onOpenQuoteWithDetails 
}) {
  // Active State Management - Defaults to "All" or selectedCategory prop
  const [activeCategoryName, setActiveCategoryName] = useState(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const match = LOOKMAN_TAXONOMY.find(c => 
        c.name.toLowerCase().includes(selectedCategory.toLowerCase()) || 
        selectedCategory.toLowerCase().includes(c.name.toLowerCase())
      );
      return match ? match.name : selectedCategory;
    }
    return 'All';
  });
  const [activeSubFilter, setActiveSubFilter] = useState('all');
  const [activeSubcategoryTitle, setActiveSubcategoryTitle] = useState('All Products');
  const [activePillFilter, setActivePillFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Full-Page Product Detail View State
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [detailTab, setDetailTab] = useState('intro'); // 'intro' | 'specs' | 'accessories' | 'downloads'
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  // Mobile Category Dropdown State
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setMobileDropdownOpen(false);
      }
    }
    if (mobileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileDropdownOpen]);

  // Sync when selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const match = LOOKMAN_TAXONOMY.find(c => 
        c.name.toLowerCase().includes(selectedCategory.toLowerCase()) || 
        selectedCategory.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) {
        setActiveCategoryName(match.name);
        setActiveSubFilter('all');
        setActiveSubcategoryTitle(match.subcategories[0]?.name.replace('- ', '') || `All ${match.name}`);
        setActivePillFilter(match.pillFilters[0] || 'All');
        setSelectedProductDetail(null);
      } else {
        setActiveCategoryName(selectedCategory);
        setActiveSubFilter('all');
        setActiveSubcategoryTitle(selectedCategory);
        setActivePillFilter('All');
        setSelectedProductDetail(null);
      }
    } else if (selectedCategory === 'all' || !selectedCategory) {
      setActiveCategoryName('All');
      setActiveSubFilter('all');
      setActiveSubcategoryTitle('All Products');
      setActivePillFilter('All');
      setSelectedProductDetail(null);
    }
  }, [selectedCategory]);

  // Combine fetched API products with baseline products, strictly excluding Secura serials & obsolete samples
  const allAvailableProducts = useMemo(() => {
    const sourceList = (products && products.length > 0) ? products : ALL_LOOKMAN_PRODUCTS;
    const obsoleteCodes = [
      'CO-IP-401FDA', 'CO-IP-201FDMA', 'CO-PTZ-8032AI', 'CO-PTZ-2025AI', 
      'CO-NVR-0432AI', 'CO-NVR-0216', 'CO-XVR-1615L', 'CO-SW-0802POE'
    ];
    return sourceList.filter(p => {
      if (!p) return false;
      const m = String(p.model || p.name || p.productCode || p.id || '').toUpperCase().trim();
      const b = String(p.brand || '').toLowerCase().trim();
      const isSecura = m.startsWith('SIP-') || m.startsWith('SHD-') || m.startsWith('SNVR-') || m.startsWith('SXVR-') || b === 'secura';
      const isObsolete = obsoleteCodes.includes(m);
      return !isSecura && !isObsolete;
    }).map(p => {
      let cleanDesc = (p.description || p.title || '').replace(/\[\/?et_pb_[^\]]*\]/g, '').replace(/<[^>]*>/g, '').trim();
      if (!cleanDesc || cleanDesc.length < 10) {
        cleanDesc = `${p.category || 'Security'} Camera Solution with high resolution imaging.`;
      }

      const resolvedCode = resolveProductCode(p);
      const resolvedName = resolveProductName(p);
      const pCategory = p.category || (p.categories && p.categories[0]) || 'HD Analog Cameras';
      const pCategories = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories : [pCategory];

      return {
        ...p,
        id: p.id || resolvedCode,
        productCode: resolvedCode,
        name: resolvedName,
        model: resolvedCode,
        rawModel: p.model || '',
        rawName: p.name || '',
        brand: p.brand || 'Color On',
        title: p.title || resolvedName,
        description: p.description || cleanDesc,
        keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures : (typeof p.keyFeatures === 'string' ? p.keyFeatures.split(/\r?\n/).filter(Boolean) : []),
        category: pCategory,
        categories: pCategories,
        image: resolveProductImage(p),
        datasheetPdf: p.datasheetPdf || p.pdf || '',
        datasheetPdfName: p.datasheetPdfName || (p.datasheetPdf || p.pdf ? `${resolvedCode}_datasheet.pdf` : ''),
        specs: p.specs || {},
        functions: p.functions || {}
      };
    });
  }, [products]);

  // Sync when selectedModel prop changes (for browser back/forward navigation)
  useEffect(() => {
    if (selectedModel) {
      const target = selectedModel.toLowerCase().trim();
      const targetClean = target.replace(/[^a-z0-9]/g, '');
      const match = allAvailableProducts.find(p => {
        const pCode = (p.productCode || '').toLowerCase().trim();
        const pModel = (p.model || '').toLowerCase().trim();
        const pName = (p.name || '').toLowerCase().trim();
        const pRawModel = (p.rawModel || '').toLowerCase().trim();
        const pRawName = (p.rawName || '').toLowerCase().trim();
        const pId = String(p.id || '').toLowerCase().trim();

        return pCode === target ||
               pModel === target ||
               pName === target ||
               pRawModel === target ||
               pRawName === target ||
               pId === target ||
               pCode.replace(/[^a-z0-9]/g, '') === targetClean ||
               pName.replace(/[^a-z0-9]/g, '') === targetClean ||
               pRawName.replace(/[^a-z0-9]/g, '') === targetClean ||
               (targetClean.length > 8 && pName.replace(/[^a-z0-9]/g, '').includes(targetClean)) ||
               (targetClean.length > 8 && targetClean.includes(pName.replace(/[^a-z0-9]/g, '')));
      });
      if (match) {
        setSelectedProductDetail(match);
        setDetailTab('intro');
        setSelectedThumbnail(0);
        window.scrollTo({ top: 320, behavior: 'smooth' });
      }
    } else {
      setSelectedProductDetail(null);
    }
  }, [selectedModel, allAvailableProducts]);

  // Current Active Category Object
  const currentCategoryObj = useMemo(() => {
    return LOOKMAN_TAXONOMY.find(c => c.name.toLowerCase() === activeCategoryName.toLowerCase()) || LOOKMAN_TAXONOMY[0];
  }, [activeCategoryName]);

  // Filtered Products List - Comprehensive & Robust Category / Subcategory / Pill Matcher
  const displayedProducts = useMemo(() => {
    return allAvailableProducts.filter(p => {
      const pModel = (p.model || p.name || '').toUpperCase();
      const pCat = (p.category || '').toUpperCase();
      const pCats = (p.categories || []).map(c => c.toUpperCase());
      const pSpecs = JSON.stringify(p.specs || {}).toUpperCase();
      const pAllText = (pModel + ' ' + pCat + ' ' + pCats.join(' ') + ' ' + (p.title || '')).toUpperCase();

      // 1. Search Bar Query
      if (searchQuery.trim()) {
        const q = searchQuery.toUpperCase().trim();
        return pAllText.includes(q);
      }

      // 2. Main Category Filter
      let matchCat = false;
      const activeCatUpper = (activeCategoryName || '').toUpperCase();
      if (activeCategoryName === 'All' || activeCategoryName === 'All Equipment & Cameras') {
        matchCat = true;
      } else if (pCat === activeCatUpper || pCat.includes(activeCatUpper) || pCats.includes(activeCatUpper) || pCats.some(c => c.includes(activeCatUpper))) {
        matchCat = true;
      } else if (activeCategoryName === 'HD Analog Cameras') {
        matchCat = pModel.includes('CO-H') || pCat.includes('ANALOG') || pCat.includes('HD') || pCats.some(c => c.includes('HD ANALOG') || c.includes('COLOR AUDIO') || c.includes('IR AUDIO'));
      } else if (activeCategoryName === 'HD IP Camera') {
        matchCat = pModel.includes('IP') || pCat.includes('IP') || pCats.some(c => c.includes('IP'));
      } else if (activeCategoryName === 'PTZ Cameras') {
        matchCat = pCats.includes('PTZ') || pCat.includes('PTZ') || pModel.includes('PTZ') || pAllText.includes('PTZ') || pAllText.includes('SPEED DOME');
      } else if (activeCategoryName === 'Hybrid DVR') {
        matchCat = pModel.includes('XVR') || pCat.includes('XVR') || pCat.includes('DVR') || pCats.some(c => c.includes('XVR') || c.includes('DVR'));
      } else if (activeCategoryName === 'AI Product') {
        matchCat = pModel.includes('AI') || pCat.includes('AI') || pCats.some(c => c.includes('AI')) || pAllText.includes('AI');
      } else if (activeCategoryName === 'Switch') {
        matchCat = pAllText.includes('SWITCH') || pAllText.includes('POE') || pModel.includes('SW');
      } else if (activeCategoryName === 'NVRS') {
        matchCat = pModel.includes('NVR') || pCat.includes('NVR') || pCats.includes('NVRS') || pCats.includes('NVR');
      } else if (activeCategoryName === 'Platform Product') {
        matchCat = pAllText.includes('STORAGE') || pAllText.includes('SERVER') || pAllText.includes('VMS');
      } else if (activeCategoryName === 'Accessories') {
        matchCat = pAllText.includes('KEYBOARD') || pAllText.includes('MOUNT') || pAllText.includes('BRACKET') || pAllText.includes('POE') || pAllText.includes('ACCESSOR');
      } else if (activeCategoryName === 'Intercom') {
        matchCat = pAllText.includes('INTERCOM') || pAllText.includes('DOOR');
      } else {
        matchCat = true;
      }

      if (!matchCat) return false;

      // 3. Subcategory Filter (Left Sidebar sub-items)
      if (activeSubFilter && activeSubFilter !== 'all') {
        const s = activeSubFilter.toUpperCase();
        let matchSub = false;
        if (s === 'PTZ') matchSub = pCats.includes('PTZ') || pModel.includes('PTZ');
        else if (s === '2MP') matchSub = pModel.includes('2MP') || pModel.includes('2B') || pModel.includes('2D') || pModel.includes('201') || pModel.includes('2025') || pSpecs.includes('2MP') || pSpecs.includes('1080P');
        else if (s === '4MP') matchSub = pModel.includes('4MP') || pModel.includes('401') || pSpecs.includes('4MP');
        else if (s === '5MP') matchSub = pModel.includes('5MP') || pSpecs.includes('5MP');
        else if (s === '6MP' || s === '8MP') matchSub = pModel.includes('8MP') || pModel.includes('8032') || pSpecs.includes('8MP') || pSpecs.includes('4K');
        else if (s === 'COLOR AUDIO') matchSub = pCats.includes('COLOR AUDIO') || pCat.includes('COLOR AUDIO') || pAllText.includes('COLOR');
        else if (s === 'IR AUDIO') matchSub = pCats.includes('IR AUDIO') || pCat.includes('IR AUDIO') || pAllText.includes('IR');
        else if (s === 'IP PRO SERIES') matchSub = pCat.includes('IP') || pCats.includes('IP PRO SERIES');
        else if (s === 'S LITE') matchSub = pAllText.includes('LITE') || pModel.includes('L');
        else if (s === 'AI NVR') matchSub = pModel.includes('AI') && pModel.includes('NVR');
        else if (s === 'SNVR SERIES' || s === 'NVR') matchSub = pModel.includes('NVR');
        else matchSub = pAllText.includes(s);

        if (!matchSub) return false;
      }

      // 4. Horizontal Pill Filter
      if (activePillFilter && !['All', 'E3', 'E3B'].includes(activePillFilter)) {
        const pillKey = activePillFilter.toUpperCase();
        let matchPill = false;
        if (pillKey === '2MP') matchPill = pModel.includes('2MP') || pModel.includes('2B') || pModel.includes('2D') || pModel.includes('201') || pModel.includes('2025') || pSpecs.includes('2MP') || pSpecs.includes('1080P');
        else if (pillKey === '4MP') matchPill = pModel.includes('4MP') || pModel.includes('401') || pSpecs.includes('4MP');
        else if (pillKey === '8MP' || pillKey === '4K UHD') matchPill = pModel.includes('8MP') || pModel.includes('8032') || pSpecs.includes('8MP') || pSpecs.includes('4K');
        else if (pillKey === 'COLOR AUDIO') matchPill = pCats.includes('COLOR AUDIO') || pCat.includes('COLOR AUDIO') || pAllText.includes('COLOR');
        else matchPill = pAllText.includes(pillKey);

        if (!matchPill) return false;
      }

      return true;
    });
  }, [allAvailableProducts, activeCategoryName, activeSubFilter, activePillFilter, searchQuery]);

  const handleOpenDetailView = (product) => {
    const code = resolveProductCode(product);
    if (onSelectModel) {
      onSelectModel(code || product.model);
    } else {
      setSelectedProductDetail(product);
      setDetailTab('intro');
      setSelectedThumbnail(0);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handleBackToCatalog = () => {
    if (onClearModel) {
      onClearModel();
    } else {
      setSelectedProductDetail(null);
    }
  };

  return (
    <div className="w-full bg-transparent font-body text-slate-700 min-h-screen">
      
      {/* ── MAIN WORKSPACE CONTAINER: LEFT CATEGORY SIDEBAR + RIGHT PRODUCT CONTENT ── */}
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pb-16 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* ── 1A. MOBILE VIEW ALONE: COMPACT CATEGORY DROPDOWN WITH CATEGORY NAME ── */}
          <div className="block md:hidden w-full relative z-30 mb-2 anim-card-slide-left" ref={mobileDropdownRef}>
            {/* Backdrop for outside click */}
            {mobileDropdownOpen && (
              <div 
                className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px]"
                onClick={() => setMobileDropdownOpen(false)}
              />
            )}

            <div className="relative z-40">
              {/* Dropdown Toggle Trigger Card */}
              <button
                type="button"
                onClick={() => setMobileDropdownOpen(prev => !prev)}
                className="w-full bg-white border border-slate-200/90 rounded-xl px-5 py-3.5 shadow-md flex items-center justify-between text-left transition-all active:scale-[0.99] cursor-pointer hover:border-slate-300"
                aria-expanded={mobileDropdownOpen}
                aria-haspopup="listbox"
                id="mobile-category-dropdown-btn"
              >
                <span className="text-sm sm:text-base font-heading font-bold text-[#101f46] tracking-tight">
                  Category
                </span>

                <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 transition-all duration-200 ${mobileDropdownOpen ? 'rotate-180 bg-red-50 text-[#ea0004]' : ''}`}>
                  <ChevronDown size={18} />
                </div>
              </button>


              {/* Collapsible Dropdown Panel */}
              {mobileDropdownOpen && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/90 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-100 max-h-[65vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="listbox"
                >
                  <div className="bg-[#f8fafd] px-4 py-2.5 text-xs font-heading font-bold text-[#101f46] flex items-center justify-between border-b border-slate-100">
                    <span>Select Category</span>
                    <span className="text-[11px] font-medium text-slate-400">11 Categories</span>
                  </div>
                  {LOOKMAN_TAXONOMY.map((cat) => {
                    const isActive = activeCategoryName.toLowerCase() === cat.name.toLowerCase();
                    const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

                    return (
                      <div key={cat.id} className="w-full">
                        {/* Category Button in Dropdown */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategoryName(cat.name);
                            setActiveSubFilter('all');
                            setActiveSubcategoryTitle(cat.subcategories[0]?.name.replace('- ', '') || `All ${cat.name}`);
                            setActivePillFilter(cat.pillFilters[0] || 'All');
                            setSearchQuery('');
                            setSelectedProductDetail(null);
                            setMobileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-[#fcfdfe] text-[#ea0004] font-bold shadow-2xs'
                              : 'bg-white text-slate-700 font-medium hover:bg-[#f8fafd] hover:text-[#ea0004]'
                          }`}
                        >
                          {isActive && (
                            <span 
                              className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xs"
                              style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                            />
                          )}
                          <span className={isActive ? 'hero-title-gradient font-bold' : ''}>
                            {cat.name}
                          </span>
                          {isActive ? (
                            <span className="text-[#ea0004] text-xs font-bold flex items-center gap-1">
                              <Check size={14} /> Selected
                            </span>
                          ) : (
                            hasSubcategories && (
                              <span className="text-slate-400 text-xs font-normal">
                                {cat.subcategories.length} sub-types
                              </span>
                            )
                          )}
                        </button>

                        {/* Subcategories (if active) */}
                        {isActive && hasSubcategories && (
                          <div className="bg-[#f8fafd] border-t border-b border-slate-100 py-1.5 px-2 space-y-1">
                            <div className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Subcategories
                            </div>
                            {cat.subcategories.map((sub) => {
                              const subTitle = sub.name.replace('- ', '');
                              const isSubActive = activeSubFilter === sub.filterKey || activeSubcategoryTitle === subTitle;

                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSubFilter(sub.filterKey);
                                    setActiveSubcategoryTitle(subTitle);
                                    setSelectedProductDetail(null);
                                    setMobileDropdownOpen(false);
                                  }}
                                  className={`w-full text-left pl-6 pr-3 py-2 text-xs rounded-lg font-body transition-all flex items-center justify-between cursor-pointer ${
                                    isSubActive
                                      ? 'text-[#ea0004] font-bold bg-white border border-red-100 shadow-2xs'
                                      : 'text-slate-600 hover:text-[#101f46] hover:bg-white/80 font-medium'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-[#ea0004]' : 'bg-slate-300'}`} />
                                    <span className="truncate">{subTitle}</span>
                                  </div>
                                  {isSubActive && <Check size={12} className="text-[#ea0004] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── 1B. DESKTOP VIEW ALONE: LEFT SIDEBAR CATEGORY NAVIGATION ── */}
          <div className="hidden md:block md:w-60 lg:w-64 min-[2000px]:w-72 shrink-0 border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-lg anim-card-slide-left">
            <div className="bg-[#f8fafd] text-[#101f46] px-4 py-3 text-sm font-heading font-bold border-b border-slate-200/80 text-left flex items-center justify-between">
              <span>Category</span>
            </div>
            <div className="divide-y divide-slate-100">
              {LOOKMAN_TAXONOMY.map((cat) => {
                const isActive = activeCategoryName.toLowerCase() === cat.name.toLowerCase();
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

                return (
                  <div key={cat.id} className="w-full">
                    {/* Category Header Button */}
                    <button
                      onClick={() => {
                        setActiveCategoryName(cat.name);
                        setActiveSubFilter('all');
                        setActiveSubcategoryTitle(cat.subcategories[0]?.name.replace('- ', '') || `All ${cat.name}`);
                        setActivePillFilter(cat.pillFilters[0] || 'All');
                        setSearchQuery('');
                        setSelectedProductDetail(null);
                      }}
                      className={`w-full text-left pl-5 pr-4 py-3 text-xs sm:text-sm font-heading transition-all relative flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#fcfdfe] shadow-2xs font-bold'
                          : 'bg-white text-slate-700 font-medium hover:bg-[#f8fafd] hover:text-[#ea0004]'
                      }`}
                    >
                      {/* Double-Shaded Gradient Selection Marker Line at Left Edge */}
                      {isActive && (
                        <span 
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xs"
                          style={{ background: 'linear-gradient(180deg, #ea0004 0%, #6a0006 100%)' }}
                        />
                      )}

                      <span className={isActive ? 'hero-title-gradient font-bold' : ''}>
                        {cat.name}
                      </span>

                      {/* Chevron Indicator */}
                      {hasSubcategories && (
                        <span className={`transition-transform duration-200 text-xs ${isActive ? 'rotate-90 text-[#ea0004]' : 'text-slate-400'}`}>
                          <ChevronRight size={14} />
                        </span>
                      )}
                    </button>

                    {/* Subcategories Accordion Panel */}
                    {isActive && hasSubcategories && (
                      <div className="bg-[#f8fafd]/90 border-t border-b border-slate-100 py-1 space-y-0.5 animate-in fade-in duration-200">
                        {cat.subcategories.map(sub => {
                          const subTitle = sub.name.replace('- ', '');
                          const isSubActive = activeSubFilter === sub.filterKey || activeSubcategoryTitle === subTitle;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveSubFilter(sub.filterKey);
                                setActiveSubcategoryTitle(subTitle);
                                setSelectedProductDetail(null);
                              }}
                              className={`w-full text-left pl-8 pr-4 py-2 text-xs font-body transition-all flex items-center gap-2 cursor-pointer ${
                                isSubActive
                                  ? 'text-[#ea0004] font-bold bg-white border-l-2 border-[#ea0004] shadow-2xs'
                                  : 'text-slate-600 hover:text-[#101f46] hover:bg-white/80 font-medium'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-[#ea0004]' : 'bg-slate-300'}`} />
                              <span>{subTitle}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* ── 2. RIGHT MAIN WORKSPACE CONTENT ── */}
          <div className="flex-1 w-full min-w-0 anim-card-slide-right">

            {/* ── PRODUCT DETAIL VIEW MATCHING USER SCREENSHOT EXACTLY ── */}
            {selectedProductDetail ? (
              <div className="space-y-6 animate-in fade-in duration-300 bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100">
                {/* Top Breadcrumb & Navigation Bar (Clean & Borderless) */}
                <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 flex-wrap">
                    <button
                      onClick={handleBackToCatalog}
                      className="text-slate-500 hover:text-[#ea0004] transition-colors cursor-pointer"
                    >
                      Products
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600">{activeCategoryName}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[#ea0004] font-bold">{selectedProductDetail.model}</span>
                  </div>
                  <button
                    onClick={handleBackToCatalog}
                    className="text-xs font-heading font-medium text-slate-600 hover:text-[#ea0004] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer ml-auto shadow-2xs"
                  >
                    ← Back to Catalog
                  </button>
                </div>

                {/* Center Showcase (Seamless Floating Image & Information) */}
                <div className="py-5 sm:py-6 px-4 flex flex-col items-center justify-center text-center">
                  {/* Product Image (Clean, Transparent Camera Cutout) */}
                  <div className="w-full max-w-xs h-40 sm:h-48 flex items-center justify-center mb-3 bg-transparent">
                    <TransparentCameraImage
                      src={resolveProductImage(selectedProductDetail)}
                      alt={selectedProductDetail.productCode || selectedProductDetail.model}
                      className="max-h-36 sm:max-h-44 max-w-[78%] object-contain drop-shadow-xs hover:scale-105 transition-transform duration-300 bg-transparent"
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    <span className="px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#101f46] text-[11px] font-bold uppercase tracking-wider">
                      {selectedProductDetail.category || 'HD Analog Cameras'}
                    </span>
                  </div>

                  {/* Camera Name */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#101f46] tracking-tight mb-2 text-center max-w-3xl">
                    {resolveProductName(selectedProductDetail)}
                  </h2>

                  {/* Product Code (Shown directly BELOW Camera Name) */}
                  <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">Product Code:</span>
                    <span className="text-sm sm:text-base font-black font-mono text-[#ea0004] tracking-wide">
                      {resolveProductCode(selectedProductDetail)}
                    </span>
                  </div>

                  {/* Action Buttons: Request Quote & Download Datasheet PDF */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
                    <button
                      onClick={() => {
                        if (onOpenQuoteWithDetails) {
                          onOpenQuoteWithDetails(`Quote request for ${resolveProductName(selectedProductDetail)} (Product Code: ${resolveProductCode(selectedProductDetail)})`);
                        }
                      }}
                      className="text-white font-heading text-xs sm:text-sm font-bold px-8 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                      style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                    >
                      <span>Request Quote</span>
                      <span>&gt;</span>
                    </button>

                    {(selectedProductDetail.datasheetPdf || selectedProductDetail.driveLink || selectedProductDetail.pdf) && (
                      <button
                        type="button"
                        onClick={() => downloadProductDatasheet(selectedProductDetail)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-2xs hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
                        title="Download official PDF datasheet"
                      >
                        <Download size={14} className="text-[#ea0004]" />
                        <span>Download Datasheet (PDF)</span>
                      </button>
                    )}
                  </div>

                  {/* Overview Description */}
                  {selectedProductDetail.description && (
                    <div className="max-w-3xl mx-auto my-3 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-center">
                      {selectedProductDetail.description}
                    </div>
                  )}
                </div>

                {/* Key Features Section */}
                {selectedProductDetail.keyFeatures && selectedProductDetail.keyFeatures.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 text-left">
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ea0004]" />
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#101f46]">
                        KEY FEATURES
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProductDetail.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:shadow-xs transition-all">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-[#ea0004] flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} />
                          </span>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">{feat}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Camera Specifications Section */}
                <div className="pt-6 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ea0004]" />
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#101f46]">
                        CAMERA SPECIFICATIONS
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#ea0004] font-mono tracking-wider">
                      PRODUCT CODE: {resolveProductCode(selectedProductDetail)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Optics, Sensor & Video */}
                    <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs font-heading font-bold text-[#101f46] pb-2 mb-2 border-b border-slate-200 flex items-center justify-between">
                        <span>Optics, Sensor & Video</span>
                        <span className="text-[10px] text-slate-400 font-normal">Core Imaging</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Image Sensor</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.sensor || '1/2.8" CMOS'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Resolution / Image Size</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.resolution || '2MP (1920 × 1080)'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Video Output</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.videoOutput || 'AHD / TVI / CVI / CVBS'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Audio</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.audio || '1CH built-in MIC'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Lens & Mount</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.lens || '2.8mm (M12 mount)'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">LED Distance</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.ledDistance || '10 ~ 20 m Supplemental LED'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Frame Rate</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.frameRate || '30fps(60Hz); 25fps(50Hz)'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Min. Illumination</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.minIllumination || '0 lux (LED ON)'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-500 font-medium">S / N Ratio</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.snRatio || '≥52dB (AGC OFF)'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Electrical, Mechanical & Enclosure */}
                    <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs font-heading font-bold text-[#101f46] pb-2 mb-2 border-b border-slate-200 flex items-center justify-between">
                        <span>Electrical, Mechanical & Enclosure</span>
                        <span className="text-[10px] text-slate-400 font-normal">Hardware & Power</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Ingress Protection</span>
                          <span className="font-bold text-[#ea0004] text-right">{selectedProductDetail.specs?.casing || 'IP67 Weatherproof Dust-tight'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Power Supply</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.power || 'DC12V (±15%)'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Power Consumption</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.powerConsumption || 'LED OFF: < 1W; LED ON: < 4W'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Working Environment</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.workingEnvironment || '-30°C ~ 50°C, 10% ~ 90% RH'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Dimensions (mm)</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.dimensions || '162.1 × 74.8 × 73.8 mm'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">Net Weight</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.weight || 'Approx. 0.37 KG'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-500 font-medium">Image System</span>
                          <span className="font-bold text-[#101f46] text-right">{selectedProductDetail.specs?.imageSystem || 'PAL / NTSC (Auto Shutter)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functions of the Camera Section */}
                <div className="pt-6 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ea0004]" />
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#101f46]">
                        FUNCTIONS OF THE CAMERA
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#ea0004] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Advanced Image Enhancement & OSD Controls
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {/* Function item 1 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Function Control</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>{selectedProductDetail.functions?.functionControl || 'OSD (COC Control)'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">COC OSD</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Control over coax allows adjustment through compatible DVR menus</p>
                    </div>

                    {/* Function item 2 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Smart LED Mode</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>{selectedProductDetail.functions?.smartLed || 'Manual or Auto mode'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">24/7 Color</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Automatic illumination matching lighting conditions or manual intensity</p>
                    </div>

                    {/* Function item 3 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Digital WDR</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>{selectedProductDetail.functions?.digitalWdr || 'Digital WDR Supported'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">WDR Active</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Balances bright background lighting with shadowed foreground subjects</p>
                    </div>

                    {/* Function item 4 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Noise Reduction (DNR)</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>{selectedProductDetail.functions?.digitalDnr || 'Yes, 2D DNR'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">2D DNR</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Suppresses grain and artifacts for crystal-clear night video footage</p>
                    </div>

                    {/* Function item 5 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Light Compensation (BLC & HLC)</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>BLC & HLC Enabled</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#ea0004] text-[10px] font-bold">HLC / BLC</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Suppresses vehicle headlight glare and boosts dark foreground areas</p>
                    </div>

                    {/* Function item 6 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Angle Adjustment</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span className="truncate">{selectedProductDetail.functions?.angleAdjustment || 'Pan: 0°~360°; Tilt: 0°~80°'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">3-Axis</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Full 3-axis rotation for accurate field of view positioning</p>
                    </div>

                    {/* Function item 7 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Automatic Gain Control (AGC)</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>{selectedProductDetail.functions?.agc || 'Auto Gain Control'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">AGC Auto</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Dynamically amplifies signal for consistent low-light image clarity</p>
                    </div>

                    {/* Function item 8 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Auto White Balance & Defect Correction</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>Auto White Balance (AWB)</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">Auto</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Corrects natural color temperature and eliminates bad pixel spots</p>
                    </div>

                    {/* Function item 9 */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 shadow-2xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Image Settings & OSD Menu</div>
                      <div className="text-xs font-black text-[#101f46] flex items-center justify-between">
                        <span>Sharpness & Contrast Fine-Tuning</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">OSD Setting</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Adjustable sharpness, contrast, image saturation, and English OSD</p>
                    </div>
                  </div>
                </div>

                {/* Technical Datasheet & Documentation Section */}
                <div className="pt-6 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ea0004]" />
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#101f46]">
                        TECHNICAL DATASHEET &amp; DOCUMENTATION
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      PDF SPECIFICATIONS
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-slate-50 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#ea0004] flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-[#101f46]">
                          {resolveProductName(selectedProductDetail)}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hardware Product Code: <strong className="text-[#ea0004] font-mono">{resolveProductCode(selectedProductDetail)}</strong> • Complete engineering specs, dimensions, and wiring schematics.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadProductDatasheet(selectedProductDetail)}
                      className="text-white font-heading text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
                      style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                    >
                      <Download size={14} />
                      <span>Download Datasheet (PDF)</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* ── STANDARD PRODUCTS GRID VIEW (CLEAN WHITE CARDS ON HERO BACKGROUND) ── */
              <>
                {/* Results counter info bar */}
                <div className="flex items-center justify-between pb-3 mb-6 text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#101f46] text-base">{activeCategoryName}</span>
                    {activeSubcategoryTitle && activeSubcategoryTitle !== activeCategoryName && (
                      <>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#ea0004] font-semibold">{activeSubcategoryTitle}</span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-500 font-medium">
                    Showing <strong className="text-[#101f46] font-bold">{displayedProducts.length}</strong> equipment models
                  </span>
                </div>

                {/* Product Cards Grid (Clean white cards with soft drop-shadow) */}
                {displayedProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center my-6 shadow-md border border-slate-100">
                    <p className="font-heading text-sm font-bold text-slate-700 mb-1">No products match the selected filter.</p>
                    <p className="text-xs text-slate-500 mb-4 font-body">Try resetting filters to view the complete catalog.</p>
                    <button
                      onClick={() => {
                        setActiveCategoryName('All');
                        setActiveSubFilter('all');
                        setActiveSubcategoryTitle('All Products');
                        setActivePillFilter('All');
                        setSearchQuery('');
                      }}
                      className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] text-white text-xs font-heading font-bold px-6 py-2.5 rounded-full hover:shadow-md transition-all cursor-pointer"
                    >
                      Show All {allAvailableProducts.length} Products
                    </button>
                  </div>
                ) : (
                  <div className="product-cards-grid">
                    {displayedProducts.map(product => (
                      <div
                        key={product.id}
                        className="product-card-item bg-white rounded-2xl p-3.5 sm:p-4 text-center shadow-md hover:shadow-2xl border border-slate-100/90 hover:border-rose-200 transition-all duration-300 group relative cursor-pointer"
                        onClick={() => handleOpenDetailView(product)}
                      >
                        {/* Camera Product Image (Transparent Cutout, Scaled Proportionally) */}
                        <div 
                          className="w-full flex-1 min-h-0 flex items-center justify-center mb-2 p-2 relative group/img overflow-hidden bg-transparent"
                        >
                          <TransparentCameraImage
                            src={resolveProductImage(product)}
                            alt={product.productCode || product.model}
                            className="max-h-[76%] max-w-[76%] object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs bg-transparent"
                          />

                          {/* Quick View Eye Button - Visible on mobile/tablet/touch in top-right corner, centered hover reveal on desktop */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailView(product);
                            }}
                            title="Quick View"
                            aria-label={`View details for ${product.productCode || product.model}`}
                            className="absolute z-10 w-8 h-8 rounded-full bg-white/95 text-[#162653] hover:text-[#ea0004] hover:bg-white shadow-md border border-slate-200/70 flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-auto
                              top-1.5 right-1.5 opacity-100 scale-100
                              lg:top-1/2 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:opacity-0 lg:scale-75 lg:group-hover:opacity-100 lg:group-hover:scale-100
                              [@media(hover:none)]:top-1.5 [@media(hover:none)]:right-1.5 [@media(hover:none)]:left-auto [@media(hover:none)]:translate-x-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100"
                          >
                            <Eye size={15} className="transition-colors" />
                          </button>
                        </div>

                        {/* Camera Name */}
                        <h3 
                          className="font-heading text-xs sm:text-sm font-bold text-[#162653] tracking-tight mb-1 group-hover:text-[#ea0004] transition-colors truncate w-full shrink-0"
                          title={resolveProductName(product)}
                        >
                          {resolveProductName(product)}
                        </h3>

                        {/* Product Code (Shown directly BELOW the camera name) */}
                        <div className="w-full shrink-0 mb-2.5 bg-slate-50/90 py-1 px-2 rounded-lg border border-slate-200/80 flex flex-wrap items-center justify-center gap-1 text-center">
                          <span className="text-[9.5px] uppercase font-bold text-slate-500 font-sans tracking-wide">Product Code:</span>
                          <span className="text-[11px] font-mono font-black text-[#ea0004] tracking-tight">{resolveProductCode(product)}</span>
                        </div>

                        {/* Action Buttons: View Details & 1-Click Datasheet Download */}
                        <div className="flex items-center gap-1.5 w-full shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailView(product);
                            }}
                            className="flex-1 text-white font-heading text-[11px] sm:text-xs font-semibold px-3 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md hover:opacity-95 transition-all duration-150 cursor-pointer"
                            style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                          >
                            View Details
                          </button>
                          {(product.datasheetPdf || product.driveLink || product.pdf) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadProductDatasheet(product);
                              }}
                              title={`Download ${resolveProductCode(product)} Datasheet (PDF)`}
                              aria-label={`Download ${resolveProductCode(product)} Datasheet`}
                              className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-[#ea0004] border border-rose-200 flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer"
                            >
                              <FileText size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
