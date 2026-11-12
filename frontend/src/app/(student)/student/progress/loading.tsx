import React from "react";

export default function StudentProgressLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto animate-pulse motion-reduce:animate-none" aria-busy="true" aria-label="Đang tải dữ liệu tiến trình đào tạo...">
      {/* 1. Skeleton Header hồ sơ NCS */}
      <section className="rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted shrink-0" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-48 bg-muted rounded-md" />
                <div className="h-5 w-24 bg-muted rounded-md" />
                <div className="h-5 w-28 bg-muted rounded-full" />
              </div>
              <div className="h-4 w-72 bg-muted rounded-md" />
              <div className="flex items-center gap-4 pt-1">
                <div className="h-3.5 w-44 bg-muted rounded-md" />
                <div className="h-3.5 w-36 bg-muted rounded-md" />
                <div className="h-3.5 w-52 bg-muted rounded-md" />
              </div>
            </div>
          </div>

          <div className="lg:w-72 rounded-xl bg-muted/40 p-4 shrink-0 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-muted rounded-md" />
              <div className="h-4 w-10 bg-muted rounded-md" />
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full" />
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-muted rounded-md" />
              <div className="h-3 w-32 bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Skeleton Timeline Stepper */}
      <section className="rounded-2xl bg-card border border-border p-6 shadow-2xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
          <div className="h-4 w-48 bg-muted rounded-md" />
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-muted rounded-lg" />
            <div className="w-10 h-10 bg-muted rounded-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-muted" />
              <div className="h-3 w-14 bg-muted rounded-md" />
              <div className="h-2.5 w-10 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Skeleton Milestone Cards */}
      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <div className="h-5 w-44 bg-muted rounded-md" />
          <div className="h-4 w-32 bg-muted rounded-md" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xs"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 rounded-xl bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-muted rounded-md" />
                  <div className="h-5 w-64 bg-muted rounded-md" />
                </div>
              </div>
              <div className="h-6 w-28 bg-muted rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-muted rounded-md" />
            <div className="h-12 w-full bg-muted/50 rounded-xl" />
          </div>
        ))}
      </section>
    </div>
  );
}
