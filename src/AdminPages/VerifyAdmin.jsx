import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VerifyAdmin = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading");

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) return setMessage("No token found in URL");

      try {
        const res = await apiClient.post(
          "/admin/verify",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessage(res.data.message || "Admin verified successfully!");
        setStatus("success");
        toast.success(res.data.message);

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message);
        setStatus("error");
        toast.error("Verification failed!");
      }
    };

    verifyAdmin();
  }, [token]);

  // Tailwind CSS classes based on status
  const statusColors = {
    loading: "text-gray-800",
    success: "text-green-600",
    error: "text-red-600",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-12 max-w-md w-full text-center">
        {status === "success" && (
          <svg
            className="mx-auto h-12 w-12 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "error" && (
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <h2 className={`text-2xl sm:text-3xl font-semibold mb-4 ${statusColors[status]}`}>
          {message}
        </h2>
        {status === "success" && (
          <p className="text-gray-500 text-sm sm:text-base">
            You will be redirected to the login page shortly...
          </p>
        )}
        {status === "error" && (
          <p className="text-gray-500 text-sm sm:text-base">
            Please try again or contact support.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyAdmin;
