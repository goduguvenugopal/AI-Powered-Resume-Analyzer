import React from "react";

interface PageLoaderProps {
  message?: string;
}

/**
 * Full-screen loader — used in ProtectedRoute, lazy page Suspense, etc.
 * Usage: <PageLoader message="Restoring session…" />
 */
const PageLoader = ({ message }: PageLoaderProps) => (
  <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
    {/* Outer glow ring */}
    <div className="relative flex items-center justify-center">
      <div className="absolute w-16 h-16 rounded-full bg-indigo-500/10 animate-ping" />
      <div className="w-12 h-12 rounded-full border-[3px] border-zinc-800 border-t-indigo-500 animate-spin" />
    </div>

    {message && (
      <p className="text-zinc-500 text-sm tracking-wide">{message}</p>
    )}
  </div>
);

export default PageLoader;