import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VerifyLoginOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
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
        inputsRef.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    // Auto-submit when all 6 digits entered
    if (otp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    const email = localStorage.getItem("email");

    if (otpValue.length !== 6) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/verify/${email}`, {
        otp: otpValue,
      });
      toast.success(res.data.message || "OTP verified successfully!");
      setTimeout(() => {
        navigate("/dashboard");
        toast.success("Welcome to MediSynthia!");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-12 max-w-md w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Verify OTP
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Enter the 6-digit OTP sent to your email or phone
        </p>

        <form
          onSubmit={(e) => e.preventDefault()} // prevent default submit
          className="flex justify-center gap-3 mb-6"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </form>

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          Didn't receive OTP?{" "}
          <span className="text-blue-600 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyLoginOTP;
