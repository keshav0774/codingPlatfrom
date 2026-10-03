import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

const LANGUAGES = ["cpp", "java", "javascript", "python"];

const defaultStartCode = {
  cpp:        "// C++ Solution\n#include <bits/stdc++.h>\nusing namespace std;\n\nint solve() {\n    // Write your code here\n}",
  java:       "// Java Solution\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  javascript: "// JavaScript Solution\nfunction solve() {\n    // Write your code here\n}",
  python:     "# Python Solution\ndef solve():\n    # Write your code here\n    pass",
};

const defaultRefCode = {
  cpp:        "// C++ Reference Solution\n#include <bits/stdc++.h>\nusing namespace std;\n\nint solve() {\n    \n}",
  java:       "// Java Reference Solution\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}",
  javascript: "// JavaScript Reference Solution\nfunction solve() {\n    \n}",
  python:     "# Python Reference Solution\ndef solve():\n    pass",
};


export default function CreateProblem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  // ── Form state ──
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty]   = useState("Easy");
  const [tags, setTags]               = useState("");

  // Visible test cases
  const [visibleTestCases, setVisibleTestCases] = useState([
    { input: "", output: "", explanation: "" },
    { input: "", output: "", explanation: "" },
    { input: "", output: "", explanation: "" },
  ]);

  // Hidden test cases
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
    { input: "", output: "" },
    { input: "", output: "" },
  ]);

  // Start code per language
  const [startCode, setStartCode] = useState(defaultStartCode);

  // Reference solution per language
  const [refCode, setRefCode] = useState(defaultRefCode);

  // Active tabs
  const [startCodeTab, setStartCodeTab]   = useState("cpp");
  const [refCodeTab, setRefCodeTab]       = useState("cpp");

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUserAPI());
    navigate("/");
  };

  // ── Visible test case handlers ──
  const updateVisible = (i, field, value) => {
    const updated = [...visibleTestCases];
    updated[i][field] = value;
    setVisibleTestCases(updated);
  };
  const addVisible = () => setVisibleTestCases([...visibleTestCases, { input: "", output: "", explanation: "" }]);
  const removeVisible = (i) => setVisibleTestCases(visibleTestCases.filter((_, idx) => idx !== i));

  // ── Hidden test case handlers ──
  const updateHidden = (i, field, value) => {
    const updated = [...hiddenTestCases];
    updated[i][field] = value;
    setHiddenTestCases(updated);
  };
  const addHidden = () => setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }]);
  const removeHidden = (i) => setHiddenTestCases(hiddenTestCases.filter((_, idx) => idx !== i));

  // ── Submit ──
  const handleSubmit = async () => {
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
        visibleTestCases,
        hiddenTestCases,
        startCode: LANGUAGES.map(lang => ({ language: lang, initialCode: startCode[lang] })),
        referenceSolution: LANGUAGES.map(lang => ({ language: lang, completeCode: refCode[lang] })),
        problemCreator: user?._id
      };
     const { data  } =   await axiosClient.post("/problem/create", payload);
     console.log(data);
      setSubmitSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Shared styles ──
  const inputCls = "w-full bg-[#1c1c1e] border border-[#ffffff10] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200 resize-none";
  const labelCls = "block text-[10px] font-medium text-[#48484a] uppercase tracking-[0.08em] mb-1.5";
  const sectionCls = "bg-[#111111] border border-[#ffffff0a] rounded-2xl p-6 mb-5";

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
            <span className="hidden md:block text-[12px] font-medium text-[#48484a] uppercase tracking-wider">{user?.firstName}</span>
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
            Admin · Add Problem
          </div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">Create New Problem</h1>
          <p className="text-[12px] text-[#48484a] mt-1">Fill in all sections below to add a problem to CodeIt.</p>
        </div>

        {/* ── SECTION 1: Basic Info ── */}
        <div className={sectionCls}>
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">1</span>
            Basic Info
          </h2>
          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text"
                placeholder="e.g. Two Sum"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={5}
                placeholder="Describe the problem clearly..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Difficulty + Tags — side by side */}
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
                  placeholder="e.g. array, hashmap, greedy"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION 2: Visible Test Cases ── */}
        <div className={sectionCls}>
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">2</span>
            Visible Test Cases <span className="text-[#48484a] normal-case tracking-normal font-normal">(shown to user)</span>
          </h2>

          <div className="space-y-4">
            {visibleTestCases.map((tc, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#ffffff08] rounded-[10px] p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Example {i + 1}</span>
                  {visibleTestCases.length > 1 && (
                    <button onClick={() => removeVisible(i)} className="text-[10px] text-[#ff453a] hover:text-[#ff6b6b] transition-colors">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelCls}>Input</label>
                    <textarea rows={2} placeholder='e.g. [2,7,11,15]\n9' value={tc.input} onChange={e => updateVisible(i, "input", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Output</label>
                    <textarea rows={2} placeholder='e.g. [0,1]' value={tc.output} onChange={e => updateVisible(i, "output", e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Explanation <span className="text-[#2a2a2e] normal-case tracking-normal">(optional)</span></label>
                  <input type="text" placeholder="Explain why this output is correct..." value={tc.explanation} onChange={e => updateVisible(i, "explanation", e.target.value)} className={inputCls} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addVisible}
            className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#48484a] hover:text-[#98989d] transition-colors"
          >
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[12px]">+</span>
            Add Example
          </button>
        </div>

        {/* ── SECTION 3: Hidden Test Cases ── */}
        <div className={sectionCls}>
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">3</span>
            Hidden Test Cases <span className="text-[#48484a] normal-case tracking-normal font-normal">(used for judging)</span>
          </h2>

          <div className="space-y-3">
            {hiddenTestCases.map((tc, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#ffffff08] rounded-[10px] p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Test {i + 1}</span>
                  {hiddenTestCases.length > 1 && (
                    <button onClick={() => removeHidden(i)} className="text-[10px] text-[#ff453a] hover:text-[#ff6b6b] transition-colors">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Input</label>
                    <textarea rows={2} placeholder="Input" value={tc.input} onChange={e => updateHidden(i, "input", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Expected Output</label>
                    <textarea rows={2} placeholder="Expected Output" value={tc.output} onChange={e => updateHidden(i, "output", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addHidden}
            className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#48484a] hover:text-[#98989d] transition-colors"
          >
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[12px]">+</span>
            Add Test Case
          </button>
        </div>

        {/* ── SECTION 4: Start Code ── */}
        <div className={sectionCls}>
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">4</span>
            Start Code <span className="text-[#48484a] normal-case tracking-normal font-normal">(shown in editor)</span>
          </h2>

          {/* Language tabs */}
          <div className="flex gap-1 mb-4 bg-[#1a1a1a] border border-[#ffffff08] rounded-[10px] p-1 w-fit">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setStartCodeTab(lang)}
                className={`px-3 py-1.5 rounded-[7px] text-[11px] font-medium transition-all duration-200 ${
                  startCodeTab === lang
                    ? 'bg-white text-black'
                    : 'text-[#48484a] hover:text-[#98989d]'
                }`}
              >
                {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            rows={10}
            value={startCode[startCodeTab]}
            onChange={e => setStartCode({ ...startCode, [startCodeTab]: e.target.value })}
            className={inputCls + " font-mono text-[12px]"}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        {/* ── SECTION 5: Reference Solution ── */}
        <div className={sectionCls}>
          <h2 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#1c1c1e] border border-[#ffffff10] flex items-center justify-center text-[10px]">5</span>
            Reference Solution <span className="text-[#48484a] normal-case tracking-normal font-normal">(per language)</span>
          </h2>

          {/* Language tabs */}
          <div className="flex gap-1 mb-4 bg-[#1a1a1a] border border-[#ffffff08] rounded-[10px] p-1 w-fit">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setRefCodeTab(lang)}
                className={`px-3 py-1.5 rounded-[7px] text-[11px] font-medium transition-all duration-200 ${
                  refCodeTab === lang
                    ? 'bg-white text-black'
                    : 'text-[#48484a] hover:text-[#98989d]'
                }`}
              >
                {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            rows={10}
            value={refCode[refCodeTab]}
            onChange={e => setRefCode({ ...refCode, [refCodeTab]: e.target.value })}
            className={inputCls + " font-mono text-[12px]"}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>

        {/* ── Error / Success ── */}
        {submitError && (
          <div className="bg-[#ff453a0a] border border-[#ff453a25] rounded-[10px] px-4 py-3 mb-5">
            <p className="text-[12px] text-[#ff453a]">⚠ {submitError}</p>
          </div>
        )}
        {submitSuccess && (
          <div className="bg-[#32d74b0a] border border-[#32d74b25] rounded-[10px] px-4 py-3 mb-5">
            <p className="text-[12px] text-[#32d74b]">✓ Problem created successfully! Redirecting...</p>
          </div>
        )}

        {/* ── Submit Button ── */}
        <div className="flex items-center gap-4 pb-14">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Problem"}
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
          >
            ← Cancel
          </button>
        </div>

      </main>
    </div>
  );
}