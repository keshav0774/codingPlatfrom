import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginUserAPI } from './authSlice';

const loginSchema = z.object({
    emailId: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
});

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const submitForm = async (data) => {
        console.log(data);
        dispatch(loginUserAPI(data));
    };

    const features = [
        {
            icon: "⚡",
            title: "Instant Code Execution",
            desc: "Run your code in 20+ programming languages with real-time output and zero setup required."
        },
        {
            icon: "🏆",
            title: "Track Your Progress",
            desc: "Monitor solved problems, submission history, and performance stats all in one place."
        },
        {
            icon: "🔬",
            title: "Advanced Debugger",
            desc: "Step through your code, inspect variables, and squash bugs faster than ever before."
        },
        {
            icon: "📊",
            title: "Performance Analytics",
            desc: "Get instant runtime and memory feedback on every submission to optimise your solutions."
        },
        {
            icon: "🛡️",
            title: "Secure & Reliable",
            desc: "Enterprise-grade auth with JWT, Redis sessions, and bcrypt-hashed passwords."
        },
    ];

    return (
        <div
            className="min-h-screen bg-black text-[#f5f5f7] flex"
            style={{ WebkitFontSmoothing: 'antialiased', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >

            {/* ── LEFT SIDE — Overview ── */}
            <div className="hidden lg:flex flex-col justify-between w-[52%] px-14 py-14 border-r border-[#ffffff08] relative overflow-hidden">

                {/* Subtle background glow */}
                <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full"
                     style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }}>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 bg-white text-black flex items-center justify-center text-[11px] font-medium rounded-[8px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        &lt;/&gt;
                    </div>
                    <span className="font-semibold text-[16px] tracking-tight text-white">CodeIt</span>
                </div>

                {/* Main copy */}
                <div className="my-auto">
                    <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
                        Welcome Back
                    </div>

                    <h1 className="text-[32px] font-semibold text-white leading-tight tracking-tight mb-4">
                        Keep solving.<br />
                        <span className="text-[#48484a]">Keep improving.</span>
                    </h1>

                    <p className="text-[#98989d] text-[14px] leading-relaxed mb-10 max-w-sm">
                        Pick up right where you left off. Your problems, submissions, and progress are all waiting for you.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-5">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-[8px] bg-[#1c1c1e] border border-[#ffffff0a] flex items-center justify-center text-[14px] shrink-0 mt-0.5">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-[13px] font-medium text-[#f5f5f7] mb-0.5">{f.title}</p>
                                    <p className="text-[12px] text-[#48484a] leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom note */}
                <p className="text-[11px] text-[#2a2a2e]">© 2024 CodeIt. All rights reserved.</p>
            </div>

            {/* ── RIGHT SIDE — Form ── */}
            <div className="flex-1 flex items-center justify-center px-8 py-14">
                <div className="w-full max-w-[360px]">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                        <div
                            className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            &lt;/&gt;
                        </div>
                        <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-[22px] font-semibold text-white tracking-tight mb-1">Welcome back</h2>
                        <p className="text-[#48484a] text-[13px]">Sign in to continue to CodeIt.</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-[#ff453a12] border border-[#ff453a30] rounded-[10px] px-4 py-3 mb-5">
                            <p className="text-[12px] text-[#ff453a]">⚠ {error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full bg-[#1c1c1e] border ${errors.emailId ? 'border-[#ff453a60]' : 'border-[#ffffff10]'} rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                {...register('emailId')}
                            />
                            {errors.emailId && (
                                <p className="mt-1.5 text-[11px] text-[#ff453a]">⚠ {errors.emailId.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[11px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className={`w-full bg-[#1c1c1e] border ${errors.password ? 'border-[#ff453a60]' : 'border-[#ffffff10]'} rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-[11px] text-[#ff453a]">⚠ {errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className={`w-full py-2.5 mt-2 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 focus:outline-none ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting || loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-[#ffffff08]"></div>
                        <span className="mx-4 text-[11px] text-[#2a2a2e]">OR</span>
                        <div className="flex-1 h-px bg-[#ffffff08]"></div>
                    </div>

                    {/* Signup link */}
                    <p className="text-center text-[12px] text-[#48484a]">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-[#98989d] hover:text-white transition-colors duration-200">
                            Create account
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-[11px] text-[#2a2a2e] mt-5 leading-relaxed">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-[#48484a] hover:text-[#98989d] transition-colors duration-200">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-[#48484a] hover:text-[#98989d] transition-colors duration-200">Privacy Policy</a>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default Login;
