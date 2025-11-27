import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center gap-3 py-4 bg-gray-50 min-h-screen">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          className="w-[90%] bg-white rounded-lg p-5 animate-pulse"
          key={item}
        >
          {/* Title skeleton */}
          <div className="mb-3">
            <div className="h-6 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-3/4 animate-shimmer bg-size-[200%_100%]"></div>
          </div>

          {/* Metadata skeleton */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-4 bg-linear-to-r from-teal-100 via-teal-50 to-teal-100 rounded w-24 animate-shimmer bg-size-[200%_100%]"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16 animate-shimmer bg-size-[200%_100%]"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-shimmer bg-size-[200%_100%]"></div>
            <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 animate-shimmer bg-size-[200%_100%]"></div>
            <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/6 animate-shimmer bg-size-[200%_100%]"></div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const PostLoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden animate-pulse"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-slate-100 to-teal-50 p-4 sm:p-5 border-b-2 border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 w-full">
                {/* Day Circle */}
                <div className="w-10 h-10 bg-slate-300 rounded-full shrink-0"></div>

                <div className="flex-1">
                  {/* Day & Subreddit */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-slate-300 rounded"></div>
                    <div className="w-12 h-3 bg-slate-300 rounded"></div>
                    <div className="w-20 h-3 bg-slate-300 rounded"></div>
                  </div>
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-300 rounded w-1/2 sm:hidden"></div>
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <div className="w-full sm:w-auto">
                <div className="h-9 bg-slate-300 rounded-lg w-full sm:w-32"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Key Points Section */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-slate-300 rounded"></div>
                <div className="h-5 w-40 bg-slate-300 rounded"></div>
              </div>
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 shrink-0"></span>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-300 rounded w-full"></div>
                      <div className="h-3 bg-slate-300 rounded w-4/5"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post Draft Section */}
            <div>
              <div className="h-5 w-24 bg-slate-300 rounded mb-3"></div>
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
                <div className="space-y-2">
                  <div className="h-3 bg-slate-300 rounded w-full"></div>
                  <div className="h-3 bg-slate-300 rounded w-11/12"></div>
                  <div className="h-3 bg-slate-300 rounded w-full"></div>
                  <div className="h-3 bg-slate-300 rounded w-10/12"></div>
                  <div className="h-3 bg-slate-300 rounded w-full"></div>
                  <div className="h-3 bg-slate-300 rounded w-9/12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { SkeletonLoader, PostLoadingSkeleton };
