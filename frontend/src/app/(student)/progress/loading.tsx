import React from "react";

export default function StudentProgressLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12 max-w-7xl mx-auto animate-pulse" aria-busy="true" aria-label="Đang tải dữ liệu tiến trình đào tạo...">
      {/* 1. Skeleton Header hồ sơ NCS */}
      <section className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-48 bg-slate-200 rounded-md" />
                <div className="h-5 w-24 bg-slate-200 rounded-md" />
                <div className="h-5 w-28 bg-slate-200 rounded-full" />
              </div>
              <div className="h-4 w-72 bg-slate-200 rounded-md" />
              <div className="flex items-center gap-4 pt-1">
                <div className="h-3.5 w-44 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-36 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-52 bg-slate-200 rounded-md" />
              </div>
            </div>
          </div>

          <div className="lg:w-72 rounded-xl bg-slate-50 border border-slate-200/80 p-4 shrink-0 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-4 w-10 bg-slate-200 rounded-md" />
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full" />
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-slate-200 rounded-md" />
              <div className="h-3 w-32 bg-slate-200 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Skeleton Timeline Stepper */}
      <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
          <div className="h-4 w-48 bg-slate-200 rounded-md" />
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-slate-200 rounded-lg" />
            <div className="w-7 h-7 bg-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-200" />
              <div className="h-3 w-14 bg-slate-200 rounded-md" />
              <div className="h-2.5 w-10 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Skeleton Milestone Cards */}
      <section className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <div className="h-5 w-44 bg-slate-200 rounded-md" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xs"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="w-11 h-11 rounded-xl bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-200 rounded-md" />
                  <div className="h-5 w-64 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="h-6 w-28 bg-slate-200 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
          </div>
        ))}
      </section>
    </div>
  );
}
