import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Vertical Lines - Blue */}
    <path d="M12 9V22" stroke="#2563EB" strokeWidth="1.6" />
    <path d="M9 9V20" stroke="#2563EB" strokeWidth="1.6" />
    <path d="M15 9V20" stroke="#2563EB" strokeWidth="1.6" />
    
    {/* Top Straight Line */}
    <path d="M6 5H18" stroke="#2563EB" strokeWidth="0.5" />

    
    {/* Inverted Triangles - Orange */}
    <path d="M10 6 L14 6 L12 9 Z" fill="#F97316" />
    <path d="M7 6 L11 6 L9 9 Z" fill="#F97316" />
    <path d="M13 6 L17 6 L15 9 Z" fill="#F97316" />
  </svg>
);
