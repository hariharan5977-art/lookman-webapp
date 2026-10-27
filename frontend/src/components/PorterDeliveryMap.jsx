import React from 'react';

/**
 * PorterDeliveryMap
 * Interactive & animated logistics visual featuring:
 * - Clean plain white Tata Ace delivery vehicle & Indian driver (compact in lower right, NO Porter name on truck)
 * - Large, wide illuminated glowing India map connecting all states
 * - Animated small goods vans starting from Chennai and routing to different states separately (North/Delhi, West/Mumbai, East/Kolkata, South/Bengaluru)
 * - Outward pulsing highway conduits radiating from Chennai Dispatch HQ
 * - City beacons, destination arrival pulses, and live fleet status HUD
 */
const PorterDeliveryMap = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] overflow-hidden select-none">
      <div className="absolute inset-0 w-full h-full">
        {/* 1. Base High-Tech Background Image (Plain Tata Ace, Large India Map, Indian Driver) */}
        <img
          src="/porter_delivery_tata_ace.jpg"
          alt="Tata Ace Express Delivery with All-India State Route Network"
          className="absolute inset-0 w-full h-full object-cover object-right"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Smooth left-edge fade into section background (#f8f9fc) */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent 62% via-[#f8f9fc]/40 86% to-[#f8f9fc] pointer-events-none" />

        {/* 2. Live SVG Overlay: Animated Goods Vans Routing Separately from Chennai to Different States */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1376 768"
          preserveAspectRatio="xMaxYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          {/* Glowing Filters */}
          <filter id="vanShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#000" floodOpacity="0.6" />
          </filter>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Headlight beam gradient */}
          <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#fef08a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>

          {/* Route Gradients (Radiating outward from Chennai to respective state corridors) */}
          <linearGradient id="routeGradDelhi" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea0004" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="routeGradMumbai" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea0004" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="routeGradKolkata" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea0004" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="routeGradBengaluru" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea0004" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
          </linearGradient>

          {/* ── VAN TEMPLATE 1: RED EXPRESS (Headed to Delhi NCR) ── */}
          <g id="vanDelhi" filter="url(#vanShadow)">
            <ellipse cx="0" cy="0" rx="19" ry="9.5" fill="rgba(0,0,0,0.5)" />
            <polygon points="15,-6 48,-16 48,16 15,6" fill="url(#headlightBeam)" />
            <rect x="-14" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-14" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-16" y="-9" width="19" height="18" rx="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.85" />
            <line x1="-16" y1="0" x2="3" y2="0" stroke="#ea0004" strokeWidth="1.8" />
            <rect x="-12" y="-5.5" width="8.5" height="11" rx="1.2" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" />
            <line x1="-7.5" y1="-5.5" x2="-7.5" y2="5.5" stroke="#b45309" strokeWidth="0.6" />
            <path d="M 3 -8.5 L 11 -8.5 Q 16.5 -6 17.5 -1 L 17.5 1 Q 16.5 6 11 8.5 L 3 8.5 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
            <path d="M 5 -6.5 L 11 -6.5 Q 14.5 -4 15.5 0 Q 14.5 4 11 6.5 L 5 6.5 Z" fill="#0284c7" opacity="0.95" />
            <circle cx="17" cy="-4" r="1.6" fill="#fef08a" />
            <circle cx="17" cy="4" r="1.6" fill="#fef08a" />
            <circle cx="-6" cy="0" r="3.2" fill="#ea0004">
              <animate attributeName="r" values="2.6;4.2;2.6" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="-6" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* ── VAN TEMPLATE 2: CYAN EXPRESS (Headed to Mumbai) ── */}
          <g id="vanMumbai" filter="url(#vanShadow)">
            <ellipse cx="0" cy="0" rx="19" ry="9.5" fill="rgba(0,0,0,0.5)" />
            <polygon points="15,-6 48,-16 48,16 15,6" fill="url(#headlightBeam)" />
            <rect x="-14" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-14" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-16" y="-9" width="19" height="18" rx="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.85" />
            <line x1="-16" y1="0" x2="3" y2="0" stroke="#06b6d4" strokeWidth="1.8" />
            <rect x="-12" y="-5.5" width="8.5" height="11" rx="1.2" fill="#ecfeff" stroke="#0891b2" strokeWidth="0.6" />
            <line x1="-7.5" y1="-5.5" x2="-7.5" y2="5.5" stroke="#0e7490" strokeWidth="0.6" />
            <path d="M 3 -8.5 L 11 -8.5 Q 16.5 -6 17.5 -1 L 17.5 1 Q 16.5 6 11 8.5 L 3 8.5 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
            <path d="M 5 -6.5 L 11 -6.5 Q 14.5 -4 15.5 0 Q 14.5 4 11 6.5 L 5 6.5 Z" fill="#0284c7" opacity="0.95" />
            <circle cx="17" cy="-4" r="1.6" fill="#fef08a" />
            <circle cx="17" cy="4" r="1.6" fill="#fef08a" />
            <circle cx="-6" cy="0" r="3.2" fill="#06b6d4">
              <animate attributeName="r" values="2.6;4.2;2.6" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="-6" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* ── VAN TEMPLATE 3: EMERALD EXPRESS (Headed to Kolkata) ── */}
          <g id="vanKolkata" filter="url(#vanShadow)">
            <ellipse cx="0" cy="0" rx="19" ry="9.5" fill="rgba(0,0,0,0.5)" />
            <polygon points="15,-6 48,-16 48,16 15,6" fill="url(#headlightBeam)" />
            <rect x="-14" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-14" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-16" y="-9" width="19" height="18" rx="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.85" />
            <line x1="-16" y1="0" x2="3" y2="0" stroke="#10b981" strokeWidth="1.8" />
            <rect x="-12" y="-5.5" width="8.5" height="11" rx="1.2" fill="#ecfdf5" stroke="#059669" strokeWidth="0.6" />
            <line x1="-7.5" y1="-5.5" x2="-7.5" y2="5.5" stroke="#047857" strokeWidth="0.6" />
            <path d="M 3 -8.5 L 11 -8.5 Q 16.5 -6 17.5 -1 L 17.5 1 Q 16.5 6 11 8.5 L 3 8.5 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
            <path d="M 5 -6.5 L 11 -6.5 Q 14.5 -4 15.5 0 Q 14.5 4 11 6.5 L 5 6.5 Z" fill="#0284c7" opacity="0.95" />
            <circle cx="17" cy="-4" r="1.6" fill="#fef08a" />
            <circle cx="17" cy="4" r="1.6" fill="#fef08a" />
            <circle cx="-6" cy="0" r="3.2" fill="#10b981">
              <animate attributeName="r" values="2.6;4.2;2.6" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="-6" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* ── VAN TEMPLATE 4: AMBER EXPRESS (Headed to Bengaluru) ── */}
          <g id="vanBengaluru" filter="url(#vanShadow)">
            <ellipse cx="0" cy="0" rx="19" ry="9.5" fill="rgba(0,0,0,0.5)" />
            <polygon points="15,-6 48,-16 48,16 15,6" fill="url(#headlightBeam)" />
            <rect x="-14" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="-12" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-14" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="7" y="9" width="7" height="3" rx="1.5" fill="#020617" />
            <rect x="-16" y="-9" width="19" height="18" rx="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.85" />
            <line x1="-16" y1="0" x2="3" y2="0" stroke="#f59e0b" strokeWidth="1.8" />
            <rect x="-12" y="-5.5" width="8.5" height="11" rx="1.2" fill="#fffbeb" stroke="#d97706" strokeWidth="0.6" />
            <line x1="-7.5" y1="-5.5" x2="-7.5" y2="5.5" stroke="#b45309" strokeWidth="0.6" />
            <path d="M 3 -8.5 L 11 -8.5 Q 16.5 -6 17.5 -1 L 17.5 1 Q 16.5 6 11 8.5 L 3 8.5 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="0.85" />
            <path d="M 5 -6.5 L 11 -6.5 Q 14.5 -4 15.5 0 Q 14.5 4 11 6.5 L 5 6.5 Z" fill="#0284c7" opacity="0.95" />
            <circle cx="17" cy="-4" r="1.6" fill="#fef08a" />
            <circle cx="17" cy="4" r="1.6" fill="#fef08a" />
            <circle cx="-6" cy="0" r="3.2" fill="#f59e0b">
              <animate attributeName="r" values="2.6;4.2;2.6" dur="1.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="-6" cy="0" r="1.5" fill="#ffffff" />
          </g>
        </defs>

        {/* ════════════════════════════════════════════════════════════════
            SEPARATE HIGHWAY ROUTES FROM CHENNAI TO DIFFERENT STATES
        ════════════════════════════════════════════════════════════════ */}

        {/* 1. SEPARATE ROUTE: Chennai -> Delhi NCR (North Corridor) */}
        <path
          id="routeToDelhi"
          d="M 895 530 C 875 440, 845 320, 830 205"
          fill="none"
          stroke="url(#routeGradDelhi)"
          strokeWidth="2.8"
          strokeDasharray="6 8"
          opacity="0.85"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-56"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* 2. SEPARATE ROUTE: Chennai -> Mumbai (West Corridor) */}
        <path
          id="routeToMumbai"
          d="M 895 530 C 830 500, 750 460, 700 405"
          fill="none"
          stroke="url(#routeGradMumbai)"
          strokeWidth="2.6"
          strokeDasharray="6 8"
          opacity="0.85"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-56"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* 3. SEPARATE ROUTE: Chennai -> Kolkata (East Corridor) */}
        <path
          id="routeToKolkata"
          d="M 895 530 C 940 450, 1000 395, 1055 335"
          fill="none"
          stroke="url(#routeGradKolkata)"
          strokeWidth="2.6"
          strokeDasharray="6 8"
          opacity="0.85"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-56"
            dur="2.3s"
            repeatCount="indefinite"
          />
        </path>

        {/* 4. SEPARATE ROUTE: Chennai -> Bengaluru (South Corridor) */}
        <path
          id="routeToBengaluru"
          d="M 895 530 C 860 535, 820 535, 785 530"
          fill="none"
          stroke="url(#routeGradBengaluru)"
          strokeWidth="2.6"
          strokeDasharray="6 8"
          opacity="0.9"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-56"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>

        {/* 5. SEPARATE FEEDER: Chennai -> Hyderabad (Central Corridor) */}
        <path
          d="M 895 530 C 885 495, 875 465, 865 435"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="4 6"
          opacity="0.75"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-40"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* ════════════════════════════════════════════════════════════════
            ANIMATED GOODS VANS ROUTING SEPARATELY OUTWARD FROM CHENNAI
        ════════════════════════════════════════════════════════════════ */}

        {/* ── VAN 1: Dispatches from Chennai -> Drives straight to DELHI NCR ── */}
        <g>
          <use href="#vanDelhi">
            <animateMotion
              dur="6.5s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#routeToDelhi" />
            </animateMotion>
          </use>
          {/* Smooth spawn at Chennai and arrival drop at Delhi */}
          <animate
            attributeName="opacity"
            values="0;1;1;1;0"
            keyTimes="0;0.08;0.86;0.96;1"
            dur="6.5s"
            repeatCount="indefinite"
          />
        </g>

        {/* ── VAN 2: Dispatches from Chennai -> Drives straight to MUMBAI ── */}
        <g>
          <use href="#vanMumbai">
            <animateMotion
              dur="5.5s"
              begin="-1.8s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#routeToMumbai" />
            </animateMotion>
          </use>
          <animate
            attributeName="opacity"
            values="0;1;1;1;0"
            keyTimes="0;0.1;0.84;0.95;1"
            dur="5.5s"
            begin="-1.8s"
            repeatCount="indefinite"
          />
        </g>

        {/* ── VAN 3: Dispatches from Chennai -> Drives straight to KOLKATA ── */}
        <g>
          <use href="#vanKolkata">
            <animateMotion
              dur="5.8s"
              begin="-3.6s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#routeToKolkata" />
            </animateMotion>
          </use>
          <animate
            attributeName="opacity"
            values="0;1;1;1;0"
            keyTimes="0;0.1;0.85;0.95;1"
            dur="5.8s"
            begin="-3.6s"
            repeatCount="indefinite"
          />
        </g>

        {/* ── VAN 4: Dispatches from Chennai -> Drives straight to BENGALURU ── */}
        <g>
          <use href="#vanBengaluru">
            <animateMotion
              dur="4.2s"
              begin="-2.2s"
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href="#routeToBengaluru" />
            </animateMotion>
          </use>
          <animate
            attributeName="opacity"
            values="0;1;1;1;0"
            keyTimes="0;0.12;0.82;0.94;1"
            dur="4.2s"
            begin="-2.2s"
            repeatCount="indefinite"
          />
        </g>

        {/* ════════════════════════════════════════════════════════════════
            CITY HUBS, STATE DESTINATION BEACONS & DELIVERY DROP PULSES
        ════════════════════════════════════════════════════════════════ */}

        {/* 1. CHENNAI: Origin Dispatch Master Hub */}
        <g transform="translate(895, 530)">
          {/* Multiple Radar Dispatch Rings */}
          <circle cx="0" cy="0" r="7" fill="none" stroke="#ea0004" strokeWidth="1.6" opacity="0.9">
            <animate attributeName="r" values="5;26" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.95;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="10" fill="none" stroke="#ea0004" strokeWidth="1.2" opacity="0.6">
            <animate attributeName="r" values="5;26" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="5.5" fill="#ea0004" stroke="#ffffff" strokeWidth="2" filter="url(#goldGlow)" />
          {/* Dispatch Pin Badge placed cleanly on the left of the beacon */}
          <g transform="translate(-132, 4)">
            <rect x="0" y="-10" width="126" height="20" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#ea0004" strokeWidth="1.2" />
            <circle cx="10" cy="0" r="3.5" fill="#22c55e">
              <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
            </circle>
            <text x="20" y="3.5" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="system-ui, sans-serif">
              Chennai Dispatch HQ
            </text>
          </g>
        </g>

        {/* 2. BENGALURU (Destination) */}
        <g transform="translate(785, 530)">
          <circle cx="0" cy="0" r="5" fill="none" stroke="#f59e0b" strokeWidth="1.5">
            <animate attributeName="r" values="3;18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="4.2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
          <g transform="translate(-74, 14)">
            <rect x="0" y="-8" width="68" height="16" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="9" y="3.5" fill="#e2e8f0" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Bengaluru
            </text>
          </g>
        </g>

        {/* 3. MUMBAI (Destination) */}
        <g transform="translate(700, 405)">
          <circle cx="0" cy="0" r="5" fill="none" stroke="#06b6d4" strokeWidth="1.5">
            <animate attributeName="r" values="3;18" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="4.2" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          <g transform="translate(-62, -10)">
            <rect x="0" y="-8" width="56" height="16" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#06b6d4" strokeWidth="0.8" />
            <text x="9" y="3.5" fill="#e2e8f0" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Mumbai
            </text>
          </g>
        </g>

        {/* 4. HYDERABAD (Transit Node) */}
        <g transform="translate(865, 435)">
          <circle cx="0" cy="0" r="4" fill="none" stroke="#f59e0b" strokeWidth="1.2">
            <animate attributeName="r" values="3;14" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="3.8" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.4" />
          <g transform="translate(10, -8)">
            <rect x="0" y="-8" width="66" height="16" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="0.8" />
            <text x="9" y="3.5" fill="#e2e8f0" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Hyderabad
            </text>
          </g>
        </g>

        {/* 5. KOLKATA (Destination) */}
        <g transform="translate(1055, 335)">
          <circle cx="0" cy="0" r="5" fill="none" stroke="#10b981" strokeWidth="1.5">
            <animate attributeName="r" values="3;18" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="4.2" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <g transform="translate(10, 2)">
            <rect x="0" y="-8" width="54" height="16" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#10b981" strokeWidth="0.8" />
            <text x="9" y="3.5" fill="#e2e8f0" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Kolkata
            </text>
          </g>
        </g>

        {/* 6. DELHI NCR (Destination) */}
        <g transform="translate(830, 205)">
          <circle cx="0" cy="0" r="5.5" fill="none" stroke="#38bdf8" strokeWidth="1.6">
            <animate attributeName="r" values="3;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.6" />
          <g transform="translate(-18, -20)">
            <rect x="0" y="-8" width="62" height="16" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="8" y="3.5" fill="#e2e8f0" fontSize="8.5" fontWeight="600" fontFamily="system-ui, sans-serif">
              Delhi NCR
            </text>
          </g>
        </g>
      </svg>
      </div>
    </div>
  );
};

export default PorterDeliveryMap;
