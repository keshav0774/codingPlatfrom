import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loginUserAPI } from "./authSlice";

const loginSchema = z.object({
  emailId: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } =
    useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const submitForm = async (data) => {
    dispatch(loginUserAPI(data));
  };

  return (
    <div
      className="min-h-screen bg-[#080808] text-white flex"
    
    >
      {/* =====================================================
                          LEFT SIDE
      ===================================================== */}

      <section
        className="
        hidden lg:flex
        w-[52%]
        min-h-screen
        relative
        overflow-hidden
        flex-col
        border-r border-white/[0.07]
        "
      >
        {/* subtle light */}

        <div
          className="
          absolute
          -top-[220px]
          -left-[180px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-white/[0.035]
          blur-[130px]
          pointer-events-none
          "
        />

        {/* grid */}

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
          }}
        />

        <div
          className="
          relative z-10
          flex flex-col
          h-full
          min-h-screen
          px-12 xl:px-16
          py-10
          "
        >
          {/* LOGO */}

          <div
            onClick={() => navigate("/")}
            className="
            flex items-center gap-3
            cursor-pointer
            w-fit
            group
            "
          >
            <div
              className="
              w-9 h-9
              rounded-xl
              bg-white
              text-black
              flex items-center
              justify-center
              text-[11px]
              font-bold
              group-hover:scale-105
              transition-transform
              "
              style={{
                fontFamily:
                  "'JetBrains Mono', monospace",
              }}
            >
              &lt;/&gt;
            </div>

            <span
              className="
              text-[17px]
              font-semibold
              tracking-[-0.03em]
              "
            >
              CodeIt
            </span>
          </div>

          {/* MAIN CONTENT */}

          <div
            className="
            flex-1
            flex
            items-center
            "
          >
            <div className="max-w-[500px]">

              {/* SMALL LABEL */}

              <div
                className="
                inline-flex
                items-center
                gap-2
                border border-white/[0.1]
                bg-white/[0.035]
                rounded-full
                px-3.5 py-1.5
                mb-8
                "
              >
                <span
                  className="
                  w-1.5 h-1.5
                  bg-white
                  rounded-full
                  "
                />

                <span
                  className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-medium
                  text-[#777]
                  "
                >
                  Welcome back
                </span>
              </div>

              {/* HEADING */}

              <h1
                className="
                text-[46px]
                xl:text-[54px]
                leading-[1.04]
                tracking-[-0.055em]
                font-semibold
                "
              >
                Keep solving.
                <br />

                <span className="text-[#555]">
                  Keep improving.
                </span>
              </h1>

              <p
                className="
                text-[14px]
                leading-7
                text-[#777]
                mt-6
                max-w-[430px]
                "
              >
                Pick up where you left off and keep
                sharpening your problem-solving skills,
                one challenge at a time.
              </p>

              {/* STEPS */}

              <div className="mt-12 max-w-[430px]">

                {/* 01 */}

                <div
                  className="
                  flex items-center
                  gap-5
                  py-5
                  border-t border-white/[0.08]
                  group
                  "
                >
                  <span
                    className="
                    font-mono
                    text-[11px]
                    text-[#3f3f3f]
                    "
                  >
                    01
                  </span>

                  <div>
                    <h3
                      className="
                      text-[13px]
                      font-medium
                      text-[#d4d4d4]
                      "
                    >
                      Solve curated problems
                    </h3>

                    <p
                      className="
                      text-[11px]
                      text-[#555]
                      mt-1
                      "
                    >
                      Practice across different
                      difficulties and concepts.
                    </p>
                  </div>
                </div>

                {/* 02 */}

                <div
                  className="
                  flex items-center
                  gap-5
                  py-5
                  border-t border-white/[0.08]
                  "
                >
                  <span
                    className="
                    font-mono
                    text-[11px]
                    text-[#3f3f3f]
                    "
                  >
                    02
                  </span>

                  <div>
                    <h3
                      className="
                      text-[13px]
                      font-medium
                      text-[#d4d4d4]
                      "
                    >
                      Run & test your code
                    </h3>

                    <p
                      className="
                      text-[11px]
                      text-[#555]
                      mt-1
                      "
                    >
                      Execute solutions against test
                      cases instantly.
                    </p>
                  </div>
                </div>

                {/* 03 */}

                <div
                  className="
                  flex items-center
                  gap-5
                  py-5
                  border-y border-white/[0.08]
                  "
                >
                  <span
                    className="
                    font-mono
                    text-[11px]
                    text-[#3f3f3f]
                    "
                  >
                    03
                  </span>

                  <div>
                    <h3
                      className="
                      text-[13px]
                      font-medium
                      text-[#d4d4d4]
                      "
                    >
                      Track your progress
                    </h3>

                    <p
                      className="
                      text-[11px]
                      text-[#555]
                      mt-1
                      "
                    >
                      Keep your solved problems and
                      submissions in one place.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FOOT NOTE */}

          <p
            className="
            text-[10px]
            text-[#333]
            "
          >
            © 2026 CodeIt
          </p>
        </div>
      </section>

      {/* =====================================================
                          RIGHT SIDE
      ===================================================== */}

      <section
        className="
        flex-1
        min-h-screen
        flex
        items-center
        justify-center
        px-6 sm:px-10
        py-10
        relative
        "
      >
        <div className="w-full max-w-[390px]">

          {/* MOBILE LOGO */}

          <div
            onClick={() => navigate("/")}
            className="
            lg:hidden
            flex items-center
            gap-3
            mb-14
            cursor-pointer
            "
          >
            <div
              className="
              w-9 h-9
              rounded-xl
              bg-white
              text-black
              flex items-center
              justify-center
              text-[11px]
              font-bold
              "
              style={{
                fontFamily:
                  "'JetBrains Mono', monospace",
              }}
            >
              &lt;/&gt;
            </div>

            <span
              className="
              text-[17px]
              font-semibold
              tracking-[-0.03em]
              "
            >
              CodeIt
            </span>
          </div>

          {/* FORM HEADER */}

          <div className="mb-9">

            <h2
              className="
              text-[28px]
              font-semibold
              tracking-[-0.04em]
              "
            >
              Sign in
            </h2>

            <p
              className="
              text-[#666]
              text-[13px]
              mt-2
              "
            >
              Welcome back to CodeIt.
            </p>
          </div>

          {/* SERVER ERROR */}

          {error && (
            <div
              className="
              border border-white/[0.12]
              bg-white/[0.04]
              rounded-xl
              px-4 py-3.5
              mb-6
              "
            >
              <div className="flex gap-3">

                <div
                  className="
                  w-5 h-5
                  rounded-full
                  border border-white/[0.2]
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  text-[#aaa]
                  shrink-0
                  "
                >
                  !
                </div>

                <p
                  className="
                  text-[12px]
                  leading-5
                  text-[#aaa]
                  "
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
                              FORM
          ===================================================== */}

          <form
            onSubmit={handleSubmit(submitForm)}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>

              <label
                className="
                block
                text-[11px]
                font-medium
                text-[#777]
                mb-2
                "
              >
                Email address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                {...register("emailId")}
                className={`
                w-full
                h-[46px]
                bg-[#111111]
                border
                ${
                  errors.emailId
                    ? "border-white/[0.28]"
                    : "border-white/[0.09]"
                }
                rounded-xl
                px-4
                text-[13px]
                text-white
                placeholder:text-[#3f3f3f]
                outline-none
                focus:bg-[#131313]
                focus:border-white/[0.25]
                transition-all duration-200
                `}
              />

              {errors.emailId && (
                <p
                  className="
                  mt-2
                  text-[11px]
                  text-[#777]
                  flex items-center
                  gap-1.5
                  "
                >
                  <span>!</span>
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>

              <div
                className="
                flex
                justify-between
                items-center
                mb-2
                "
              >
                <label
                  className="
                  text-[11px]
                  font-medium
                  text-[#777]
                  "
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="
                  text-[11px]
                  text-[#666]
                  hover:text-white
                  transition-colors
                  "
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={`
                w-full
                h-[46px]
                bg-[#111111]
                border
                ${
                  errors.password
                    ? "border-white/[0.28]"
                    : "border-white/[0.09]"
                }
                rounded-xl
                px-4
                text-[13px]
                text-white
                placeholder:text-[#3f3f3f]
                outline-none
                focus:bg-[#131313]
                focus:border-white/[0.25]
                transition-all duration-200
                `}
              />

              {errors.password && (
                <p
                  className="
                  mt-2
                  text-[11px]
                  text-[#777]
                  flex items-center
                  gap-1.5
                  "
                >
                  <span>!</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`
              w-full
              h-[46px]
              mt-2
              rounded-xl
              bg-white
              text-black
              text-[13px]
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#e7e7e7]
              active:scale-[0.99]
              transition-all duration-200
              ${
                isSubmitting || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
              `}
            >
              {isSubmitting || loading ? (
                <>
                  <span
                    className="
                    w-3.5 h-3.5
                    rounded-full
                    border-2
                    border-black/30
                    border-t-black
                    animate-spin
                    "
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}

          <div
            className="
            flex items-center
            gap-4
            my-8
            "
          >
            <div className="flex-1 h-px bg-white/[0.07]" />

            <span
              className="
              text-[9px]
              text-[#3d3d3d]
              uppercase
              tracking-[0.16em]
              "
            >
              New here?
            </span>

            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* CREATE ACCOUNT */}

          <Link
            to="/signup"
            className="
            w-full
            h-[46px]
            border border-white/[0.1]
            rounded-xl
            flex
            items-center
            justify-center
            text-[12px]
            font-medium
            text-[#999]
            bg-white/[0.025]
            hover:bg-white/[0.06]
            hover:text-white
            hover:border-white/[0.16]
            transition-all
            "
          >
            Create an account
          </Link>

          {/* TERMS */}

          <p
            className="
            text-center
            text-[10px]
            leading-5
            text-[#3f3f3f]
            mt-7
            "
          >
            By continuing, you agree to our{" "}

            <a
              href="#"
              className="
              text-[#555]
              hover:text-[#999]
              transition-colors
              "
            >
              Terms
            </a>

            {" "}and{" "}

            <a
              href="#"
              className="
              text-[#555]
              hover:text-[#999]
              transition-colors
              "
            >
              Privacy Policy
            </a>
          </p>

        </div>
      </section>
    </div>
  );
}

export default Login;