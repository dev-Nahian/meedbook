import {
  apiGet,
  apiPostForm,
  apiPutForm,
  ApiClientError,
  type ApiEnvelope,
  type ApiErrorBody,
} from "./apiClient";

export type AccountType = "PATIENT" | "CLINIC_OWNER";

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termAndCondition: boolean;
  privacyPolicy: boolean;
  accountType: AccountType;
  country?: string;
  phone?: string;
};

export type SignupResponse = {
  id: number;
  email: string;
  message: string;
  role: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  purpose?: "signup" | "password_reset";
};

export type VerifyOtpResponse = {
  user: {
    id: number;
    email: string;
    avatar: string | null;
    is_verified: boolean;
  };
  access_token: string;
  refresh_token: string;
};

export type SigninPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  avatar: string | null;
  role: string;
  full_name?: string;
  name?: string;
};

export type SigninResponse = {
  user: AuthUser;
  refresh: string;
  access: string;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
  gender?: string;
  nationality?: string;
  phone?: string;
  dob?: string;
  address?: string;
  avatar?: string | null;
  role?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
};

export type SendOtpPayload = {
  email: string;
  purpose: "password_reset" | "signup";
};

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
  confirmPassword: string;
  purpose?: "password_reset";
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export class ApiError extends ApiClientError {
  constructor(message: string, status?: number, details?: ApiErrorBody) {
    super(message, status, details);
    this.name = "ApiError";
  }
}

const postFormFields = async <T>(
  path: string,
  values: Record<string, string | boolean | undefined>,
  options?: { accessToken?: string | null }
): Promise<ApiEnvelope<T>> => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  try {
    return await apiPostForm<ApiEnvelope<T>>(path, formData, options);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const signup = (payload: SignupPayload) =>
  postFormFields<SignupResponse>("/signup/", {
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password,
    confirm_password: payload.confirmPassword,
    term_and_condition_accepted: payload.termAndCondition,
    privacy_policy_accepted: payload.privacyPolicy,
    privacy_and_terms_accepted: payload.termAndCondition && payload.privacyPolicy,
    purpose: "signup",
    account_type: payload.accountType,
    country: payload.country,
    phone: payload.phone,
  });

export const verifySignupOtp = (payload: VerifyOtpPayload) =>
  postFormFields<VerifyOtpResponse>("/verify-otp/", {
    email: payload.email,
    otp: payload.otp,
    purpose: payload.purpose ?? "signup",
  });

export const sendOtp = (payload: SendOtpPayload) =>
  postFormFields<{ message: string }>("/send-otp/", {
    email: payload.email,
    purpose: payload.purpose,
  });

export const resendOtp = (payload: SendOtpPayload) =>
  postFormFields<{ message: string; otp?: string }>("/resend-otp/", {
    email: payload.email,
    purpose: payload.purpose,
  });

export const resetPassword = (payload: ResetPasswordPayload) =>
  postFormFields<{ message: string }>("/reset-password/", {
    email: payload.email,
    new_password: payload.newPassword,
    confirm_password: payload.confirmPassword,
    purpose: payload.purpose ?? "password_reset",
  });

export const signin = (payload: SigninPayload) =>
  postFormFields<SigninResponse>("/signin/", {
    email: payload.email,
    password: payload.password,
  });

export const signout = async (accessToken: string, refreshToken: string) => {
  const formData = new FormData();
  formData.append("refresh_token", refreshToken);

  try {
    return await apiPostForm<ApiEnvelope<unknown>>(
      "/signout/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const refreshTokenApi = async (refreshToken: string) => {
  const formData = new FormData();
  formData.append("refresh", refreshToken);

  try {
    return await apiPostForm<ApiEnvelope<{ access: string; refresh?: string }>>(
      "/token/refresh/",
      formData
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const changePassword = (
  payload: ChangePasswordPayload,
  accessToken: string
) =>
  postFormFields<{ message: string }>(
    "/change-password/",
    {
      old_password: payload.oldPassword,
      new_password: payload.newPassword,
      confirm_password: payload.confirmPassword,
    },
    { accessToken }
  );

export const getProfile = async (accessToken: string): Promise<UserProfile> => {
  try {
    const res = await apiGet<any>("/profile-get/", {
      accessToken,
    });
    const p =
      res?.data?.profile ||
      res?.data?.user ||
      res?.data ||
      res?.profile ||
      res?.user ||
      res ||
      {};

    return {
      id: p.id || 0,
      email: p.email || "",
      full_name: p.full_name || p.name || p.user_name || "",
      gender: p.gender || "",
      nationality: p.nationality || "",
      phone: p.phone || p.phone_number || "",
      dob: p.dob || p.date_of_birth || "",
      address: p.address || "",
      avatar: p.avatar || p.avatar_url || null,
      role: p.role || "",
      linkedin: p.linkedin || "",
      github: p.github || "",
      twitter: p.twitter || "",
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const updateProfile = async (
  profile: Partial<UserProfile>,
  accessToken: string
) => {
  const formData = new FormData();
  if (profile.full_name) formData.append("full_name", profile.full_name);
  if (profile.gender) formData.append("gender", profile.gender);
  if (profile.nationality) formData.append("nationality", profile.nationality);
  if (profile.email) formData.append("email", profile.email);
  if (profile.phone) formData.append("phone", profile.phone);
  if (profile.dob) formData.append("dob", profile.dob);
  if (profile.address) formData.append("address", profile.address);
  if (profile.linkedin) formData.append("linkedin", profile.linkedin);
  if (profile.github) formData.append("github", profile.github);
  if (profile.twitter) formData.append("twitter", profile.twitter);

  try {
    return await apiPutForm<ApiEnvelope<UserProfile>>("/profile-update/", formData, {
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const updateAvatar = async (file: File, accessToken: string) => {
  const formData = new FormData();
  formData.append("avatar", file, file.name);

  try {
    return await apiPostForm<ApiEnvelope<{ avatar_url?: string; avatar?: string }>>(
      "/avatar-update/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

export const googleAuth = async (idToken: string) => {
  const formData = new FormData();
  formData.append("id_token", idToken);

  try {
    return await apiPostForm<ApiEnvelope<SigninResponse>>("/google-auth/", formData);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ApiError(error.message, error.status, error.details);
    }
    throw error;
  }
};

