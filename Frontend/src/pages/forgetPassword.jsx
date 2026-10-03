import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPasswordAPI } from './authSlice';
import axiosClient from '../utils/axiosClient';

const forgetSchema = z.object({
    emailId: z.string().email("Please enter a valid email").min(1, "Email is required")
});

export default function ForgetPassword() {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showPanel, setShowPanel] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [verifying, setVerifying] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [email, setEmail] = useState('');
    const otpRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(forgetSchema)
    });

    // ── Send OTP ──
    const submitForm = async (data) => {
        try {
            await dispatch(forgotPasswordAPI(data)).unwrap();
            setEmail(data.emailId);
            setMessageType('success');
            setMessage(`OTP sent to ${data.emailId}`);
            setTimeout(() => setShowPanel(true), 400);
        } catch (error) {
            setMessageType('error');
            setMessage(error || "Something went wrong");
        }
    };

    // ── OTP input handlers ──
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setOtpError('');
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pasted.split('').forEach((char, i) => { newOtp[i] = char; });
        setOtp(newOtp);
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    // ── Verify OTP ──
    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setOtpError('Please enter all 6 digits');
            return;
        }
        setVerifying(true);
        setOtpError('');
        try {
            //await dispatch(verifyOtpAPI({ emailId: email, otp: otpString })).unwrap();
            await axiosClient.post('/user/verifyOtp', { emailId: email, otp: otpString });
            setShowPanel(false);
            setMessageType('success');
            setMessage('Password reset! Check your email for the new password.');
            setTimeout(() => navigate('/login'), 2500);
        } catch (error) {
            setOtpError(error || 'Invalid OTP. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-black flex items-center justify-center p-4"
            style={{ WebkitFontSmoothing: 'antialiased', fontFamily: 'Inter, -apple-system, sans-serif' }}
        >
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>

            <div className="w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-11 h-11 bg-white text-black flex items-center justify-center text-[13px] font-semibold rounded-[12px] mb-4"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        &lt;/&gt;
                    </div>
                    <h1 className="text-[22px] font-semibold text-white tracking-tight">Reset Password</h1>
                    <p className="text-[12px] text-[#48484a] mt-1">Enter your email to receive an OTP</p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl border border-[#ffffff0f] overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                    <div className="px-7 py-7">

                        {/* Message */}
                        {message && (
                            <div className={`mb-5 px-4 py-3 rounded-[10px] text-[12px] font-medium border ${
                                messageType === 'success'
                                    ? 'bg-[#32d74b0a] text-[#32d74b] border-[#32d74b25]'
                                    : 'bg-[#ff453a0a] text-[#ff453a] border-[#ff453a25]'
                            }`}>
                                {messageType === 'success' ? '✓ ' : '⚠ '}{message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-medium text-[#48484a] uppercase tracking-[0.08em] mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className={`w-full bg-[#1c1c1e] border ${
                                        errors.emailId ? 'border-[#ff453a55]' : 'border-[#ffffff10]'
                                    } rounded-[10px] px-4 py-2.5 text-[13px] text-[#f5f5f7] placeholder-[#48484a] outline-none focus:border-[#ffffff25] transition-colors duration-200`}
                                    {...register('emailId')}
                                />
                                {errors.emailId && (
                                    <p className="mt-1.5 text-[11px] text-[#ff453a]">{errors.emailId.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || showPanel}
                                className="w-full py-2.5 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                            >
                                {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    </div>

                    {/* Footer link */}
                    <div className="px-7 py-4 border-t border-[#ffffff08] text-center">
                        <Link
                            to="/login"
                            className="text-[12px] text-[#48484a] hover:text-[#98989d] transition-colors duration-200"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>

            </div>

            {/* ══ OTP SLIDE-UP PANEL ══ */}
            {showPanel && (
                <div
                    className="fixed bottom-0 left-0 right-0 z-50"
                    style={{
                        background: 'rgba(10,10,10,0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        animation: 'slideUp 0.3s ease'
                    }}
                >
                    <div className="max-w-sm mx-auto px-6 py-8">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[13px] font-semibold text-white">Enter OTP</p>
                                <p className="text-[11px] text-[#48484a] mt-0.5">Sent to {email}</p>
                            </div>
                            <button
                                onClick={() => { setShowPanel(false); setOtp(['','','','','','']); setOtpError(''); }}
                                className="w-6 h-6 rounded-full bg-[#1c1c1e] border border-[#ffffff0f] flex items-center justify-center text-[#48484a] hover:text-white text-[10px] transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 6 OTP Boxes */}
                        <div className="flex gap-3 justify-center mb-5" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => otpRefs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    className={`w-11 h-12 text-center text-[18px] font-semibold bg-[#1c1c1e] border ${
                                        otpError ? 'border-[#ff453a60]' : digit ? 'border-[#ffffff25]' : 'border-[#ffffff10]'
                                    } rounded-[10px] text-white outline-none focus:border-[#ffffff40] transition-colors duration-200`}
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        {/* OTP Error */}
                        {otpError && (
                            <p className="text-center text-[11px] text-[#ff453a] mb-4">⚠ {otpError}</p>
                        )}

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyOtp}
                            disabled={verifying || otp.join('').length !== 6}
                            className="w-full py-2.5 bg-white text-black text-[13px] font-semibold rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {verifying
                                ? <span className="flex items-center justify-center gap-2">
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00000020] border-t-black animate-spin inline-block"></span>
                                    Verifying...
                                  </span>
                                : 'Verify OTP'
                            }
                        </button>

                        {/* Resend */}
                        <p className="text-center text-[11px] text-[#48484a] mt-4">
                            Didn't receive it?{' '}
                            <button
                                onClick={() => { setShowPanel(false); setOtp(['','','','','','']); setOtpError(''); }}
                                className="text-[#98989d] hover:text-white transition-colors underline"
                            >
                                Resend OTP
                            </button>
                        </p>

                    </div>
                </div>
            )}

        </div>
    );
}