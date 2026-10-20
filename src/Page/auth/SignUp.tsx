import React, { useState } from "react";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  ApiError,
  signup,
  type AccountType,
  type SignupPayload,
} from "../../lib/authApi";
import { ApiClientError } from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termAndCondition: boolean;
  privacyPolicy: boolean;
}

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termAndCondition?: string;
  privacyPolicy?: string;
}

const getAccountTypeFromQuery = (value: string | null): AccountType =>
  value === "CLINIC_OWNER" || value === "clinic_owner"
    ? "CLINIC_OWNER"
    : "PATIENT";

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Signup failed. Please try again.";
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setPendingVerificationEmail = useAuthStore(
    (state) => state.setPendingVerificationEmail
  );
  const setPendingFullName = useAuthStore((state) => state.setPendingFullName);

  const accountType = getAccountTypeFromQuery(searchParams.get("account_type"));
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termAndCondition: false,
    privacyPolicy: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
    onSuccess: (response, variables) => {
      const email = response.data.email || variables.email;
      setPendingVerificationEmail(email);
      setPendingFullName(variables.fullName);
      navigate(
        `/verification?email=${encodeURIComponent(email)}&account_type=${accountType}`
      );
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.termAndCondition) {
      newErrors.termAndCondition = "Please accept the terms and conditions";
    }

    if (!formData.privacyPolicy) {
      newErrors.privacyPolicy = "Please accept the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    signupMutation.mutate({
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      accountType,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAccountTypeChange = (value: AccountType) => {
    setSearchParams({ account_type: value });
  };

  const isLoading = signupMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 pt-24 sm:pt-28">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Sign up for an account
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Create your MedBook account to continue.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => handleAccountTypeChange("PATIENT")}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              accountType === "PATIENT"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User size={17} />
            Patient
          </button>
          <Link
            to="/list-your-clinic"
            className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all"
          >
            <Building2 size={17} className="text-emerald-600" />
            Clinic Owner
          </Link>
        </div>

        {accountType === "CLINIC_OWNER" && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <p className="font-bold text-sm mb-1">Looking to list your clinic?</p>
            <p className="text-emerald-700 mb-2">
              Clinic owners register through our unified healthcare onboarding portal with facility verification.
            </p>
            <Link
              to="/list-your-clinic"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:underline"
            >
              Go to Clinic Onboarding & Listing →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={formData.privacyPolicy}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.privacyPolicy && (
              <p className="text-red-500 text-xs">{errors.privacyPolicy}</p>
            )}

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                name="termAndCondition"
                checked={formData.termAndCondition}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-blue-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </span>
            </label>
            {errors.termAndCondition && (
              <p className="text-red-500 text-xs">{errors.termAndCondition}</p>
            )}
          </div>

          {signupMutation.isError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {getErrorMessage(signupMutation.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center text-base"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-black font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
