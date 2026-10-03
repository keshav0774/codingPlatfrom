import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { registerUserAPI } from "./authSlice";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, "Name should contain at least 3 characters"),

  emailId: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password should contain at least 8 characters"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const submitForm = async (data) => {
    dispatch(registerUserAPI(data));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">

      {/* =====================================================
                          LEFT SECTION
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
        {/* SUBTLE GLOW */}

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

        {/* GRID BACKGROUND */}

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
              transition-transform
              group-hover:scale-105
              "
              style={{
                fontFamily: "'JetBrains Mono', monospace",
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

          {/* MAIN LEFT CONTENT */}

          <div className="flex-1 flex items-center">
            <div className="max-w-[500px]">

              {/* LABEL */}

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
                <span className="w-1.5 h-1.5 bg-white rounded-full" />

                <span
                  className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  font-medium
                  text-[#777]
                  "
                >
                  Start building
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
                Learn by solving.
                <br />

                <span className="text-[#555]">
                  Improve by building.
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
                Create your CodeIt account and start solving
                programming challenges in a focused developer
                environment.
              </p>

              {/* FEATURES */}

              <div className="mt-12 max-w-[430px]">

                {/* FEATURE 1 */}

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
                    01
                  </span>

                  <div>
                    <p className="text-[13px] font-medium text-[#d4d4d4]">
                      Solve coding problems
                    </p>

                    <p className="text-[11px] text-[#555] mt-1">
                      Practice across different concepts and difficulties.
                    </p>
                  </div>
                </div>

                {/* FEATURE 2 */}

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
                    <p className="text-[13px] font-medium text-[#d4d4d4]">
                      Run & submit instantly
                    </p>

                    <p className="text-[11px] text-[#555] mt-1">
                      Test your solutions and get execution feedback.
                    </p>
                  </div>
                </div>

                {/* FEATURE 3 */}

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
                    <p className="text-[13px] font-medium text-[#d4d4d4]">
                      Track your progress
                    </p>

                    <p className="text-[11px] text-[#555] mt-1">
                      Keep your solved problems and submissions together.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COPYRIGHT */}

          <p className="text-[10px] text-[#333]">
            © {new Date().getFullYear()} CodeIt
          </p>
        </div>
      </section>

      {/* =====================================================
                          RIGHT SECTION
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
            mb-12
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
                fontFamily: "'JetBrains Mono', monospace",
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

          {/* HEADING */}

          <div className="mb-8">

            <h2
              className="
              text-[28px]
              font-semibold
              tracking-[-0.04em]
              "
            >
              Create account
            </h2>

            <p className="text-[#666] text-[13px] mt-2">
              Start your journey with CodeIt.
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
              <div className="flex gap-3 items-start">

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

                <p className="text-[12px] leading-5 text-[#aaa]">
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

            {/* NAME */}

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
                Full name
              </label>

              <input
                type="text"
                placeholder="Your name"
                {...register("firstName")}
                className={`
                w-full
                h-[46px]
                bg-[#111111]
                border
                ${
                  errors.firstName
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

              {errors.firstName && (
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

                  {errors.firstName.message}
                </p>
              )}
            </div>

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

              <label
                className="
                block
                text-[11px]
                font-medium
                text-[#777]
                mb-2
                "
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 8 characters"
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

            {/* CREATE ACCOUNT BUTTON */}

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

                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}

          <div
            className="
            flex
            items-center
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
              Already a member?
            </span>

            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* LOGIN */}

          <Link
            to="/login"
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
            Sign in instead
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
            By creating an account, you agree to our{" "}

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

export default Signup;