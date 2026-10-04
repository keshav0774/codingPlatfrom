import { Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import ForgetPassword from "./pages/forgetPassword";
import DeleteProblem from "./pages/deletePage";
import Admin from "./pages/adminPanel";
import ProblemPage from "./pages/problemPage";
import CreateProblem from "./pages/createProblem";
import UpdateProblemList from "./pages/UpdateProblemList";
import UpdateProblem from "./pages/UpdateProblem";

import { checkAuthAPI } from "./pages/authSlice";


function App() {

  const dispatch = useDispatch();

  const {
    isAuthenticated,
    loading,
    user
  } = useSelector((state) => state.auth);


  // =====================================================
  // CHECK AUTHENTICATION ON APP START / REFRESH
  // =====================================================

  useEffect(() => {
    dispatch(checkAuthAPI());
  }, [dispatch]);


  // =====================================================
  // INITIAL AUTH LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">

        <div className="flex flex-col items-center">

          {/* Logo */}

          <div
            className="text-xl font-semibold tracking-[-0.04em] text-white mb-8"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            CodeIt
          </div>


          {/* Spinner */}

          <div className="relative w-9 h-9">

            <div className="absolute inset-0 rounded-full border-2 border-white/10" />

            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />

          </div>


          <p className="mt-4 text-[13px] text-white/40">
            Loading...
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ROUTES
  // =====================================================

  return (

    <Routes>


      {/* =========================
          HOME
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =========================
          AUTH ROUTES
      ========================== */}

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/" replace />
            : <Login />
        }
      />


      <Route
        path="/signup"
        element={
          isAuthenticated
            ? <Navigate to="/" replace />
            : <Signup />
        }
      />


      <Route
        path="/forgot-password"
        element={<ForgetPassword />}
      />


      {/* =========================
          USER ROUTES
      ========================== */}

      <Route
        path="/profile"
        element={
          isAuthenticated
            ? <Profile />
            : <Navigate to="/login" replace />
        }
      />


      <Route
        path="/problem/:problemId"
        element={
          isAuthenticated
            ? <ProblemPage />
            : <Navigate to="/login" replace />
        }
      />


      {/* =========================
          ADMIN ROUTES
      ========================== */}

      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "Admin"
            ? <Admin />
            : <Navigate to="/" replace />
        }
      />


      <Route
        path="/admin/add-problem"
        element={
          isAuthenticated && user?.role === "Admin"
            ? <CreateProblem />
            : <Navigate to="/" replace />
        }
      />


      <Route
        path="/admin/update-problem"
        element={
          isAuthenticated && user?.role === "Admin"
            ? <UpdateProblemList />
            : <Navigate to="/" replace />
        }
      />


      <Route
        path="/admin/update-problem/:problemId"
        element={
          isAuthenticated && user?.role === "Admin"
            ? <UpdateProblem />
            : <Navigate to="/" replace />
        }
      />


      <Route
        path="/admin/delete-problem"
        element={
          isAuthenticated && user?.role === "Admin"
            ? <DeleteProblem />
            : <Navigate to="/" replace />
        }
      />


      {/* =========================
          UNKNOWN ROUTE
      ========================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />


    </Routes>

  );
}


export default App;