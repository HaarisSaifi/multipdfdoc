import React from "react";

interface MasterShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MasterShell({ children, className = "" }: MasterShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`relative bubble-card p-4 sm:p-7 lg:p-9 ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
