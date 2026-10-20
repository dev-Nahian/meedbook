import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ApiError, signin, type SigninPayload } from "../../lib/authApi";
import { ApiClientError } from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

type LocationState = {
  message?: string;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Login failed. Please try again.";
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const locationState = location.state as LocationState | null;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const signinMutation = useMutation({
    mutationFn: (payload: SigninPayload) => signin(payload),
    onSuccess: (response) => {
      const payloadData = (response?.data || response) as any;
      const user = payloadData?.user;
      const role = user?.role?.toLowerCase();
      const isOwner = role === "clinic_owner" || role === "clinic owner";

      setAuth({
        accessToken: payloadData?.access || payloadData?.access_token || "",
        refreshToken: payloadData?.refresh || payloadData?.refresh_token || "",
        user: user,
      });

      navigate(isOwner ? "/clinic-dashboard" : "/user-account");
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    signinMutation.mutate({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isLoading = signinMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 pt-24 sm:pt-28">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to continue with MedBook.
          </p>
        </div>

        {locationState?.message && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 mb-5">
            {locationState.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Forgot Password
            </Link>
          </div>

          {signinMutation.isError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {getErrorMessage(signinMutation.error)}
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
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">Sign In With Google</span>
        </button>

        <div className="text-center text-xs text-gray-600 mt-6 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup?account_type=PATIENT"
              className="text-sky-600 font-semibold hover:underline"
            >
              Sign Up as Patient
            </Link>
          </p>
          <p className="text-gray-400">
            Are you a healthcare provider?{" "}
            <Link
              to="/list-your-clinic"
              className="text-emerald-600 font-semibold hover:underline"
            >
              List Your Clinic
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
