"use client";

import { ThemeToggle } from "./ThemeToggle";

export function LandingHeader() {
  return (
    <div className="absolute right-4 top-4">
      <ThemeToggle />
    </div>
  );
}
