import React, { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle, MessageSquare, Users } from "lucide-react";
import { Button } from "./Index.js";

function Insights({ showPostsData }) {
  const [insight, setInsight] = useState(null);
  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("insight") || "null");

    setInsight(stored);
  }, []);

  if (!insight) {
    return (
      <div className="p-6 text-center text-slate-500">
        No insights found. Please generate insights first.
      </div>
    );
  }

  const sections = [
    {
      title: "Market Demand",
      subtitle: "What users are actively searching for",
      icon: TrendingUp,
      data: insight.marketDemand,
    },
    {
      title: "Common Pain Points",
      subtitle: "Problems users complain about most",
      icon: AlertTriangle,
      data: insight.painPoints,
    },
    {
      title: "Competitive Gaps",
      subtitle: "What's missing in the market",
      icon: Users,
      data: insight.competitive,
    },
  ];

  return (
    <div className="space-y-6 mb-8 min-h-screen p-4 sm:p-6 md:p-8">
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <div
            key={idx}
            className="border border-slate-200 rounded-xl p-4 sm:p-6 transition-all hover:shadow-lg bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className="p-3 sm:p-4 rounded-full shrink-0 bg-[#2DD4BF] self-start sm:self-auto">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              {/* Text section */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                  {section.subtitle}
                </p>

                <ul className="space-y-2 sm:space-y-3">
                  {section.data.map((point, pointIdx) => (
                    <li
                      key={pointIdx}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <span className="bg-teal-300 w-1.5 h-1.5 rounded-full mt-2 shrink-0"></span>
                      <span className="text-slate-700 leading-relaxed text-sm sm:text-base">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center p-3 sm:p-4 mt-6">
        <Button
          onClick={showPostsData}
          className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base"
        >
          Generate Posting Plan
        </Button>
      </div>
    </div>
  );
}

export default Insights;
