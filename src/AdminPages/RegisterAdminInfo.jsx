import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminApi } from '../api/adminApi'; // adjust path if needed
import { MailCheck, RefreshCcw } from 'lucide-react';

const RegisterAdminInfo = () => {
  const [loading, setLoading] = useState(false);
  const superAdminEmail = localStorage.getItem("superAdminEmail"); // ideally from backend
  localStorage.removeItem("superAdminEmail");

  const handleResendEmail = async () => {
    try {
      setLoading(true);

      const res = await adminApi.resendEmail();

      if (res.data?.success) {
        toast.success('Verification email resent successfully');
      } else {
        toast.error(res.data?.message || 'Failed to resend email');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-lg p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <MailCheck className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verification Required
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          A verification email has been sent to the Super Admin.
          Please wait until your account is approved.
        </p>

        <div className="bg-gray-50 border rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Super Admin Email:</span>
            <br />
            {superAdminEmail}
          </p>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Didn’t receive the email?
        </p>

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? (
            'Resending...'
          ) : (
            <>
              <RefreshCcw className="h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default RegisterAdminInfo;
