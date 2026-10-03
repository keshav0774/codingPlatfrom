import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

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

  const handleLogout = () => {
    dispatch(logoutUserAPI());
    navigate('/');
  };

  const userInitial = data?.firstName?.charAt(0).toUpperCase() || "U";

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":   return "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]";
      case "Medium": return "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]";
      case "Hard":   return "bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]";
      default:       return "bg-[#1c1c1e] text-[#98989d] border border-[#ffffff10]";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
        <p className="text-[12px] text-[#48484a]">Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div className="bg-[#111111] border border-[#ffffff0f] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="text-3xl mb-4">⚠️</div>
        <p className="text-[14px] text-white font-medium mb-1">Something went wrong</p>
        <p className="text-[12px] text-[#48484a] mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-white text-black text-[12px] font-semibold rounded-[9px] hover:bg-[#f0f0f0] transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <p className="text-[13px] text-[#48484a]">No profile data found.</p>
    </div>
  );

  const easy   = solvedProblems.filter(p => p.difficulty === "Easy").length;
  const medium = solvedProblems.filter(p => p.difficulty === "Medium").length;
  const hard   = solvedProblems.filter(p => p.difficulty === "Hard").length;

  return (
    <div
      className="min-h-screen bg-black text-[#f5f5f7] flex flex-col"
      style={{ WebkitFontSmoothing: "antialiased", fontFamily: "Inter, -apple-system, sans-serif" }}
    >

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 border-b border-[#ffffff0f]"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)" }}
      >
        <div className="max-w-6xl mx-auto px-7 h-[52px] flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              &lt;/&gt;
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-[12px] font-medium text-[#48484a] uppercase tracking-wider">{data?.firstName}</span>
            <button onClick={handleLogout} title="Logout" className="relative w-[30px] h-[30px] rounded-full bg-[#1c1c1e] border border-[#ffffff1a] flex items-center justify-center text-[12px] font-semibold text-[#98989d] transition-all duration-200 hover:border-[#ff453a55] hover:bg-[#ff453a14] focus:outline-none overflow-hidden group">
              <span className="group-hover:opacity-0 transition-opacity duration-200">{userInitial}</span>
              <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">↩</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── SPLIT LAYOUT ── */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full">

        {/* ── LEFT ── */}
        <div className="hidden lg:flex flex-col w-[38%] px-10 pt-10 pb-10 border-r border-[#ffffff08]">
          <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] w-fit mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
            Your Profile
          </div>
          <h1 className="text-[26px] font-semibold text-white leading-snug tracking-tight mb-3">
            Welcome back,<br />
            <span className="text-[#48484a]">{data?.firstName}.</span>
          </h1>
          <p className="text-[#98989d] text-[12.5px] leading-relaxed mb-8">
            CodeIt is a production-grade competitive coding platform. Run code, debug faster, and track your growth — all in one place.
          </p>
          <div className="space-y-3">
            {[
              { icon: "⚡", title: "Instant Execution",     desc: "20+ languages, zero setup." },
              { icon: "🔐", title: "Secure Auth",           desc: "JWT + Redis + bcrypt." },
              { icon: "📊", title: "Track Progress",        desc: "Submissions, streaks & stats." },
              { icon: "🛡️", title: "Role-based Access",    desc: "Separate admin & user panels." },
              { icon: "📬", title: "OTP Mail Verification", desc: "Real-time email support." },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#111111] border border-[#ffffff08] rounded-xl px-3.5 py-2.5">
                <div className="w-7 h-7 rounded-[7px] bg-[#1c1c1e] border border-[#ffffff0a] flex items-center justify-center text-[12px] shrink-0">{f.icon}</div>
                <div>
                  <p className="text-[12px] font-medium text-[#f5f5f7] leading-none mb-0.5">{f.title}</p>
                  <p className="text-[11px] text-[#48484a]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#2a2a2e] mt-auto pt-10">© 2026 CodeIt. All rights reserved.</p>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex-1 px-8 lg:px-10 py-10 overflow-y-auto">

          {/* ── Profile Card ── */}
          <div className="bg-[#111111] border border-[#ffffff0f] rounded-2xl overflow-hidden mb-8">
            <div className="px-6 pt-6 pb-5 flex items-center gap-5 border-b border-[#ffffff08]">
              <div className="w-16 h-16 rounded-xl border border-[#ffffff10] flex items-center justify-center text-[24px] font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #1c1c1e 0%, #2a2a2e 100%)' }}>
                {userInitial}
              </div>
              <div>
                <h2 className="text-[18px] font-semibold text-white tracking-tight leading-none mb-1">{data?.firstName} {data?.lastName}</h2>
                <p className="text-[12px] text-[#48484a] mb-2">@{data?.firstName?.toLowerCase()}{data?.lastName ? `_${data.lastName.toLowerCase()}` : ""}</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  data?.role === "Admin"
                    ? "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]"
                    : "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]"
                }`}>{data?.role || "User"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#ffffff08]">
              {[
                { label: "Email",     value: data?.emailId  },
                { label: "Age",       value: data?.age      },
                { label: "Role",      value: data?.role     },
                { label: "Last Name", value: data?.lastName },
              ].map((item, i) => (
                <div key={i} className="bg-[#111111] px-5 py-4">
                  <p className="text-[10px] font-medium text-[#48484a] uppercase tracking-[0.08em] mb-1.5">{item.label}</p>
                  <p className="text-[13px] text-[#f5f5f7] font-medium truncate">{item.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══ SOLVED PROBLEMS ══ */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
              Solved Problems
            </div>

            {/* Stats — Easy / Medium / Hard */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#111111] border border-[#ffffff08] rounded-[12px] px-4 py-3 text-center">
                <p className="text-[22px] font-semibold text-[#32d74b]">{easy}</p>
                <p className="text-[10px] text-[#48484a] uppercase tracking-wider mt-0.5">Easy</p>
              </div>
              <div className="bg-[#111111] border border-[#ffffff08] rounded-[12px] px-4 py-3 text-center">
                <p className="text-[22px] font-semibold text-[#ff9f0a]">{medium}</p>
                <p className="text-[10px] text-[#48484a] uppercase tracking-wider mt-0.5">Medium</p>
              </div>
              <div className="bg-[#111111] border border-[#ffffff08] rounded-[12px] px-4 py-3 text-center">
                <p className="text-[22px] font-semibold text-[#ff453a]">{hard}</p>
                <p className="text-[10px] text-[#48484a] uppercase tracking-wider mt-0.5">Hard</p>
              </div>
            </div>

            {/* List */}
            {solvedLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 rounded-full border-2 border-[#ffffff10] border-t-[#98989d] animate-spin"></div>
              </div>
            ) : solvedProblems.length === 0 ? (
              <div className="bg-[#111111] border border-[#ffffff08] rounded-[12px] px-5 py-8 text-center">
                <p className="text-2xl mb-2">🎯</p>
                <p className="text-[12px] text-[#48484a]">No problems solved yet. Start coding!</p>
                <button
                  onClick={() => navigate('/home')}
                  className="mt-4 px-4 py-1.5 bg-white text-black text-[11px] font-semibold rounded-[8px] hover:bg-[#f0f0f0] transition-colors"
                >
                  Browse Problems
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {solvedProblems.map((problem, i) => (
                  <div
                    key={problem._id}
                    onClick={() => navigate(`/problem/${problem._id}`)}
                    className="bg-[#111111] border border-[#ffffff08] rounded-[12px] px-5 py-3.5 flex items-center justify-between hover:border-[#ffffff15] cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-[#2a2a2e] font-mono w-5">{i + 1}</span>
                      <div>
                        <p className="text-[13px] font-medium text-white group-hover:text-[#f5f5f7]">{problem.title}</p>
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
                    <span className="text-[#32d74b] text-[11px] font-medium">✓ Solved</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Membership ── */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] inline-block"></span>
              Membership Plans
            </div>
            <h3 className="text-[17px] font-semibold text-white tracking-tight mb-1">Unlock your full potential.</h3>
            <p className="text-[12px] text-[#48484a]">Starting at just ₹199/month. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            <div className="bg-[#111111] p-5 flex flex-col">
              <p className="text-[10px] font-semibold text-[#48484a] uppercase tracking-widest mb-3">Starter</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-[24px] font-semibold text-white">₹199</span><span className="text-[11px] text-[#48484a]">/mo</span></div>
              <p className="text-[11px] text-[#48484a] mb-4">Perfect for beginners.</p>
              <div className="space-y-1.5 mb-5 flex-1">
                {["100+ problems", "Basic analytics", "Email support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="text-[#32d74b] text-[11px] font-bold">✓</span><span className="text-[11px] text-[#98989d]">{f}</span></div>
                ))}
              </div>
              <button className="w-full py-2 rounded-[9px] bg-[#1c1c1e] border border-[#ffffff10] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff20] transition-all duration-200">Get Started</button>
            </div>
            <div className="bg-white p-5 flex flex-col relative">
              <div className="absolute top-3 right-3"><span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span></div>
              <p className="text-[10px] font-semibold text-[#666] uppercase tracking-widest mb-3">Pro</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-[24px] font-semibold text-black">₹499</span><span className="text-[11px] text-[#999]">/mo</span></div>
              <p className="text-[11px] text-[#666] mb-4">For serious coders.</p>
              <div className="space-y-1.5 mb-5 flex-1">
                {["All problems", "Advanced analytics", "Priority support", "Contest access"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="text-black text-[11px] font-bold">✓</span><span className="text-[11px] text-[#444]">{f}</span></div>
                ))}
              </div>
              <button className="w-full py-2 rounded-[9px] bg-black text-white text-[11px] font-semibold hover:bg-[#222] transition-all duration-200">Upgrade to Pro</button>
            </div>
            <div className="bg-[#111111] p-5 flex flex-col">
              <p className="text-[10px] font-semibold text-[#48484a] uppercase tracking-widest mb-3">Elite</p>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-[24px] font-semibold text-white">₹999</span><span className="text-[11px] text-[#48484a]">/mo</span></div>
              <p className="text-[11px] text-[#48484a] mb-4">For teams & power users.</p>
              <div className="space-y-1.5 mb-5 flex-1">
                {["Everything in Pro", "Team management", "Custom contests", "Dedicated support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="text-[#ff9f0a] text-[11px] font-bold">✓</span><span className="text-[11px] text-[#98989d]">{f}</span></div>
                ))}
              </div>
              <button className="w-full py-2 rounded-[9px] bg-[#1c1c1e] border border-[#ffffff10] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff20] transition-all duration-200">Go Elite</button>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button onClick={() => navigate('/home')} className="text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200">← Back to Home</button>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#ffffff0a] py-6">
        <div className="max-w-6xl mx-auto px-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white text-black flex items-center justify-center text-[8px] font-medium rounded-[4px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt;</div>
              <span className="text-[12px] text-[#48484a]">© 2026 CodeIt. All rights reserved.</span>
            </div>
            <div className="flex gap-5 text-[12px] text-[#48484a]">
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
