import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { registerUserAPI } from './authSlice';

const signupSchema = z.object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    emailId: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password should contain at least 8 characters")
});

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const submitForm = async (data) => {
        dispatch(registerUserAPI(data));
    };

    const features = [
        {
            icon: "🔐",
            title: "JWT + Redis Auth",
            desc: "Secure token-based authentication with Redis-backed session management for instant revocation."
        },
        {
            icon: "🍃",
            title: "MongoDB + Hashed Passwords",
            desc: "All passwords are bcrypt-hashed before storage. Your credentials are never stored in plain text."
        },
        {
            icon: "📬",
            title: "OTP Mail Verification",
            desc: "Email verification and OTP support powered by real-time mail delivery via Nodemailer."
        },
        {
            icon: "🔑",
            title: "Forgot Password Flow",
            desc: "Full forgot password support with OTP — temp password sent directly to your email."
        },
        {
            icon: "🛡️",
            title: "Role-based Access Control",
            desc: "Dedicated admin panel for platform management with separate user & admin roles."
        },
        {
            icon: "⚡",
            title: "Judge0 Code Execution",
            desc: "Run & submit code in 10+ languages with real-time runtime and memory feedback."
        },
        {
            icon: "🤖",
            title: "AI Chat Assistant",
            desc: "Google Gemini 2.5 powered hints per problem — guiding you without giving away solutions."
        },
        {
            icon: "✏️",
            title: "Monaco Editor",
            desc: "The same editor that powers VS Code — syntax highlighting, IntelliSense and more."
        },
    ];

    return (
        <div
            className="min-h-screen bg-black text-[#f5f5f7] flex"
            style={{ WebkitFontSmoothing: 'antialiased', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >

            {/* ── LEFT SIDE — Overview ── */}
            <div className="hidden lg:flex flex-col justify-between w-[52%] px-14 py-14 border-r border-[#ffffff08] relative overflow-hidden">

                <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full"
                     style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }}>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center text-[11px] font-medium rounded-[8px]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        &lt;/&gt;
                    </div>
                    <span className="font-semibold text-[16px] tracking-tight text-white">CodeIt</span>
                </div>

                {/* Main copy */}
                <div className="my-auto">
                    <div className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-[#ffffff1a] rounded-full px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-[#48484a] mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b] inline-block"></span>
                        Production Ready
                    </div>

                    <h1 className="text-[30px] font-semibold text-white leading-tight tracking-tight mb-4">
                        Built for developers<br />
                        <span className="text-[#48484a]">who take security seriously.</span>
                    </h1>

                    <p className="text-[#98989d] text-[13px] leading-relaxed mb-8 max-w-sm">
                        CodeIt is a production-grade competitive coding platform with enterprise-level auth, AI assistance, and real-time code execution.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-3.5">
                                <div className="w-7 h-7 rounded-[7px] bg-[#1c1c1e] border border-[#ffffff0a] flex items-center justify-center text-[12px] shrink-0 mt-0.5">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-[12px] font-medium text-[#f5f5f7] mb-0.5">{f.title}</p>
                                    <p className="text-[11px] text-[#48484a] leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom note */}
                <p className="text-[11px] text-[#2a2a2e]">© 2026 CodeIt by Keshav Mishra. All rights reserved.</p>
            </div>

            {/* ── RIGHT SIDE — Form ── */}
            <div className="flex-1 flex items-center justify-center px-8 py-14">
                <div className="w-full max-w-[360px]">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2.5 mb-10 lg:hidden">
                        <div className="w-7 h-7 bg-white text-black flex items-center justify-center text-[10px] font-medium rounded-[7px]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            &lt;/&gt;
                        </div>
                        <span className="font-semibold text-[15px] tracking-tight text-white">CodeIt</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-[22px] font-semibold text-white tracking-tight mb-1">Create account</h2>
                        <p className="text-[#48484a] text-[13px]">Join thousands of developers on CodeIt.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">

                        <div>
                            <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={`w-full bg-[#1c1c1e] border ${errors.firstName ? 'border-[#ff453a60]' : 'border-[#ffffff10]'} rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                {...register('firstName')}
                            />
                            {errors.firstName && <p className="mt-1.5 text-[11px] text-[#ff453a]">⚠ {errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full bg-[#1c1c1e] border ${errors.emailId ? 'border-[#ff453a60]' : 'border-[#ffffff10]'} rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                {...register('emailId')}
                            />
                            {errors.emailId && <p className="mt-1.5 text-[11px] text-[#ff453a]">⚠ {errors.emailId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="Minimum 8 characters"
                                className={`w-full bg-[#1c1c1e] border ${errors.password ? 'border-[#ff453a60]' : 'border-[#ffffff10]'} rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                {...register('password')}
                            />
                            {errors.password && <p className="mt-1.5 text-[11px] text-[#ff453a]">⚠ {errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className={`w-full py-2.5 mt-2 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 focus:outline-none ${isSubmitting || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting || loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-[#ffffff08]"></div>
                        <span className="mx-4 text-[11px] text-[#2a2a2e]">OR</span>
                        <div className="flex-1 h-px bg-[#ffffff08]"></div>
                    </div>

                    <p className="text-center text-[12px] text-[#48484a]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#98989d] hover:text-white transition-colors duration-200">Sign in</Link>
                    </p>

                    <p className="text-center text-[11px] text-[#2a2a2e] mt-5 leading-relaxed">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-[#48484a] hover:text-[#98989d] transition-colors duration-200">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-[#48484a] hover:text-[#98989d] transition-colors duration-200">Privacy Policy</a>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default Signup;
