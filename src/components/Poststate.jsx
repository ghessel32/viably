import {
  Calendar,
  Target,
  MessageSquare,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { generateRedditPosts, getStoredPosts } from "../services/Posts.ser.js";
import { PostLoadingSkeleton } from "./Skeleton.jsx";
import Subreddit from "./Subreddit.jsx";

export default function Poststate() {
  const [copiedDay, setCopiedDay] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [subreddits, setSubreddits] = useState([]);

  // Key points array - static data
  const keyPointsData = [
    {
      day: 1,
      keyPoints: [
        "Lead with the problem you're solving (integration headaches)",
        "Mention it's free to try (addresses price sensitivity)",
        "Use casual, non-salesy language",
        "Ask specific questions about features",
      ],
    },
    {
      day: 2,
      keyPoints: [
        "Frame as research/learning, not promotion",
        "Use 'time-saver' language (resonates better than 'efficiency')",
        "Mention privacy concerns upfront (common pain point)",
        "Be transparent about your project",
      ],
    },
    {
      day: 3,
      keyPoints: [
        "Emphasize SMB focus (gap in market for affordable solutions)",
        "Highlight transparent pricing approach",
        "Ask for honest criticism",
        "Show you've done homework (mention competitor gaps)",
      ],
    },
    {
      day: 4,
      keyPoints: [
        "Show, don't just tell (share screenshots/demo if possible)",
        "Be open about current limitations",
        "Ask technical questions about roadmap",
        "Highlight what makes you different",
      ],
    },
    {
      day: 5,
      keyPoints: [
        "Lead with value (lessons learned)",
        "Be vulnerable about challenges",
        "Invite discussion, not just promotion",
        "Connect back to community pain points",
      ],
    },
    {
      day: 6,
      keyPoints: [
        "Lead with research/insights (high-value content)",
        "Mention your project naturally at the end",
        "Use data points to build credibility",
        "Address common objections",
      ],
    },
    {
      day: 7,
      keyPoints: [
        "Show transparency (what you learned)",
        "Thank the communities",
        "Soft CTA to stay updated",
        "Continue the conversation",
      ],
    },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: cachedPosts, subreddits: cachedSubreddits } =
          getStoredPosts();

        if (cachedPosts && cachedSubreddits) {
          setPosts(cachedPosts);
          setSubreddits(cachedSubreddits);
          setLoading(false);
        } else {
          const result = await generateRedditPosts();
          setPosts(result.posts);
          setSubreddits(result.subreddits);

          sessionStorage.setItem("posts", JSON.stringify(result.posts));
          sessionStorage.setItem(
            "subreddits",
            JSON.stringify(result.subreddits)
          );
          setLoading(false);
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching posts");
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Merge key points with posts data
  const mergedPostingPlan = keyPointsData.map((keyPointItem) => {
    const postData = posts.find((post) => post.day === keyPointItem.day);
    return {
      day: keyPointItem.day,
      keyPoints: keyPointItem.keyPoints,
      title: postData?.title || "",
      postDraft: postData?.post || "",
    };
  });

  const copyPost = (day) => {
    const post = mergedPostingPlan.find((p) => p.day === day);
    if (post && post.postDraft) {
      navigator.clipboard.writeText(post.postDraft);
      setCopiedDay(day);
      setTimeout(() => setCopiedDay(null), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2 sm:mb-3">
            Your 7-Day Validation Plan
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Strategic posts designed to get real user feedback from Reddit
          </p>
        </div>

        {/* Strategy Overview */}
        <div className="rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Target className="w-8 h-8 shrink-0 mt-1 text-[#2DD4BF]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                The Strategy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Days 1-3: Listen
                  </p>
                  <p className="text-sm">
                    Focus on asking questions and gathering feedback
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Days 4-5: Show
                  </p>
                  <p className="text-sm">
                    Share your solution and invite discussion
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">
                    Days 6-7: Provide Value
                  </p>
                  <p className="text-sm">Give insights and close the loop</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
            <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          </div>
        )}

        <div>
          <Subreddit subreddits={subreddits} />
        </div>

        {/* Daily Posts */}
        {loading ? (
          <PostLoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {mergedPostingPlan.map((post) => (
              <div
                key={post.day}
                className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="bg-linear-to-r from-slate-100 to-teal-50 p-4 sm:p-5 border-b-2 border-slate-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-[#2DD4BF] text-white font-bold text-lg sm:text-xl w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        {post.day}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-xs sm:text-sm font-medium text-slate-600">
                            Day {post.day}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto p-2">
                      <button
                        onClick={() => copyPost(post.day)}
                        className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#2DD4BF] text-white rounded-lg text-sm sm:text-base font-medium hover:bg-teal-600 transition-colors"
                        disabled={!post.postDraft}
                      >
                        {copiedDay === post.day ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Key Points */}
                  <div className="mb-5 sm:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-[#2DD4BF]" />
                      <h4 className="font-bold text-slate-800 text-base sm:text-lg">
                        Key Points to Include
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {post.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 sm:gap-3 text-slate-700"
                        >
                          <span className="w-1.5 h-1.5 bg-[#2DD4BF] rounded-full mt-2 shrink-0"></span>
                          <span className="text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Post Draft */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 text-base sm:text-lg">
                      Post Draft
                    </h4>
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200">
                      <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base text-slate-700 leading-relaxed">
                        {post.postDraft || "Post content loading..."}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Tips */}
        <div className="mt-8 sm:mt-10 bg-teal-50 border-2 border-teal-300 rounded-xl p-4 sm:p-6">
          <h3 className="font-bold text-teal-900 mb-3 text-base sm:text-lg">
            💡 Pro Tips
          </h3>
          <ul className="space-y-2 text-slate-700 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">•</span>
              <span>
                Post during peak hours (9-11 AM or 6-8 PM in your target
                timezone)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">•</span>
              <span>
                Respond to every comment within the first 2 hours - engagement
                matters
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">•</span>
              <span>
                Be genuine and humble - Reddit can smell promotion from miles
                away
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2DD4BF] font-bold">•</span>
              <span>
                Save all feedback in a doc - you'll find patterns after day 7
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
