import React from "react";

interface EssLogoProps {
  className?: string;
  size?: number;
}

export const EssLogo: React.FC<EssLogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ess-logo-silver-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="ess-logo-green-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      {/* Left Half (E Monogram in Silver) */}
      <path
        d="M60 10 L15 36 L15 88 L60 114 L60 92 L33 76 L33 62 L60 62 L60 48 L33 48 L33 34 L60 19 Z"
        fill="url(#ess-logo-silver-grad)"
      />
      {/* Right Half (S Monogram in Green) */}
      <path
        d="M60 10 L105 36 L105 52 L78 52 L78 38 L60 28 L60 48 L87 63 L87 88 L60 104 L60 81 L87 68 L87 63 L60 48 Z"
        fill="url(#ess-logo-green-grad)"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {/* Perfect separation line */}
      <path d="M60 10 L60 114" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* High-fidelity modern pointer cursor matching the ESS logo physically */}
      <path
        d="M68 56 L83 77 L76 79 L85 95 L80 97.5 L71 81.5 L65 86 Z"
        fill="white"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
