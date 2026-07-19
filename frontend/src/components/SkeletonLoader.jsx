import React from 'react';

function SkeletonBox({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const cards = Array(count).fill(0);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <SkeletonBox className="h-14 w-14 rounded-2xl flex-shrink-0" />
              <div className="flex-grow flex flex-col gap-2 pt-1">
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-4 w-28" />
                <div className="flex gap-1 mt-1">
                  {Array(5).fill(0).map((_, j) => (
                    <SkeletonBox key={j} className="h-2.5 w-2.5 rounded-full" />
                  ))}
                  <SkeletonBox className="h-2.5 w-8 ml-1" />
                </div>
              </div>
            </div>
            <SkeletonBox className="h-8 w-full" />
            <div className="border-t border-gray-100 dark:border-slate-800 pt-3 flex justify-between items-center">
              <div className="flex flex-col gap-1.5">
                <SkeletonBox className="h-2.5 w-20" />
                <SkeletonBox className="h-2.5 w-16" />
              </div>
              <SkeletonBox className="h-7 w-16 rounded-lg" />
            </div>
            <SkeletonBox className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Header */}
        <div className="flex gap-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800">
          {[2, 3, 3, 2, 2].map((w, i) => (
            <SkeletonBox key={i} className={`h-3 flex-${w}`} />
          ))}
        </div>
        {cards.map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4 rounded-xl border border-gray-100 dark:border-slate-800 items-center">
            <SkeletonBox className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-grow flex flex-col gap-1.5">
              <SkeletonBox className="h-3.5 w-32" />
              <SkeletonBox className="h-2.5 w-24" />
            </div>
            <SkeletonBox className="h-3 w-20 hidden sm:block" />
            <SkeletonBox className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile card */}
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex gap-5 items-start">
            <SkeletonBox className="h-24 w-24 rounded-2xl flex-shrink-0" />
            <div className="flex-grow flex flex-col gap-3 pt-1">
              <SkeletonBox className="h-3 w-20 rounded-full" />
              <SkeletonBox className="h-6 w-48" />
              <SkeletonBox className="h-3 w-32" />
              <div className="flex gap-4 mt-1">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-4 w-20" />
              </div>
            </div>
          </div>
          {/* About */}
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-3">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-5/6" />
            <SkeletonBox className="h-3 w-4/6" />
          </div>
          {/* Reviews */}
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-5">
            <SkeletonBox className="h-4 w-32" />
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3">
                <SkeletonBox className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-grow flex flex-col gap-2">
                  <SkeletonBox className="h-3 w-24" />
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
            <SkeletonBox className="h-8 w-28" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-5/6" />
            <SkeletonBox className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3">
            <SkeletonBox className="h-10 w-10 rounded-xl" />
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-7 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return <SkeletonBox className="h-10 w-full" />;
}
