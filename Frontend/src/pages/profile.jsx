import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap');
`;

const sora = { fontFamily: "'Sora', ui-sans-serif, system-ui, sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace" };

const IconCheck = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const IconArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconArrowLeft = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const IconLogout = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const IconCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 10h18" />
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export default function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Solved problems
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [solvedLoading, setSolvedLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/getProfile');
        setData(response.data.user || response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        setSolvedLoading(true);
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data || []);
      } catch (err) {
        console.log("Solved problems fetch error:", err);
        setSolvedProblems([]);
      } finally {
        setSolvedLoading(false);
      }
    };

    fetchProfile();
    fetchSolvedProblems();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAPI()).unwrap();
      navigate("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const userInitial = data?.firstName?.charAt(0).toUpperCase() || "U";

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":   return "bg-[#F1F1ED] text-[#8B8B87]";
      case "Medium": return "bg-[#E2E2DC] text-[#4a4a47]";
      case "Hard":   return "bg-[#111111] text-white";
      default:       return "bg-[#F1F1ED] text-[#8B8B87]";
    }
  };

  const pageShell = "min-h-screen bg-[#F4F4F1] text-[#111111] flex items-center justify-center";
  const pageStyle = { ...sora, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" };

  if (loading) return (
    <div className={pageShell} style={pageStyle}>
      <style>{FONT_IMPORT}</style>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#E0E0DA] border-t-[#111111] animate-spin"></div>
        <p className="text-[12px] text-[#8B8B87]">Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={pageShell} style={pageStyle}>
      <style>{FONT_IMPORT}</style>
      <div className="bg-white border border-[#E8E8E3] rounded-[24px] p-8 max-w-sm w-full mx-4 text-center" style={{ boxShadow: "0 12px 40px rgba(17,17,17,0.06)" }}>
        <p className="text-[15px] text-[#111111] font-semibold mb-1.5">Something went wrong</p>
        <p className="text-[12.5px] text-[#8B8B87] leading-relaxed mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#0A0A0A] text-white text-[12px] font-medium rounded-full hover:bg-[#222] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!data) return (
    <div className={pageShell} style={pageStyle}>
      <style>{FONT_IMPORT}</style>
      <p className="text-[13px] text-[#8B8B87]">No profile data found.</p>
    </div>
  );

  const easy   = solvedProblems.filter(p => p.difficulty === "Easy").length;
  const medium = solvedProblems.filter(p => p.difficulty === "Medium").length;
  const hard   = solvedProblems.filter(p => p.difficulty === "Hard").length;

  const stats = [
    { label: "Total Solved", value: solvedProblems.length },
    { label: "Easy",         value: easy },
    { label: "Medium",       value: medium },
    { label: "Hard",         value: hard },
  ];

  const username = `${data?.firstName?.toLowerCase() || "user"}${data?.lastName ? `_${data.lastName.toLowerCase()}` : ""}`;

  return (
    <div
      className="min-h-screen bg-[#F4F4F1] text-[#111111] flex flex-col"
      style={pageStyle}
    >
      <style>{FONT_IMPORT}</style>

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 border-b border-[#E8E8E3]"
        style={{ background: "rgba(244,244,241,0.85)", backdropFilter: "saturate(160%) blur(14px)", WebkitBackdropFilter: "saturate(160%) blur(14px)" }}
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 h-[56px] flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div
              className="w-7 h-7 bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:-rotate-3"
              style={mono}
            >
              &lt;/&gt;
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#111111]">CodeIt</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[13px] font-medium text-[#111111]">{data?.firstName}</span>
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="group relative w-[32px] h-[32px] rounded-full bg-[#0A0A0A] border border-[#0A0A0A] flex items-center justify-center text-[12px] font-semibold text-white transition-all duration-200 hover:bg-[#2a2a2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F4F1] overflow-hidden"
            >
              <span className="transition-opacity duration-200 group-hover:opacity-0">{userInitial}</span>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <IconLogout />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-[1100px] mx-auto w-full px-5 sm:px-8 pt-8 sm:pt-12 pb-16 flex-1">

        {/* ══ PROFILE HERO CARD ══ */}
        <section
          className="bg-white rounded-[24px] sm:rounded-[30px] overflow-hidden mb-12 sm:mb-14"
          style={{ boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 18px 50px rgba(17,17,17,0.06)" }}
        >
          {/* Cover */}
          <div
            className="relative h-[140px] sm:h-[200px] overflow-hidden"
            style={{
              background:
                "radial-gradient(120% 140% at 12% 0%, #FFFFFF 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 120% at 88% 100%, #D9D9D3 0%, rgba(217,217,211,0) 60%), radial-gradient(60% 80% at 55% 30%, #ECECE7 0%, rgba(236,236,231,0) 70%), #E7E7E2",
            }}
          >
            {/* subtle grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.05) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, #000 0%, transparent 75%)",
                maskImage: "radial-gradient(ellipse at 70% 40%, #000 0%, transparent 75%)",
              }}
            ></div>
            {/* technical glyphs */}
            <div className="absolute right-5 sm:right-8 top-4 sm:top-6 text-[11px] text-[#111111]/25 select-none leading-relaxed text-right" style={mono}>
              <div>{"{ solved: " + solvedProblems.length + " }"}</div>
              <div className="hidden sm:block">{"// keep shipping"}</div>
            </div>
            <div className="absolute left-5 sm:left-8 bottom-4 text-[56px] sm:text-[84px] leading-none font-light tracking-tighter text-[#111111]/[0.05] select-none" style={mono}>
              &lt;/&gt;
            </div>
          </div>

          {/* Avatar + actions */}
          <div className="px-5 sm:px-10">
            <div className="flex items-end justify-between gap-4 -mt-[40px] sm:-mt-[50px]">
              <div
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[32px] sm:text-[40px] font-medium shrink-0 ring-[4px] ring-white"
                style={{ boxShadow: "0 8px 24px rgba(17,17,17,0.15)" }}
              >
                {userInitial}
              </div>

              <div className="flex items-center gap-2 pb-1 sm:pb-2">
                <a
                  href="#membership"
                  title="Membership"
                  aria-label="Membership"
                  className="w-10 h-10 rounded-full bg-[#F1F1ED] text-[#111111] flex items-center justify-center transition-colors duration-200 hover:bg-[#E6E6E0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30"
                >
                  <IconCard />
                </a>
                <button
                  onClick={() => navigate('/home')}
                  className="group inline-flex items-center gap-2 h-10 px-5 sm:px-6 rounded-full bg-[#0A0A0A] text-white text-[12.5px] font-medium transition-colors duration-200 hover:bg-[#2a2a2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/40 focus-visible:ring-offset-2"
                >
                  Browse Problems
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <IconArrowRight size={13} />
                  </span>
                </button>
              </div>
            </div>

            {/* Identity */}
            <div className="pt-5 pb-7 sm:pb-9">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-1">
                <h1 className="text-[24px] sm:text-[30px] font-semibold tracking-[-0.02em] leading-tight text-[#111111]">
                  {data?.firstName} {data?.lastName}
                </h1>
                <span
                  className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-[#F1F1ED] text-[#6f6f6b] text-[10px] tracking-[0.12em] uppercase"
                  style={mono}
                >
                  {data?.role || "User"}
                </span>
              </div>
              <p className="text-[13px] text-[#8B8B87] mb-1.5" style={mono}>@{username}</p>
              <p className="text-[13px] text-[#B0B0AA] break-all">
                {data?.emailId || "—"}
                {data?.age ? <span className="text-[#C9C9C3]"> &nbsp;/&nbsp; Age {data.age}</span> : null}
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-[#E8E8E3] grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-5 sm:px-8 py-5 sm:py-7 border-[#E8E8E3] ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t" : ""} sm:border-t-0 ${i > 0 ? "sm:border-l" : ""}`}
              >
                <p className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-none text-[#111111] mb-2">
                  {solvedLoading ? <span className="text-[#D5D5CF]">–</span> : s.value}
                </p>
                <p className="text-[10px] tracking-[0.14em] uppercase text-[#B0B0AA]" style={mono}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SOLVED PROBLEMS ══ */}
        <section className="mb-14 sm:mb-16">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#111111]">Solved Problems</h2>
            <span className="text-[12px] text-[#8B8B87]">{solvedProblems.length} completed</span>
          </div>

          {solvedLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 rounded-full border-2 border-[#E0E0DA] border-t-[#111111] animate-spin"></div>
            </div>
          ) : solvedProblems.length === 0 ? (
            <div
              className="bg-white border border-[#E8E8E3] rounded-[24px] px-6 py-12 sm:py-14 text-center"
              style={{ boxShadow: "0 12px 40px rgba(17,17,17,0.04)" }}
            >
              <div className="w-12 h-12 rounded-full bg-[#F1F1ED] text-[#111111] flex items-center justify-center mx-auto mb-5">
                <IconTarget />
              </div>
              <p className="text-[16px] font-semibold text-[#111111] mb-1.5">No problems solved yet</p>
              <p className="text-[13px] text-[#8B8B87] mb-6 max-w-xs mx-auto leading-relaxed">
                Start solving challenges and your progress will appear here.
              </p>
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center h-10 px-6 rounded-full bg-[#0A0A0A] text-white text-[12.5px] font-medium hover:bg-[#2a2a2a] transition-colors duration-200"
              >
                Browse Problems
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {solvedProblems.map((problem, i) => (
                <div
                  key={problem._id}
                  onClick={() => navigate(`/problem/${problem._id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/problem/${problem._id}`);
                    }
                  }}
                  className="group bg-white border border-[#E8E8E3] rounded-[16px] px-4 sm:px-6 py-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] hover:border-[#CFCFC8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/25"
                  style={{ boxShadow: "0 1px 2px rgba(17,17,17,0.03)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 10px 28px rgba(17,17,17,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(17,17,17,0.03)")}
                >
                  <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                    <span className="text-[11px] text-[#B0B0AA] w-5 shrink-0" style={mono}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#111111] truncate mb-1.5">{problem.title}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        {Array.isArray(problem.tags) && problem.tags.slice(0, 2).map((tag, j) => (
                          <span key={j} className="px-2.5 py-0.5 bg-[#F6F6F3] border border-[#EDEDE8] text-[#8B8B87] text-[10px] rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6f6f6b]">
                      <span className="w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center">
                        <IconCheck size={9} />
                      </span>
                      Solved
                    </span>
                    <span className="sm:hidden w-4 h-4 rounded-full bg-[#111111] text-white flex items-center justify-center" title="Solved">
                      <IconCheck size={9} />
                    </span>
                    <span className="text-[#B0B0AA] transition-all duration-200 group-hover:text-[#111111] group-hover:translate-x-0.5">
                      <IconArrowRight />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══ MEMBERSHIP ══ */}
        <section id="membership" className="mb-10 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#111111] mb-1.5">Membership</h2>
            <p className="text-[13px] text-[#8B8B87]">Choose the plan that matches your coding journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Starter */}
            <div
              className="bg-white border border-[#E8E8E3] rounded-[22px] p-6 sm:p-7 flex flex-col"
              style={{ boxShadow: "0 1px 2px rgba(17,17,17,0.03)" }}
            >
              <p className="text-[10px] tracking-[0.16em] uppercase text-[#8B8B87] mb-5" style={mono}>Starter</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[34px] font-semibold tracking-[-0.03em] text-[#111111]">₹199</span>
                <span className="text-[12px] text-[#B0B0AA]">/mo</span>
              </div>
              <p className="text-[12.5px] text-[#8B8B87] mb-6">Perfect for beginners.</p>
              <div className="space-y-2.5 mb-8 flex-1">
                {["100+ problems", "Basic analytics", "Email support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[#111111]"><IconCheck /></span>
                    <span className="text-[12.5px] text-[#555552]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full h-10 rounded-full bg-transparent border border-[#111111] text-[12.5px] font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-200">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div
              className="bg-[#0A0A0A] rounded-[22px] p-6 sm:p-7 flex flex-col relative"
              style={{ boxShadow: "0 18px 44px rgba(17,17,17,0.18)" }}
            >
              <span
                className="absolute top-5 right-5 inline-flex items-center h-[22px] px-2.5 rounded-full bg-white text-[#0A0A0A] text-[9px] tracking-[0.14em] uppercase font-medium"
                style={mono}
              >
                Popular
              </span>
              <p className="text-[10px] tracking-[0.16em] uppercase text-[#a1a1aa] mb-5" style={mono}>Pro</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[34px] font-semibold tracking-[-0.03em] text-white">₹499</span>
                <span className="text-[12px] text-[#71717a]">/mo</span>
              </div>
              <p className="text-[12.5px] text-[#a1a1aa] mb-6">For serious coders.</p>
              <div className="space-y-2.5 mb-8 flex-1">
                {["All problems", "Advanced analytics", "Priority support", "Contest access"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-white"><IconCheck /></span>
                    <span className="text-[12.5px] text-[#d4d4d8]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full h-10 rounded-full bg-white text-[#0A0A0A] text-[12.5px] font-medium hover:bg-[#E8E8E3] transition-colors duration-200">
                Upgrade to Pro
              </button>
            </div>

            {/* Elite */}
            <div
              className="bg-white border border-[#E8E8E3] rounded-[22px] p-6 sm:p-7 flex flex-col"
              style={{ boxShadow: "0 1px 2px rgba(17,17,17,0.03)" }}
            >
              <p className="text-[10px] tracking-[0.16em] uppercase text-[#8B8B87] mb-5" style={mono}>Elite</p>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-[34px] font-semibold tracking-[-0.03em] text-[#111111]">₹999</span>
                <span className="text-[12px] text-[#B0B0AA]">/mo</span>
              </div>
              <p className="text-[12.5px] text-[#8B8B87] mb-6">For teams & power users.</p>
              <div className="space-y-2.5 mb-8 flex-1">
                {["Everything in Pro", "Team management", "Custom contests", "Dedicated support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[#111111]"><IconCheck /></span>
                    <span className="text-[12.5px] text-[#555552]">{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full h-10 rounded-full bg-[#0A0A0A] text-white text-[12.5px] font-medium hover:bg-[#2a2a2a] transition-colors duration-200">
                Go Elite
              </button>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/home')}
            className="group inline-flex items-center gap-2 text-[12px] text-[#8B8B87] hover:text-[#111111] transition-colors duration-200 focus:outline-none focus-visible:text-[#111111]"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
              <IconArrowLeft />
            </span>
            Back to Home
          </button>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E8E8E3]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 bg-[#0A0A0A] text-white flex items-center justify-center text-[8px] rounded-[5px]"
                style={mono}
              >
                &lt;/&gt;
              </div>
              <span className="text-[12px] text-[#B0B0AA]">© 2026 CodeIt. All rights reserved.</span>
            </div>
            <div className="flex gap-5 text-[12px] text-[#B0B0AA]">
              <a href="#" className="hover:text-[#111111] transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-[#111111] transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-[#111111] transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}