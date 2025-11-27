import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Index.js";
import {
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowBigLeft,
} from "lucide-react";
import { authService } from "../services/Authservice";
import { fetchIdeaData } from "../services/FetchData";

export default function IdeaDetail() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ideaData, setIdeaData] = useState(null);
  const [redditPosts, setRedditPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    runOnce();
  }, [id]);

  const hasRun = useRef(false);

  const runOnce = async () => {
    if (hasRun.current) return;
    hasRun.current = true;
    await getData();
  };

  const getData = async () => {
    const idea = await fetchIdeaData(id);
    setIdeaData(idea);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const showRedditTalks = async () => {
    setLoading(true);
    const { data, error } = await authService.fetchRedditTalks(id);
    if (error) {
      console.error("Error fetching Reddit talks:", error);
      setLoading(false);
      return;
    }
    setRedditPosts(data);
    setLoading(false);
  };

  const posts = ideaData ? ideaData.posts : [];
  const subreddits = ideaData ? ideaData.subreddits : [];

  const insights = ideaData
    ? ideaData.insights
    : {
        marketDemand: [],
        painPoints: [],
        competitive: [],
      };

  const formatPoints = (arr) =>
    arr.map((point) => point.replace(/\.$/, "")).join(". ") + ".";

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-20 px-4 sm:px-8 pb-12">
      <div className="max-w-4xl mx-auto ">
        <div className="ml-2 mb-4 block md:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="underline text-teal-500 flex items-center gap-1 cursor-pointer"
          >
            <ArrowBigLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Idea Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#edefee] rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your Idea</h2>
          </div>
          <p className="text-lg text-slate-700 leading-relaxed capitalize">
            {ideaData ? ideaData.idea : "Loading..."}
          </p>
        </section>

        {/* Subreddits Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-slate-200 h-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#edefee] bg-opacity-10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Relevant Subreddits
            </h2>
          </div>
          <div className="bg-linear-to-br from-slate-100 to-slate-50 rounded-lg  flex items-center justify-center flex-wrap gap-3 px-4 h-auto">
            {subreddits.slice(0, 5).map((subreddit, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span className="text-[#2DD4BF] font-medium hover:underline cursor-pointer text-[15px]">
                  {subreddit}
                </span>
                {idx < subreddits.slice(0, 5).length - 1 && (
                  <span className="text-slate-400 m-2">•</span>
                )}
              </span>
            ))}
          </div>
        </section>

        {/* Posts Section */}
        <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-8 border border-slate-200">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#edefee] bg-opacity-10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Posts Ideas</h2>
          </div>

          {/* Slider Wrapper */}
          <div className="relative mt-4">
            {/* Left Navigation Button */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-300 shadow-lg hover:bg-slate-50 hover:border-[#2DD4BF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-[#2DD4BF]" />
            </button>

            {/* Right Navigation Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === posts.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-300 shadow-lg hover:bg-slate-50 hover:border-[#2DD4BF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[#2DD4BF]" />
            </button>

            {/* Slider Content */}
            <div className="overflow-hidden sm:px-8 lg:px-14">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {posts.map((post, index) => (
                  <div key={index} className="shrink-0 w-full px-2">
                    <article className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-[#2DD4BF] transition-colors duration-300">
                      <div className="bg-linear-to-r from-slate-100 to-teal-50 p-4 rounded-t-xl">
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600">
                            Day {index + 1}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-[#2DD4BF] transition-colors cursor-pointer">
                          {post.title}
                        </h3>
                      </div>

                      <div className="whitespace-pre-wrap font-sans text-sm sm:text-base text-slate-700 leading-relaxed p-4">
                        {post.post}
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#2DD4BF] w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Insights Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#edefee] bg-opacity-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Insights</h2>
          </div>

          {/* Market Subsection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2DD4BF] rounded-full"></span>
              Market
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {formatPoints(insights.marketDemand)}
            </p>
          </div>

          {/* Pain Points Subsection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2DD4BF] rounded-full"></span>
              Pain Points
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {formatPoints(insights.painPoints)}
            </p>
          </div>

          {/* Competition Subsection */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2DD4BF] rounded-full"></span>
              Competition
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {formatPoints(insights.competitive)}
            </p>
          </div>
        </section>

        {/* Reddit Talks Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#edefee] bg-opacity-10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#2DD4BF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Reddit Talks</h2>
          </div>
          {/* Scrollable List */}

          <div
            className="flex flex-col gap-4 overflow-y-auto pb-4 pr-2 
        scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 
        max-h-[500px]"
          >
            {redditPosts && redditPosts.length > 0 ? (
              redditPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border border-slate-200
             hover:border-[#2DD4BF] hover:shadow-md transition-all cursor-pointer w-full"
                >
                  <h1
                    className="text-lg font-semibold mb-2 line-clamp-3
                 group-hover:text-[#2DD4BF] transition-colors"
                  >
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#2DD4BF] font-semibold">
                      {post.subreddit}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-sm">
                      {post.timeAgo}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {post.content.length > 200
                      ? post.content.slice(0, 200) + "..."
                      : post.content}
                  </p>
                </div>
              ))
            ) : (
              <Button className="lg:w-1/4" onClick={showRedditTalks}>
                {loading ? (
                  <l-tailspin
                    size="20"
                    stroke="3"
                    speed="0.9"
                    color="white"
                  ></l-tailspin>
                ) : (
                  "Show Reddit Talks"
                )}
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
