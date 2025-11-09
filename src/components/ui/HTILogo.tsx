"use client";

import { Power } from "lucide-react";

interface HTILogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    circle: "w-8 h-8",
    text: "text-xs",
    gap: "gap-2",
  },
  md: {
    circle: "w-12 h-12",
    text: "text-sm",
    gap: "gap-3",
  },
  lg: {
    circle: "w-16 h-16",
    text: "text-base",
    gap: "gap-4",
  },
};

export default function HTILogo({ size = "md", showText = true, className = "" }: HTILogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center ${config.gap} ${className}`}>
      {/* Four Circles */}
      <div className={`flex items-center ${config.gap}`}>
        {/* Power Symbol Circle - Orange-Red */}
        <div className={`${config.circle} rounded-full bg-[#E67E50] flex items-center justify-center shadow-md`}>
          <Power className="w-1/2 h-1/2 text-white stroke-[3]" />
        </div>
        
        {/* H Circle - Orange */}
        <div className={`${config.circle} rounded-full bg-[#F19E3E] flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-lg">H</span>
        </div>
        
        {/* T Circle - Yellow-Orange */}
        <div className={`${config.circle} rounded-full bg-[#F5BB2D] flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-lg">T</span>
        </div>
        
        {/* I Circle - Yellow */}
        <div className={`${config.circle} rounded-full bg-[#F9D71C] flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-lg">I</span>
        </div>
      </div>

      {/* Text Below */}
      {showText && (
        <div className={`${config.text} font-bold text-hti-navy uppercase tracking-wide text-center`}>
          HUBZONE TECHNOLOGY INITIATIVE
        </div>
      )}
    </div>
  );
}

