import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUserAPI } from "./authSlice";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap');
`;

const sora = { fontFamily: "'Sora', ui-sans-serif, system-ui, sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace" };

const IconPlus = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
   </svg>
);

const IconEdit = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
   </svg>
);

const IconTrash = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
   </svg>
);

const IconLogout = () => (
   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
   </svg>
);

const IconArrowRight = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
   </svg>
);

const IconArrowLeft = () => (
   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
   </svg>
);

const ACTIONS = [
   {
      key: "add",
      path: "/admin/add-problem",
      label: "CREATE",
      title: "Add Problem",
      description: "Create a new coding challenge with test cases, constraints, tags, and difficulty.",
      cta: "Add new problem",
      Icon: IconPlus,
      danger: false,
   },
   {
      key: "update",
      path: "/admin/update-problem",
      label: "MODIFY",
      title: "Update Problem",
      description: "Modify problem statements, test cases, metadata, and existing configurations.",
      cta: "Update existing problem",
      Icon: IconEdit,
      danger: false,
   },
   {
      key: "delete",
      path: "/admin/delete-problem",
      label: "REMOVE",
      title: "Delete Problem",
      description: "Review and permanently remove existing problems from the platform.",
      cta: "Delete a problem",
      Icon: IconTrash,
      danger: true,
   },
];

function AdminPanel() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useSelector((state) => state.auth);

   const handleLogout = async () => {
      try {
         await dispatch(logoutUserAPI()).unwrap();
         navigate("/");
      } catch (err) {
         console.log("Logout error:", err);
      }
   };

   const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

   return (
      <div
         className="min-h-screen bg-[#080808] text-white flex flex-col"
         style={{ ...sora, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
      >
         <style>{FONT_IMPORT}</style>

         {/* ── Navbar ── */}
         <nav
            className="sticky top-0 z-50 border-b border-white/[0.07]"
            style={{
               background: "rgba(8,8,8,0.8)",
               backdropFilter: "saturate(140%) blur(14px)",
               WebkitBackdropFilter: "saturate(140%) blur(14px)",
            }}
         >
            <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[52px] flex justify-between items-center">
               {/* Logo */}
               <div
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onClick={() => navigate("/")}
               >
                  <div
                     className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px] transition-transform duration-300 group-hover:-rotate-3"
                     style={mono}
                  >
                     &lt;/&gt;
                  </div>
                  <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
               </div>

               {/* Admin indicator + avatar */}
               <div className="flex items-center gap-3">
                  <span
                     className="hidden sm:inline-flex items-center h-[22px] px-2 rounded-md border border-white/[0.1] bg-[#111111] text-[10px] tracking-wider text-[#a1a1aa]"
                     style={mono}
                  >
                     Admin
                  </span>
                  <button
                     onClick={handleLogout}
                     title="Logout"
                     aria-label="Logout"
                     className="group relative w-[30px] h-[30px] rounded-full bg-[#151515] border border-white/[0.12] flex items-center justify-center text-[12px] font-semibold text-[#a1a1aa] transition-all duration-200 hover:bg-[#1c1c1c] hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 overflow-hidden"
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
         <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-12 flex-1 w-full">
            {/* Breadcrumb + header */}
            <div className="mb-10 sm:mb-12">
               <div
                  className="text-[11px] tracking-[0.14em] text-[#5f5f66] mb-4"
                  style={mono}
               >
                  ADMIN <span className="text-[#3a3a3f] mx-1">/</span> PROBLEM MANAGEMENT
               </div>

               <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                     <h1 className="text-[28px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-tight mb-2">
                        Admin Panel
                     </h1>
                     <p className="text-[#a1a1aa] text-[14px] leading-relaxed max-w-xl">
                        Create, maintain, and manage coding problems across the CodeIt platform.
                     </p>
                  </div>
                  <span className="text-[11px] text-[#5f5f66] sm:pb-1.5" style={mono}>
                     3 management actions
                  </span>
               </div>
            </div>

            {/* Section header */}
            <div className="flex items-center gap-4 mb-5">
               <span className="text-[11px] tracking-[0.14em] text-[#a1a1aa]" style={mono}>
                  MANAGEMENT ACTIONS
               </span>
               <div className="h-px flex-1 bg-white/[0.07]"></div>
               <span className="text-[11px] tracking-[0.14em] text-[#5f5f66]" style={mono}>
                  3 AVAILABLE
               </span>
            </div>

            {/* ── Action cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {ACTIONS.map(({ key, path, label, title, description, cta, Icon, danger }) => (
                  <div
                     key={key}
                     role="link"
                     tabIndex={0}
                     onClick={() => navigate(path)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                           e.preventDefault();
                           navigate(path);
                        }
                     }}
                     className={`group relative flex flex-col min-h-[240px] p-6 sm:p-7 rounded-[14px] bg-[#101010] border cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[2px] hover:bg-[#151515] focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                        danger
                           ? "border-white/[0.08] hover:border-white/[0.28]"
                           : "border-white/[0.08] hover:border-white/[0.18]"
                     }`}
                     style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                  >
                     {/* Top row: icon + label */}
                     <div className="flex items-center justify-between mb-7">
                        <div className="w-10 h-10 rounded-[10px] bg-[#171717] border border-white/[0.1] flex items-center justify-center text-[#d4d4d8] transition-colors duration-300 group-hover:text-white group-hover:border-white/[0.2]">
                           <Icon />
                        </div>
                        <span className="text-[10px] tracking-[0.16em] text-[#5f5f66]" style={mono}>
                           {label}
                        </span>
                     </div>

                     {/* Content */}
                     <h3 className="text-[17px] font-semibold text-white tracking-tight mb-2">{title}</h3>
                     <p className="text-[#a1a1aa] text-[13px] leading-[1.65] mb-8 max-w-[34ch]">
                        {description}
                     </p>

                     {/* CTA */}
                     <div className="mt-auto flex items-center gap-2 text-[12px] font-medium text-[#8a8a92] transition-colors duration-300 group-hover:text-white">
                        <span>{cta}</span>
                        <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                           <IconArrowRight />
                        </span>
                     </div>
                  </div>
               ))}
            </div>

            {/* Back to Home */}
            <div className="mt-10">
               <button
                  onClick={() => navigate("/")}
                  className="group inline-flex items-center gap-2 text-[12px] text-[#5f5f66] hover:text-[#d4d4d8] transition-colors duration-200 focus:outline-none focus-visible:text-white"
               >
                  <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                     <IconArrowLeft />
                  </span>
                  Back to Home
               </button>
            </div>
         </main>

         {/* ── Footer ── */}
         <footer className="border-t border-white/[0.07]">
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                     <div
                        className="w-5 h-5 bg-[#1c1c1c] border border-white/[0.1] text-[#a1a1aa] flex items-center justify-center text-[8px] rounded-[5px]"
                        style={mono}
                     >
                        &lt;/&gt;
                     </div>
                     <span className="text-[12px] text-[#5f5f66]">
                        © 2026 CodeIt by Keshav Mishra. All rights reserved.
                     </span>
                  </div>
                  <div className="flex gap-5 text-[12px] text-[#5f5f66]">
                     <a href="#" className="hover:text-[#a1a1aa] transition-colors duration-200">Terms</a>
                     <a href="#" className="hover:text-[#a1a1aa] transition-colors duration-200">Privacy</a>
                     <a href="#" className="hover:text-[#a1a1aa] transition-colors duration-200">Contact</a>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default AdminPanel;