import React, { useEffect, useState, useRef } from "react";
import Card from "../components/Card.jsx";
import Header from "../components/Header.jsx";
import { Button } from "../components/Index.js";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/Authservice.js";
import { fetchIdeaArr } from "../services/FetchData.js";
import ideaStore from "../store/store.js";

function Dashboard() {
  const { setTotalIdeas } = ideaStore();
  const navigateTo = useNavigate();
  const [userSignedIn, setUserSignedIn] = useState(null);
  const [err, setErr] = useState(null);
  const [ideasArr, setIdeasArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    runOnce();
  }, []);

  const runOnce = async () => {
    if (hasRun.current) return;
    hasRun.current = true;

    const sessionOk = await getUserSession();
    if (!sessionOk) return;

    // Clear session storage
    const storedVals = [
      "idea",
      "redditTalks",
      "insight",
      "posts",
      "idea_id",
      "subreddits",
    ];
    storedVals.forEach((key) => sessionStorage.removeItem(key));
  };

  const getUserSession = async () => {
    try {
      const { data, error } = await authService.getSession();

      if (!data?.session || error) {
        setUserSignedIn(null);
        navigateTo("/auth/login");
        return false;
      }

      setUserSignedIn(data.session);
      await checkIdeaArray(data.session.user.id);
      return true;
    } catch (error) {
      console.error("Session error:", error);
      navigateTo("/auth/login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkIdeaArray = async (id) => {
    try {
      const ideaArr = await fetchIdeaArr(id);
      if (ideaArr.length > 0) {
        setIdeasArr(ideaArr);
        setErr(null);
        setTotalIdeas(ideaArr.length);
      } else {
        setErr("No ideas found. Start by creating your first idea!");
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setErr("Failed to load ideas. Please try again.");
    }
  };

  const handleCardClick = (ideaId) => {
    navigateTo(`/idea/${ideaId}`);
  };

  const handleNewIdeaClick = () => {
    if (ideasArr.length == 2) {
      setErr("Idea limit reached. You can only create up to 2 ideas.");
      return;
    }
    navigateTo("/validate");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Main content with responsive padding */}
      <main className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-8">
        {/* Error message */}
        {err && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-slate-600 text-sm sm:text-base">{err}</p>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="max-w-7xl mx-auto mb-6 flex justify-end">
          <Button
            className="flex items-center gap-2 text-sm sm:text-base"
            onClick={handleNewIdeaClick}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">New Idea</span>
            <span className="xs:hidden">New</span>
          </Button>
        </div>

        {userSignedIn && (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-3">
            {ideasArr && <Card onClick={handleCardClick} ideas={ideasArr} />}

            {/* Add more sections here */}
            <div className="mt-8">
              {/* Your additional content sections go here */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
