import { Hash } from "lucide-react";

export default function SuggestedSubreddits({ subreddits = [] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap text-sm text-slate-600 bg-white rounded-xl shadow-lg border-2 border-slate-200 p-4 sm:p-6 my-5 ">
      <Hash className="w-4 h-4 text-[#2DD4BF]" />
      <span className="font-medium text-slate-700 mr-5">Suggested:</span>
      {subreddits.slice(0, 5).map((subreddit, idx) => (
        <span key={idx} className="inline-flex items-center gap-2">
          <span className="text-[#2DD4BF] font-medium hover:underline cursor-pointer">
            {subreddit}
          </span>
          {idx < subreddits.slice(0, 5).length - 1 && (
            <span className="text-slate-400">•</span>
          )}
        </span>
      ))}
    </div>
  );
}
