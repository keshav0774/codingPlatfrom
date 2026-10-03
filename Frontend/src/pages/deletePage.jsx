import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";

function DeleteProblem() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useSelector((state) => state.auth);

   const [problems, setProblems] = useState([]);
   const [loading, setLoading] = useState(true);

   // Modal state
   const [selectedProblem, setSelectedProblem] = useState(null);
   const [password, setPassword] = useState('');
   const [deleting, setDeleting] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

   // Fetch all problems
   useEffect(() => {
      const fetchProblems = async () => {
         try {
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
         } catch (err) {
            console.log("Fetch error:", err.message);
         } finally {
            setLoading(false);
         }
      };
      fetchProblems();
   }, []);

   const handleLogout = async () => {
      try {
         dispatch(logoutUserAPI());
         navigate('/');
      } catch (err) {
         console.log("Logout error:", err);
      }
   };

   // Open password modal
   const handleProblemClick = (problem) => {
      setSelectedProblem(problem);
      setPassword('');
      setError('');
      setSuccess('');
   };

   // Close modal
   const closeModal = () => {
      setSelectedProblem(null);
      setPassword('');
      setError('');
      setSuccess('');
   };

   // Delete handler
   const handleDelete = async () => {
      if (!password.trim()) {
         setError('Please enter your password.');
         return;
      }
      setDeleting(true);
      setError('');
      try {
        console.log(password)
         await axiosClient.delete(`/problem/delete/${selectedProblem._id}`, {
            data: { password }
         });
         setSuccess('Problem deleted successfully!');
         setProblems(prev => prev.filter(p => p._id !== selectedProblem._id));
         setTimeout(() => closeModal(), 1500);
      } catch (err) {
         setError(err?.response?.data?.message || 'Incorrect password or server error.');
      } finally {
         setDeleting(false);
      }
   };

   const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
         case "Easy":   return "bg-[#32d74b1a] text-[#32d74b] border border-[#32d74b30]";
         case "Medium": return "bg-[#ff9f0a1a] text-[#ff9f0a] border border-[#ff9f0a30]";
         case "Hard":   return "bg-[#ff453a1a] text-[#ff453a] border border-[#ff453a30]";
         default:       return "bg-[#1c1c1e] text-[#98989d] border border-[#ffffff10]";
      }
   };

   return (
      <div className="min-h-screen bg-black text-[#f5f5f7] font-sans flex flex-col" style={{ WebkitFontSmoothing: 'antialiased' }}>

         {/* ── Navbar ── */}
         <nav className="sticky top-0 z-50 border-b border-[#ffffff0f]"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)' }}>
            <div className="max-w-5xl mx-auto px-7 h-[52px] flex justify-between items-center">
               <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/home')}>
                  <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                       style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                     &lt;/&gt;
                  </div>
                  <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
               </div>
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

            {/* Label */}
            <div className="mb-10">
               <span className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff453a] inline-block"></span>
                  Admin · Delete Problem
               </span>
            </div>

            {/* Title */}
            <div className="mb-10">
               <h1 className="text-[24px] font-semibold text-white tracking-tight mb-1.5">Delete a Problem</h1>
               <p className="text-[#48484a] text-[13px]">Click on any problem to delete it from the platform.</p>
            </div>

            {/* Problems Table */}
            <div className="bg-[#111111] border border-[#ffffff0f] rounded-[14px] overflow-hidden">

               {/* Table Header */}
               <div className="grid grid-cols-12 px-5 py-2.5 border-b border-[#ffffff0a] text-[10px] uppercase tracking-[0.08em] font-medium text-[#48484a]">
                  <div className="col-span-6">Title</div>
                  <div className="col-span-3">Difficulty</div>
                  <div className="col-span-3">Tags</div>
               </div>

               {/* Rows */}
               <div>
                  {loading ? (
                     <div className="px-5 py-12 text-center text-[#48484a] text-[13px]">
                        Loading problems...
                     </div>
                  ) : problems.length > 0 ? (
                     problems.map((problem) => (
                        <div
                           key={problem._id}
                           onClick={() => handleProblemClick(problem)}
                           className="grid grid-cols-12 items-center px-5 py-3 border-b border-[#ffffff08] last:border-b-0 hover:bg-[#1a0f0f] transition-colors duration-150 cursor-pointer group"
                        >
                           <div className="col-span-6 pr-4 flex items-center gap-2">
                              <h3 className="text-[#98989d] text-[13.5px] font-[450] group-hover:text-[#ff453a] transition-colors duration-200">
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

            {/* Back */}
            <div className="mt-10 flex justify-center">
               <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
               >
                  ← Back to Admin Panel
               </button>
            </div>
         </main>

         {/* ── Footer ── */}
         <footer className="border-t border-[#ffffff0a] py-7">
            <div className="max-w-5xl mx-auto px-7">
               <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-5 bg-white text-black flex items-center justify-center text-[8px] font-medium rounded-[4px]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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

         {/* ── Password Modal ── */}
         {selectedProblem && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center px-4"
               style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
               onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
               <div className="bg-[#111111] border border-[#ffffff10] rounded-2xl p-7 w-full max-w-md shadow-2xl">

                  {/* Modal Header */}
                  <div className="mb-6">
                     <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 bg-[#ff453a1a] border border-[#ff453a30] rounded-xl flex items-center justify-center text-[16px]">
                           🗑️
                        </div>
                        <button
                           onClick={closeModal}
                           className="w-7 h-7 rounded-full bg-[#1c1c1e] border border-[#ffffff0f] flex items-center justify-center text-[#48484a] hover:text-[#98989d] transition-colors text-[12px]"
                        >
                           ✕
                        </button>
                     </div>
                     <h2 className="text-[16px] font-semibold text-white tracking-tight mt-3">Delete Problem</h2>
                     <p className="text-[#48484a] text-[12px] mt-1 leading-relaxed">
                        You are about to delete{" "}
                        <span className="text-[#ff453a] font-medium">"{selectedProblem.title}"</span>.
                        This action cannot be undone.
                     </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#ffffff08] mb-6"></div>

                  {/* Password Input */}
                  <div className="mb-5">
                     <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider mb-2">
                        Confirm your password
                     </label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                        placeholder="Enter your password"
                        autoFocus
                        className="w-full bg-[#1c1c1e] border border-[#ffffff10] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200"
                     />
                     {/* Error */}
                     {error && (
                        <p className="mt-2 text-[11px] text-[#ff453a] flex items-center gap-1">
                           ⚠ {error}
                        </p>
                     )}
                     {/* Success */}
                     {success && (
                        <p className="mt-2 text-[11px] text-[#32d74b] flex items-center gap-1">
                           ✓ {success}
                        </p>
                     )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2.5">
                     <button
                        onClick={closeModal}
                        className="flex-1 py-2.5 rounded-[10px] bg-[#1c1c1e] border border-[#ffffff0f] text-[13px] font-medium text-[#98989d] hover:text-white hover:bg-[#2a2a2e] transition-all duration-200"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-[10px] bg-[#ff453a1a] border border-[#ff453a40] text-[13px] font-medium text-[#ff453a] hover:bg-[#ff453a30] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                     >
                        {deleting ? 'Deleting...' : 'Delete Problem'}
                     </button>
                  </div>

               </div>
            </div>
         )}

      </div>
   );
}

export default DeleteProblem;