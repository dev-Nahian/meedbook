import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ApiError, verifySignupOtp, resendOtp } from "../../lib/authApi";
import { ApiClientError } from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const OTP_LENGTH = 6;

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "OTP verification failed. Please try again.";
};

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get("email");
  const purpose = (searchParams.get("purpose") || "signup") as "signup" | "password_reset";
  const accountType = (searchParams.get("account_type") || "PATIENT").toUpperCase();

  const isClinicOwner = accountType === "CLINIC_OWNER";

  const pendingVerificationEmail = useAuthStore(
    (state) => state.pendingVerificationEmail
  );
  const setPendingVerificationEmail = useAuthStore(
    (state) => state.setPendingVerificationEmail
  );

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const [email, setEmail] = useState(
    queryEmail || pendingVerificationEmail || ""
  );
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(239);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  const verifyMutation = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      verifySignupOtp({ ...payload, purpose }),
    onSuccess: () => {
      if (purpose === "password_reset") {
        navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      } else {
        setPendingVerificationEmail(null);
        setIsVerifiedSuccess(true);
      }
    },
    onError: (err: unknown) => {
      setOtpError(getErrorMessage(err));
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp({ email: email.trim(), purpose }),
    onSuccess: (data) => {
      setTimeLeft(239);
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setResendSuccess(data?.message || "Verification code resent successfully.");
      setTimeout(() => setResendSuccess(null), 4000);
    },
    onError: (err: unknown) => {
      setOtpError(getErrorMessage(err));
    },
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (Number.isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, OTP_LENGTH)
      .replace(/\D/g, "");

    if (pastedData) {
      const newOtp = Array.from({ length: OTP_LENGTH }, () => "");
      pastedData.split("").forEach((char, index) => {
        if (index < OTP_LENGTH) newOtp[index] = char;
      });
      setOtp(newOtp);
      setOtpError("");

      const lastFilledIndex = Math.min(pastedData.length - 1, OTP_LENGTH - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleResend = () => {
    if (timeLeft <= 0 && email.trim()) {
      resendMutation.mutate();
    }
  };

  const handleConfirm = () => {
    const trimmedEmail = email.trim();
    const code = otp.join("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError("Email address is required");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (code.length < OTP_LENGTH) {
      setOtpError(`Please enter the complete ${OTP_LENGTH}-digit code`);
      return;
    }

    setEmailError("");
    setOtpError("");
    verifyMutation.mutate({ email: trimmedEmail, otp: code });
  };

  const isLoading = verifyMutation.isPending || resendMutation.isPending;
  const isResendDisabled = timeLeft > 0 || resendMutation.isPending;

  // ─── POST-VERIFICATION SUCCESS SCREEN (ROLE-AWARE) ───
  if (isVerifiedSuccess) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-sky-50/50 via-white to-gray-100 flex items-center justify-center px-4 py-8 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 sm:p-10 text-center border border-gray-100 space-y-6"
        >
          <div className="w-18 h-18 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={38} className="stroke-[2.5]" />
          </div>

          {isClinicOwner ? (
            /* Clinic Owner Verification Screen */
            <>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Clock size={13} /> Under Compliance Review
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Your Clinic Application Has Been Submitted!
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your email has been verified. Your clinic registration is currently under review for further assessment by our medical administration team.
                  <strong className="text-gray-900 block mt-2">
                    For further updates and assessment details, please check your mail.
                  </strong>
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left text-xs space-y-2 text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Verified Email:</span>
                  <span className="font-semibold text-sky-600 flex items-center gap-1">
                    <Mail size={12} /> {email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Review Turnaround:</span>
                  <span className="font-bold text-amber-700">24 – 48 Hours</span>
                </div>
              </div>
            </>
          ) : (
            /* Patient Account Verification Screen */
            <>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={13} /> Verification Complete
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Account Verified Successfully!
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Welcome to MedBook! Your patient account is now fully verified and activated. You can now browse verified dialysis centers, book treatments abroad, and manage your medical travel profile.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left text-xs space-y-2 text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Verified Email:</span>
                  <span className="font-semibold text-sky-600 flex items-center gap-1">
                    <Mail size={12} /> {email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <span className="font-bold text-emerald-700">Patient Member</span>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signin"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition text-center"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 flex items-center justify-center px-4 py-8 pt-24 sm:pt-28">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Enter the Code We Sent
          </h1>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Enter the 6-digit OTP sent to your email to verify your MedBook account.
          </p>
        </div>

        {resendSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center">
            {resendSuccess}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`w-full px-4 py-3 rounded-2xl border text-sm text-gray-800 outline-none transition ${
              emailError
                ? "border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-2xl border bg-gray-50/50 text-gray-900 outline-none transition ${
                  otpError
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : digit
                    ? "border-sky-400 bg-sky-50/30 ring-2 ring-sky-100"
                    : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
              />
            ))}
          </div>
          {otpError && (
            <p className="text-red-500 text-xs text-center mt-2">{otpError}</p>
          )}
          {verifyMutation.isError && (
            <p className="text-red-500 text-xs text-center mt-2">
              {getErrorMessage(verifyMutation.error)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-sm transition disabled:opacity-50 cursor-pointer text-sm"
        >
          {isLoading ? "Verifying..." : "Verify & Confirm"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't receive code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled}
            className={`font-semibold ${
              isResendDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-sky-600 hover:underline cursor-pointer"
            }`}
          >
            Resend Code {isResendDisabled && `(${formatTime(timeLeft)})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
