import React, { useRef } from 'react';
import { Sparkles } from './Icons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CustomerStories() {
  const [storiesRef, isVisible] = useScrollReveal({ threshold: 0.1 });
  const scrollRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Roy Daniels",
      role: "Advisor",
      company: "VisionPro Systems",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "I recently upgraded to the VisionPro CCTV system, and it has improved the safety of my store. The clear footage, smooth performance, and easy controls make it ideal for daily use. The support staff was professional and guided me through setup. I now feel secure and satisfied with this reliable solution!",
      stars: 5,
      ratingLabel: "4 *"
    },
    {
      id: 2,
      name: "Alice Williams",
      role: "CEO & Founder",
      company: "SecureVision Corp",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote: "I recently installed the SecureVision CCTV system, and it has transformed my sense of security. The clarity, reliability, and easy setup make it an excellent choice for businesses. Their support team was outstanding and guided me through every detail. I feel confident and secure with this system in place!",
      stars: 5,
      ratingLabel: "5 *"
    },
    {
      id: 3,
      name: "Simon Cyrene",
      role: "Lead Engineer",
      company: "Apex Infra Tech",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      quote: "We're extremely satisfied with their CCTV installation service. The team ensured complete coverage and provided excellent camera quality. Their professionalism, quick support, and regular maintenance keep our premises safe 24/7. We highly recommend them for anyone looking for reliable and high-quality surveillance.",
      stars: 5,
      ratingLabel: "5 *"
    },
    {
      id: 4,
      name: "Ananya Deshmukh",
      role: "Facility Director",
      company: "Vanguard Commercial",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      quote: "We deployed 64 Lookman IP cameras across our commercial park. The 360 PTZ speed domes and instant mobile app alerts transformed our facility management with zero false alarms and 4K clarity.",
      stars: 5,
      ratingLabel: "5 *"
    },
    {
      id: 5,
      name: "Vikramaditya Rao",
      role: "Security Chief",
      company: "State Financial Bank",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      quote: "Compliance and encrypted RAID storage were critical for our bank vault monitoring. Lookman delivered robust hardware with 99.9% uptime reliability and responsive customer support.",
      stars: 5,
      ratingLabel: "5 *"
    }
  ];

  const scrollUp = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: -240, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 240, behavior: 'smooth' });
    }
  };

  return (
    <section ref={storiesRef} className="customer-stories-section bg-[#f5f6f9] border-b border-[#eaecf0] relative overflow-hidden">
      <div className="w-full max-w-[2000px] mx-auto wide-2000-flush">
        
        {/* Main 2-Column Split Layout: Left Info & Controls | Right Vertical Scrollable Reviews Stack (matching Image 2.jpeg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 overflow-hidden">
          
          {/* Left Column (~42%): Section Info, Rating Stars, Customer Pill (Top-aligned with first review card) */}
          <div className={`lg:col-span-5 flex flex-col items-start pt-2 ${isVisible ? 'anim-card-slide-left' : 'opacity-0'}`}>
            <div className="badge-red min-h-[28px] px-5 py-1.5 w-fit mb-4">
              <Sparkles size={12} />
              <span>// TESTIMONIAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12182b] leading-[1.12] tracking-tight mb-4">
              Happy <span className="bg-gradient-to-r from-[#ea0004] to-[#6a0006] bg-clip-text text-transparent">Clients,</span> <br /> Reliable Services
            </h2>

            {/* 5 Amber Stars */}
            <div className="flex items-center gap-1 text-amber-500 text-base mb-3">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>

            <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed max-w-md mb-6">
              Motivation is not an accident or something that someone else can provide. Real security builds long-term peace of mind.
            </p>

            {/* Customer Trust Pill with Avatars */}
            <div className="flex items-center gap-3.5 bg-white border border-[#eaecf0] shadow-xs px-5 py-3 rounded-full">
              <div className="flex -space-x-2.5">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Client 1" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Client 2" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Client 3" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#12182b] leading-none">1.8M+</div>
                <div className="text-[11px] text-[#6b7280] font-medium">Satisfied customers</div>
              </div>
            </div>
          </div>

          {/* Right Column (~58%): Vertical Scrollable Review Cards Stack (matching Image 2.jpeg) */}
          <div className={`lg:col-span-7 relative px-4 sm:px-0 ${isVisible ? 'anim-card-slide-right' : 'opacity-0'}`}>
            <div
              ref={scrollRef}
              className="flex flex-col gap-4 max-h-[540px] sm:max-h-[580px] overflow-y-auto scrollbar-none py-2 pr-1 scroll-smooth snap-y snap-mandatory select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#eaecf0] rounded-2xl p-5 sm:p-6 relative shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start gap-4 sm:gap-6 shrink-0 snap-start"
                >
                  {/* Left Sub-Column: Author Info */}
                  <div className="flex flex-col items-center sm:items-start shrink-0 w-full sm:w-32 border-b sm:border-b-0 sm:border-r border-[#eaecf0] pb-3 sm:pb-0 sm:pr-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md mb-2">
                      <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#162653] text-white flex items-center justify-center text-[9px] font-black border border-white">
                        a
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#12182b] text-center sm:text-left leading-tight">{rev.name}</div>
                    <div className="text-[10px] text-[#6b7280] text-center sm:text-left mb-2">{rev.role}</div>
                    <div className="text-xs font-extrabold text-[#12182b] bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                      {rev.ratingLabel}
                    </div>
                  </div>

                  {/* Right Sub-Column: Review Quote Content */}
                  <div className="flex-1 relative pr-4">
                    <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#4b5563] italic leading-relaxed font-medium">
                      "{rev.quote}"
                    </p>

                    {/* Decorative Pink Double Quote Icon Overlay */}
                    <div className="absolute -bottom-1 right-0 text-[#fecdD6]/40 font-serif text-5xl sm:text-6xl font-black select-none pointer-events-none leading-none">
                      ““
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
