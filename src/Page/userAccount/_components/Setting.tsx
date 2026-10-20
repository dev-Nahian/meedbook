"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changePassword, ApiError } from "../../../lib/authApi";
import { useAuthStore } from "../../../store/authStore";

const Setting = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [language, setLanguage] = useState("English");
  const [showDropdown, setShowDropdown] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const languages = ["English", "Spanish", "French", "German", "Arabic", "Bengali"];

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      changePassword(
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        accessToken!
      ),
    onSuccess: () => {
      setSuccessMessage("Password changed successfully!");
      setErrorMessage(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: unknown) => {
      setSuccessMessage(null);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to change password. Please check your credentials.");
      }
    },
  });

  const handleUpdatePassword = () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }
    if (!accessToken) {
      setErrorMessage("Please sign in to change your password.");
      return;
    }

    changePasswordMutation.mutate();
  };

  return (
    <div className="bg-gray-100 rounded-xl p-7">
      {/* Security Settings Header */}
      <h2 className="text-base font-semibold text-gray-800 mb-1">Security Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        Adjust your preferences and personalize your experience.
      </p>

      {/* Language Preference */}
      <div className="mb-7">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language Preference
        </label>
        <div className="relative w-64">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-gray-300 transition-colors focus:outline-none"
          >
            {language}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute z-10 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    language === lang ? "text-sky-500 font-medium" : "text-gray-700"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6" />

      {/* Change Password Header */}
      <h3 className="text-base font-semibold text-gray-800 mb-1">Change Password</h3>
      <p className="text-sm text-gray-500 mb-5">
        Update your password to keep your account secure.
      </p>

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold max-w-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold max-w-sm">
          {errorMessage}
        </div>
      )}

      {/* Password Fields */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Update Password Button */}
        <button
          onClick={handleUpdatePassword}
          disabled={changePasswordMutation.isPending}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-1 cursor-pointer flex items-center justify-center gap-2"
        >
          {changePasswordMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default Setting;