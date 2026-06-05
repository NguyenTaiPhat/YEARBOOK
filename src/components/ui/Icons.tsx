import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

function svg(size: number, className: string | undefined, children: React.ReactNode) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function Sun({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </>);
}

export function Moon({ size = 24, className }: IconProps) {
  return svg(size, className, <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
}

export function Music({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </>);
}

export function Camera({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </>);
}

export function Heart({ size = 24, className }: IconProps) {
  return svg(size, className,
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  );
}

export function HeartFilled({ size = 24, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function BookOpen({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>);
}

export function ArrowRight({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>);
}

export function CheckCircle({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </>);
}

export function ChevronDown({ size = 24, className }: IconProps) {
  return svg(size, className, <path d="m6 9 6 6 6-6" />);
}

export function ChevronLeft({ size = 24, className }: IconProps) {
  return svg(size, className, <path d="m15 18-6-6 6-6" />);
}

export function ChevronRight({ size = 24, className }: IconProps) {
  return svg(size, className, <path d="m9 18 6-6-6-6" />);
}

export function GraduationCap({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5" />
  </>);
}

export function Star({ size = 24, className }: IconProps) {
  return svg(size, className,
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  );
}

export function Coffee({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </>);
}

export function Laugh({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </>);
}

export function PenLine({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </>);
}

export function X({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>);
}

export function Download({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </>);
}

export function ZoomIn({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </>);
}

export function Send({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </>);
}

export function MessageSquareHeart({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M14.5 8a1.85 1.85 0 0 0-1.5.7A1.85 1.85 0 0 0 11.5 8a2 2 0 0 0-2 2c0 1.3 2 3 3.5 4 1.5-1 3.5-2.7 3.5-4a2 2 0 0 0-2-2Z" fill="currentColor" strokeWidth={0} />
  </>);
}

export function MessageSquare({ size = 24, className }: IconProps) {
  return svg(size, className,
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  );
}

export function Users({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>);
}

export function QrCode({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </>);
}

export function Volume2({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </>);
}

export function VolumeX({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </>);
}

export function Share2({ size = 24, className }: IconProps) {
  return svg(size, className, <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>);
}
