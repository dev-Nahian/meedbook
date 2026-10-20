
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendOtp, ApiError } from "../../lib/authApi";
import { ApiClientError } from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";

interface FormData {
  email: string;
}

interface Errors {
  email?: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const setPendingVerificationEmail = useAuthStore(
    (state) => state.setPendingVerificationEmail
  );

  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) =>
      sendOtp({ email, purpose: "password_reset" }),
    onSuccess: (_, email) => {
      setPendingVerificationEmail(email);
      navigate("/verification?purpose=password_reset");
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else if (err instanceof ApiClientError) {
        setApiError(err.message);
      } else if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Failed to send reset code. Please try again.");
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    sendOtpMutation.mutate(formData.email.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 pt-24 sm:pt-28">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Forgot your password?
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Don't worry, we've got you covered. Enter your registered email address
            and we'll send you a verification code to reset your password.
          </p>
        </div>

        {apiError && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sendOtpMutation.isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center text-base cursor-pointer"
          >
            {sendOtpMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/signin"
              className="text-xs text-gray-500 hover:text-blue-600 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;