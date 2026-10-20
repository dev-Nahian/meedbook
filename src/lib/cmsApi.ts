import { apiGet, ApiClientError, type ApiEnvelope } from "./apiClient";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

export type ResourceItem = {
  id: number;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  image_url?: string;
  created_at?: string;
};

export type LanguageItem = {
  id: number;
  code: string;
  name: string;
};

export class CmsApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "CmsApiError";
  }
}

export const getFaqs = async (): Promise<FaqItem[]> => {
  try {
    const res = await apiGet<ApiEnvelope<FaqItem[]> | FaqItem[]>("/faqs/");
    if (Array.isArray(res)) return res;
    if ("data" in res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getResources = async (): Promise<ResourceItem[]> => {
  try {
    const res = await apiGet<ApiEnvelope<ResourceItem[]> | ResourceItem[]>("/resources/");
    if (Array.isArray(res)) return res;
    if ("data" in res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getResourceDetails = async (id: string | number): Promise<ResourceItem> => {
  try {
    const res = await apiGet<ApiEnvelope<ResourceItem> | ResourceItem>(`/resources/${id}/`);
    if ("data" in res && res.data) return res.data;
    return res as ResourceItem;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getLanguages = async (): Promise<LanguageItem[]> => {
  try {
    const res = await apiGet<ApiEnvelope<LanguageItem[]> | LanguageItem[]>("/languages/");
    if (Array.isArray(res)) return res;
    if ("data" in res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export type ContactInfoItem = {
  id?: number;
  email?: string;
  phone?: string;
  address?: string;
  support_hours?: string;
  emergency_hotline?: string;
};

export const getContactInfo = async (): Promise<ContactInfoItem> => {
  try {
    const res = await apiGet<ApiEnvelope<ContactInfoItem> | ContactInfoItem>("/contact-info/");
    if ("data" in res && res.data) return res.data;
    return res as ContactInfoItem;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export type HappyPatientItem = {
  id: number;
  name?: string;
  full_name?: string;
  patient_name?: string;
  location?: string;
  country?: string;
  city?: string;
  avatar?: string | null;
  image?: string | null;
  text?: string;
  message?: string;
  review?: string;
  comment?: string;
  rating?: number;
};

export const getHappyPatients = async (): Promise<HappyPatientItem[]> => {
  try {
    const res = await apiGet<ApiEnvelope<HappyPatientItem[]> | HappyPatientItem[]>("/happy-patients/");
    if (Array.isArray(res)) return res;
    if ("data" in res && Array.isArray(res.data)) return res.data;
    return [];
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};

export type AboutSystemItem = {
  title?: string;
  description?: string;
  mission?: string;
  vision?: string;
  statistics?: Record<string, any>;
  [key: string]: any;
};

export const getAboutSystem = async (): Promise<AboutSystemItem> => {
  try {
    const res = await apiGet<ApiEnvelope<AboutSystemItem> | AboutSystemItem>("/about-system/");
    if ("data" in res && res.data) return res.data;
    return res as AboutSystemItem;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new CmsApiError(error.message, error.status);
    }
    throw error;
  }
};
