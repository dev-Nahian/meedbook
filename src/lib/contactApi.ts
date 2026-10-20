import { apiPostForm, ApiClientError, type ApiEnvelope } from "./apiClient";

export type ContactSubmitPayload = {
  fullName: string;
  email: string;
  queryType: string;
  message: string;
  isAgree: boolean;
};

export type ContactSubmitResponse = {
  id: number;
  full_name: string;
  email: string;
  query_type: string;
  message: string;
  created_at: string;
};

export class ContactApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "ContactApiError";
  }
}

export const submitContactMessage = async (
  payload: ContactSubmitPayload,
  accessToken?: string | null
) => {
  if (accessToken) {
    const authForm = new FormData();
    authForm.append("full_name", payload.fullName);
    authForm.append("email", payload.email);
    authForm.append("query_type", payload.queryType);
    authForm.append("message", payload.message);
    authForm.append("is_agree", String(payload.isAgree));

    try {
      return await apiPostForm<ApiEnvelope<ContactSubmitResponse>>("/contact-submit/", authForm, { accessToken });
    } catch (error) {
      if (error instanceof ApiClientError && error.status !== 401 && error.status !== 404) {
        throw new ContactApiError(error.message, error.status);
      }
    }
  }

  // Fallback to public /contact-us/
  const publicForm = new FormData();
  publicForm.append("name", payload.fullName);
  publicForm.append("email", payload.email);
  publicForm.append("purpose", payload.queryType || "general_inquiry");
  publicForm.append("message", payload.message);

  try {
    return await apiPostForm<ApiEnvelope<ContactSubmitResponse>>("/contact-us/", publicForm);
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ContactApiError(error.message, error.status);
    }
    throw error;
  }
};
