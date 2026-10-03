import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import ProblemPage from "./problemPage";
import { logoutUserAPI } from "./authSlice";
import AuthModal from '../components/authModel'

function Home() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user, isAuthenticated } = useSelector((state) => state.auth);
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [problem, setProblem] = useState([]);
   const [solvedProblem, setSolvedProblem] = useState([]);
   const [filterProblem, setFilterProblem] = useState([]);
   const [currentFilter, setCurrentFilter] = useState('All');

   useEffect(() => {
      const fetchProblem = async () => {
         try {
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblem(data);
            setFilterProblem(data);
         } catch (error) {
            console.log("Problem fetch error:", error.message);
         }
      };

      const fetchSolvedProblems = async () => {
         try {
            const { data } = await axiosClient.get('/problem/problemSolvedByUser');
            setSolvedProblem(data);
         } catch (error) {
            console.log("Error fetching Solved problems:", error.message);
         }
      };
      
      fetchProblem();
      if (user) fetchSolvedProblems();
   }, [user]);

   const handleLogout = async () => {
      try {
         dispatch(logoutUserAPI());
         setSolvedProblem([]);
         navigate('/');
         console.log("navigate through home.jsx")
      } catch (err) {
         console.log("Logout error:", err);
      }
   };

   const onlineUsers = useMemo(() => {
      const num = Math.random() * (9 - 1) + 1;
      return Number(num.toFixed(1));
   }, []);

   const handleFilterClick = (filter) => {
      setCurrentFilter(filter);
      if (filter === 'All') {
         setFilterProblem(problem);
      } else {
         const filtered = problem.filter(p => p.difficulty === filter);
         setFilterProblem(filtered);
      }
   };

  const openProblemPage = (problemId) => {
  if (!isAuthenticated) {
    setShowAuthModal(true);
    return;
  }
  navigate(`/problem/${problemId}`);
};

   const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
         case "Easy":   return "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]";
         case "Medium": return "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]";
         case "Hard":   return "bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]";
         default:       return "bg-[#1c1c1e] text-[#98989d] border border-[#ffffff10]";
      }
   };

   const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

   return (
      <div className="min-h-screen bg-black text-[#f5f5f7] font-sans" style={{ WebkitFontSmoothing: 'antialiased' }}>

         {/* ── Navbar ── */}
         <nav className="sticky top-0 z-50 border-b border-[#ffffff0f]"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
            <div className="max-w-5xl mx-auto px-7 h-[52px] flex justify-between items-center">

               {/* Logo */}
               <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                  <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                     &lt;/&gt;
                  </div>
                  <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
               </div>

               {/* Right side: Admin button + Avatar (or Login/Signup if not authenticated) */}
               <div className="flex items-center gap-2.5">

                  {isAuthenticated ? (
                     <>
                        {/* Admin Panel — only visible to admins */}
                        {user?.role === "Admin" && (
                           <button
                              onClick={() => navigate('/admin')}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-[#ffffff18] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff30] hover:bg-[#2a2a2e] transition-all duration-200"
                           >
                              <span className="text-[10px]">⚙️</span>
                              Admin Panel
                           </button>
                        )}

                        {/* Profile */}
                        <button
                           onClick={() => navigate("/profile")}
                           className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1c1e] border border-[#ffffff18] text-[11px] font-medium text-[#98989d] hover:text-white hover:border-[#ffffff30] hover:bg-[#2a2a2e] transition-all duration-200"
                        >
                           <span className="text-[10px]">👤</span>
                           Profile
                        </button>

                        {/* Avatar / Logout */}
                        <button
                           onClick={handleLogout}
                           title="Logout"
                           className="relative w-[30px] h-[30px] rounded-full bg-[#1c1c1e] border border-[#ffffff1a] flex items-center justify-center text-[12px] font-semibold text-[#98989d] transition-all duration-250 hover:border-[#ff453a55] hover:bg-[#ff453a14] focus:outline-none overflow-hidden group"
                        >
                           <span className="group-hover:opacity-0 transition-opacity duration-200">{userInitial}</span>
                           <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">↩</span>
                        </button>
                     </>
                  ) : (
                     /* Not authenticated — single Login/Signup trigger */
                     <button
                        onClick={() => setShowAuthModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-semibold hover:bg-[#e5e5e5] transition-all duration-200"
                     >
                        Login / Signup
                     </button>
                  )}

               </div>
            </div>
         </nav>

         {/* ── Main ── */}
         <main className="max-w-5xl mx-auto px-7 py-14">

            {/* Status pill */}
            <div className="mb-10">
               <span className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
                  Practice · Build · Ship
               </span>
            </div>

            {/* ── 3 Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 mb-14"
                 style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>

               {/* Run */}
               <div className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">⚡</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Run</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Execute code instantly across 20+ languages with zero setup.
                  </p>
                  <button className="text-[#48484a] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#98989d] border-none bg-none">
                     Try it now
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 inline-block">→</span>
                  </button>
               </div>

               {/* Debug */}
               <div className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">🔬</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Debug</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Pinpoint and resolve bugs fast with our intelligent debugger.
                  </p>
                  <button className="text-[#48484a] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#98989d] border-none bg-none">
                     Start debugging
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 inline-block">→</span>
                  </button>
               </div>

               {/* Submit */}
               <div className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">✦</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Submit</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Submit solutions and receive instant runtime & memory feedback.
                  </p>
                  <button className="text-[#48484a] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#98989d] border-none bg-none">
                     View submissions
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 inline-block">→</span>
                  </button>
               </div>
            </div>

            {/* ── Problems Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
               <div className="flex items-baseline gap-2.5">
                  <h2 className="text-[16px] font-semibold text-white tracking-tight">Problems</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#1c1c1e] text-[#48484a]">
                     {filterProblem.length}
                  </span>
               </div>

               {/* Filter Buttons */}
               <div className="flex gap-0.5 p-[3px] bg-[#111111] rounded-[9px] border border-[#ffffff1a]">
                  {["All", "Easy", "Medium", "Hard"].map((filter) => (
                     <button
                        key={filter}
                        onClick={() => handleFilterClick(filter)}
                        className={`px-3.5 py-1 text-[12px] font-medium rounded-[6px] transition-all duration-200 ${
                           currentFilter === filter
                              ? "bg-[#1c1c1e] text-[#f5f5f7] border border-[#ffffff1a] shadow-sm"
                              : "text-[#48484a] hover:text-[#98989d] hover:bg-[#1c1c1e]"
                        }`}
                     >
                        {filter}
                     </button>
                  ))}
               </div>
            </div>

            {/* ── Problems Table ── */}
            <div className="bg-[#111111] border border-[#ffffff0f] rounded-[14px] overflow-hidden">

               {/* Table Header */}
               <div className="grid grid-cols-12 px-5 py-2.5 border-b border-[#ffffff0a] text-[10px] uppercase tracking-[0.08em] font-medium text-[#48484a]">
                  <div className="col-span-6">Title</div>
                  <div className="col-span-3">Difficulty</div>
                  <div className="col-span-3">Tags</div>
               </div>

               {/* Rows */}
               <div>
                  {filterProblem.length > 0 ? (
                     filterProblem.map((problem) => (
                        <div
                           onClick={() => openProblemPage(problem._id)} 
                           key={problem._id}
                           className="grid grid-cols-12 items-center px-5 py-3 border-b border-[#ffffff08] last:border-b-0 hover:bg-[#161616] transition-colors duration-150 cursor-pointer group"
                        >
                           <div className="col-span-6 pr-4">
                              <h3 onClick={() => openProblemPage(problem._id)}
                              className="text-[#98989d] text-[13.5px] font-[450] group-hover:text-[#f5f5f7] transition-colors duration-200">
                                 
                                 {problem.title}
                              </h3>
                           </div>
                           <div className="col-span-3">
                              <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                                 {problem.difficulty}
                              </span>
                           </div>
                           <div className="col-span-3">
                              <div className="flex flex-wrap gap-1">
                                 {Array.isArray(problem.tags) ? (
                                    problem.tags.map((tag, idx) => (
                                       <span key={idx} className="text-[11px] bg-[#1c1c1e] border border-[#ffffff0a] text-[#48484a] px-2 py-0.5 rounded-[5px] font-medium">
                                          {tag}
                                       </span>
                                    ))
                                 ) : (
                                    <span className="text-[11px] bg-[#1c1c1e] border border-[#ffffff0a] text-[#48484a] px-2 py-0.5 rounded-[5px] font-medium">
                                       {problem.tags || "No tags"}
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="px-5 py-12 text-center text-[#48484a] text-[13px]">
                        No problems found.
                     </div>
                  )}
               </div>
            </div>

            {/* ── Online Users ── */}
            <div className="flex justify-center items-center gap-2 text-[12px] text-[#48484a] mt-10">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#32d74b] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#32d74b]"></span>
               </span>
               {onlineUsers}k developers online
            </div>
         </main>

         {/* ── Footer ── */}
         <footer className="border-t border-[#ffffff0a] py-7 mt-auto">
            <div className="max-w-5xl mx-auto px-7">
               <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                  <span className="text-[12px] text-[#48484a]">© 2024 CodeIt. All rights reserved.</span>
                  <div className="flex gap-5 text-[12px] text-[#48484a]">
                     <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Terms</a>
                     <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Privacy</a>
                     <a href="#" className="hover:text-[#98989d] transition-colors duration-200">Contact</a>
                  </div>
               </div>
            </div>
         </footer>

         {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
   );
}

export default Home;