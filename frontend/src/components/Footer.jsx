import React, { useState, useEffect, useRef } from 'react';

export default function Footer({ onSelectCategory, onOpenContact, onOpenAdmin }) {
  const [isShining, setIsShining] = useState(false);
  const [shineKey, setShineKey] = useState(0);
  const footerLogoRef = useRef(null);

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
        // Sparse random delay: 15s to 30s (fewer times & randomly)
        const nextDelay = Math.floor(Math.random() * 15000) + 15000;
        timeoutId = setTimeout(triggerShine, nextDelay);
      }, 2400);
    };

    // Trigger red gradient shine when the footer scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(triggerShine, 300);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (footerLogoRef.current) {
      observer.observe(footerLogoRef.current);
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(animTimeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="footer-section w-full">
      <div className="footer-shell w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-2">
        <div className="footer-container">

          {/* ── Main 4-Column Content Grid ── */}
          <div className="footer-content">

            {/* Col 1 — Brand Anchor & Socials */}
            <div className="footer-col footer-col-brand">
              <div className="footer-logo-wrap">
                <div
                  ref={footerLogoRef}
                  onClick={() => onSelectCategory && onSelectCategory('home')}
                  className="relative inline-flex items-center justify-center cursor-pointer group select-none transition-transform duration-300 hover:scale-[1.03]"
                  title="Lookman - Channeling Growth"
                >
                  {/* Authentic White Logo Image */}
                  <img
                    src="/lookman_logo_white.png"
                    alt="Lookman Channeling Growth"
                    className="h-11 sm:h-12 w-auto object-contain block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                  />

                  {/* Glass Shine Sheen Effect in Red Double Gradient (appears on view & randomly fewer times) */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-10 overflow-hidden footer-logo-glass-shine-mask"
                    aria-hidden="true"
                  >
                    <div 
                      key={shineKey}
                      className={`footer-logo-glass-shine-beam ${isShining ? 'is-shining' : ''}`} 
                    />
                  </div>
                </div>
              </div>
              <p className="footer-brand-desc">
                Your partner in finding the right CCTV Solutions
              </p>
              <div className="footer-social-row">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-btn"
                  aria-label="Facebook"
                  title="Follow us on Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-btn"
                  aria-label="X (Twitter)"
                  title="Follow us on X"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/lookman_distribution/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label="Instagram"
                  title="Follow us on Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-heading">
                <span className="footer-heading-accent" />
                Quick Links
              </h4>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => onSelectCategory('home')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('products')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>Products</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('about')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>About Us</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('solutions')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>Solutions</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('contact')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>Contact</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 — Products */}
            <div className="footer-col">
              <h4 className="footer-col-heading">
                <span className="footer-heading-accent" />
                Products
              </h4>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => onSelectCategory('products')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>All Products</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('HD Camera')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>HD Series</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('IP Camera')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>IP Series</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('NVR')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>NVR</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectCategory('XVR')} className="footer-link-item">
                    <span className="footer-link-arrow">›</span>
                    <span>XVR</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div className="footer-col footer-col-contact">
              <h4 className="footer-col-heading">
                <span className="footer-heading-accent" />
                Contact
              </h4>
              <ul className="footer-contact-list">
                <li>
                  <a href="tel:+914447982947" className="footer-contact-row">
                    <div className="footer-contact-icon-box">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">Phone Support</span>
                      <span className="footer-contact-val">+91 44 4798 2947</span>
                    </div>
                  </a>
                </li>

                <li>
                  <a href="mailto:contact@lookman.xyz" className="footer-contact-row">
                    <div className="footer-contact-icon-box">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">Email Inquiries</span>
                      <span className="footer-contact-val">contact@lookman.xyz</span>
                    </div>
                  </a>
                </li>

                <li className="footer-contact-row footer-contact-address">
                  <div className="footer-contact-icon-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    <span className="footer-contact-label">Office Address</span>
                    <span className="footer-contact-val">
                      Ground Floor, New No.15, Old No.3, 2nd Street Extension, 3rd Main Road CIT Nagar, Nandanam, Chennai 600035
                    </span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* ── Bottom Bar ── */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-inner">
              <span className="footer-copyright">
                © {new Date().getFullYear()} <span className="footer-brand-red font-semibold">Lookman</span>. All Rights Reserved.
              </span>
              <div className="flex items-center gap-3">
                <span className="footer-status-pill">
                  <span className="footer-status-dot" />
                  24/7 CCTV &amp; Security Support
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
