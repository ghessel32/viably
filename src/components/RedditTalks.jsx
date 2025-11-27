import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { SkeletonLoader } from "./Skeleton.jsx";
import getInsights from "../services/Insight.ser.js";

function RedditTalks({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = sessionStorage.getItem("redditTalks");
      if (data) {
        setPosts(JSON.parse(data));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-3/4 h-[80%] absolute bg-[#f3f3f3] rounded-xl flex flex-col">
        {/* Fixed Header */}
        <div className="shrink-0 flex flex-col items-center pt-4 pb-2 relative">
          <XCircle
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
          />
          <h1 className="font-bold underline text-2xl">
            Relevant Reddit Conversations:
          </h1>
        </div>

        {/* Scrollable Content */}
        {posts && !loading ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-3 py-4 no-scrollbar">
            {posts.map((post, index) => (
              <div
                className="w-[90%] bg-white rounded-lg p-5 group hover:outline-1 outline-[#2DD4BF] hover:shadow-lg transition-all cursor-pointer"
                key={index}
              >
                <h1 className="text-lg font-medium mb-2 group-hover:text-[#2DD4BF]">
                  {post.title}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#31c8b4] font-medium">
                    {post.subreddit}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                </div>
                <p className="text-gray-500">
                  {post.content.length > 200
                    ? post.content.slice(0, 200) + "..."
                    : post.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </div>
    </>
  );
}

export default RedditTalks;
