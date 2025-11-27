import React, { useEffect, useState } from "react";
import { Button } from "./Index.js";
import { validateIdea } from "../services/Reddittalk.ser.js";
import getInsights from "../services/Insight.ser.js";
import ideaStore from "../store/store.js";
import ShinyText from "./ShinyEffect.jsx";
import { authService } from "../services/Authservice";

function IdeaBox({ showRedditTalks, onInsightsReady }) {
  const { totalIdeas } = ideaStore();
  const [ideaText, setIdeatext] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redditPosts, setRedditPosts] = useState([]);
  const [postLength, setPostLength] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem("redditTalks");
    if (savedData) {
      setData(true);
      const parsed = JSON.parse(savedData);
      setPostLength(parsed.length);
      setRedditPosts(parsed);
    }
  }, []);

  const handleIdeaValidation = async () => {
    if (totalIdeas == 2) {
      setError("Idea limit reached. You can only create up to 2 ideas.");
    } else {
      fetchData();
    }
  };

  const fetchData = async () => {
    sessionStorage.setItem("idea", ideaText);
    setLoading(true);

    try {
      const result = await validateIdea(ideaText);
      sessionStorage.setItem("redditTalks", JSON.stringify(result.posts));
      setPostLength(result.posts.length);
      setRedditPosts(result.posts);

      if (result) {
        setData(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || "An error occurred");
    }
  };

  const handleClick = async () => {
    setAnalyzing(true);
    const result = await getInsights(ideaText, redditPosts);
    if (result.success == 200) {
      setAnalyzing(false);
      onInsightsReady();
    } else {
      setAnalyzing(false);
      setError(result.error || "An error occurred while getting insights");
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center items-stretch gap-4 px-4 sm:px-6 md:px-0">
      <label htmlFor="idea" className="sr-only">
        Enter your idea
      </label>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <textarea
        id="idea"
        name="idea"
        rows={3}
        maxLength={1000}
        placeholder="Share your idea..."
        onChange={(e) => setIdeatext(e.target.value)}
        className="w-full min-h-[120px] p-3 rounded-xl border border-gray-300 bg-white/60 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-shadow resize-y text-base sm:text-lg"
        aria-label="Idea textarea"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-3">
        <p className="text-sm text-gray-500">Be concise and clear.</p>
        <Button
          onClick={() => handleIdeaValidation()}
          disabled={!ideaText.trim()}
          className="w-full sm:w-auto"
        >
          Validate
        </Button>
      </div>

      {loading && (
        <div className="w-full flex justify-center p-2">
          <l-dot-stream size="60" speed="2.5" color="#2DD4BF"></l-dot-stream>
        </div>
      )}

      {data && !loading && (
        <div
          className="w-full bg-gray-100 mt-2 rounded-xl overflow-hidden relative shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
          onClick={showRedditTalks}
        >
          <div className="absolute inset-0 bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          <div className="relative p-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Here {postLength} Reddit convos
            </p>
          </div>
        </div>
      )}
      {data && (
        <div className="w-full flex justify-center items-center">
          <Button className="w-1/4" onClick={handleClick}>
            {analyzing ? (
              <l-tailspin
                size="20"
                stroke="3"
                speed="0.9"
                color="white"
              ></l-tailspin>
            ) : (
              "Get Insights"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default IdeaBox;
