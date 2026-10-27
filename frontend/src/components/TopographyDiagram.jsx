import React from 'react';

// ─── PRECISION EQUIPMENT ICONS (VECTOR SCHEMATICS) ───
const ServerRackIcon = ({ x, y, label = "Storage server" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="44" height="24" rx="2" fill="#2d3748" stroke="#1a202c" strokeWidth="1" />
    <line x1="4" y1="6" x2="40" y2="6" stroke="#4a5568" strokeWidth="1" />
    <line x1="4" y1="12" x2="40" y2="12" stroke="#4a5568" strokeWidth="1" />
    <line x1="4" y1="18" x2="40" y2="18" stroke="#4a5568" strokeWidth="1" />
    <circle cx="8" cy="6" r="1.2" fill="#48bb78" />
    <circle cx="8" cy="12" r="1.2" fill="#48bb78" />
    <circle cx="8" cy="18" r="1.2" fill="#48bb78" />
    <text x="22" y="34" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const MatrixDecoderIcon = ({ x, y, label = "Decoder" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="36" height="18" rx="1.5" fill="#4a5568" stroke="#2d3748" strokeWidth="1" />
    <line x1="6" y1="9" x2="30" y2="9" stroke="#718096" strokeWidth="1" />
    <circle cx="30" cy="5" r="1" fill="#4299e1" />
    <text x="18" y="28" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const TvWallIcon = ({ x, y, brand = "LOOKMAN" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="64" height="38" rx="2" fill="#1a365d" stroke="#0070ba" strokeWidth="1.5" />
    <line x1="32" y1="2" x2="32" y2="36" stroke="#2b6cb0" strokeWidth="1" />
    <line x1="2" y1="19" x2="62" y2="19" stroke="#2b6cb0" strokeWidth="1" />
    <rect x="12" y="10" width="40" height="18" rx="2" fill="#0070ba" />
    <text x="32" y="22" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif" letterSpacing="0.5">
      {brand}
    </text>
    <path d="M26 38 L38 38 L35 44 L29 44 Z" fill="#4a5568" />
    <rect x="22" y="44" width="20" height="2" rx="1" fill="#2d3748" />
    <text x="32" y="54" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0070ba" fontFamily="sans-serif">TV wall</text>
  </g>
);

const PcClientIcon = ({ x, y, label = "Client" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="28" height="20" rx="1.5" fill="#edf2f7" stroke="#4a5568" strokeWidth="1" />
    <rect x="2" y="2" width="24" height="14" fill="#3182ce" />
    <path d="M11 20 L17 20 L15 24 L13 24 Z" fill="#718096" />
    <rect x="9" y="24" width="10" height="1.5" fill="#4a5568" />
    <rect x="31" y="4" width="10" height="21.5" rx="1" fill="#2d3748" stroke="#1a202c" strokeWidth="0.5" />
    <line x1="33" y1="8" x2="39" y2="8" stroke="#718096" strokeWidth="0.5" />
    <circle cx="36" cy="18" r="1" fill="#48bb78" />
    <text x="20" y="34" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const LaptopIcon = ({ x, y, label = "Client PC" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="4" width="24" height="16" rx="1" fill="#2b6cb0" stroke="#2d3748" strokeWidth="1" />
    <path d="M0 16 L32 16 L30 19 L2 19 Z" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
    <text x="16" y="29" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const SwitchIcon = ({ x, y, label = "Switch" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <polygon points="14,0 28,8 14,16 0,8" fill="#4299e1" stroke="#2b6cb0" strokeWidth="1" />
    <line x1="0" y1="8" x2="0" y2="12" stroke="#2b6cb0" strokeWidth="1" />
    <line x1="14" y1="16" x2="14" y2="20" stroke="#2b6cb0" strokeWidth="1" />
    <line x1="28" y1="8" x2="28" y2="12" stroke="#2b6cb0" strokeWidth="1" />
    <polygon points="0,12 14,20 28,12 14,16" fill="#3182ce" />
    <text x="14" y="29" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const DomeCameraIcon = ({ x, y, label = "Dome" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M2 14 C2 6 22 6 22 14 Z" fill="#ffffff" stroke="#4a5568" strokeWidth="1" />
    <circle cx="12" cy="11" r="4" fill="#1a202c" />
    <rect x="0" y="14" width="24" height="3" rx="1" fill="#cbd5e0" stroke="#718096" strokeWidth="0.5" />
    <text x="12" y="26" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const BulletCameraIcon = ({ x, y, label = "Bullet" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <polygon points="2,8 18,3 18,17 2,12" fill="#ffffff" stroke="#4a5568" strokeWidth="1" />
    <circle cx="18" cy="10" r="7" fill="#edf2f7" stroke="#4a5568" strokeWidth="1" />
    <circle cx="18" cy="10" r="4" fill="#1a202c" />
    <line x1="10" y1="13" x2="8" y2="20" stroke="#4a5568" strokeWidth="2" />
    <rect x="4" y="20" width="8" height="2" fill="#718096" />
    <text x="12" y="29" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const PtzCameraIcon = ({ x, y, label = "PTZ Dome" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="4" y="0" width="16" height="5" fill="#718096" rx="1" />
    <path d="M2 5 L22 5 L19 15 L5 15 Z" fill="#ffffff" stroke="#4a5568" strokeWidth="1" />
    <circle cx="12" cy="18" r="7" fill="#ffffff" stroke="#4a5568" strokeWidth="1" />
    <circle cx="12" cy="18" r="4" fill="#1a202c" />
    <text x="12" y="33" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const BarrierGateIcon = ({ x, y, label = "Barrier gate" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="0" y="4" width="10" height="24" rx="1" fill="#dd6b20" stroke="#c05621" strokeWidth="1" />
    <line x1="10" y1="10" x2="38" y2="2" stroke="#e53e3e" strokeWidth="2.5" />
    <line x1="10" y1="10" x2="38" y2="2" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
    <line x1="28" y1="8" x2="28" y2="28" stroke="#4a5568" strokeWidth="1.5" />
    <polygon points="22,6 34,4 34,10 22,8" fill="#2b6cb0" />
    <rect x="36" y="6" width="12" height="14" rx="1" fill="#2d3748" />
    <rect x="38" y="8" width="8" height="10" fill="#e53e3e" />
    <text x="24" y="38" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const AlarmMainframeIcon = ({ x, y, label = "Alarm mainframe" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="26" height="32" rx="1.5" fill="#edf2f7" stroke="#a0aec0" strokeWidth="1" />
    <circle cx="6" cy="6" r="1.5" fill="#e53e3e" />
    <circle cx="10" cy="6" r="1.5" fill="#48bb78" />
    <rect x="5" y="12" width="16" height="12" fill="#ffffff" stroke="#cbd5e0" strokeWidth="0.5" />
    <text x="13" y="41" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const StrobeIcon = ({ x, y, label = "Sound/light alarm" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d="M4 14 C4 6 16 6 16 14 Z" fill="#e53e3e" stroke="#c53030" strokeWidth="1" />
    <rect x="2" y="14" width="16" height="4" fill="#4a5568" rx="1" />
    <text x="10" y="26" textAnchor="middle" fontSize="7" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const AccessDoorIcon = ({ x, y, label = "Access control" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="18" height="30" fill="#c05621" stroke="#7b341e" strokeWidth="1" rx="0.5" />
    <circle cx="15" cy="16" r="1.5" fill="#ecc94b" />
    <rect x="22" y="8" width="10" height="14" fill="#ffffff" stroke="#a0aec0" strokeWidth="0.5" />
    <rect x="24" y="10" width="6" height="4" fill="#3182ce" />
    <text x="16" y="39" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const IntercomStationIcon = ({ x, y, label = "Door Station" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width="16" height="30" rx="2" fill="#2d3748" stroke="#1a202c" strokeWidth="1" />
    <circle cx="8" cy="6" r="3" fill="#3182ce" />
    <rect x="3" y="12" width="10" height="8" fill="#4a5568" />
    <circle cx="8" cy="24" r="2" fill="#edf2f7" />
    <text x="8" y="38" textAnchor="middle" fontSize="7.5" fill="#4a5568" fontFamily="sans-serif">{label}</text>
  </g>
);

const CloudIcon = ({ x, y, label = "Private Network" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path 
      d="M10 24 A12 12 0 0 1 24 10 A16 16 0 0 1 50 8 A18 18 0 0 1 70 12 A14 14 0 0 1 84 24 A12 12 0 0 1 76 38 L18 38 A12 12 0 0 1 10 24 Z" 
      fill="#ebf8ff" 
      stroke="#3182ce" 
      strokeWidth="1.5" 
    />
    <text 
      x="47" 
      y="26" 
      textAnchor="middle" 
      fontSize="7.5" 
      fontWeight="bold" 
      fill="#2b6cb0" 
      fontFamily="sans-serif"
    >
      {label}
    </text>
  </g>
);

export default function TopographyDiagram({ type = 'bank' }) {
  return (
    <div className="w-full bg-white p-2 sm:p-4 overflow-x-auto flex justify-center">
      <svg 
        viewBox="0 0 740 420" 
        className="w-full max-w-[740px] h-auto font-sans"
        style={{ minWidth: '600px' }}
      >
        <defs>
          <linearGradient id="conduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bee3f8" />
            <stop offset="50%" stopColor="#90cdf4" />
            <stop offset="100%" stopColor="#bee3f8" />
          </linearGradient>
        </defs>

        {type === 'school' && <SchoolTopologySvg />}
        {type === 'hospital' && <HospitalTopologySvg />}
        {type === 'bank' && <BankTopologySvg />}
        {(type === 'industrial' || type === 'industrial-park') && <IndustrialTopologySvg />}
        {type === 'community' && <CommunityTopologySvg />}
        {(type === 'commercial' || type === 'commercial-complex') && <CommercialTopologySvg />}
        {type === 'chain-store' && <ChainStoreTopologySvg />}
      </svg>
    </div>
  );
}

// ─── 1. SCHOOL TOPOLOGY SVG ───
function SchoolTopologySvg() {
  return (
    <g>
      <rect x="20" y="15" width="160" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="100" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Superior Education Dept.</text>
      <MatrixDecoderIcon x="35" y="40" label="Matrix" />
      <TvWallIcon x="100" y="38" brand="LOOKMAN" />
      <line x1="30" y1="78" x2="170" y2="78" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="53" cy="78" r="2" fill="#00a0e9" />
      <circle cx="132" cy="78" r="2" fill="#00a0e9" />
      <text x="50" y="95" textAnchor="middle" fontSize="7.5" fill="#718096">Edu Platform</text>
      <PcClientIcon x="120" y="65" label="Client" />

      <rect x="200" y="15" width="290" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="345" y="30" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">School Surveillance Center</text>
      <ServerRackIcon x="215" y="40" label="Storage server" />
      <MatrixDecoderIcon x="280" y="42" label="Matrix" />
      <TvWallIcon x="340" y="38" brand="LOOKMAN" />
      <rect x="420" y="44" width="22" height="14" fill="#4a5568" rx="1" />
      <text x="431" y="66" textAnchor="middle" fontSize="7.5" fill="#718096">Keyboard</text>
      <line x1="210" y1="80" x2="480" y2="80" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="237" cy="80" r="2" fill="#00a0e9" />
      <circle cx="298" cy="80" r="2" fill="#00a0e9" />
      <circle cx="372" cy="80" r="2" fill="#00a0e9" />
      <circle cx="431" cy="80" r="2" fill="#00a0e9" />
      <text x="240" y="98" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="340" y="98" textAnchor="middle" fontSize="7.5" fill="#718096">Main Network</text>
      <text x="440" y="98" textAnchor="middle" fontSize="7.5" fill="#718096">Client</text>

      <rect x="510" y="15" width="210" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="615" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Police Database Center</text>
      <MatrixDecoderIcon x="535" y="40" label="Matrix" />
      <TvWallIcon x="605" y="38" brand="POLICE" />
      <line x1="520" y1="78" x2="710" y2="78" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="553" cy="78" r="2" fill="#00a0e9" />
      <circle cx="637" cy="78" r="2" fill="#00a0e9" />
      <text x="560" y="95" textAnchor="middle" fontSize="7.5" fill="#718096">Police Platform</text>
      <PcClientIcon x="650" y="65" label="Client" />

      {/* Clean Straight Network lines from Top Centers to LAN */}
      <line x1="100" y1="78" x2="100" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="345" y1="80" x2="345" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="615" y1="78" x2="615" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="100" cy="155" r="2.5" fill="#00a0e9" />
      <circle cx="345" cy="155" r="2.5" fill="#00a0e9" />
      <circle cx="615" cy="155" r="2.5" fill="#00a0e9" />

      {/* LAN Conduit */}
      <rect x="20" y="155" width="700" height="12" rx="6" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1.2" />
      <text x="370" y="164" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* Clean Straight Network lines from LAN to Bottom Modules */}
      <line x1="100" y1="167" x2="100" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="270" y1="167" x2="270" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="455" y1="167" x2="455" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="640" y1="167" x2="640" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="100" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="270" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="455" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="640" cy="167" r="2.5" fill="#00a0e9" />

      {/* Bottom Modules */}
      <rect x="20" y="195" width="160" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="100" y="330" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Surrounding Alarm</text>
      <StrobeIcon x="30" y="210" label="Sound/Light" />
      <circle cx="78" cy="225" r="7" fill="#edf2f7" stroke="#718096" />
      <text x="78" y="242" textAnchor="middle" fontSize="7" fill="#718096">IR detector</text>
      <text x="105" y="218" textAnchor="middle" fontSize="7" fill="#718096">Vibration Optic</text>
      <line x1="28" y1="245" x2="160" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="40" cy="245" r="2" fill="#00a0e9" />
      <circle cx="78" cy="245" r="2" fill="#00a0e9" />
      <circle cx="138" cy="245" r="2" fill="#00a0e9" />
      <AlarmMainframeIcon x="125" y="210" label="Alarm mainframe" />

      <rect x="195" y="195" width="150" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="270" y="330" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Access control system</text>
      <rect x="210" y="210" width="18" height="24" rx="1" fill="#edf2f7" stroke="#a0aec0" />
      <text x="219" y="243" textAnchor="middle" fontSize="7" fill="#718096">Card reader</text>
      <rect x="245" y="210" width="18" height="24" rx="1" fill="#edf2f7" stroke="#a0aec0" />
      <text x="254" y="243" textAnchor="middle" fontSize="7" fill="#718096">Card reader</text>
      <line x1="205" y1="245" x2="335" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="219" cy="245" r="2" fill="#00a0e9" />
      <circle cx="254" cy="245" r="2" fill="#00a0e9" />
      <circle cx="308" cy="245" r="2" fill="#00a0e9" />
      <AlarmMainframeIcon x="295" y="210" label="Controller" />

      <rect x="360" y="195" width="190" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="455" y="330" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Admin / Office / Teaching Campus</text>
      <SwitchIcon x="440" y="200" label="Switch" />
      <line x1="375" y1="235" x2="535" y2="235" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="454" y1="220" x2="454" y2="235" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="395" cy="235" r="2" fill="#00a0e9" />
      <circle cx="435" cy="235" r="2" fill="#00a0e9" />
      <circle cx="475" cy="235" r="2" fill="#00a0e9" />
      <circle cx="515" cy="235" r="2" fill="#00a0e9" />
      <ServerRackIcon x="375" y="245" label="NVR" />
      <BulletCameraIcon x="425" y="248" label="Bullet" />
      <DomeCameraIcon x="465" y="248" label="Dome" />
      <PtzCameraIcon x="505" y="245" label="PTZ" />

      <rect x="565" y="195" width="155" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="642" y="330" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Gate</text>
      <line x1="575" y1="245" x2="710" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="615" cy="245" r="2" fill="#00a0e9" />
      <circle cx="680" cy="245" r="2" fill="#00a0e9" />
      <BarrierGateIcon x="590" y="205" label="Barrier gate" />
      <text x="680" y="225" textAnchor="middle" fontSize="7.5" fill="#718096">LPR Camera</text>
      <text x="680" y="240" textAnchor="middle" fontSize="7.5" fill="#718096">Display screen</text>
      <text x="680" y="260" textAnchor="middle" fontSize="7.5" fill="#718096">Fill light</text>
    </g>
  );
}

// ─── 2. HOSPITAL TOPOLOGY SVG ───
function HospitalTopologySvg() {
  return (
    <g>
      <rect x="20" y="15" width="280" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="160" y="30" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">Hospital Surveillance Center</text>
      <ServerRackIcon x="35" y="40" label="Storage server" />
      <MatrixDecoderIcon x="100" y="42" label="Decoder" />
      <TvWallIcon x="155" y="38" brand="LOOKMAN" />
      <line x1="30" y1="88" x2="280" y2="88" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="57" cy="88" r="2" fill="#00a0e9" />
      <circle cx="118" cy="88" r="2" fill="#00a0e9" />
      <circle cx="187" cy="88" r="2" fill="#00a0e9" />
      <text x="55" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="125" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Media Stream</text>
      <text x="195" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Alarm Server</text>
      <text x="260" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">E-map Server</text>

      <rect x="315" y="15" width="160" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="395" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Remote Medical Center</text>
      <TvWallIcon x="330" y="40" brand="LOOKMAN" />
      <MatrixDecoderIcon x="415" y="42" label="Decoder" />
      <line x1="325" y1="88" x2="465" y2="88" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="362" cy="88" r="2" fill="#00a0e9" />
      <circle cx="433" cy="88" r="2" fill="#00a0e9" />
      <text x="355" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="435" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Client</text>

      <CloudIcon x="480" y="38" label="Private Network" />

      <rect x="580" y="15" width="140" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="650" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Clients</text>
      <LaptopIcon x="595" y="45" label="Executive" />
      <PcClientIcon x="655" y="45" label="Security" />

      {/* Clean Straight Network lines */}
      <line x1="300" y1="70" x2="315" y2="70" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="475" y1="65" x2="480" y2="65" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="565" y1="65" x2="580" y2="65" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="527" y1="76" x2="527" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="527" cy="155" r="2.5" fill="#00a0e9" />

      {/* LAN Conduit */}
      <rect x="20" y="155" width="700" height="12" rx="6" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1.2" />
      <text x="370" y="164" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* LAN to bottom lines */}
      <line x1="85" y1="167" x2="85" y2="210" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="227" y1="167" x2="227" y2="210" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="372" y1="167" x2="372" y2="210" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="515" y1="167" x2="515" y2="210" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="655" y1="167" x2="655" y2="210" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="85" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="227" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="372" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="515" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="655" cy="167" r="2.5" fill="#00a0e9" />

      {/* 5 Medical Units */}
      <rect x="20" y="200" width="130" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="85" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Clinic</text>
      <SwitchIcon x="70" y="210" label="Switch" />
      <line x1="45" y1="238" x2="125" y2="238" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="52" cy="238" r="2" fill="#00a0e9" />
      <circle cx="107" cy="238" r="2" fill="#00a0e9" />
      <DomeCameraIcon x="40" y="250" label="Dome" />
      <DomeCameraIcon x="95" y="250" label="Audio Dome" />

      <rect x="160" y="200" width="135" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="227" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Operating room</text>
      <SwitchIcon x="215" y="210" label="Switch" />
      <line x1="185" y1="238" x2="270" y2="238" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="192" cy="238" r="2" fill="#00a0e9" />
      <circle cx="247" cy="238" r="2" fill="#00a0e9" />
      <BulletCameraIcon x="180" y="250" label="HD Cam" />
      <DomeCameraIcon x="235" y="250" label="Sterile Dome" />

      <rect x="305" y="200" width="135" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="372" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Inpatient dept</text>
      <SwitchIcon x="360" y="210" label="Switch" />
      <line x1="330" y1="238" x2="415" y2="238" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="342" cy="238" r="2" fill="#00a0e9" />
      <circle cx="397" cy="238" r="2" fill="#00a0e9" />
      <DomeCameraIcon x="330" y="250" label="Corridor Dome" />
      <BulletCameraIcon x="385" y="250" label="Night IR" />

      <rect x="450" y="200" width="130" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="515" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Lobby</text>
      <SwitchIcon x="500" y="210" label="Switch" />
      <line x1="475" y1="238" x2="555" y2="238" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="485" cy="238" r="2" fill="#00a0e9" />
      <circle cx="537" cy="238" r="2" fill="#00a0e9" />
      <circle cx="485" cy="265" r="9" fill="#edf2f7" stroke="#718096" strokeWidth="1" />
      <text x="485" y="285" textAnchor="middle" fontSize="7" fill="#718096">Fisheye 360°</text>
      <DomeCameraIcon x="525" y="250" label="Audio Dome" />

      <rect x="590" y="200" width="130" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="655" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Parking area</text>
      <BarrierGateIcon x="615" y="225" label="Ambulance Gate" />
    </g>
  );
}

// ─── 3. BANK TOPOLOGY SVG ───
function BankTopologySvg() {
  return (
    <g>
      <rect x="30" y="15" width="460" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="260" y="30" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">Headquarter Surveillance Center</text>
      <ServerRackIcon x="45" y="40" label="Storage server" />
      <MatrixDecoderIcon x="110" y="42" label="Decoder" />
      <TvWallIcon x="170" y="38" brand="LOOKMAN" />
      <ServerRackIcon x="260" y="40" label="Alarm server" />
      <rect x="330" y="45" width="20" height="14" fill="#4a5568" rx="1" />
      <text x="340" y="68" textAnchor="middle" fontSize="7.5" fill="#718096">Keyboard</text>
      <line x1="45" y1="88" x2="450" y2="88" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="67" cy="88" r="2" fill="#00a0e9" />
      <circle cx="128" cy="88" r="2" fill="#00a0e9" />
      <circle cx="202" cy="88" r="2" fill="#00a0e9" />
      <circle cx="282" cy="88" r="2" fill="#00a0e9" />
      <text x="80" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="180" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Media Streaming</text>
      <text x="290" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Two-way Audio</text>
      <text x="400" y="105" textAnchor="middle" fontSize="7.5" fill="#718096">Main Network</text>
      
      <rect x="440" y="55" width="18" height="24" fill="#c53030" rx="1" />
      <text x="449" y="88" textAnchor="middle" fontSize="7" fill="#ffffff">FW</text>
      
      <rect x="520" y="15" width="190" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="615" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Client</text>
      <LaptopIcon x="550" y="45" label="PC Client" />
      <rect x="630" y="45" width="14" height="22" rx="2" fill="#2d3748" stroke="#718096" />
      <text x="637" y="78" textAnchor="middle" fontSize="7.5" fill="#718096">Mobile</text>

      {/* Cloud Network lines */}
      <line x1="490" y1="70" x2="520" y2="70" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="260" y1="125" x2="260" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="260" y1="148" x2="330" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <CloudIcon x="330" y="130" label="Private Network" />
      <line x1="415" y1="148" x2="480" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="480" y1="148" x2="480" y2="180" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="260" y1="148" x2="185" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="185" y1="148" x2="185" y2="180" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="185" cy="180" r="2.5" fill="#00a0e9" />
      <circle cx="480" cy="180" r="2.5" fill="#00a0e9" />

      {/* Branch Centers */}
      <rect x="30" y="180" width="310" height="75" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="185" y="195" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Branch Bank Surveillance Center 1</text>
      <TvWallIcon x="50" y="200" brand="LOOKMAN" />
      <MatrixDecoderIcon x="130" y="205" label="Decoder" />
      <ServerRackIcon x="180" y="202" label="Storage Server" />
      <SwitchIcon x="265" y="205" label="Switch" />

      <rect x="400" y="180" width="310" height="75" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="555" y="195" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Branch Bank Surveillance Center 2</text>
      <ServerRackIcon x="420" y="202" label="Storage Server" />
      <MatrixDecoderIcon x="495" y="205" label="Decoder" />
      <TvWallIcon x="550" y="200" brand="LOOKMAN" />
      <SwitchIcon x="640" y="205" label="Switch" />

      {/* Branch to Bottom Units lines */}
      <line x1="185" y1="255" x2="185" y2="280" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="555" y1="255" x2="555" y2="280" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="185" cy="280" r="2.5" fill="#00a0e9" />
      <circle cx="555" cy="280" r="2.5" fill="#00a0e9" />

      {/* Bottom Units */}
      <rect x="20" y="280" width="130" height="125" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="85" y="395" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Service hall</text>
      <PtzCameraIcon x="40" y="290" label="PTZ" />
      <DomeCameraIcon x="90" y="290" label="IPC" />
      <StrobeIcon x="65" y="335" label="Alarm" />

      <rect x="160" y="280" width="130" height="125" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="225" y="395" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">ATM</text>
      <circle cx="195" cy="305" r="5" fill="#1a202c" />
      <text x="195" y="322" textAnchor="middle" fontSize="7" fill="#718096">Pinhole</text>
      <BulletCameraIcon x="235" y="290" label="IPC" />
      <text x="225" y="360" textAnchor="middle" fontSize="7" fill="#718096">Microphone • Sensor</text>

      <rect x="300" y="280" width="135" height="125" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="367" y="395" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Vault</text>
      <AccessDoorIcon x="320" y="290" label="Access" />
      <StrobeIcon x="385" y="295" label="Dual Alarm" />

      <rect x="445" y="280" width="130" height="125" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="510" y="395" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Self-service bank</text>
      <BulletCameraIcon x="470" y="290" label="IPC" />
      <StrobeIcon x="525" y="295" label="Alarm" />

      <rect x="585" y="280" width="135" height="125" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="652" y="395" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Office</text>
      <DomeCameraIcon x="610" y="290" label="IPC" />
      <PtzCameraIcon x="660" y="290" label="Speed Dome" />
      <text x="652" y="360" textAnchor="middle" fontSize="7" fill="#718096">IR detector</text>
    </g>
  );
}

// ─── 4. INDUSTRIAL TOPOLOGY SVG ───
function IndustrialTopologySvg() {
  return (
    <g>
      <rect x="30" y="15" width="220" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="140" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Surroundings &amp; Alarm</text>
      <circle cx="60" cy="55" r="8" fill="#edf2f7" stroke="#718096" />
      <text x="60" y="75" textAnchor="middle" fontSize="7" fill="#718096">Smoke detector</text>
      <line x1="110" y1="40" x2="110" y2="70" stroke="#e53e3e" strokeWidth="2" strokeDasharray="2,2" />
      <text x="110" y="80" textAnchor="middle" fontSize="7" fill="#718096">Electric fence</text>
      <AlarmMainframeIcon x="165" y="40" label="Alarm mainframe" />

      <rect x="270" y="15" width="440" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="490" y="30" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">Industrial Park Surveillance Center</text>
      <ServerRackIcon x="295" y="40" label="Storage server" />
      <MatrixDecoderIcon x="365" y="42" label="Matrix" />
      <TvWallIcon x="430" y="38" brand="LOOKMAN" />
      <line x1="285" y1="85" x2="690" y2="85" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="317" cy="85" r="2" fill="#00a0e9" />
      <circle cx="383" cy="85" r="2" fill="#00a0e9" />
      <circle cx="462" cy="85" r="2" fill="#00a0e9" />
      <text x="330" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="430" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">Keyboard</text>
      <text x="530" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">Main Network</text>
      <text x="630" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">Client</text>

      {/* LAN Conduit lines */}
      <line x1="140" y1="85" x2="140" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="490" y1="85" x2="490" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="140" cy="155" r="2.5" fill="#00a0e9" />
      <circle cx="490" cy="155" r="2.5" fill="#00a0e9" />

      <rect x="20" y="155" width="700" height="12" rx="6" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1.2" />
      <text x="370" y="164" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* LAN to bottom lines */}
      <line x1="135" y1="167" x2="135" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="370" y1="167" x2="370" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="605" y1="167" x2="605" y2="245" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="135" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="370" cy="167" r="2.5" fill="#00a0e9" />
      <circle cx="605" cy="167" r="2.5" fill="#00a0e9" />

      {/* Bottom Modules */}
      <rect x="30" y="195" width="210" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="135" y="320" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Access control and patrol</text>
      <AccessDoorIcon x="60" y="215" label="Electronic lock" />
      <rect x="115" y="215" width="18" height="26" fill="#edf2f7" stroke="#a0aec0" />
      <text x="124" y="250" textAnchor="middle" fontSize="7" fill="#718096">Card reader</text>
      <AlarmMainframeIcon x="165" y="215" label="Access controller" />

      <rect x="260" y="195" width="220" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="370" y="320" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Video surveillance system</text>
      <SwitchIcon x="355" y="205" label="Switch" />
      <line x1="280" y1="238" x2="460" y2="238" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="302" cy="238" r="2" fill="#00a0e9" />
      <circle cx="367" cy="238" r="2" fill="#00a0e9" />
      <circle cx="432" cy="238" r="2" fill="#00a0e9" />
      <BulletCameraIcon x="290" y="245" label="Night Bullet" />
      <DomeCameraIcon x="355" y="245" label="Dome" />
      <PtzCameraIcon x="420" y="240" label="32X Speed Dome" />

      <rect x="500" y="195" width="210" height="135" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="605" y="320" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Weighbridge &amp; Parking</text>
      <BarrierGateIcon x="560" y="215" label="Weighbridge Barrier" />
      <text x="650" y="240" textAnchor="middle" fontSize="7.5" fill="#718096">LPR Camera</text>
      <text x="650" y="260" textAnchor="middle" fontSize="7.5" fill="#718096">Fill light</text>
    </g>
  );
}

// ─── 5. COMMUNITY TOPOLOGY SVG ───
function CommunityTopologySvg() {
  return (
    <g>
      <rect x="20" y="15" width="220" height="100" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="130" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Visual intercom system</text>
      <IntercomStationIcon x="40" y="40" label="Door Station" />
      <rect x="90" y="45" width="28" height="20" rx="1.5" fill="#edf2f7" stroke="#4a5568" />
      <text x="104" y="75" textAnchor="middle" fontSize="7" fill="#718096">Extension</text>
      <TvWallIcon x="150" y="40" brand="LOOKMAN" />

      <rect x="260" y="15" width="220" height="100" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="370" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Info issuing system</text>
      <LaptopIcon x="280" y="45" label="Client" />
      <rect x="350" y="42" width="18" height="32" rx="1" fill="#2d3748" />
      <text x="359" y="85" textAnchor="middle" fontSize="7" fill="#718096">Display screen</text>
      <rect x="420" y="45" width="14" height="22" rx="2" fill="#2d3748" />
      <text x="427" y="78" textAnchor="middle" fontSize="7.5" fill="#718096">Mobile app</text>

      <rect x="500" y="15" width="220" height="100" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="610" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Remote client</text>
      <CloudIcon x="515" y="38" label="Internet" />
      <LaptopIcon x="610" y="45" label="Homeowner PC" />
      <rect x="675" y="45" width="14" height="22" rx="2" fill="#2d3748" />
      <text x="682" y="78" textAnchor="middle" fontSize="7.5" fill="#718096">App</text>

      {/* LAN Conduit 1 */}
      <line x1="130" y1="115" x2="130" y2="130" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="370" y1="115" x2="370" y2="130" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="610" y1="115" x2="610" y2="130" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="130" cy="130" r="2.5" fill="#00a0e9" />
      <circle cx="370" cy="130" r="2.5" fill="#00a0e9" />
      <circle cx="610" cy="130" r="2.5" fill="#00a0e9" />
      <rect x="20" y="130" width="700" height="10" rx="5" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1" />
      <text x="370" y="138" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* Middle Alarm & Community Center */}
      <line x1="130" y1="140" x2="130" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="490" y1="140" x2="490" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="130" cy="140" r="2.5" fill="#00a0e9" />
      <circle cx="490" cy="140" r="2.5" fill="#00a0e9" />
      <rect x="20" y="155" width="220" height="100" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="130" y="170" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Alarm System</text>
      <circle cx="50" cy="190" r="7" fill="#edf2f7" stroke="#718096" />
      <text x="50" y="210" textAnchor="middle" fontSize="7" fill="#718096">Smoke</text>
      <line x1="95" y1="180" x2="95" y2="210" stroke="#e53e3e" strokeWidth="1.5" strokeDasharray="2,2" />
      <text x="95" y="220" textAnchor="middle" fontSize="7" fill="#718096">Fence</text>
      <AlarmMainframeIcon x="150" y="180" label="Mainframe" />

      <rect x="260" y="155" width="460" height="100" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="490" y="170" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Community Surveillance Center</text>
      <ServerRackIcon x="290" y="180" label="Storage Server" />
      <MatrixDecoderIcon x="365" y="182" label="Matrix" />
      <TvWallIcon x="430" y="178" brand="LOOKMAN" />
      <line x1="280" y1="225" x2="700" y2="225" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="312" cy="225" r="2" fill="#00a0e9" />
      <circle cx="383" cy="225" r="2" fill="#00a0e9" />
      <circle cx="462" cy="225" r="2" fill="#00a0e9" />
      <text x="330" y="242" textAnchor="middle" fontSize="7.5" fill="#718096">Auth Server</text>
      <text x="430" y="242" textAnchor="middle" fontSize="7.5" fill="#718096">Keyboard</text>
      <text x="530" y="242" textAnchor="middle" fontSize="7.5" fill="#718096">Main Network</text>
      <text x="630" y="242" textAnchor="middle" fontSize="7.5" fill="#718096">Client</text>

      {/* LAN Conduit 2 */}
      <line x1="490" y1="255" x2="490" y2="265" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="490" cy="265" r="2.5" fill="#00a0e9" />
      <rect x="20" y="265" width="700" height="10" rx="5" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1" />
      <text x="370" y="273" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* Bottom functional lines */}
      <line x1="130" y1="275" x2="130" y2="290" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="370" y1="275" x2="370" y2="290" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="610" y1="275" x2="610" y2="290" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="130" cy="275" r="2.5" fill="#00a0e9" />
      <circle cx="370" cy="275" r="2.5" fill="#00a0e9" />
      <circle cx="610" cy="275" r="2.5" fill="#00a0e9" />

      <rect x="20" y="290" width="220" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="130" y="388" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Vehicle management system</text>
      <BarrierGateIcon x="90" y="305" label="Barrier gate" />

      <rect x="260" y="290" width="220" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="370" y="388" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Video surveillance system</text>
      <SwitchIcon x="355" y="298" label="Switch" />
      <line x1="285" y1="325" x2="435" y2="325" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="307" cy="325" r="2" fill="#00a0e9" />
      <circle cx="367" cy="325" r="2" fill="#00a0e9" />
      <circle cx="427" cy="325" r="2" fill="#00a0e9" />
      <BulletCameraIcon x="295" y="335" label="Bullet" />
      <DomeCameraIcon x="355" y="335" label="Dome" />
      <PtzCameraIcon x="415" y="330" label="PTZ" />

      <rect x="500" y="290" width="220" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="610" y="388" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2d3748">Access control and patrol</text>
      <AccessDoorIcon x="530" y="305" label="Door" />
      <AlarmMainframeIcon x="610" y="305" label="Access Controller" />
    </g>
  );
}

// ─── 6. COMMERCIAL TOPOLOGY SVG ───
function CommercialTopologySvg() {
  return (
    <g>
      <rect x="30" y="20" width="460" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="260" y="35" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">Commercial Complex Central SOC</text>
      <ServerRackIcon x="60" y="45" label="Storage server" />
      <MatrixDecoderIcon x="140" y="47" label="BI Server" />
      <TvWallIcon x="210" y="42" brand="LOOKMAN" />
      <ServerRackIcon x="320" y="45" label="Tenant Matrix" />
      <line x1="50" y1="95" x2="450" y2="95" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="82" cy="95" r="2" fill="#00a0e9" />
      <circle cx="158" cy="95" r="2" fill="#00a0e9" />
      <circle cx="242" cy="95" r="2" fill="#00a0e9" />
      <text x="110" y="112" textAnchor="middle" fontSize="7.5" fill="#718096">Evacuation Audio</text>
      <text x="260" y="112" textAnchor="middle" fontSize="7.5" fill="#718096">People Counting BI</text>
      <text x="390" y="112" textAnchor="middle" fontSize="7.5" fill="#718096">Central Dispatch</text>

      <rect x="510" y="20" width="200" height="110" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="610" y="35" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Operations Client</text>
      <LaptopIcon x="540" y="50" label="Mall BI Console" />
      <PcClientIcon x="630" y="50" label="Patrol Station" />

      {/* Downward Lines from Upper Centers to LAN */}
      <line x1="260" y1="130" x2="260" y2="160" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="610" y1="130" x2="610" y2="160" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="260" cy="160" r="2.5" fill="#00a0e9" />
      <circle cx="610" cy="160" r="2.5" fill="#00a0e9" />

      <rect x="20" y="160" width="700" height="12" rx="6" fill="url(#conduitGrad)" stroke="#3182ce" strokeWidth="1.2" />
      <text x="370" y="169" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1a365d" letterSpacing="2">LAN</text>

      {/* LAN to bottom units straight lines */}
      <line x1="100" y1="172" x2="100" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="275" y1="172" x2="275" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="452" y1="172" x2="452" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="635" y1="172" x2="635" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="100" cy="172" r="2.5" fill="#00a0e9" />
      <circle cx="275" cy="172" r="2.5" fill="#00a0e9" />
      <circle cx="452" cy="172" r="2.5" fill="#00a0e9" />
      <circle cx="635" cy="172" r="2.5" fill="#00a0e9" />

      {/* Bottom Units */}
      <rect x="20" y="200" width="160" height="140" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="100" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Central Atrium</text>
      <circle cx="100" cy="245" r="14" fill="#edf2f7" stroke="#2b6cb0" strokeWidth="1.5" />
      <text x="100" y="275" textAnchor="middle" fontSize="7.5" fill="#718096">360° Panoramic 16MP</text>

      <rect x="195" y="200" width="160" height="140" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="275" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Mall Entrances</text>
      <DomeCameraIcon x="250" y="235" label="People Counting" />
      <DomeCameraIcon x="295" y="235" label="Face Turnstile" />

      <rect x="370" y="200" width="165" height="140" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="452" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Parking Garage</text>
      <BarrierGateIcon x="420" y="230" label="Parking Guidance" />

      <rect x="550" y="200" width="170" height="140" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="635" y="325" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Retail Corridors</text>
      <DomeCameraIcon x="590" y="235" label="Audio Dome" />
      <StrobeIcon x="655" y="240" label="Emergency Alert" />
    </g>
  );
}

// ─── 7. CHAIN STORE TOPOLOGY SVG ───
function ChainStoreTopologySvg() {
  return (
    <g>
      <rect x="30" y="15" width="460" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="260" y="30" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2d3748">Chain Store Cloud VMS Platform</text>
      <ServerRackIcon x="60" y="40" label="Cloud VMS Server" />
      <MatrixDecoderIcon x="140" y="42" label="POS Engine" />
      <TvWallIcon x="210" y="38" brand="LOOKMAN" />
      <ServerRackIcon x="320" y="40" label="Health Monitor" />
      <line x1="50" y1="85" x2="450" y2="85" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="82" cy="85" r="2" fill="#00a0e9" />
      <circle cx="158" cy="85" r="2" fill="#00a0e9" />
      <circle cx="242" cy="85" r="2" fill="#00a0e9" />
      <text x="110" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">POS Search</text>
      <text x="260" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">Cloud Device Uplink</text>
      <text x="390" y="102" textAnchor="middle" fontSize="7.5" fill="#718096">HQ Video Wall</text>

      <rect x="510" y="15" width="200" height="105" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="610" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#2d3748">Regional Manager</text>
      <LaptopIcon x="540" y="45" label="Store Audit PC" />
      <rect x="635" y="45" width="14" height="22" rx="2" fill="#2d3748" />
      <text x="642" y="78" textAnchor="middle" fontSize="7.5" fill="#718096">Audit App</text>

      {/* Downward connecting lines into Cloud */}
      <line x1="260" y1="120" x2="260" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="260" y1="148" x2="330" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="610" y1="120" x2="610" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="610" y1="148" x2="415" y2="148" stroke="#00a0e9" strokeWidth="1.5" />
      
      {/* Central Cloud Uplink */}
      <CloudIcon x="330" y="130" label="Cloud Uplink" />

      {/* Downward Flow Lines from Cloud to the 3 Branch Stores */}
      <line x1="372" y1="168" x2="372" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="330" y1="155" x2="135" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="135" y1="155" x2="135" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="415" y1="155" x2="605" y2="155" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="605" y1="155" x2="605" y2="200" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="135" cy="200" r="2.5" fill="#00a0e9" />
      <circle cx="372" cy="200" r="2.5" fill="#00a0e9" />
      <circle cx="605" cy="200" r="2.5" fill="#00a0e9" />

      {/* 3 Chain Branch Stores */}
      <rect x="30" y="200" width="210" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="135" y="332" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Branch Store 1 (Metro)</text>
      <SwitchIcon x="120" y="208" label="PoE Switch" />
      <line x1="50" y1="242" x2="220" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="134" y1="228" x2="134" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="67" cy="242" r="2" fill="#00a0e9" />
      <circle cx="134" cy="242" r="2" fill="#00a0e9" />
      <circle cx="195" cy="242" r="2" fill="#00a0e9" />
      <ServerRackIcon x="45" y="252" label="Mini NVR" />
      <DomeCameraIcon x="120" y="252" label="POS Cam" />
      <StrobeIcon x="180" y="255" label="Strobe Siren" />

      <rect x="265" y="200" width="210" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="370" y="332" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Branch Store 2 (Express)</text>
      <SwitchIcon x="355" y="208" label="PoE Switch" />
      <line x1="285" y1="242" x2="455" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="369" y1="228" x2="369" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="302" cy="242" r="2" fill="#00a0e9" />
      <circle cx="369" cy="242" r="2" fill="#00a0e9" />
      <circle cx="430" cy="242" r="2" fill="#00a0e9" />
      <ServerRackIcon x="280" y="252" label="Mini NVR" />
      <DomeCameraIcon x="355" y="252" label="Queue Cam" />
      <StrobeIcon x="415" y="255" label="Strobe Siren" />

      <rect x="500" y="200" width="210" height="145" rx="3" fill="#fafafa" stroke="#a0aec0" strokeWidth="1" strokeDasharray="4,3" />
      <text x="605" y="332" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#2d3748">Branch Store 3 (Plaza)</text>
      <SwitchIcon x="590" y="208" label="PoE Switch" />
      <line x1="520" y1="242" x2="690" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <line x1="604" y1="228" x2="604" y2="242" stroke="#00a0e9" strokeWidth="1.5" />
      <circle cx="537" cy="242" r="2" fill="#00a0e9" />
      <circle cx="604" cy="242" r="2" fill="#00a0e9" />
      <circle cx="665" cy="242" r="2" fill="#00a0e9" />
      <ServerRackIcon x="515" y="252" label="Mini NVR" />
      <DomeCameraIcon x="590" y="252" label="POS Cam" />
      <StrobeIcon x="650" y="255" label="Strobe Siren" />
    </g>
  );
}
