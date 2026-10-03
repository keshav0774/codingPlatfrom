import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits")
    // number ki jagah string use kiya kyunki input se string aati hai
});

export default function OtpPage() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = (data) => {
        console.log("User OTP:", data);
        setMessageType('success');
        setMessage("OTP verified successfully! Redirecting...");
        
        // 2 sec baad reset password page par redirect
        setTimeout(() => {
            navigate('/reset-password');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg">
                <div className="p-8">
                    {/* Header with Logo */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-3xl font-bold">
                                {'</>'}
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-black">CodeIt</h2>
                        <p className="text-gray-600 text-sm mt-1">Run. Debug. Submit.</p>
                        <p className="text-gray-800 mt-4">Enter Verification Code</p>
                    </div>

                    {/* Instruction Text */}
                    <p className="text-gray-700 mb-6">
                        We've sent a 6-digit verification code to your email. Please enter it below.
                    </p>

                    {/* Message Display */}
                    {message && (
                        <div className={`p-3 mb-4 text-sm ${
                            messageType === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-300' 
                                : 'bg-blue-50 text-blue-700 border border-blue-300'
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* OTP Field */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                className={`w-full px-3 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-400'} focus:outline-none focus:ring-1 focus:ring-black text-black text-center text-2xl tracking-widest placeholder:text-gray-500 placeholder:text-base`}
                                {...register('otp')}
                            />
                            {errors.otp && (
                                <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-600">
                                Demo: Use "123456" for testing
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>

                    {/* Back to Forgot Password */}
                    <div className="text-center mt-6">
                        <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black hover:underline">
                            ← Didn't receive code? Request again
                        </Link>
                    </div>

                    {/* Resend Option */}
                    <div className="text-center mt-4">
                        <button 
                            type="button"
                            onClick={() => {
                                setMessageType('info');
                                setMessage("Demo: New OTP sent! Use 123456");
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}