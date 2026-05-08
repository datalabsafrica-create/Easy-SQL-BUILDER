import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  noUnderline?: boolean;
  className?: string;
}

export function Tooltip({ text, children, noUnderline, className = '' }: TooltipProps) {
  return (
    <div className={`group/tooltip relative inline-flex items-center justify-center ${className}`}>
      <div className={`cursor-help inline-flex w-full ${noUnderline ? '' : 'border-b border-dashed border-slate-400'}`}>
        {children}
      </div>
      <div className="pointer-events-none absolute bottom-full mb-2 w-max max-w-[220px] opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl z-50 text-center font-normal tracking-normal normal-case break-words whitespace-pre-wrap">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
}
