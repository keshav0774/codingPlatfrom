import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { logoutUserAPI } from "./authSlice";
import AuthModal from "../components/authModel";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [problem, setProblem] = useState([]);
  const [solvedProblem, setSolvedProblem] = useState([]);
  const [filterProblem, setFilterProblem] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ----------------------------------------------------
  // FETCH PROBLEMS
  // ----------------------------------------------------

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/getAllProblem"
        );

        setProblem(data);
        setFilterProblem(data);
      } catch (error) {
        console.log("Problem fetch error:", error.message);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );

        setSolvedProblem(data);
      } catch (error) {
        console.log(
          "Error fetching Solved problems:",
          error.message
        );
      }
    };

    fetchProblem();

    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------

  const handleLogout = async () => {
    try {
      dispatch(logoutUserAPI());

      setSolvedProblem([]);

      navigate("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  // ----------------------------------------------------
  // FILTER
  // ----------------------------------------------------

  const handleFilterClick = (filter) => {
    setCurrentFilter(filter);

    let filtered = problem;

    if (filter !== "All") {
      filtered = problem.filter(
        (p) => p.difficulty === filter
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilterProblem(filtered);
  };

  // ----------------------------------------------------
  // SEARCH
  // ----------------------------------------------------

  const handleSearch = (value) => {
    setSearch(value);

    let filtered = problem;

    if (currentFilter !== "All") {
      filtered = filtered.filter(
        (p) => p.difficulty === currentFilter
      );
    }

    if (value.trim()) {
      filtered = filtered.filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(value.toLowerCase())
      );
    }

    setFilterProblem(filtered);
  };

  // ----------------------------------------------------
  // OPEN PROBLEM
  // ----------------------------------------------------

  const openProblemPage = (problemId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    navigate(`/problem/${problemId}`);
  };

  // ----------------------------------------------------
  // MONOCHROME DIFFICULTY
  // ----------------------------------------------------

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-white text-black border-white";

      case "Medium":
        return "bg-[#262626] text-white border-[#3a3a3a]";

      case "Hard":
        return "bg-black text-white border-[#4a4a4a]";

      default:
        return "bg-[#171717] text-[#a3a3a3] border-[#2a2a2a]";
    }
  };

  const userInitial =
    user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className="min-h-screen bg-[#080808] text-white"
      
    >
   

      <nav
        className="sticky top-0 z-50 border-b border-white/[0.08]"
        style={{
          background: "rgba(8,8,8,0.86)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[64px] flex items-center justify-between">

          {/* LOGO */}

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="
              w-9 h-9
              rounded-xl
              bg-white
              text-black
              flex items-center justify-center
              text-[11px]
              font-bold
              transition-all duration-300
              group-hover:scale-105
              "
              style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              &lt;/&gt;
            </div>

            <span className="text-[17px] font-semibold tracking-[-0.03em]">
              CodeIt
            </span>
          </div>

          {/* NAV RIGHT */}

          <div className="flex items-center gap-2">

            {isAuthenticated ? (
              <>
                {user?.role === "Admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="
                    hidden sm:block
                    px-4 py-2
                    rounded-lg
                    text-[13px]
                    text-[#a3a3a3]
                    hover:text-white
                    hover:bg-white/[0.06]
                    transition-all
                    "
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={() => navigate("/profile")}
                  className="
                  hidden sm:block
                  px-4 py-2
                  rounded-lg
                  text-[13px]
                  text-[#a3a3a3]
                  hover:text-white
                  hover:bg-white/[0.06]
                  transition-all
                  "
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="
                  ml-1
                  w-9 h-9
                  rounded-full
                  bg-[#171717]
                  border border-white/[0.12]
                  flex items-center justify-center
                  text-[13px]
                  font-semibold
                  text-white
                  hover:bg-white
                  hover:text-black
                  transition-all duration-300
                  "
                >
                  {userInitial}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="
                bg-white
                text-black
                px-5 py-2
                rounded-lg
                text-[13px]
                font-semibold
                hover:bg-[#e5e5e5]
                transition-all duration-200
                "
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* =====================================================
                            HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.07]">

        {/* subtle background glow */}

        <div
          className="
          pointer-events-none
          absolute
          top-[-250px]
          left-1/2
          -translate-x-1/2
          w-[850px]
          h-[500px]
          rounded-full
          bg-white/[0.035]
          blur-[120px]
          "
        />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-16">

          {/* BADGE */}

          <div className="flex justify-center mb-7">
            <div
              className="
              inline-flex items-center gap-2
              border border-white/[0.1]
              bg-white/[0.035]
              rounded-full
              px-4 py-2
              text-[10px]
              font-medium
              tracking-[0.2em]
              uppercase
              text-[#888]
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />

              Practice · Build · Ship
            </div>
          </div>

          {/* HERO TEXT */}

          <div className="text-center max-w-3xl mx-auto">

            <h1
              className="
              text-[42px]
              sm:text-[55px]
              md:text-[66px]
              font-semibold
              leading-[1.02]
              tracking-[-0.055em]
              "
            >
              Code. Test.
              <span className="text-[#777]"> Improve.</span>
            </h1>

            <p
              className="
              mt-6
              text-[15px]
              sm:text-[16px]
              leading-7
              text-[#888]
              max-w-xl
              mx-auto
              "
            >
              Solve programming challenges, test your code
              instantly and sharpen your problem-solving skills.
            </p>

            <div className="mt-8 flex justify-center gap-3">

              <button
                onClick={() => {
                  document
                    .getElementById("problems")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="
                bg-white
                text-black
                px-6 py-2.5
                rounded-lg
                text-[13px]
                font-semibold
                hover:bg-[#dedede]
                transition-all
                "
              >
                Start solving
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="
                  border border-white/[0.14]
                  bg-white/[0.04]
                  px-6 py-2.5
                  rounded-lg
                  text-[13px]
                  text-[#c5c5c5]
                  hover:bg-white/[0.08]
                  hover:text-white
                  transition-all
                  "
                >
                  Create account
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
                          FEATURE CARDS
          ===================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-16">

            {/* RUN */}

            <div
              className="
              group
              relative
              bg-[#101010]
              border border-white/[0.08]
              rounded-2xl
              p-6
              hover:border-white/[0.17]
              hover:bg-[#131313]
              transition-all duration-300
              "
            >
              <div
                className="
                w-10 h-10
                rounded-xl
                bg-white
                text-black
                flex items-center justify-center
                mb-5
                text-[16px]
                font-bold
                "
              >
                ▶
              </div>

              <h3 className="text-[16px] font-semibold tracking-tight">
                Run
              </h3>

              <p className="text-[#777] text-[13px] leading-6 mt-2">
                Execute your code instantly and validate your
                solution against test cases.
              </p>

              <div className="mt-5 text-[12px] text-[#555] group-hover:text-white transition-colors">
                Execute code →
              </div>
            </div>

            {/* DEBUG */}

            <div
              className="
              group
              bg-[#101010]
              border border-white/[0.08]
              rounded-2xl
              p-6
              hover:border-white/[0.17]
              hover:bg-[#131313]
              transition-all duration-300
              "
            >
              <div
                className="
                w-10 h-10
                rounded-xl
                border border-white/[0.15]
                bg-[#181818]
                flex items-center justify-center
                mb-5
                text-[16px]
                "
              >
                ◇
              </div>

              <h3 className="text-[16px] font-semibold tracking-tight">
                Debug
              </h3>

              <p className="text-[#777] text-[13px] leading-6 mt-2">
                Find problems faster and understand exactly
                where your solution goes wrong.
              </p>

              <div className="mt-5 text-[12px] text-[#555] group-hover:text-white transition-colors">
                Find bugs →
              </div>
            </div>

            {/* SUBMIT */}

            <div
              className="
              group
              bg-[#101010]
              border border-white/[0.08]
              rounded-2xl
              p-6
              hover:border-white/[0.17]
              hover:bg-[#131313]
              transition-all duration-300
              "
            >
              <div
                className="
                w-10 h-10
                rounded-xl
                border border-white/[0.15]
                bg-[#181818]
                flex items-center justify-center
                mb-5
                text-[17px]
                "
              >
                ✓
              </div>

              <h3 className="text-[16px] font-semibold tracking-tight">
                Submit
              </h3>

              <p className="text-[#777] text-[13px] leading-6 mt-2">
                Submit your solution and receive instant
                execution results and feedback.
              </p>

              <div className="mt-5 text-[12px] text-[#555] group-hover:text-white transition-colors">
                Submit solution →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                          PROBLEMS
      ===================================================== */}

      <main
        id="problems"
        className="max-w-6xl mx-auto px-6 lg:px-8 py-16"
      >

        {/* HEADING */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <h2
              className="
              text-[26px]
              font-semibold
              tracking-[-0.035em]
              "
            >
              Problems
            </h2>

            <span
              className="
              bg-[#171717]
              border border-white/[0.08]
              text-[#777]
              text-[11px]
              px-2.5 py-1
              rounded-full
              "
            >
              {filterProblem.length}
            </span>
          </div>

          <p className="text-[#666] text-[13px] mt-2">
            Choose a problem and start solving.
          </p>
        </div>

        {/* =====================================================
                          SEARCH + FILTER
        ===================================================== */}

        <div
          className="
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-3
          mb-5
          "
        >

          {/* SEARCH */}

          <div className="relative w-full md:w-[340px]">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              w-4 h-4
              text-[#555]
              "
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search problems..."
              className="
              w-full
              bg-[#101010]
              border border-white/[0.09]
              rounded-xl
              pl-10 pr-4 py-2.5
              text-[13px]
              text-white
              placeholder:text-[#4f4f4f]
              outline-none
              focus:border-white/[0.22]
              focus:bg-[#121212]
              transition-all
              "
            />
          </div>

          {/* FILTER */}

          <div
            className="
            flex
            items-center
            gap-1
            p-1
            bg-[#101010]
            border border-white/[0.08]
            rounded-xl
            "
          >
            {["All", "Easy", "Medium", "Hard"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    handleFilterClick(filter)
                  }
                  className={`
                    px-4
                    py-1.5
                    rounded-lg
                    text-[12px]
                    font-medium
                    transition-all duration-200

                    ${
                      currentFilter === filter
                        ? "bg-white text-black"
                        : "text-[#666] hover:text-white hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* =====================================================
                          TABLE
        ===================================================== */}

        <div
          className="
          bg-[#0d0d0d]
          border border-white/[0.08]
          rounded-2xl
          overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
            hidden
            md:grid
            grid-cols-12
            px-6 py-3
            bg-white/[0.02]
            border-b border-white/[0.07]
            text-[10px]
            uppercase
            tracking-[0.14em]
            font-semibold
            text-[#505050]
            "
          >
            <div className="col-span-6">
              Problem
            </div>

            <div className="col-span-3">
              Difficulty
            </div>

            <div className="col-span-3">
              Tags
            </div>
          </div>

          {/* ROWS */}

          {filterProblem.length > 0 ? (
            filterProblem.map((problem, index) => {

              const isSolved = solvedProblem?.some(
                (solved) =>
                  solved._id === problem._id ||
                  solved.problemId === problem._id
              );

              return (
                <div
                  key={problem._id}
                  onClick={() =>
                    openProblemPage(problem._id)
                  }
                  className="
                  group
                  grid
                  grid-cols-1
                  md:grid-cols-12
                  md:items-center
                  gap-3
                  px-5 md:px-6
                  py-4
                  border-b border-white/[0.055]
                  last:border-none
                  hover:bg-white/[0.035]
                  cursor-pointer
                  transition-all duration-200
                  "
                >

                  {/* TITLE */}

                  <div className="md:col-span-6 flex items-center gap-4">

                    <div
                      className="
                      text-[11px]
                      font-mono
                      text-[#3f3f3f]
                      w-6
                      "
                    >
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h3
                          className="
                          text-[13.5px]
                          font-medium
                          text-[#bdbdbd]
                          group-hover:text-white
                          transition-colors
                          "
                        >
                          {problem.title}
                        </h3>

                        {isSolved && (
                          <span
                            title="Solved"
                            className="
                            w-4 h-4
                            rounded-full
                            bg-white
                            text-black
                            text-[9px]
                            flex items-center
                            justify-center
                            font-bold
                            "
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DIFFICULTY */}

                  <div className="md:col-span-3">

                    <span
                      className={`
                      inline-flex
                      items-center
                      px-2.5
                      py-1
                      rounded-md
                      border
                      text-[10px]
                      font-semibold
                      ${getDifficultyStyle(
                        problem.difficulty
                      )}
                      `}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* TAGS */}

                  <div className="md:col-span-3">

                    <div className="flex flex-wrap gap-1.5">

                      {Array.isArray(problem.tags) ? (
                        problem.tags.map(
                          (tag, idx) => (
                            <span
                              key={idx}
                              className="
                              bg-[#151515]
                              border border-white/[0.07]
                              text-[#666]
                              px-2
                              py-1
                              rounded-md
                              text-[10px]
                              font-medium
                              "
                            >
                              {tag}
                            </span>
                          )
                        )
                      ) : (
                        <span
                          className="
                          bg-[#151515]
                          border border-white/[0.07]
                          text-[#666]
                          px-2
                          py-1
                          rounded-md
                          text-[10px]
                          "
                        >
                          {problem.tags ||
                            "No tags"}
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          ) : (

            /* EMPTY STATE */

            <div className="py-20 flex flex-col items-center justify-center">

              <div
                className="
                w-11 h-11
                rounded-xl
                bg-[#151515]
                border border-white/[0.08]
                flex items-center justify-center
                mb-4
                text-[#666]
                "
              >
                &lt;/&gt;
              </div>

              <h3 className="text-[14px] font-medium text-[#aaa]">
                No problems found
              </h3>

              <p className="text-[12px] text-[#505050] mt-1">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>

        {/* SYSTEM STATUS */}

        <div
          className="
          mt-7
          flex
          justify-center
          items-center
          gap-2
          text-[11px]
          text-[#505050]
          "
        >
          <span
            className="
            w-1.5 h-1.5
            bg-[#888]
            rounded-full
            "
          />

          CodeIt platform
        </div>
      </main>

      {/* =====================================================
                            FOOTER
      ===================================================== */}

      <footer
        className="
        border-t border-white/[0.07]
        bg-[#060606]
        "
      >
        <div
          className="
          max-w-6xl
          mx-auto
          px-6 lg:px-8
          py-8
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-4
          "
        >
          <div className="flex items-center gap-2">

            <div
              className="
              w-6 h-6
              rounded-md
              bg-white
              text-black
              flex items-center justify-center
              text-[8px]
              font-bold
              "
            >
              &lt;/&gt;
            </div>

            <span className="text-[12px] text-[#555]">
              © 2026 CodeIt
            </span>
          </div>

          <div className="flex gap-6 text-[11px] text-[#555]">

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>

          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}

      {showAuthModal && (
        <AuthModal
          onClose={() =>
            setShowAuthModal(false)
          }
        />
      )}
    </div>
  );
}

export default Home;