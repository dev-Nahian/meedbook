"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, updateAvatar, ApiError, type UserProfile } from "../../../lib/authApi";
import { useAuthStore } from "../../../store/authStore";

const MyProfile = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const pendingFullName = useAuthStore((state) => state.pendingFullName);

  const initialName =
    user?.full_name ||
    (user as any)?.name ||
    pendingFullName ||
    "";

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: initialName,
    gender: "Male",
    dob: "",
    nationality: "",
    address: "",
    email: user?.email || "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch real profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile", accessToken],
    queryFn: () => getProfile(accessToken!),
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    if (profileData) {
      setForm((prev) => ({
        ...prev,
        fullName: profileData.full_name || prev.fullName || initialName,
        gender: profileData.gender || prev.gender || "Male",
        dob: profileData.dob || prev.dob || "",
        nationality: profileData.nationality || prev.nationality || "",
        address: profileData.address || prev.address || "",
        email: profileData.email || prev.email || user?.email || "",
        phone: profileData.phone || prev.phone || "",
      }));
      if (profileData.avatar) {
        setAvatarPreview(profileData.avatar);
      }
    }
  }, [profileData, user, initialName]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) =>
      updateProfile(data, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", accessToken] });
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: unknown) => {
      setSuccessMessage(null);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to update profile. Please try again.");
      }
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => updateAvatar(file, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", accessToken] });
      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) setErrorMessage(err.message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      if (accessToken) {
        avatarMutation.mutate(file);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!accessToken) {
      setErrorMessage("Please sign in to update your profile.");
      return;
    }

    updateProfileMutation.mutate({
      full_name: form.fullName.trim(),
      gender: form.gender,
      dob: form.dob,
      nationality: form.nationality.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-[14px] py-[10px] text-sm text-gray-700 border rounded-lg outline-none bg-white transition ${
      hasError
        ? "border-red-400 focus:border-red-400"
        : "border-gray-200 focus:border-sky-400"
    }`;

  return (
    <div className="bg-gray-100 rounded-xl p-7">
      {/* Header */}
      <h2 className="text-base font-semibold text-gray-900 mb-1">My Profile</h2>
      <p className="text-xs text-gray-500 mb-6">
        Manage your personal information and keep your profile up to date.
      </p>

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Avatar */}
      <div className="mb-7">
        <p className="text-[0.82rem] font-medium text-gray-700 mb-2.5">Profile Photo</p>
        <div className="flex items-end">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-300">
              <img
                src={avatarPreview || "https://i.pravatar.cc/56?img=47"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 bg-white border border-gray-200 rounded-full w-5.5 h-5.5 flex items-center justify-center cursor-pointer p-0 hover:bg-gray-50"
            >
              <svg width="11" height="11" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <span className="text-[0.72rem] text-gray-500 ml-1.5 mb-0.5">
            {avatarMutation.isPending ? "Uploading..." : "Edit"}
          </span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
          {/* Full Name */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={inputClass(!!errors.fullName)}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`${inputClass(!!errors.gender)} appearance-none cursor-pointer pr-9`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Date of Birth</label>
            <div className="relative">
              <input
                ref={dobRef}
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`${inputClass(!!errors.dob)} pr-10`}
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Nationality</label>
            <input
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder="Enter your nationality"
              className={inputClass(!!errors.nationality)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={inputClass(false)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputClass(!!errors.email)}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-[0.8rem] font-medium text-gray-700 mb-1.5">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={inputClass(!!errors.address)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-7">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || isProfileLoading}
            className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300 text-white rounded-lg px-6 py-2 text-sm font-medium transition cursor-pointer flex items-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;