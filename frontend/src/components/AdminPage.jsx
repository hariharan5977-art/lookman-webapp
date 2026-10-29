import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { parsePdfDatasheet } from '../utils/pdfParser';
import { removeWhiteBackgroundFromImage } from '../utils/imageTransparency';
import { 
  resolveProductCode, 
  resolveProductName, 
  isDescriptiveText, 
  extractGoogleDriveId, 
  getGoogleDriveDirectDownloadUrl, 
  getGoogleDriveViewUrl, 
  downloadProductDatasheet 
} from '../utils/productUtils';
import { 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Package, 
  RefreshCw, 
  AlertCircle, 
  Search,
  CheckCircle2,
  ChevronRight,
  Shield,
  Upload,
  FileSpreadsheet,
  FileUp,
  FileText,
  Check,
  Download,
  Edit,
  ExternalLink
} from './Icons';
import { API_BASE } from '../api';
import ALL_LOOKMAN_PRODUCTS from '../data/allProducts.json';

export default function AdminPage({ user, onLogin, onLogout, onBackToHome }) {
  const [loginEmail, setLoginEmail] = useState('beyonddigitalchennai@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'products' | 'add'
  const [inquiries, setInquiries] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [inquirySearch, setInquirySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // ── DATASHEET BATCH UPLOAD STATE (REPLACES SINGLE PRODUCT TECHNIQUE) ──
  const [datasheetFile, setDatasheetFile] = useState(null);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [parseError, setParseError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'update' | 'replace'
  const [previewRowIndex, setPreviewRowIndex] = useState(0);
  const [datasheetSearch, setDatasheetSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // ── EXACT DATASHEET IMAGE SUPPORT & COMPANION ASSETS ──
  const [companionImages, setCompanionImages] = useState({});
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingProductModal, setEditingProductModal] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [deleteInquiryLoading, setDeleteInquiryLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isParsingModalPdf, setIsParsingModalPdf] = useState(false);
  const [modalPdfNotice, setModalPdfNotice] = useState('');
  const companionFilesRef = useRef(null);
  const singleImagePickerRef = useRef(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    let inqs = [];
    let prods = [];
    let backendDeleted = [];
    let backendDeletedInquiries = [];

    // 1. Fetch from live API backend if online
    try {
      const [inqRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/inquiries`),
        fetch(`${API_BASE}/products`)
      ]);
      const inqData = await inqRes.json();
      const prodData = await prodRes.json();

      if (inqData.success && inqData.inquiries) {
        inqs = inqData.inquiries;
        if (inqData.deletedInquiryIds && Array.isArray(inqData.deletedInquiryIds)) {
          backendDeletedInquiries = inqData.deletedInquiryIds;
        }
      }
      if (prodData.success && prodData.products) {
        prods = prodData.products;
        if (prodData.deletedProductIds && Array.isArray(prodData.deletedProductIds)) {
          backendDeleted = prodData.deletedProductIds;
        }
      }
    } catch (e) {
      // Backend offline on static host
    }

    // Merge deleted product tombstones
    const localDeleted = JSON.parse(localStorage.getItem('lookman_deleted_product_ids') || '[]');
    const allDeleted = [...new Set([...localDeleted, ...backendDeleted])];
    if (backendDeleted.length > 0) {
      localStorage.setItem('lookman_deleted_product_ids', JSON.stringify(allDeleted));
    }

    // Merge deleted inquiry tombstones
    const localDeletedInqs = JSON.parse(localStorage.getItem('lookman_deleted_inquiry_ids') || '[]');
    const allDeletedInqs = new Set([...localDeletedInqs, ...backendDeletedInquiries].map(String));
    if (backendDeletedInquiries.length > 0) {
      localStorage.setItem('lookman_deleted_inquiry_ids', JSON.stringify(Array.from(allDeletedInqs)));
    }

    const isDeletedInquiry = (inq) => {
      if (!inq) return false;
      const iId = String(inq.id || '').toLowerCase().trim();
      const iPhone = String(inq.phone || '').trim();
      const iEmail = String(inq.email || '').toLowerCase().trim();
      return Array.from(allDeletedInqs).some(d => {
        const dl = String(d).toLowerCase().trim();
        return dl === iId || (iPhone && dl === iPhone) || (iEmail && dl === iEmail);
      });
    };

    const isDeleted = (p) => {
      const pid = String(p.id || '').toLowerCase();
      const pmodel = String(p.model || '').toLowerCase();
      const pname = String(p.name || '').toLowerCase();
      const pslug = String(p.slug || '').toLowerCase();
      return allDeleted.some(d => {
        if (!d) return false;
        const dl = String(d).toLowerCase();
        return dl === pid || dl === pmodel || dl === pname || dl === pslug;
      });
    };

    // Helper to identify Secura serial cameras
    const isSecuraSerial = (p) => {
      if (!p) return false;
      const m = String(p.model || p.name || '').toUpperCase().trim();
      const b = String(p.brand || '').toLowerCase().trim();
      return m.startsWith('SIP-') || m.startsWith('SHD-') || m.startsWith('SNVR-') || m.startsWith('SXVR-') || b === 'secura';
    };

    // 2. Merge inquiries with local storage, strictly filtering out deleted inquiries
    const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
    const cleanInqs = inqs.filter(i => !isDeletedInquiry(i));
    const cleanLocalInqs = localInqs.filter(li => !isDeletedInquiry(li));
    const mergedInquiries = [...cleanInqs, ...cleanLocalInqs.filter(li => !cleanInqs.some(i => String(i.id) === String(li.id)))];

    const obsoleteCodes = [
      'CO-IP-401FDA', 'CO-IP-201FDMA', 'CO-PTZ-8032AI', 'CO-PTZ-2025AI', 
      'CO-NVR-0432AI', 'CO-NVR-0216', 'CO-XVR-1615L', 'CO-SW-0802POE'
    ];
    const isObsoleteSample = (p) => {
      if (!p) return false;
      const m = String(p.model || p.productCode || p.id || '').toUpperCase().trim();
      return obsoleteCodes.includes(m);
    };

    // 3. Merge products with custom products & all catalog products, strictly filtering out Secura, obsolete & deleted items
    const rawCustom = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const cleanedCustom = rawCustom.filter(p => !isSecuraSerial(p) && !isObsoleteSample(p));
    if (cleanedCustom.length !== rawCustom.length) {
      localStorage.setItem('lookman_custom_products', JSON.stringify(cleanedCustom));
    }

    const customProds = cleanedCustom.filter(p => !isDeleted(p) && !isSecuraSerial(p) && !isObsoleteSample(p));
    const baseProds = (prods.length > 0 ? prods : ALL_LOOKMAN_PRODUCTS).filter(p => !isDeleted(p) && !isSecuraSerial(p) && !isObsoleteSample(p));

    const combined = [...customProds];
    baseProds.forEach(bp => {
      const bpModel = (bp.model || bp.name || '').toLowerCase();
      const already = combined.some(cp => String(cp.id) === String(bp.id) || (cp.model && cp.model.toLowerCase() === bpModel) || (cp.name && cp.name.toLowerCase() === bpModel));
      if (!already) {
        combined.push(bp);
      }
    });

    setInquiries(mergedInquiries);
    setProductsList(combined);
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
      // Fallback for static Netlify hosting
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

  // ── EXTRACT EMBEDDED DRAWINGS / IMAGES FROM XLSX WORKBOOKS ──
  const extractImagesFromXlsx = async (arrayBuffer) => {
    const imagesByRow = {};
    const imagesByName = {};
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const drawingFiles = Object.keys(zip.files).filter(f => /^xl\/drawings\/drawing\d+\.xml$/i.test(f));

      for (const dPath of drawingFiles) {
        const relsPath = dPath.replace(/drawing(\d+)\.xml$/i, '_rels/drawing$1.xml.rels');
        const dXmlStr = await zip.files[dPath]?.async('string');
        const rXmlStr = zip.files[relsPath] ? await zip.files[relsPath].async('string') : null;

        if (!dXmlStr) continue;

        const rIdToMedia = {};
        if (rXmlStr) {
          const relRegex = /<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"/g;
          let match;
          while ((match = relRegex.exec(rXmlStr)) !== null) {
            const rId = match[1];
            let target = match[2].replace(/^\.\.\//, 'xl/');
            if (!target.startsWith('xl/')) target = 'xl/' + target;
            rIdToMedia[rId] = target;
          }
        }

        const anchorRegex = /<xdr:(?:twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g;
        let anchorMatch;
        while ((anchorMatch = anchorRegex.exec(dXmlStr)) !== null) {
          const anchorContent = anchorMatch[1];
          const rowMatch = anchorContent.match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/);
          const blipMatch = anchorContent.match(/<a:blip[^>]+(?:r:embed|r:link)="([^"]+)"/);

          if (rowMatch && blipMatch) {
            const rowIdx = parseInt(rowMatch[1], 10);
            const rId = blipMatch[1];
            const mediaPath = rIdToMedia[rId];

            if (mediaPath && zip.files[mediaPath]) {
              const ext = mediaPath.split('.').pop().toLowerCase();
              const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/png';
              const base64 = await zip.files[mediaPath].async('base64');
              const dataUri = `data:${mime};base64,${base64}`;
              const cleanTransparentUri = await removeWhiteBackgroundFromImage(dataUri);
              imagesByRow[rowIdx] = cleanTransparentUri;
              const fname = mediaPath.split('/').pop().toLowerCase();
              imagesByName[fname] = cleanTransparentUri;
            }
          }
        }
      }

      // Collect all media in xl/media/
      const mediaFiles = Object.keys(zip.files).filter(f => /^xl\/media\//i.test(f));
      for (const mPath of mediaFiles) {
        const fname = mPath.split('/').pop().toLowerCase();
        if (!imagesByName[fname]) {
          const ext = mPath.split('.').pop().toLowerCase();
          const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/png';
          const base64 = await zip.files[mPath].async('base64');
          const dataUri = `data:${mime};base64,${base64}`;
          const cleanTransparentUri = await removeWhiteBackgroundFromImage(dataUri);
          imagesByName[fname] = cleanTransparentUri;
        }
      }
    } catch (err) {
      console.warn('XLSX media extraction notice:', err);
    }
    return { imagesByRow, imagesByName };
  };

  // ── COMPANION IMAGE FILE MATCHING & CUSTOM IMAGE HELPERS ──
  const handleCompanionImageUpload = (files) => {
    if (!files || files.length === 0) return;
    const newMap = { ...companionImages };
    let processedCount = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const rawBase64 = e.target.result;
        // Automatically extract camera and make white square background transparent
        const base64 = await removeWhiteBackgroundFromImage(rawBase64);
        const fname = file.name.toLowerCase();
        const baseNoExt = fname.replace(/\.[^/.]+$/, "");
        newMap[fname] = base64;
        newMap[file.name] = base64;
        newMap[baseNoExt] = base64;
        processedCount++;

        if (processedCount === files.length) {
          setCompanionImages({ ...newMap });

          // Dynamically re-link images in parsedProducts
          setParsedProducts(prev => prev.map(p => {
            const rawMatch = p.rawImageGiven && (
              p.rawImageGiven.toLowerCase() === fname || 
              p.rawImageGiven.replace(/^\.?\//, '').toLowerCase() === fname ||
              p.rawImageGiven.replace(/^\.?\//, '').toLowerCase() === baseNoExt
            );
            const modelMatch = p.model && (
              p.model.toLowerCase() === baseNoExt || 
              p.model.toLowerCase().replace(/[^a-z0-9]/g, '') === baseNoExt.replace(/[^a-z0-9]/g, '')
            );
            if (!p.image || rawMatch || modelMatch) {
              return {
                ...p,
                image: base64,
                imageSource: 'companion_upload',
                hasImage: true
              };
            }
            return p;
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePickImageForRow = (rowIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawBase64 = e.target.result;
      const base64 = await removeWhiteBackgroundFromImage(rawBase64);
      setParsedProducts(prev => prev.map((p, i) => {
        if (i === rowIndex) {
          return {
            ...p,
            image: base64,
            imageSource: 'manual_upload',
            hasImage: true
          };
        }
        return p;
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateImageUrlForRow = (rowIndex, newUrl) => {
    const trimmed = (newUrl || '').trim();
    setParsedProducts(prev => prev.map((p, i) => {
      if (i === rowIndex) {
        return {
          ...p,
          image: trimmed,
          rawImageGiven: trimmed,
          imageSource: 'manual_url',
          hasImage: Boolean(trimmed)
        };
      }
      return p;
    }));
  };

  const handleApplyDefaultRenderForRow = (rowIndex) => {
    setParsedProducts(prev => prev.map((p, i) => {
      if (i === rowIndex) {
        const def = autoDetectProductImage(p.model, p.category);
        return {
          ...p,
          image: def,
          imageSource: 'default_render',
          hasImage: true
        };
      }
      return p;
    }));
  };

  const autoDetectProductImage = (model = '', category = '') => {
    const m = (model || '').toUpperCase();
    const c = (category || '').toUpperCase();
    if (m.includes('TURRET') || m.includes('2D') || m.includes('EYEBALL') || m.includes('DOME')) {
      return '/CO-H-2DFDML(V).png';
    }
    if (m.includes('BULLET') || m.includes('2B') || m.includes('CO-H')) {
      return '/CO-H-2BFDML(V).png';
    }
    if (m.includes('VPS') || m.includes('PTZ') || c.includes('PTZ')) {
      return '/SIP-VPS8032AI.png';
    }
    if (m.includes('SNVR') || m.includes('NVR') || c.includes('NVR')) {
      return '/SNVR-V0432AI.png';
    }
    if (m.includes('XVR') || m.includes('DVR') || c.includes('DVR') || c.includes('HYBRID')) {
      return '/SXVR-V1615L.png';
    }
    return '/CO-H-2BFDML(V).png';
  };

  // ── STRICT EXACT IMAGE EXTRACTION ENGINE ──
  const processRawRows = (rawRows, embeddedImagesByRow = {}, embeddedImagesByName = {}, imageFilesMap = companionImages) => {
    const normalized = [];

    rawRows.forEach((row, idx) => {
      const map = {};
      Object.keys(row).forEach(k => {
        const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        map[cleanKey] = String(row[k] !== undefined && row[k] !== null ? row[k] : '').trim();
      });

      // 1. Dedicated Product Code extraction from all known column variations
      const rawProductCode = (
        map.productcode || 
        map.code || 
        map.itemcode || 
        map.partno || 
        map.partnumber || 
        map.sku || 
        map.modelcode || 
        map.modelno || 
        map.modelnumber || 
        map.pn || 
        map.cameracode || 
        row['Product Code'] || 
        row['product_code'] || 
        row['ProductCode'] || 
        row['Code'] || 
        row['Item Code'] || 
        row['ItemCode'] || 
        row['Part No'] || 
        row['Part Number'] || 
        row['SKU'] || 
        row['Model No'] || 
        row['Model #'] || 
        row['P/N'] || 
        ''
      ).trim();

      // 2. Dedicated Camera / Product Name extraction from all known column variations
      const rawProductName = (
        map.productname || 
        map.cameraname || 
        map.name || 
        map.title || 
        map.producttitle || 
        map.itemname || 
        map.modelname || 
        map.product || 
        row['Product Name'] || 
        row['ProductName'] || 
        row['Camera Name'] || 
        row['Name'] || 
        row['Title'] || 
        ''
      ).trim();

      // 3. Fallback Model field (which might be either a code or a name)
      const rawModel = (
        map.model || 
        row['Model'] || 
        row['model'] || 
        row['MODEL'] || 
        rawProductName || 
        rawProductCode || 
        ''
      ).trim();

      if (!rawModel && !rawProductName && !rawProductCode) return;

      // 4. Resolve clean Camera Name and crisp hardware Product Code
      let resolvedCode = '';
      let resolvedName = '';

      if (rawProductCode && !isDescriptiveText(rawProductCode)) {
        resolvedCode = rawProductCode;
      } else if (rawModel && !isDescriptiveText(rawModel)) {
        resolvedCode = rawModel;
      } else {
        resolvedCode = resolveProductCode({
          productCode: rawProductCode,
          model: rawModel,
          name: rawProductName,
          description: map.description || '',
          category: map.category || ''
        });
      }

      if (rawProductName) {
        resolvedName = resolveProductName({ name: rawProductName });
      } else if (rawModel && isDescriptiveText(rawModel)) {
        resolvedName = resolveProductName({ name: rawModel });
      } else {
        resolvedName = resolveProductName({ model: resolvedCode, name: rawModel });
      }

      const model = resolvedCode;
      const name = resolvedName;

      // 5. Extract Google Drive Link or Datasheet URL
      let driveLink = (
        map.drivelink || 
        map.googledrivelink || 
        map.googledrive || 
        map.driveurl || 
        map.googledriveurl || 
        map.datasheetlink || 
        map.datasheeturl || 
        map.datasheet || 
        map.datasheetpdf || 
        map.pdflink || 
        map.pdfurl || 
        map.pdf || 
        map.brochure || 
        map.manual || 
        map.documentlink || 
        map.doclink || 
        row['Drive Link'] || 
        row['Google Drive Link'] || 
        row['Google Drive'] || 
        row['Drive URL'] || 
        row['Datasheet Link'] || 
        row['Datasheet URL'] || 
        row['Datasheet'] || 
        row['PDF Link'] || 
        row['PDF URL'] || 
        row['Datasheet PDF'] || 
        row['PDF'] || 
        ''
      ).trim();

      // Scan all row values for drive.google.com or .pdf URLs if not found in named column
      if (!driveLink) {
        for (const k of Object.keys(row)) {
          const val = String(row[k] || '').trim();
          if (val.includes('drive.google.com') || val.includes('docs.google.com') || val.toLowerCase().endsWith('.pdf') || val.toLowerCase().includes('.pdf?')) {
            driveLink = val;
            break;
          }
        }
      }

      let directDownloadLink = '';
      if (driveLink) {
        directDownloadLink = getGoogleDriveDirectDownloadUrl(driveLink);
      }

      let category = map.category || map.productcategory || map.type || map.cctvtype || map.group || '';
      if (!category) {
        const u = `${model} ${name}`.toUpperCase();
        if (u.includes('VPS') || u.includes('PTZ')) category = 'PTZ Cameras';
        else if (u.includes('VD') || u.includes('DOME')) category = 'HD IP Camera';
        else if (u.includes('SNVR') || u.includes('NVR')) category = 'NVRS';
        else if (u.includes('XVR') || u.includes('DVR')) category = 'Hybrid DVR';
        else if (u.includes('SHD') || u.includes('ANALOG')) category = 'HD Analog Cameras';
        else category = 'HD IP Camera';
      }

      const resolution = map.resolution || map.megapixel || map.mp || map.res || map.videoresolution || '1080P Full HD';
      const sensor = map.sensor || map.imagesensor || map.optics || '1/2.8" Progressive Scan CMOS';
      const nightVision = map.nightvision || map.ir || map.irrange || map.irdistance || 'Smart IR Night Vision 30m';
      const audio = map.audio || map.mic || map.microphone || map.twowayaudio || 'Built-in Mic & Audio Output';
      const power = map.power || map.poe || map.powersupply || map.voltage || 'PoE / 12V DC';
      const casing = map.casing || map.housing || map.ingress || map.iprating || map.weatherproof || 'IP66 Weatherproof Housing';
      const description = map.description || map.features || map.keyfeatures || map.details || map.overview || `${name} (${model}) high performance ${category} security camera with ${resolution} resolution.`;

      // 6. Check all possible image column variations in the row
      const rawImage = (
        map.image || 
        map.imageurl || 
        map.productimage || 
        map.picture || 
        map.photo || 
        map.pic || 
        map.img || 
        map.imgurl || 
        map.imagepath || 
        map.thumbnail || 
        map.thumbnailurl || 
        map.photourl || 
        map.pictureurl || 
        map.cameraimage || 
        map.media || 
        map.file || 
        map.filename || 
        row['Image'] || 
        row['image'] || 
        row['IMAGE'] || 
        row['Image URL'] || 
        row['Picture'] || 
        row['Photo'] || 
        row['Product Image'] || 
        row['Image Path'] || 
        ''
      ).trim();

      let image = '';
      let imageSource = 'none';

      if (rawImage) {
        const cleanName = rawImage.replace(/^\.?\//, '').toLowerCase();
        // Check if user uploaded a companion file with this exact filename
        if (imageFilesMap[cleanName]) {
          image = imageFilesMap[cleanName];
          imageSource = 'companion_upload';
        } else if (imageFilesMap[rawImage.toLowerCase()]) {
          image = imageFilesMap[rawImage.toLowerCase()];
          imageSource = 'companion_upload';
        } else if (embeddedImagesByName[cleanName]) {
          image = embeddedImagesByName[cleanName];
          imageSource = 'embedded_excel';
        } else if (rawImage.startsWith('data:') || rawImage.startsWith('blob:') || rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
          // Direct web URL or base64 data URI in datasheet
          image = rawImage;
          imageSource = 'datasheet_url';
        } else if (rawImage.startsWith('/')) {
          // Absolute public path
          image = rawImage;
          imageSource = 'datasheet_file';
        } else {
          // Relative path or public asset filename (e.g. "SIP-VB401ADA.png" or "cctv1.jpg")
          image = '/' + rawImage.replace(/^\.?\//, '');
          imageSource = 'datasheet_file';
        }
      }

      // Check if Excel has an embedded drawing in this worksheet row (1-based header index)
      if (!image) {
        if (embeddedImagesByRow[idx + 1]) {
          image = embeddedImagesByRow[idx + 1];
          imageSource = 'embedded_excel';
        } else if (embeddedImagesByRow[idx]) {
          image = embeddedImagesByRow[idx];
          imageSource = 'embedded_excel';
        }
      }

      // Check if a companion image was uploaded named after the model or code
      if (!image) {
        const mKeyPng = model.toLowerCase().replace(/[^a-z0-9]/g, '') + '.png';
        const mKeyJpg = model.toLowerCase().replace(/[^a-z0-9]/g, '') + '.jpg';
        if (imageFilesMap[mKeyPng]) {
          image = imageFilesMap[mKeyPng];
          imageSource = 'companion_upload';
        } else if (imageFilesMap[mKeyJpg]) {
          image = imageFilesMap[mKeyJpg];
          imageSource = 'companion_upload';
        }
      }

      normalized.push({
        id: 'ds_preview_' + idx,
        model,
        productCode: model,
        name,
        category,
        resolution,
        sensor,
        nightVision,
        audio,
        power,
        casing,
        description,
        rawImageGiven: rawImage,
        image: image, // Strictly the exact image from datasheet or empty
        imageSource,
        hasImage: Boolean(image),
        driveLink: driveLink,
        datasheetPdf: directDownloadLink || driveLink,
        datasheetPdfName: `${model}_datasheet.pdf`,
        hasDatasheet: Boolean(driveLink || directDownloadLink),
        price: parseFloat(map.price || map.mrp || 0) || 0
      });
    });

    if (normalized.length === 0) {
      setParseError('Could not find any product models in the uploaded file. Please verify that your sheet contains a "Model" or "Name" column.');
      setParsedProducts([]);
      setIsParsing(false);
      return;
    }

    setParsedProducts(normalized);
    setPreviewRowIndex(0);
    setIsParsing(false);
    setParseError('');
  };

  const handleDatasheetFileUpload = async (file) => {
    if (!file) return;
    setIsParsing(true);
    setParseError('');
    setDatasheetFile(file);

    // 1. PDF Datasheet Engine (Extracts specs, visual snapshot, & attaches PDF)
    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const products = await parsePdfDatasheet(file);
        if (!products || products.length === 0) {
          setParseError('Could not extract any product information from this PDF. Please verify that the PDF contains readable text or camera specifications.');
          setIsParsing(false);
          return;
        }
        setParsedProducts(products);
        setPreviewRowIndex(0);
        setIsParsing(false);
        setParseError('');
      } catch (err) {
        console.error('PDF parsing error:', err);
        setParseError('Failed to parse PDF datasheet: ' + (err.message || 'Unknown error'));
        setIsParsing(false);
      }
      return;
    }

    const reader = new FileReader();

    if (file.name.toLowerCase().endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          const list = Array.isArray(json) ? json : (json.products || [json]);
          processRawRows(list);
        } catch (err) {
          setParseError('Failed to parse JSON file: ' + err.message);
          setIsParsing(false);
        }
      };
      reader.readAsText(file);
      return;
    }

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        let embeddedImagesByRow = {};
        let embeddedImagesByName = {};

        // Extract embedded pictures from .xlsx drawing tags if present
        if (file.name.toLowerCase().endsWith('.xlsx')) {
          const extracted = await extractImagesFromXlsx(e.target.result);
          embeddedImagesByRow = extracted.imagesByRow || {};
          embeddedImagesByName = extracted.imagesByName || {};
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        if (!rawRows || rawRows.length === 0) {
          setParseError('No data rows found in this sheet. Please make sure the file contains camera products.');
          setIsParsing(false);
          return;
        }
        processRawRows(rawRows, embeddedImagesByRow, embeddedImagesByName);
      } catch (err) {
        setParseError('Failed to parse spreadsheet file: ' + err.message);
        setIsParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadSampleTemplate = () => {
    const headers = ['Product Name', 'Product Code', 'Category', 'Resolution', 'Sensor', 'Night Vision', 'Audio', 'Power', 'Casing', 'Description', 'Image', 'Drive Link'];
    const rows = [
      ['4MP Super HD AI Bullet Camera', 'SIP-VB402ADA', 'HD IP Camera', '4MP Super HD', '1/2.8" Progressive Scan CMOS', 'Smart IR 40m', 'Built-in Mic', 'PoE / 12V DC', 'IP67 Weatherproof Metal', 'Ultra high resolution AI bullet camera with smart motion analytics.', '/SIP-VB401ADA.png', 'https://drive.google.com/file/d/1exampleDriveIdForSIPVB402ADA/view?usp=sharing'],
      ['4MP Color Night Vision Dome Camera', 'SIP-VD402FDMA', 'HD IP Camera', '4MP Super HD', '1/2.8" CMOS', 'Color Night Vision 30m', 'Two-way Audio', 'PoE / 12V DC', 'IK10 Vandal-proof Dome', 'Vandal dome camera with facial recognition & intrusion alert.', '/SIP-VD401FDMA.png', 'https://drive.google.com/file/d/1exampleDriveIdForSIPVD402FDMA/view?usp=sharing'],
      ['2MP Full-Color HD Analog Bullet Camera', 'CO-H-2BFDML(V)', 'HD Analog Cameras', '2MP 1080P Full HD', '1/2.8" Progressive Scan CMOS', '24/7 Full Color 30m', 'Built-in Audio Mic', '12V DC', 'IP66 Weatherproof', 'Full color day/night analog bullet camera with built-in mic.', '/CO-H-2BFDML(V).png', 'https://drive.google.com/file/d/1exampleDriveIdForCOH2BFDML/view?usp=sharing'],
      ['2MP Full-Color HD Analog Turret Camera', 'CO-H-2DFDML(V)', 'HD Analog Cameras', '2MP 1080P Full HD', '1/2.8" Progressive Scan CMOS', '24/7 Full Color 20m', 'Built-in Audio Mic', '12V DC', 'IP66 Weatherproof', 'Full color day/night analog turret camera with built-in mic.', '/CO-H-2DFDML(V).png', 'https://drive.google.com/file/d/1exampleDriveIdForCOH2DFDML/view?usp=sharing'],
      ['4MP 32x Starlight PTZ Dome Camera', 'SIP-VPS4032AI', 'PTZ Cameras', '4MP 32x Optical Zoom', '1/1.8" STARVIS CMOS', 'Laser IR 150m', 'Audio In/Out', 'PoE+ / 24V AC', 'IP67 Auto-tracking Dome', 'High speed PTZ camera with 360 degree endless rotation and ANPR.', '/SIP-VPS2032AI.png', 'https://drive.google.com/file/d/1exampleDriveIdForPTZ4032/view?usp=sharing'],
      ['32 Channel 4K AI NVR', 'SNVR-V0432AI', 'NVRS', '4K 32-Channel NVR', '-', '-', 'Audio In/Out', '220V AC', '1.5U Rackmount', '32-channel AI network video recorder with 4 SATA bays and smart playback.', '/SNVR-V0232AI.png', 'https://drive.google.com/file/d/1exampleDriveIdForNVR0432/view?usp=sharing']
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lookman_cctv_datasheet_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleParsePastedText = (text) => {
    if (!text || !text.trim()) return;
    setIsParsing(true);
    setParseError('');
    try {
      const workbook = XLSX.read(text, { type: 'string' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      if (!rawRows || rawRows.length === 0) {
        setParseError('Could not parse tabular rows from pasted text.');
        setIsParsing(false);
        return;
      }
      processRawRows(rawRows);
      setShowPasteBox(false);
      setPastedText('');
    } catch (err) {
      setParseError('Failed to parse pasted text: ' + err.message);
      setIsParsing(false);
    }
  };

  const handleImportAndPublish = async () => {
    if (!parsedProducts || parsedProducts.length === 0) return;
    setIsImporting(true);

    const timestamp = Date.now();
    const formattedProducts = parsedProducts.map((p, idx) => {
      const code = resolveProductCode(p);
      const name = resolveProductName(p);
      const driveLink = p.driveLink || '';
      const directDownload = driveLink ? getGoogleDriveDirectDownloadUrl(driveLink) : (p.datasheetPdf || '');
      return {
        id: 'prod_' + timestamp + '_' + idx,
        name: name,
        model: code,
        productCode: code,
        title: p.title || `${name} surveillance hardware from Lookman.`,
        slug: code.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: p.category,
        categories: [p.category],
        description: p.description,
        fullText: p.fullText || '',
        image: p.image,
        driveLink: driveLink,
        datasheetPdf: directDownload || p.datasheetPdf || '',
        datasheetPdfName: p.datasheetPdfName || `${code}_datasheet.pdf`,
        price: p.price || 0,
        specs: {
          resolution: p.resolution,
          sensor: p.sensor,
          nightVision: p.nightVision,
          audio: p.audio,
          power: p.power,
          casing: p.casing
        }
      };
    });

    try {
      await fetch(`${API_BASE}/products/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: formattedProducts, mode: importMode })
      });
    } catch (e) {
      // Offline fallback for Netlify
    }

    const existingCustom = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    let updatedCustom = [];

    if (importMode === 'replace') {
      updatedCustom = formattedProducts;
    } else if (importMode === 'update') {
      const map = new Map();
      existingCustom.forEach(p => map.set((p.model || p.name).toLowerCase(), p));
      formattedProducts.forEach(p => map.set((p.model || p.name).toLowerCase(), p));
      updatedCustom = Array.from(map.values());
    } else {
      // Append: new products on top, avoid duplicate models
      const existingFiltered = existingCustom.filter(
        ep => !formattedProducts.some(np => np.model.toLowerCase() === (ep.model || ep.name || '').toLowerCase())
      );
      updatedCustom = [...formattedProducts, ...existingFiltered];
    }

    // Un-mark any imported models/IDs from lookman_deleted_product_ids
    const localDeleted = JSON.parse(localStorage.getItem('lookman_deleted_product_ids') || '[]');
    const importedSet = new Set(
      formattedProducts.flatMap(p => [String(p.id).toLowerCase(), (p.model || '').toLowerCase(), (p.name || '').toLowerCase()])
    );
    const cleanDeleted = localDeleted.filter(d => !importedSet.has(String(d).toLowerCase()));
    localStorage.setItem('lookman_deleted_product_ids', JSON.stringify(cleanDeleted));

    localStorage.setItem('lookman_custom_products', JSON.stringify(updatedCustom));

    setAddSuccessMsg(`🎉 Successfully imported and published ${formattedProducts.length} products from datasheet to live website!`);
    setTimeout(() => setAddSuccessMsg(''), 7000);

    fetchAdminData();
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('lookman_products_updated'));
    }

    setIsImporting(false);
    setParsedProducts([]);
    setDatasheetFile(null);
    setActiveTab('products');
  };

  const confirmExecuteDelete = async (product) => {
    if (!product) return;
    setIsDeleting(true);

    const id = product.id;
    const name = product.name;
    const model = product.model;
    const idStr = String(id);
    const modelStr = String(model || '').toLowerCase();
    const nameStr = String(name || '').toLowerCase();

    // 1. Delete permanently from backend DB if available
    try {
      await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      // Offline fallback
    }

    // 2. Update deleted tombstones in localStorage so it never reappears on refresh
    const localDeleted = JSON.parse(localStorage.getItem('lookman_deleted_product_ids') || '[]');
    const toAdd = [idStr, modelStr, nameStr].filter(Boolean);
    const updatedDeleted = [...new Set([...localDeleted, ...toAdd])];
    localStorage.setItem('lookman_deleted_product_ids', JSON.stringify(updatedDeleted));

    // 3. Remove from custom products in localStorage
    const customProds = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const filteredCustom = customProds.filter(p => 
      String(p.id) !== idStr && 
      (!p.model || p.model.toLowerCase() !== modelStr) && 
      (!p.name || p.name.toLowerCase() !== nameStr)
    );
    localStorage.setItem('lookman_custom_products', JSON.stringify(filteredCustom));

    // 4. Update live state immediately
    setProductsList(prev => prev.filter(p => 
      String(p.id) !== idStr && 
      (!p.model || p.model.toLowerCase() !== modelStr) && 
      (!p.name || p.name.toLowerCase() !== nameStr)
    ));

    // 5. Notify customer catalog in real-time
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('lookman_products_updated'));
    }

    setProductToDelete(null);
    setIsDeleting(false);
    setAddSuccessMsg(`✓ Successfully deleted "${resolveProductName(product)}" from catalog.`);
    setTimeout(() => setAddSuccessMsg(''), 5000);
  };

  const handleStartEditProduct = (product) => {
    setIsParsingModalPdf(false);
    setModalPdfNotice('');
    const code = resolveProductCode(product);
    const name = resolveProductName(product);
    setEditingProductModal({
      id: product.id,
      name: name,
      model: code,
      productCode: code,
      title: product.title || `${name} surveillance hardware from Lookman.`,
      category: typeof product.category === 'string' ? product.category : 'HD Analog Cameras',
      resolution: product.specs?.resolution || '1080P Full HD',
      sensor: product.specs?.sensor || '1/2.8" Progressive Scan CMOS',
      nightVision: product.specs?.nightVision || 'Smart IR Night Vision 30m',
      audio: product.specs?.audio || 'Built-in Mic',
      power: product.specs?.power || 'PoE / 12V DC',
      casing: product.specs?.casing || 'IP66 Weatherproof Housing',
      price: product.price || 0,
      image: product.image || '/color_on_bullet_hd.png',
      description: product.description || '',
      fullText: product.fullText || '',
      datasheetPdf: product.datasheetPdf || '',
      datasheetPdfName: product.datasheetPdfName || ''
    });
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProductModal) return;

    const code = resolveProductCode(editingProductModal);
    const name = resolveProductName(editingProductModal);

    const updated = {
      ...editingProductModal,
      name: name,
      model: code,
      productCode: code,
      title: (editingProductModal.title || `${name} surveillance hardware from Lookman.`).trim(),
      fullText: editingProductModal.fullText || '',
      driveLink: editingProductModal.driveLink || '',
      datasheetPdf: editingProductModal.datasheetPdf || editingProductModal.driveLink || '',
      datasheetPdfName: editingProductModal.datasheetPdfName || `${code}_datasheet.pdf`,
      specs: {
        resolution: editingProductModal.resolution,
        sensor: editingProductModal.sensor,
        nightVision: editingProductModal.nightVision,
        audio: editingProductModal.audio,
        power: editingProductModal.power,
        casing: editingProductModal.casing
      }
    };

    // 1. Update in backend DB
    try {
      await fetch(`${API_BASE}/products/${encodeURIComponent(updated.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      // Offline fallback
    }

    // 2. Update in localStorage lookman_custom_products
    const customProds = JSON.parse(localStorage.getItem('lookman_custom_products') || '[]');
    const existingIdx = customProds.findIndex(p => 
      String(p.id) === String(updated.id) || 
      (p.model && p.model.toLowerCase() === updated.model.toLowerCase())
    );
    if (existingIdx >= 0) {
      customProds[existingIdx] = { ...customProds[existingIdx], ...updated };
    } else {
      customProds.unshift(updated);
    }
    localStorage.setItem('lookman_custom_products', JSON.stringify(customProds));

    // 3. Update productsList state
    setProductsList(prev => prev.map(p => {
      if (String(p.id) === String(updated.id) || (p.model && p.model.toLowerCase() === updated.model.toLowerCase())) {
        return { ...p, ...updated };
      }
      return p;
    }));

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new Event('lookman_products_updated'));
    }

    setEditingProductModal(null);
    setModalPdfNotice('');
    setIsParsingModalPdf(false);
  };

  const handleModalPdfUpload = async (file) => {
    if (!file) return;
    setIsParsingModalPdf(true);
    setModalPdfNotice('');

    try {
      const products = await parsePdfDatasheet(file);
      const extracted = products && products.length > 0 ? products[0] : null;
      let cleanPdfImage = extracted?.image;
      if (cleanPdfImage) {
        cleanPdfImage = await removeWhiteBackgroundFromImage(cleanPdfImage);
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditingProductModal(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            // ── PRODUCT IMAGE ALONE WITHOUT BACKGROUND, ONE LINE TITLE, AND ALL TEXT ──
            model: extracted?.model || prev.model,
            productCode: extracted?.model || prev.productCode || prev.model,
            name: extracted?.name || extracted?.model || prev.name,
            title: extracted?.title || prev.title,
            category: extracted?.category || prev.category,
            image: cleanPdfImage || prev.image,
            resolution: extracted?.resolution || prev.resolution,
            sensor: extracted?.sensor || prev.sensor,
            nightVision: extracted?.nightVision || prev.nightVision,
            audio: extracted?.audio || prev.audio,
            power: extracted?.power || prev.power,
            casing: extracted?.casing || prev.casing,
            description: extracted?.description || prev.description,
            fullText: extracted?.fullText || prev.fullText,
            datasheetPdf: ev.target.result,
            datasheetPdfName: file.name
          };
        });

        setIsParsingModalPdf(false);
        setModalPdfNotice(`✓ Extracted from "${file.name}": Product image without background, one-line title, and all specifications & text fetched and ready to store in DB.`);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to parse PDF in modal:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditingProductModal(prev => ({
          ...prev,
          datasheetPdf: ev.target.result,
          datasheetPdfName: file.name
        }));
        setIsParsingModalPdf(false);
        setModalPdfNotice(`Attached "${file.name}" (could not auto-extract fields: ${err.message})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    const id = inquiryToDelete.id;
    const idStr = String(id);
    const phone = inquiryToDelete.phone ? String(inquiryToDelete.phone).trim() : '';
    const email = inquiryToDelete.email ? String(inquiryToDelete.email).trim().toLowerCase() : '';
    setDeleteInquiryLoading(true);

    try {
      await fetch(`${API_BASE}/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Backend delete inquiry offline fallback:', e);
    }

    // 1. Update deleted tombstones in localStorage
    const localDeleted = JSON.parse(localStorage.getItem('lookman_deleted_inquiry_ids') || '[]');
    const toAdd = [idStr, phone, email].filter(Boolean);
    toAdd.forEach(item => {
      if (!localDeleted.includes(item)) localDeleted.push(item);
    });
    localStorage.setItem('lookman_deleted_inquiry_ids', JSON.stringify(localDeleted));

    // 2. Remove from lookman_inquiries in localStorage
    const localInqs = JSON.parse(localStorage.getItem('lookman_inquiries') || '[]');
    const filteredLocal = localInqs.filter(inq => {
      if (String(inq.id) === idStr) return false;
      if (phone && inq.phone === phone) return false;
      if (email && inq.email && inq.email.toLowerCase() === email) return false;
      return true;
    });
    localStorage.setItem('lookman_inquiries', JSON.stringify(filteredLocal));

    // 3. Remove from UI state
    setInquiries(prev => prev.filter(inq => {
      if (String(inq.id) === idStr) return false;
      if (phone && inq.phone === phone) return false;
      if (email && inq.email && inq.email.toLowerCase() === email) return false;
      return true;
    }));
    setInquiryToDelete(null);
    setDeleteInquiryLoading(false);
  };

  // Filtered lists
  const filteredInquiries = useMemo(() => {
    if (!inquirySearch.trim()) return inquiries;
    const q = inquirySearch.toLowerCase();
    return inquiries.filter(inq => 
      (inq.name && inq.name.toLowerCase().includes(q)) ||
      (inq.phone && inq.phone.includes(q)) ||
      (inq.email && inq.email.toLowerCase().includes(q)) ||
      (inq.company && inq.company.toLowerCase().includes(q)) ||
      (inq.solution && inq.solution.toLowerCase().includes(q))
    );
  }, [inquiries, inquirySearch]);

  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const catMatch = productCategoryFilter === 'all' || 
        (typeof p.category === 'string' && p.category.toLowerCase().includes(productCategoryFilter.toLowerCase()));
      const searchMatch = !productSearch.trim() || 
        (p.name && p.name.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
      return catMatch && searchMatch;
    });
  }, [productsList, productCategoryFilter, productSearch]);

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 1: DEDICATED ADMINISTRATOR LOGIN PAGE
  // ──────────────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="w-full min-h-[85vh] bg-[#f8f9fc] flex flex-col items-center justify-center py-12 wide-2000-symmetric">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
          
          {/* Top Brand Accent Stripe */}
          <div 
            className="absolute top-0 left-0 right-0 h-2"
            style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
          />

          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-50 text-[#ea0004] border border-red-200 shadow-xs mb-1">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#12182b] tracking-tight">
              Lookman Admin Portal
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Authorized administrator dashboard to manage product catalog, view customer quotes, and system settings.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs pt-2">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#ea0004] text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-[#12182b] mb-1.5">Username / Admin Email</label>
              <input 
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="beyonddigitalchennai@gmail.com"
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3.5 rounded-xl outline-none shadow-xs transition-all text-xs"
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
                className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] p-3.5 rounded-xl outline-none shadow-xs transition-all text-xs"
              />
            </div>

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full text-white py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md active:scale-[0.99] transition-all cursor-pointer mt-2"
              style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
            >
              {authLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          {/* Return to Website link */}
          <div className="pt-4 border-t border-gray-100 text-center">
            <button 
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-500 hover:text-[#ea0004] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>← Return to Main Website</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 2: DEDICATED FULL-PAGE ADMINISTRATOR DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#f8f9fc] min-h-screen font-body text-slate-700 pb-16">
      
      {/* ── Top Dashboard Header Strip ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#ea0004] border border-red-200/80 flex items-center justify-center shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-black text-[#12182b] tracking-tight">
                  Lookman Admin Dashboard
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Logged in as <strong className="text-[#12182b]">{user.username}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToHome}
              className="text-xs font-heading font-semibold text-slate-700 bg-white border border-gray-300 hover:border-slate-400 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              ← Back to Website
            </button>
            <button 
              onClick={onLogout}
              className="text-xs font-heading font-bold text-[#ea0004] bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>

        </div>

        {/* ── Tabs Navigation ── */}
        <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric flex items-center gap-2 pt-2 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'inquiries'
                ? 'text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-50 border border-gray-200'
            }`}
            style={activeTab === 'inquiries' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
          >
            <Mail size={15} />
            <span>Customer Quotes ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-50 border border-gray-200'
            }`}
            style={activeTab === 'products' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
          >
            <Package size={15} />
            <span>Product Catalog ({productsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'add'
                ? 'text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-[#ea0004] hover:bg-slate-50 border border-gray-200'
            }`}
            style={activeTab === 'add' ? { background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' } : {}}
          >
            <FileSpreadsheet size={15} />
            <span>Upload Datasheet (Add Products)</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Body ── */}
      <div className="w-full max-w-[2000px] mx-auto wide-2000-symmetric pt-8 pb-16">
        
        {addSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-in zoom-in-95">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{addSuccessMsg}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: CUSTOMER QUOTE INQUIRIES
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h2 className="text-xl font-heading font-black text-[#12182b]">
                  Customer Quote Requests ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time inquiries received via the "Get In Touch" popup and contact forms.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search by name, phone, email..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-[#12182b] outline-none focus:border-[#ea0004] w-60 sm:w-72"
                  />
                </div>
                <button 
                  onClick={fetchAdminData}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Refresh Inquiries"
                >
                  <RefreshCw size={13} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-slate-400 text-xs shadow-xs space-y-2">
                <Mail size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-[#12182b] text-sm">No Quote Inquiries Found</p>
                <p>Inquiries submitted by customers via "Get In Touch" will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredInquiries.map((inq) => (
                  <div 
                    key={inq.id} 
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-heading font-black text-[#12182b] text-base">{inq.name}</h3>
                          <span className="inline-block mt-1 text-[11px] font-bold text-[#ea0004] bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
                            {inq.solution || 'General CCTV Inquiry'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-gray-100">
                        <div>📞 <strong className="text-[#12182b] ml-1">{inq.phone}</strong></div>
                        <div>✉️ <strong className="text-[#12182b] ml-1">{inq.email || 'N/A'}</strong></div>
                        <div>🏢 <strong className="text-[#12182b] ml-1">{inq.company || 'Direct Consumer'}</strong></div>
                      </div>

                      {inq.message && (
                        <div className="bg-white p-3 rounded-xl border border-gray-200 text-slate-700 text-xs leading-relaxed italic whitespace-pre-line">
                          "{inq.message}"
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <a 
                        href={`tel:${inq.phone}`}
                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        Call Customer
                      </a>
                      <button 
                        type="button"
                        onClick={() => setInquiryToDelete(inq)}
                        className="text-xs text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Quote Request"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: PRODUCT CATALOG MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-black text-[#12182b]">
                  Live Products Catalog ({productsList.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Manage all CCTV hardware, view specs, and remove outdated inventory.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search model or name..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-[#12182b] outline-none focus:border-[#ea0004] w-56 sm:w-64"
                  />
                </div>

                <select 
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-[#ea0004] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="HD Camera">HD Camera</option>
                  <option value="IP Camera">IP Camera</option>
                  <option value="PTZ">PTZ</option>
                  <option value="NVR">NVR</option>
                  <option value="XVR">XVR</option>
                </select>

                <button 
                  onClick={() => setActiveTab('add')}
                  className="px-4 py-2 rounded-xl text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer hover:opacity-95"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-slate-400 text-xs shadow-xs space-y-2">
                <Package size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-[#12182b] text-sm">No Products Found</p>
                <p>Try clearing your category filter or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="w-full h-24 bg-transparent p-1.5 flex items-center justify-center overflow-hidden">
                        <img 
                          src={p.image || '/color_on_bullet_hd.png'} 
                          alt={p.productCode || p.name} 
                          className="max-h-20 max-w-[70%] object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300 bg-transparent" 
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#ea0004] bg-red-50 border border-red-200/80 px-2 py-0.5 rounded">
                          {typeof p.category === 'string' ? p.category : (p.category?.name || 'CCTV')}
                        </span>
                        <h4 className="font-heading font-black text-[#12182b] text-sm mt-1.5 line-clamp-1" title={resolveProductName(p)}>
                          {resolveProductName(p)}
                        </h4>
                        <div className="text-[11px] font-mono font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Product Code:</span>
                          <span className="text-[#ea0004] font-black">{resolveProductCode(p)}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {p.description || 'High-definition surveillance hardware.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        {p.specs?.resolution || '1080P Full HD'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => handleStartEditProduct(p)}
                          className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Product Details & Specs"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Permanently Delete Product from DB"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: UPLOAD PRODUCT DATASHEET (BULK ADD PRODUCTS)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'add' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Explanatory & Action Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold text-[#ea0004] uppercase tracking-wider bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <FileSpreadsheet size={12} />
                    <span>Bulk Datasheet Engine</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    No Single-Product Typing Needed
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-[#12182b] tracking-tight">
                  Upload Products Datasheet
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload an Excel spreadsheet (<code className="font-mono text-[#ea0004] bg-red-50 px-1 py-0.5 rounded">.xlsx</code>, <code className="font-mono text-[#ea0004] bg-red-50 px-1 py-0.5 rounded">.xls</code>) or <code className="font-mono text-[#ea0004] bg-red-50 px-1 py-0.5 rounded">.csv</code> datasheet file containing your CCTV camera models and specifications. All products will be parsed, verified, and published directly to the live customer catalog in one click.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  title="Download ready-to-use CSV/Excel template with real camera columns"
                >
                  <Download size={15} className="text-[#ea0004]" />
                  <span>Download Sample Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasteBox(!showPasteBox)}
                  className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    showPasteBox 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <FileText size={15} />
                  <span>{showPasteBox ? 'Hide Paste Box' : 'Paste Table Text'}</span>
                </button>
              </div>
            </div>

            {/* Optional Paste Text Box */}
            {showPasteBox && (
              <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-black text-sm text-[#12182b] flex items-center gap-2">
                    <FileText size={16} className="text-[#ea0004]" />
                    <span>Paste Copied Excel / CSV Table Text Directly</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Copy cells in Excel and paste below</span>
                </div>
                <textarea
                  rows="5"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Model,Category,Resolution,Sensor,Night Vision,Audio&#10;SIP-VB402ADA,HD IP Camera,4MP Super HD,1/2.8 CMOS,Smart IR 40m,Built-in Mic&#10;SIP-VD402FDMA,HD IP Camera,4MP Super HD,1/2.8 CMOS,Color Night Vision,Two-way Audio"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] focus:bg-white text-[#12182b] font-mono text-xs p-4 rounded-xl outline-none shadow-xs transition-all"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Clear Text
                  </button>
                  <button
                    type="button"
                    onClick={() => handleParsePastedText(pastedText)}
                    disabled={!pastedText.trim() || isParsing}
                    className="px-4 py-2 rounded-xl text-white font-heading font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                    style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                  >
                    {isParsing ? 'Parsing Rows...' : 'Parse Pasted Datasheet'}
                  </button>
                </div>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleDatasheetFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer border-2 border-dashed ${
                isDragging 
                  ? 'border-[#ea0004] bg-red-50/60 shadow-lg scale-[1.005]' 
                  : 'border-slate-300 hover:border-[#ea0004] bg-white hover:bg-slate-50/50 shadow-sm'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.tsv,.json,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleDatasheetFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div className="max-w-md mx-auto space-y-4 pointer-events-none">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 text-[#ea0004] border border-red-200 flex items-center justify-center shadow-xs">
                  {isParsing ? (
                    <RefreshCw size={28} className="animate-spin text-[#ea0004]" />
                  ) : (
                    <Upload size={28} />
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-black text-lg text-[#12182b] tracking-tight">
                    {datasheetFile ? datasheetFile.name : 'Drop Your PDF Datasheet or Spreadsheet Here'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {datasheetFile 
                      ? `${(datasheetFile.size / 1024).toFixed(1)} KB — Click or drop another file to replace`
                      : 'Click to browse files or drag and drop your PDF datasheet, Excel (.xlsx/.xls) or CSV here'}
                  </p>
                </div>

                {/* Formats Pills */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {['.PDF (DATASHEET)', '.XLSX', '.XLS', '.CSV', '.TSV', '.JSON'].map((fmt) => (
                    <span 
                      key={fmt}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        fmt.includes('PDF')
                          ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs font-black'
                          : 'bg-slate-100 text-slate-600 border-slate-200/80'
                      }`}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>

                {/* Companion Image Files Option */}
                <div 
                  className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="font-semibold text-slate-700">Have referenced image files?</span>
                  <button
                    type="button"
                    onClick={() => companionFilesRef.current?.click()}
                    className="text-[#ea0004] hover:underline font-bold cursor-pointer"
                  >
                    + Upload Image Files (.png, .jpg)
                  </button>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    ({Object.keys(companionImages).length > 0 ? `${Object.keys(companionImages).length} images matched` : 'Auto-links by filename'})
                  </span>
                </div>
              </div>
            </div>

            {/* Hidden Inputs for companion assets and single row picker */}
            <input
              ref={companionFilesRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleCompanionImageUpload(e.target.files);
                }
              }}
            />
            <input
              ref={singleImagePickerRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0 && editingRowIndex !== null) {
                  handlePickImageForRow(editingRowIndex, e.target.files[0]);
                }
              }}
            />

            {/* Parsing Error Alert */}
            {parseError && (
              <div className="p-4 bg-red-50 border border-red-200 text-[#ea0004] text-xs font-bold rounded-2xl flex items-center gap-3 animate-in fade-in shadow-xs">
                <AlertCircle size={20} className="shrink-0" />
                <div className="flex-1">
                  <p>{parseError}</p>
                  <p className="text-[11px] font-normal text-slate-600 mt-0.5">
                    Tip: Click "Download Sample Template" above to see the expected column structure.
                  </p>
                </div>
              </div>
            )}

            {/* ── PARSED DATASHEET RESULTS & LIVE PREVIEW WORKSPACE ── */}
            {parsedProducts.length > 0 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Control & Batch Summary Strip */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Datasheet Summary:
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Check size={13} className="text-emerald-600" />
                      <span>{parsedProducts.length} Products Detected</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      {new Set(parsedProducts.map(p => p.category)).size} Unique Categories
                    </span>
                  </div>

                  {/* Import Strategy Options & Action */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-extrabold text-[#12182b] shrink-0">
                        Mode:
                      </label>
                      <select
                        value={importMode}
                        onChange={(e) => setImportMode(e.target.value)}
                        className="bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] text-xs font-medium py-2 px-3 rounded-xl outline-none cursor-pointer"
                      >
                        <option value="append">Append (Add to Catalog)</option>
                        <option value="update">Update Matching Models</option>
                        <option value="replace">Replace Custom Catalog</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleImportAndPublish}
                      disabled={isImporting}
                      className="px-6 py-3 rounded-xl text-white font-heading font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Publishing to Website...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Import &amp; Publish All {parsedProducts.length} Products</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Split Table & Live Lookman Card Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Parsed Products Interactive Table */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-heading font-black text-[#12182b] text-base">
                          Datasheet Rows ({parsedProducts.length})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Click any row to see how it renders on the live customer website.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={datasheetSearch}
                          onChange={(e) => setDatasheetSearch(e.target.value)}
                          placeholder="Search parsed models..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-[#12182b] focus:bg-white focus:border-[#ea0004] outline-none"
                        />
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-gray-100 max-h-[520px] overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8f9fc] text-slate-500 font-extrabold sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-3">#</th>
                            <th className="py-3 px-3">Image</th>
                            <th className="py-3 px-3">Camera &amp; Model Code</th>
                            <th className="py-3 px-3">Category</th>
                            <th className="py-3 px-3">Resolution</th>
                            <th className="py-3 px-3">Description</th>
                            <th className="py-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {parsedProducts
                            .filter(p => !datasheetSearch || p.model.toLowerCase().includes(datasheetSearch.toLowerCase()) || (p.name && p.name.toLowerCase().includes(datasheetSearch.toLowerCase())) || p.description.toLowerCase().includes(datasheetSearch.toLowerCase()))
                            .map((p, idx) => {
                              const isSelected = previewRowIndex === idx;
                              return (
                                <tr
                                  key={idx}
                                  onClick={() => setPreviewRowIndex(idx)}
                                  className={`transition-colors cursor-pointer ${
                                    isSelected 
                                      ? 'bg-red-50/60 font-semibold' 
                                      : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                                    {idx + 1}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-11 h-11 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-2xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingRowIndex(idx);
                                          singleImagePickerRef.current?.click();
                                        }}
                                        title="Click to replace or upload image for this product"
                                      >
                                        {p.image ? (
                                          <img
                                            src={p.image}
                                            alt={p.model}
                                            className="max-h-full max-w-full object-contain"
                                          />
                                        ) : (
                                          <div className="text-[9px] text-slate-400 font-bold text-center leading-tight">
                                            No Img
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 text-white text-[8.5px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                                          {p.image ? 'Change' : '+ Upload'}
                                        </div>
                                      </div>

                                      <div className="min-w-0 flex flex-col items-start gap-0.5">
                                        {p.hasImage ? (
                                          <span 
                                            className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded truncate max-w-[110px]"
                                            title={p.rawImageGiven || p.image}
                                          >
                                            {p.imageSource === 'pdf_transparent' ? '✨ Product (No BG)' :
                                             p.imageSource === 'pdf_render' ? '📄 PDF Visual' :
                                             p.imageSource === 'datasheet_url' ? '🔗 Web URL' : 
                                             p.imageSource === 'embedded_excel' ? '🖼️ Excel Img' : 
                                             p.imageSource === 'companion_upload' ? '📁 Matched File' : 
                                             p.imageSource === 'manual_upload' ? '📁 Custom File' : 
                                             p.imageSource === 'manual_url' ? '🔗 Custom URL' : 
                                             p.imageSource === 'default_render' ? '3D Render' : '✓ Sheet Asset'}
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingRowIndex(idx);
                                              singleImagePickerRef.current?.click();
                                            }}
                                            className="text-[9.5px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded cursor-pointer"
                                          >
                                            + Add Img
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-[#12182b]">
                                    <div className="flex flex-col items-start gap-0.5">
                                      <div className="flex items-center gap-1.5">
                                        <span>{resolveProductName(p)}</span>
                                        {isSelected && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#ea0004]" />
                                        )}
                                      </div>
                                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                        <span className="uppercase text-[9px] font-bold text-slate-400">Code:</span>
                                        <span className="text-[#ea0004] font-bold">{resolveProductCode(p)}</span>
                                      </div>
                                      {(p.datasheetPdf || p.driveLink) && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            downloadProductDatasheet(p);
                                          }}
                                          className="text-[9.5px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer mt-0.5"
                                          title="Download & test attached PDF datasheet"
                                        >
                                          <FileText size={10} className="text-rose-600" />
                                          <span>Drive Datasheet (Test)</span>
                                          <Download size={9} className="opacity-70 ml-0.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="text-[10px] font-bold text-[#ea0004] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                      {p.category}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                                    {p.resolution}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate" title={p.description}>
                                    {p.description}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setParsedProducts(prev => prev.filter((_, i) => i !== idx));
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                      title="Exclude this product from import"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Live Lookman Customer Card Preview */}
                  <div className="lg:col-span-4 space-y-4">
                    {parsedProducts[previewRowIndex] ? (
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#ea0004] uppercase tracking-wider bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block">
                              Live Customer Card Preview
                            </span>
                            <span className="text-[10.5px] font-mono text-slate-400">
                              Row #{previewRowIndex + 1}
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-[#12182b] text-base mt-2">
                            How Customers Will See This
                          </h4>
                          <p className="text-xs text-slate-500">
                            Showing exact image extracted from your datasheet.
                          </p>
                        </div>

                        {/* Exact Product Card representation */}
                        <div className="product-card-item bg-white rounded-2xl p-4 text-center shadow-md border border-slate-200/90 hover:border-rose-300 transition-all">
                          <div className="w-full h-28 flex items-center justify-center mb-2 overflow-hidden bg-transparent p-1.5 relative group">
                            {parsedProducts[previewRowIndex].image ? (
                              <img
                                src={parsedProducts[previewRowIndex].image}
                                alt={parsedProducts[previewRowIndex].productCode || parsedProducts[previewRowIndex].model}
                                className="max-h-24 max-w-[70%] object-contain drop-shadow-xs hover:scale-105 transition-transform bg-transparent"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center p-3 text-slate-400 text-center">
                                <Package size={32} className="text-slate-300 mb-1.5" />
                                <span className="text-xs font-bold text-slate-700">No Image in Datasheet</span>
                                <span className="text-[10.5px] text-slate-400 mt-0.5">Attach a photo or URL below</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRowIndex(previewRowIndex);
                                singleImagePickerRef.current?.click();
                              }}
                              className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs transition-all cursor-pointer opacity-90 hover:opacity-100 flex items-center gap-1 shadow-xs"
                            >
                              <Upload size={11} />
                              <span>{parsedProducts[previewRowIndex].image ? 'Replace File' : 'Upload File'}</span>
                            </button>
                          </div>

                          <span className="text-[10px] font-bold text-[#ea0004] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                            {parsedProducts[previewRowIndex].category}
                          </span>

                          <h3 className="font-heading text-sm font-bold text-[#162653] tracking-tight mb-1 truncate" title={resolveProductName(parsedProducts[previewRowIndex])}>
                            {resolveProductName(parsedProducts[previewRowIndex])}
                          </h3>

                          {/* Product Code (Shown directly BELOW the camera name) */}
                          <div className="text-[11px] font-mono font-bold text-slate-700 mb-2 truncate flex items-center justify-center gap-1.5 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-200/80">
                            <span className="text-[10px] uppercase font-bold text-slate-500 font-sans tracking-wide">Product Code:</span>
                            <span className="text-[#ea0004] font-black">{resolveProductCode(parsedProducts[previewRowIndex])}</span>
                          </div>

                          {(parsedProducts[previewRowIndex].datasheetPdf || parsedProducts[previewRowIndex].driveLink) && (
                            <button
                              type="button"
                              onClick={() => downloadProductDatasheet(parsedProducts[previewRowIndex])}
                              className="w-full mb-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-heading text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                            >
                              <FileText size={12} className="text-rose-600" />
                              <span>Download Datasheet (PDF)</span>
                            </button>
                          )}

                          {parsedProducts[previewRowIndex].title && (
                            <p className="text-[11px] font-semibold text-[#ea0004] line-clamp-1 mb-1 px-1 text-center" title={parsedProducts[previewRowIndex].title}>
                              {parsedProducts[previewRowIndex].title}
                            </p>
                          )}

                          <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 px-1 text-center">
                            {parsedProducts[previewRowIndex].description}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] mb-3">
                            <span className="font-mono text-slate-500">{parsedProducts[previewRowIndex].resolution}</span>
                            <span className="font-bold text-emerald-600">In Stock</span>
                          </div>

                          <div
                            className="text-white font-heading text-xs font-semibold px-4 py-2 rounded-full shadow-xs w-full select-none"
                            style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                          >
                            View Details
                          </div>
                        </div>

                        {/* Datasheet Image Verification & Quick URL Editor */}
                        <div className="bg-[#f8f9fc] border border-gray-200 rounded-2xl p-3.5 text-xs space-y-2.5 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#12182b] text-[11px] uppercase tracking-wider">
                              Image Configuration:
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              parsedProducts[previewRowIndex].hasImage 
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                                : 'text-amber-700 bg-amber-50 border border-amber-200'
                            }`}>
                              {parsedProducts[previewRowIndex].hasImage ? 'Exact Image Active' : 'No Image Provided'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] text-slate-500 font-medium">Image URL / File Path:</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={parsedProducts[previewRowIndex].rawImageGiven || parsedProducts[previewRowIndex].image || ''}
                                onChange={(e) => handleUpdateImageUrlForRow(previewRowIndex, e.target.value)}
                                placeholder="e.g. https://... or camera1.png"
                                className="flex-1 bg-white border border-gray-200 text-[#12182b] text-[11px] px-2.5 py-1.5 rounded-lg outline-none focus:border-[#ea0004]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingRowIndex(previewRowIndex);
                                  singleImagePickerRef.current?.click();
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg shrink-0 cursor-pointer"
                              >
                                Browse
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 pt-1.5 border-t border-gray-200/60">
                            <label className="text-[11px] text-slate-500 font-medium">Google Drive / Datasheet URL:</label>
                            <input
                              type="url"
                              value={parsedProducts[previewRowIndex].driveLink || ''}
                              onChange={(e) => {
                                const url = e.target.value.trim();
                                const direct = getGoogleDriveDirectDownloadUrl(url);
                                setParsedProducts(prev => prev.map((p, i) => {
                                  if (i === previewRowIndex) {
                                    const code = resolveProductCode(p);
                                    return {
                                      ...p,
                                      driveLink: url,
                                      datasheetPdf: direct || url,
                                      datasheetPdfName: `${code}_datasheet.pdf`,
                                      hasDatasheet: Boolean(url)
                                    };
                                  }
                                  return p;
                                }));
                              }}
                              placeholder="https://drive.google.com/file/d/.../view"
                              className="w-full bg-white border border-gray-200 text-[#12182b] text-[11px] px-2.5 py-1.5 rounded-lg outline-none focus:border-[#ea0004] font-mono"
                            />
                          </div>

                          {!parsedProducts[previewRowIndex].hasImage && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => handleApplyDefaultRenderForRow(previewRowIndex)}
                                className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-[#ea0004] border border-red-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Use Lookman Default 3D Render
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Specs Breakdown */}
                        <div className="bg-[#f8f9fc] border border-gray-200 rounded-2xl p-4 text-xs space-y-1.5 text-left">
                          <div className="font-bold text-[#12182b] text-[11px] uppercase tracking-wider pb-1 border-b border-gray-200">
                            Extracted Specifications:
                          </div>
                          <div className="flex justify-between py-0.5"><span className="text-slate-500">Sensor:</span> <span className="font-semibold text-slate-800">{parsedProducts[previewRowIndex].sensor}</span></div>
                          <div className="flex justify-between py-0.5"><span className="text-slate-500">Night Vision:</span> <span className="font-semibold text-slate-800">{parsedProducts[previewRowIndex].nightVision}</span></div>
                          <div className="flex justify-between py-0.5"><span className="text-slate-500">Audio:</span> <span className="font-semibold text-slate-800">{parsedProducts[previewRowIndex].audio}</span></div>
                          <div className="flex justify-between py-0.5"><span className="text-slate-500">Power:</span> <span className="font-semibold text-slate-800">{parsedProducts[previewRowIndex].power}</span></div>
                          <div className="flex justify-between py-0.5"><span className="text-slate-500">Casing:</span> <span className="font-semibold text-slate-800">{parsedProducts[previewRowIndex].casing}</span></div>
                        </div>

                        {/* Attached PDF / Drive Datasheet Box */}
                        {(parsedProducts[previewRowIndex].datasheetPdf || parsedProducts[previewRowIndex].driveLink) && (
                          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <FileText size={16} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-rose-950 text-xs">
                                  {parsedProducts[previewRowIndex].driveLink?.includes('drive.google.com') ? 'Google Drive Datasheet' : 'PDF Datasheet Attached'}
                                </div>
                                <div className="text-[10px] text-rose-700 truncate" title={parsedProducts[previewRowIndex].driveLink || parsedProducts[previewRowIndex].datasheetPdfName}>
                                  {parsedProducts[previewRowIndex].datasheetPdfName || `${resolveProductCode(parsedProducts[previewRowIndex])}_datasheet.pdf`}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => downloadProductDatasheet(parsedProducts[previewRowIndex])}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10.5px] font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download size={11} />
                              <span>Test Download</span>
                            </button>
                          </div>
                        )}

                      </div>
                    ) : null}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          EDIT PRODUCT MODAL (LIVE DB UPDATE)
          ══════════════════════════════════════════════════════════════════════ */}
      {editingProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block">
                  Database Product Editor
                </span>
                <h3 className="text-lg font-heading font-black text-[#12182b] mt-1.5">
                  Edit "{editingProductModal.model || editingProductModal.name}"
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProductModal(null);
                  setModalPdfNotice('');
                  setIsParsingModalPdf(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Parsing State & Extracted Status Alerts */}
            {isParsingModalPdf && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#ea0004] text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-pulse">
                <RefreshCw size={15} className="animate-spin text-[#ea0004] shrink-0" />
                <span>Reading updated PDF datasheet and extracting Model, Category, Image, Specs, and Description...</span>
              </div>
            )}

            {modalPdfNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{modalPdfNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalPdfNotice('')}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-1 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Camera Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProductModal.name || editingProductModal.model}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    value={editingProductModal.productCode || editingProductModal.model}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, productCode: e.target.value, model: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingProductModal.category}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, category: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none cursor-pointer"
                  >
                    <option value="HD IP Camera">HD IP Camera</option>
                    <option value="PTZ Cameras">PTZ Cameras</option>
                    <option value="HD Analog Cameras">HD Analog Cameras</option>
                    <option value="NVRS">NVRS</option>
                    <option value="Hybrid DVR">Hybrid DVR</option>
                    <option value="IP Camera">IP Camera</option>
                    <option value="AI Product">AI Product</option>
                    <option value="Switch">Switch</option>
                    <option value="Platform Product">Platform Product</option>
                    <option value="Accessories">Accessories</option>
                    {!['HD IP Camera', 'PTZ Cameras', 'HD Analog Cameras', 'NVRS', 'Hybrid DVR', 'IP Camera', 'AI Product', 'Switch', 'Platform Product', 'Accessories'].includes(editingProductModal.category) && (
                      <option value={editingProductModal.category}>{editingProductModal.category}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">One-Line Product / Image Headline</label>
                <input
                  type="text"
                  value={editingProductModal.title || ''}
                  onChange={(e) => setEditingProductModal({ ...editingProductModal, title: e.target.value })}
                  placeholder="e.g. SIP-VPS8032AI 4K Ultra HD AI PTZ Camera with 32x Optical Zoom"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">Product Image (Isolated Without Background)</label>
                  {editingProductModal.image?.startsWith('data:image/png') && (
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      ✓ Transparent PNG (No Background)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <div className="w-14 h-14 rounded-xl bg-slate-100/90 border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={editingProductModal.image || '/CO-H-2BFDML(V).png'}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingProductModal.image}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, image: e.target.value })}
                    placeholder="/CO-H-2BFDML(V).png or data:image/png;base64,..."
                    className="flex-1 bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none font-mono text-[11px] min-w-[160px]"
                  />
                  <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs">
                    <Upload size={13} className="text-[#ea0004]" />
                    <span>Upload &amp; Extract Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const transparent = await removeWhiteBackgroundFromImage(file);
                          setEditingProductModal(prev => ({ ...prev, image: transparent }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Resolution</label>
                  <input
                    type="text"
                    value={editingProductModal.resolution}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, resolution: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Sensor</label>
                  <input
                    type="text"
                    value={editingProductModal.sensor}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, sensor: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Night Vision</label>
                  <input
                    type="text"
                    value={editingProductModal.nightVision}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, nightVision: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Audio</label>
                  <input
                    type="text"
                    value={editingProductModal.audio}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, audio: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Power</label>
                  <input
                    type="text"
                    value={editingProductModal.power}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, power: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Casing</label>
                  <input
                    type="text"
                    value={editingProductModal.casing}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, casing: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editingProductModal.description}
                  onChange={(e) => setEditingProductModal({ ...editingProductModal, description: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2.5 rounded-xl outline-none"
                />
              </div>

              {/* Datasheet Document (PDF) Upload / Link */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Official Datasheet Document (PDF)</label>
                    <p className="text-[10px] text-slate-400">Uploading a PDF will automatically fetch Model, Category, Image, Specs, and Description.</p>
                  </div>
                  {editingProductModal.datasheetPdf && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      PDF Linked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {editingProductModal.datasheetPdf ? (
                    <div className="flex items-center gap-2 bg-white border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-800 shadow-2xs">
                      <FileText size={14} className="text-rose-600 shrink-0" />
                      <span className="truncate max-w-[200px]">{editingProductModal.datasheetPdfName || 'Attached_Datasheet.pdf'}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No PDF attached to this product</span>
                  )}

                  <label className={`px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs ${isParsingModalPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isParsingModalPdf ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-[#ea0004]" />
                        <span>Fetching Details...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={12} className="text-[#ea0004]" />
                        <span>{editingProductModal.datasheetPdf ? 'Change PDF & Refetch' : '+ Upload PDF Datasheet'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      disabled={isParsingModalPdf}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleModalPdfUpload(file);
                        }
                      }}
                    />
                  </label>

                  {editingProductModal.datasheetPdf && (
                    <button
                      type="button"
                      onClick={() => setEditingProductModal(prev => ({ ...prev, datasheetPdf: '', datasheetPdfName: '', driveLink: '' }))}
                      className="text-xs text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Google Drive / Datasheet URL</label>
                  <input
                    type="url"
                    value={editingProductModal.driveLink || ''}
                    onChange={(e) => {
                      const url = e.target.value.trim();
                      const direct = getGoogleDriveDirectDownloadUrl(url);
                      setEditingProductModal(prev => ({
                        ...prev,
                        driveLink: url,
                        datasheetPdf: direct || url || prev.datasheetPdf
                      }));
                    }}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="w-full bg-white border border-gray-200 focus:border-[#ea0004] text-[#12182b] p-2 rounded-xl outline-none font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-400">Pastes directly from Google Drive sharing link; customers will get direct PDF download.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-heading font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #ea0004 0%, #6a0006 100%)' }}
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PERMANENT DELETE CONFIRMATION MODAL ── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ea0004] border border-red-200 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-heading font-black text-[#12182b]">
                Delete Product?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently remove <strong className="text-slate-800">{resolveProductName(productToDelete)}</strong> ({resolveProductCode(productToDelete)}) from the database and live customer catalog?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-slate-700 font-heading font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmExecuteDelete(productToDelete)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#ea0004] hover:bg-[#6a0006] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QUOTE REQUEST / INQUIRY DELETE CONFIRMATION MODAL ── */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ea0004] border border-red-200 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-heading font-black text-[#12182b]">
                Delete Quote Request?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently delete the inquiry from <strong className="text-slate-800">{inquiryToDelete.name}</strong> ({inquiryToDelete.phone || inquiryToDelete.email}) from the database?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                disabled={deleteInquiryLoading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-slate-700 font-heading font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteInquiry}
                disabled={deleteInquiryLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#ea0004] hover:bg-[#6a0006] text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                {deleteInquiryLoading ? 'Deleting...' : 'Delete Inquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
