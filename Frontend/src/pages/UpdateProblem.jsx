import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

export default function UpdateProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  // ── Form state ──
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty]   = useState("Easy");
  const [tags, setTags]               = useState("");

  // Page state
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUserAPI());
    navigate("/");
  };

  // ── Fetch existing problem ──
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDifficulty(data.difficulty || "Easy");
        setTags(Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };
    if (problemId) fetchProblem();
  }, [problemId]);

  // ── Submit ──
  const handleUpdate = async () => {
    if (!title || !description) {
      setSubmitError("Title and Description are required.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        title,
        description,
        difficulty,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      await axiosClient.put(`/problem/update/${problemId}`, payload);
      setSubmitSuccess(true);
      setTimeout(() => navigate("/admin/update-problem"), 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-[#1c1c1e] border border-[#ffffff10] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200 resize-none";
  const labelCls = "block text-[10px] font-medium text-[#48484a] uppercase tracking-[0.08em] mb-1.5";

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
        <p className="text-[12px] text-[#48484a]">Loading problem...</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: "Inter, -apple-system, sans-serif" }}>
      <div className="bg-[#111111] border border-[#ffffff0f] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-3xl mb-4">⚠️</div>
        <p className="text-[14px] text-white font-medium mb-1">Failed to load problem</p>
        <p className="text-[12px] text-[#48484a] mb-6">{error}</p>
        <button onClick={() => navigate("/admin/update-problem")} className="px-5 py-2 bg-white text-black text-[12px] font-semibold rounded-[9px] hover:bg-[#f0f0f0] transition-colors">
          Go Back
        </button>
      </div>
    </div>
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
            <button onClick={() => navigate("/admin/update-problem")} className="text-[11px] text-[#48484a] hover:text-[#98989d] transition-colors">← Back to List</button>
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

      {/* ══ MAIN ══ */}
      <main className="max-w-4xl mx-auto px-7 py-10 w-full flex-1">

        {/* Page label */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] inline-block"></span>
            Admin · Edit Problem
          </div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">Update Problem</h1>
          <p className="text-[12px] text-[#48484a] mt-1">Edit the fields below and save your changes.</p>
        </div>

        {/* ── Form ── */}
        <div className="bg-[#111111] border border-[#ffffff0a] rounded-2xl p-6 mb-5">
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">✎</span>
            Problem Details
          </h2>

          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Problem title"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Problem description..."
                className={inputCls}
              />
            </div>

            {/* Difficulty + Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className={inputCls + " cursor-pointer"}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Tags <span className="text-[#2a2a2e] normal-case tracking-normal">(comma separated)</span></label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. array, hashmap"
                  className={inputCls}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Error / Success */}
        {submitError && (
          <div className="bg-[#ff453a0a] border border-[#ff453a25] rounded-[10px] px-4 py-3 mb-5">
            <p className="text-[12px] text-[#ff453a]">⚠ {submitError}</p>
          </div>
        )}
        {submitSuccess && (
          <div className="bg-[#32d74b0a] border border-[#32d74b25] rounded-[10px] px-4 py-3 mb-5">
            <p className="text-[12px] text-[#32d74b]">✓ Problem updated successfully! Redirecting...</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-4 pb-14">
          <button
            onClick={handleUpdate}
            disabled={submitting}
            className="px-8 py-2.5 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => navigate("/admin/update-problem")}
            className="text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
          >
            ← Cancel
          </button>
        </div>

      </main>
    </div>
  );
}
