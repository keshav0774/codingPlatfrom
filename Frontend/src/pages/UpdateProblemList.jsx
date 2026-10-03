import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

export default function UpdateProblemList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logoutUserAPI());
    navigate("/");
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        
         const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problems");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":   return "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]";
      case "Medium": return "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]";
      case "Hard":   return "bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]";
      default:       return "bg-[#1c1c1e] text-[#98989d] border border-[#ffffff10]";
    }
  };

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-black text-[#f5f5f7] flex flex-col"
      style={{ WebkitFontSmoothing: "antialiased", fontFamily: "Inter, -apple-system, sans-serif" }}
    >

      {/* ══ NAVBAR ══ */}
      <nav
        className="sticky top-0 z-50 border-b border-[#ffffff0f]"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)" }}
      >
        <div className="max-w-4xl mx-auto px-7 h-[52px] flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/home")}>
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                 style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              &lt;/&gt;
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="text-[11px] text-[#48484a] hover:text-[#98989d] transition-colors">← Admin Panel</button>
            <button
              onClick={handleLogout}
              className="relative w-[30px] h-[30px] rounded-full bg-[#1c1c1e] border border-[#ffffff1a] flex items-center justify-center text-[12px] font-semibold text-[#98989d] transition-all duration-200 hover:border-[#ff453a55] hover:bg-[#ff453a14] focus:outline-none overflow-hidden group"
            >
              <span className="group-hover:opacity-0 transition-opacity duration-200">{userInitial}</span>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">↩</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-7 py-10 w-full flex-1">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] inline-block"></span>
            Admin · Update Problem
          </div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">Select Problem to Edit</h1>
          <p className="text-[12px] text-[#48484a] mt-1">Choose a problem from the list to update its details.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-[#ffffff0a] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff20] transition-colors duration-200"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#ff453a0a] border border-[#ff453a25] rounded-[10px] px-4 py-3 mb-5">
            <p className="text-[12px] text-[#ff453a]">⚠ {error}</p>
          </div>
        )}

        {/* Problems list */}
        {!loading && !error && (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-[#111111] border border-[#ffffff0a] rounded-2xl px-5 py-10 text-center">
                <p className="text-[12px] text-[#48484a]">No problems found.</p>
              </div>
            ) : (
              filtered.map((problem, i) => (
                <div
                  key={problem._id}
                  className="bg-[#111111] border border-[#ffffff0a] rounded-[12px] px-5 py-4 flex items-center justify-between hover:border-[#ffffff15] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-[#2a2a2e] font-mono w-6">{i + 1}</span>
                    <div>
                      <p className="text-[13px] font-medium text-white group-hover:text-[#f5f5f7] transition-colors">{problem.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        {Array.isArray(problem.tags) && problem.tags.slice(0, 2).map((tag, j) => (
                          <span key={j} className="px-2 py-0.5 bg-[#1c1c1e] border border-[#ffffff08] text-[#48484a] text-[10px] rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/update-problem/${problem._id}`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-[#1c1c1e] border border-[#ffffff10] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff25] hover:bg-[#2a2a2e] transition-all duration-200"
                  >
                    ✎ Edit
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}
