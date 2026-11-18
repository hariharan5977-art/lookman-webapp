import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '914447982947';
  const message = encodeURIComponent('Hello Lookman Security, I would like to know more about your security solutions.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  const lookmanAiUrl = import.meta.env.VITE_LOOKMAN_AI_URL || '/lookman-ai/index.html';

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end gap-3 select-none pointer-events-auto"
    >
      <a
        href={lookmanAiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center border-2 border-[#d8b4fe] bg-[#100c24] text-[#d8b4fe] shadow-[0_0_4px_rgba(255,255,255,0.65),0_0_12px_rgba(167,139,250,0.9),0_0_26px_rgba(124,58,237,0.7),inset_0_0_10px_rgba(167,139,250,0.18)] hover:border-white hover:shadow-[0_0_5px_rgba(255,255,255,0.9),0_0_16px_rgba(196,181,253,1),0_0_34px_rgba(124,58,237,0.9),inset_0_0_14px_rgba(167,139,250,0.28)] rounded-full transition-all duration-300 ease-out overflow-hidden h-12 sm:h-14 p-0 focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] focus:ring-offset-2 focus:ring-offset-[#100c24] cursor-pointer"
        aria-label="Open Lookman AI"
        title="Open Lookman AI"
      >
        <span className="hidden sm:inline max-w-0 opacity-0 group-hover:max-w-[170px] group-hover:opacity-100 group-hover:pl-5 group-hover:pr-2 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden text-[15px] font-bold text-white tracking-wide select-none">
          Lookman AI
        </span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 relative z-10">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:scale-105"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
            aria-hidden="true"
          >
            <path d="M12 2.5 19 5.2v5.5c0 4.8-2.5 8.3-7 10.8-4.5-2.5-7-6-7-10.8V5.2L12 2.5Z" />
            <path d="M9.4 8.8 10.5 7.3h3l1.1 1.5" />
            <rect x="7.5" y="8.8" width="9" height="6.4" rx="1.5" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="15.1" cy="10.6" r=".4" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center border-2 border-[#86efac] bg-[#071b13] text-[#86efac] shadow-[0_0_4px_rgba(255,255,255,0.65),0_0_12px_rgba(74,222,128,0.9),0_0_26px_rgba(34,197,94,0.7),inset_0_0_10px_rgba(74,222,128,0.16)] hover:border-white hover:shadow-[0_0_5px_rgba(255,255,255,0.9),0_0_16px_rgba(134,239,172,1),0_0_34px_rgba(34,197,94,0.9),inset_0_0_14px_rgba(74,222,128,0.26)] rounded-full transition-all duration-300 ease-out overflow-hidden h-12 sm:h-14 p-0 focus:outline-none focus:ring-2 focus:ring-[#86efac] focus:ring-offset-2 focus:ring-offset-[#071b13] cursor-pointer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        {/* 'Chat with us' text smoothly expands on the left of the icon on desktop hover */}
        <span className="hidden sm:inline max-w-0 opacity-0 group-hover:max-w-[170px] group-hover:opacity-100 group-hover:pl-5 group-hover:pr-2 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden text-[15px] font-bold text-white tracking-wide select-none drop-shadow-xs">
          Chat with us
        </span>

        {/* WhatsApp Circular Icon Container: 48x48 on mobile, 56x56 on desktop */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0 relative z-10">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.3-.776.978-.952 1.178-.175.2-.35.226-.651.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.3-.019-.462.132-.612.135-.135.301-.35.451-.526.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525s-.677-1.631-.927-2.234c-.244-.587-.492-.507-.677-.516-.175-.009-.375-.011-.576-.011s-.527.075-.802.375c-.276.3-1.053 1.028-1.053 2.508s1.078 2.908 1.229 3.109c.15.2 2.122 3.24 5.14 4.545.719.31 1.28.496 1.718.636.723.23 1.381.198 1.901.12.58-.088 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.431-.075-.125-.276-.201-.576-.351zM12.04 21.784h-.002c-1.722 0-3.41-.462-4.894-1.336l-.351-.208-3.642.955.972-3.551-.228-.363c-.96-1.528-1.468-3.303-1.468-5.127 0-5.32 4.329-9.65 9.654-9.65 2.578 0 4.999 1.005 6.822 2.828 1.823 1.823 2.827 4.246 2.826 6.826 0 5.322-4.329 9.652-9.689 9.652zm8.437-18.087C18.228 1.442 15.244.343 12.04.343c-6.429 0-11.66 5.231-11.66 11.662 0 2.056.537 4.062 1.557 5.829L0 24l6.335-1.662c1.705.93 3.626 1.42 5.703 1.42h.005c6.429 0 11.662-5.231 11.662-11.662 0-3.116-1.213-6.046-3.428-8.263z" />
          </svg>
        </div>
      </a>
    </aside>
  );
}
