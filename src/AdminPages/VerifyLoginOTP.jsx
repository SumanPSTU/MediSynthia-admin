import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VerifyLoginOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // ⏳ Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) handleSubmit();
  }, [otp]);

  const handleSubmit = async () => {
    if (isExpired) return toast.error("OTP expired. Please resend.");

    const otpValue = otp.join("");
    const email = localStorage.getItem("email");
    if (!email) return toast.error("Missing email. Please try again.");
    if (otpValue.length !== 6) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/verify/${email}`, { otp: otpValue });

      if (!res.data?.success) return toast.error(res.data?.message || "Verification failed");

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      toast.success(res.data.message || "OTP verified successfully!");

      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return toast.error("Missing email");

      await axios.post(`${API_BASE_URL}/admin/resend-otp/${email}`);
      toast.success("New OTP sent successfully!");
      setOtp(new Array(6).fill(""));
      setIsExpired(false);
      setTimeLeft(180);
      inputsRef.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-10 md:p-12 max-w-md sm:max-w-lg w-full text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Verify OTP
        </h2>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2 sm:px-4">
          Enter the 6-digit OTP sent to your email 
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 flex-wrap"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </form>

        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Time left:{" "}
          <span className={`font-semibold ${isExpired ? "text-red-600" : "text-green-600"}`}>
            {isExpired ? "Expired" : formatTime()}
          </span>
        </p>

        {/* ✅ Full-width button (restored style) */}
        <button
          type="button"
          disabled={loading || isExpired}
          onClick={handleSubmit}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-lg text-base sm:text-lg md:text-xl transition duration-300 ${
            (loading || isExpired) && "opacity-60 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* ✅ Resend link below button (like before) */}
        <p className="mt-4 text-gray-500 text-sm sm:text-base md:text-base">
          Didn't receive OTP?{" "}
          <span
            onClick={isExpired ? handleResend : undefined}
            className={`${
              isExpired
                ? "text-blue-600 cursor-pointer hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {isExpired ? "Resend" : "Resend"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyLoginOTP;
