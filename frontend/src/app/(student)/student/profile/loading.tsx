import React from "react";

export default function StudentProfileLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-border pb-5">
        <div className="h-8 w-64 rounded-xl bg-muted" />
        <div className="h-4 w-96 rounded-lg bg-muted/70" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Nav */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-28 rounded-2xl bg-muted" />
          <div className="h-36 rounded-2xl bg-muted/60" />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
