import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IdeaBox,
  RedditTalks,
  Insights,
  Poststate,
} from "../components/Index.js";

function Validate({ step: propStep }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTalks, setShowtalks] = useState(false);
  const step =
    propStep ||
    (() => {
      if (location.pathname.includes("/idea")) return 1;
      if (location.pathname.includes("/insights")) return 2;
      if (location.pathname.includes("/post-ideas")) return 3;
      return 1;
    })();

    const handleInsightsReady = () => {
    navigate('/validate/insights');
  };

  const handleShowPostsData = () => {
    navigate('/validate/post-ideas');
  };

  return (
    <>
      <div className="w-full pt-20 px-4 sm:px-8">
        {step == 1 && (
          <>
            <div className="w-full flex flex-col justify-center items-center gap-2 m-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mt-6 sm:mt-10 leading-tight">
                Is Your <span className="text-[#2DD4BF]">Idea</span>{" "}
                <br className="hidden sm:block" />
                Worth Pursuing?
              </h1>

              <p className="text-base sm:text-lg md:text-lg text-gray-600 text-center mx-auto mt-3 sm:mt-4 max-w-2xl px-4">
                Find out in seconds with AI-powered validation and actionable
                feedback
              </p>

              <IdeaBox
                showRedditTalks={() => setShowtalks(true)}
                onInsightsReady={handleInsightsReady}
              />
              {showTalks && <RedditTalks onClose={() => setShowtalks(false)} />}
            </div>
          </>
        )}

        {step == 2 && (
          <>
            <div className="p-6">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-slate-800 mb-2">
                    Market Intelligence
                  </h1>
                  <p className="text-slate-600">
                    Insights from analyzing Reddit conversations about your
                    space
                  </p>
                </div>
                <Insights showPostsData={handleShowPostsData} />
              </div>
            </div>
          </>
        )}

        {step == 3 && (
          <>
            <Poststate />
          </>
        )}
      </div>
    </>
  );
}

export default Validate;
