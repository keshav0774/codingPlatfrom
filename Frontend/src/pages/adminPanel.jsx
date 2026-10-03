


import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUserAPI } from "./authSlice";

function AdminPanel() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useSelector((state) => state.auth);

   const handleLogout = async () => {
      try {
         dispatch(logoutUserAPI());
         navigate('/');
      } catch (err) {
         console.log("Logout error:", err);
      }
   };

   const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

   return (
      <div className="min-h-screen bg-black text-[#f5f5f7] font-sans flex flex-col" style={{ WebkitFontSmoothing: 'antialiased' }}>

         {/* ── Navbar (same as Home, no Admin capsule) ── */}
         <nav className="sticky top-0 z-50 border-b border-[#ffffff0f]"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
            <div className="max-w-5xl mx-auto px-7 h-[52px] flex justify-between items-center">

               {/* Logo */}
               <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                  <div
                     className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                     style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                     &lt;/&gt;
                  </div>
                  <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
               </div>

               {/* Avatar / Logout only — no Admin capsule here */}
               <button
                  onClick={handleLogout}
                  title="Logout"
                  className="relative w-[30px] h-[30px] rounded-full bg-[#1c1c1e] border border-[#ffffff1a] flex items-center justify-center text-[12px] font-semibold text-[#98989d] transition-all duration-200 hover:border-[#ff453a55] hover:bg-[#ff453a14] focus:outline-none overflow-hidden group"
               >
                  <span className="group-hover:opacity-0 transition-opacity duration-200">{userInitial}</span>
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">↩</span>
               </button>

            </div>
         </nav>

         {/* ── Main ── */}
         <main className="max-w-5xl mx-auto px-7 py-14 flex-1 w-full">

            {/* Page label */}
            <div className="mb-10">
               <span className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] inline-block"></span>
                  Admin · Manage Problems
               </span>
            </div>

            {/* Page title */}
            <div className="mb-12">
               <h1 className="text-[28px] font-semibold text-white tracking-tight mb-2">Admin Panel</h1>
               <p className="text-[#48484a] text-[13px]">Manage problems on the CodeIt platform.</p>
            </div>

            {/* ── 3 Action Cards ── */}
            <div
               className="grid grid-cols-1 md:grid-cols-3"
               style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', gap: '1px', background: 'rgba(255,255,255,0.06)' }}
            >

               {/* Add Problem */}
               <div
                  className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden"
                  onClick={() => navigate('/admin/add-problem')}
               >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">➕</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Add Problem</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Add a new problem to the platform with full test cases, tags, and difficulty.
                  </p>
                  <button className="text-[#48484a] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#98989d] border-none bg-transparent">
                     Add new problem
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 inline-block">→</span>
                  </button>
               </div>

               {/* Update Problem */}
               <div
                  className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden"
                  onClick={() => navigate('/admin/update-problem')}
               >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">✏️</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Update Problem</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Edit and update an existing problem's content, difficulty, or test cases.
                  </p>
                  <button className="text-[#48484a] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#98989d] border-none bg-transparent">
                     Update existing problem
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 inline-block">→</span>
                  </button>
               </div>

               {/* Delete Problem */}
               <div
                  className="group bg-[#111111] p-7 cursor-pointer transition-colors duration-200 hover:bg-[#161616] relative overflow-hidden"
                  onClick={() => navigate('/admin/delete-problem')}
               >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffffff0f] to-transparent"></div>
                  <div className="text-[1.4rem] mb-4 inline-block transition-transform duration-300 group-hover:scale-110">🗑️</div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight">Delete Problem</h3>
                  <p className="text-[#98989d] text-[13px] leading-relaxed mb-5">
                     Permanently remove a problem from the platform.
                  </p>
                  <button className="text-[#ff453a80] text-[12px] font-medium flex items-center gap-1 transition-colors duration-200 group-hover:text-[#ff453a] border-none bg-transparent">
                     Delete a problem
                     <span className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 inline-block">→</span>
                  </button>
               </div>

            </div>

            {/* Back to Home */}
            <div className="mt-10 flex justify-center">
               <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
               >
                  ← Back to Home
               </button>
            </div>

         </main>

         {/* ── Footer ── */}
         <footer className="border-t border-[#ffffff0a] py-7">
            <div className="max-w-5xl mx-auto px-7">
               <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                     <div
                        className="w-5 h-5 bg-white text-black flex items-center justify-center text-[8px] font-medium rounded-[4px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                     >
                        &lt;/&gt;
                     </div>
                     <span className="text-[12px] text-[#48484a]">© 2026 CodeIt by Keshav Mishra. All rights reserved.</span>
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

export default AdminPanel;
