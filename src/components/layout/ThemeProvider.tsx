import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="bg-bubble-bg text-bubble-text min-h-screen flex flex-col">{children}</div>;
}
