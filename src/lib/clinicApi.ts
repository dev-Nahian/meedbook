import {
  apiGet,
  apiPostForm,
  apiPostJson,
  apiPatchForm,
  apiPatchJson,
  apiPutForm,
  apiDelete,
  ApiClientError,
  type ApiEnvelope,
} from "./apiClient";

export class ClinicApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "ClinicApiError";
  }
}

export type ClinicImage = {
  id: number;
  image: string;
  image_url: string;
};

export type ClinicTreatment = {
  id?: number;
  name?: string;
  title?: string;
  treatment_name?: string;
  price?: string;
  amount?: string;
};

export type ClinicRating = {
  clinic: number;
  rating: string;
};

export type ClinicFacility = {
  id?: number;
  name?: string;
  facility_name?: string;
  title?: string;
};

export type ClinicInsurance = {
  id: number;
  insurance_name: string;
  clinic: number;
};

export type ClinicAcceptedPatient = {
  id?: number;
  name?: string;
  patient_type?: string;
  patient_name?: string;
  title?: string;
};

export type ClinicPaymentMethod = {
  id?: number;
  name?: string;
  payment_method?: string;
  payment_method_name?: string;
  title?: string;
};

export type ClinicAvailability = {
  id?: number;
  date?: string;
  day?: string;
};

type ClinicBase = {
  id: number;
  clinic: number;
  name: string;
  title: string;
  country: string;
  city: string;
  images: ClinicImage[];
  treatments: ClinicTreatment[];
  facilities: ClinicFacility[];
  insurances: ClinicInsurance[];
};

export type ClinicListItem = ClinicBase & {
  distance_from_city_center: string;
  ratings: ClinicRating[];
  average_rating: number;
};

export type ClinicDetailsItem = ClinicBase & {
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  per_treatment_price: string;
  accepted_patients: ClinicAcceptedPatient[];
  accepted_infectious?: string[];
  payment_methods: ClinicPaymentMethod[];
  availabilities: ClinicAvailability[];
};

export type AppointmentPatientDetail = {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  language: string;
};

export type AppointmentSchedule = {
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening";
};

export type AppointmentHealthStatus = {
  hivpositive: boolean;
  hvbpositive?: boolean;
  hbvpositive?: boolean;
  hcvpositive: boolean;
};

export type AppointmentInsurance = {
  ehic_holder: boolean;
  ghic_holder: boolean;
};

export type AppointmentTreatmentType = {
  treatment_type: "HD" | "HDF" | string;
};

export type AppointmentCarePartner = {
  bringing_partner: boolean;
};

export type AppointmentHomeClinic = {
  clinic_name: string;
  home_clinic_consultant_name: string;
};

export type AppointmentPayload = {
  clinic: string | number;
  patient_detail: AppointmentPatientDetail;
  schedules: AppointmentSchedule[];
  health_status: AppointmentHealthStatus;
  insurance: AppointmentInsurance;
  treatment_type: AppointmentTreatmentType;
  care_partner: AppointmentCarePartner;
  home_clinic: AppointmentHomeClinic;
  medical_reports?: File | null;
};

export type AppointmentResponseData = {
  id: number;
  user: number;
  clinic: number;
  appointment_id: string;
  schedules: {
    id: number;
    appointment: number;
    treatment_date: string;
    shift: string;
  }[];
  patient_detail: AppointmentPatientDetail & {
    id: number;
    appointment: number;
  };
  health_status: {
    id: number;
    appointment: number;
    hivpositive: boolean;
    hvbpositive: boolean;
    hcvpositive: boolean;
  };
  insurance: {
    id: number;
    appointment: number;
    ehic_holder: boolean;
    ghic_holder: boolean;
  };
  treatment_type: {
    id: number;
    appointment: number;
    treatment_type: string;
  };
  care_partner: {
    id: number;
    appointment: number;
    bringing_partner: boolean;
  };
  home_clinic: {
    id: number;
    appointment: number;
    clinic_name: string;
    home_clinic_consultant_name: string;
  };
  medical_reports?: {
    id: number;
    appointment: number;
    file_url: string;
  }[];
  status: string;
  created_at: string;
};

export type AppointmentListSchedule = {
  id: number;
  appointment: number;
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening" | string;
};

export type BookedSlot = {
  treatment_date: string;
  shift: "morning" | "afternoon" | "evening" | string;
};

type BookedSlotsResponse = {
  clinic_id: string;
  count: number;
  booked_slots: BookedSlot[];
};

export type AppointmentListItem = {
  id: number;
  user: number;
  clinic: number;
  appointment_id: string;
  schedules: AppointmentListSchedule[];
  patient_detail: AppointmentPatientDetail & {
    id: number;
    appointment: number;
  };
  health_status: {
    id: number;
    appointment: number;
    hivpositive: boolean;
    hbvpositive?: boolean;
    hvbpositive?: boolean;
    hcvpositive: boolean;
  };
  insurance: {
    id: number;
    appointment: number;
    ehic_holder: boolean;
    ghic_holder: boolean;
  };
  treatment_type: {
    id: number;
    appointment: number;
    treatment_type: "HD" | "HDF" | string;
  };
  care_partner: {
    id: number;
    appointment: number;
    bringing_partner: boolean;
  };
  home_clinic: {
    id: number;
    appointment: number;
    clinic_name: string;
    home_clinic_consultant_name: string;
  };
  medical_reports: {
    id: number;
    appointment: number;
    file_url: string;
  }[];
  status: string;
  created_at: string;
};

type AppointmentListResponse = {
  message: string;
  count: number;
  data: AppointmentListItem[];
};

export type ClinicSearchParams = {
  date: string;
  location: string;
};

type ClinicSearchResponse = {
  location: string;
  date: string;
  count: number;
  clinics: ClinicListItem[];
};

export const getClinics = async () => {
  try {
    const res = await apiGet<ApiEnvelope<{ clinics: ClinicListItem[] }>>("/clinics/");
    return res.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const searchClinics = async ({ date, location }: ClinicSearchParams) => {
  try {
    const res = await apiGet<ClinicSearchResponse>("/clinic/search/", {
      params: { date, location },
    });
    return { clinics: res.clinics ?? [] };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicDetails = async (clinicId: string | number) => {
  try {
    const res = await apiGet<ApiEnvelope<{ clinic: ClinicDetailsItem }>>(`/clinics/${clinicId}/`);
    return res.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getAppointments = async (accessToken?: string | null) => {
  try {
    return await apiGet<AppointmentListResponse>("/appointments/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getBookedSlots = async (clinicId: string | number) => {
  try {
    return await apiGet<BookedSlotsResponse>(
      `/appointments/booked-slots/?clinic_id=${encodeURIComponent(String(clinicId))}`
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};



// Book appointment API
export const createAppointment = async (
  payload: AppointmentPayload,
  accessToken?: string | null
) => {
  const formData = new FormData();

  formData.append("clinic", String(payload.clinic));
  formData.append("patient_detail", JSON.stringify(payload.patient_detail));
  formData.append("schedules", JSON.stringify(payload.schedules));
  formData.append(
    "health_status",
    JSON.stringify({
      hivpositive: Boolean(payload.health_status.hivpositive),
      hvbpositive: Boolean(payload.health_status.hvbpositive ?? payload.health_status.hbvpositive),
      hcvpositive: Boolean(payload.health_status.hcvpositive),
    })
  );
  formData.append("insurance", JSON.stringify(payload.insurance));
  formData.append("treatment_type", JSON.stringify(payload.treatment_type));
  formData.append("care_partner", JSON.stringify(payload.care_partner));
  formData.append("home_clinic", JSON.stringify(payload.home_clinic));

  if (payload.medical_reports) {
    formData.append(
      "medical_reports",
      payload.medical_reports,
      payload.medical_reports.name
    );
  }

  try {
    return await apiPostForm<ApiEnvelope<AppointmentResponseData>>("/appointments/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getAppointmentDetails = async (
  appointmentId: string | number,
  accessToken?: string | null
) => {
  try {
    return await apiGet<ApiEnvelope<AppointmentListItem>>(`/appointments/${appointmentId}/`, {
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string | number,
  status: "confirmed" | "cancelled" | "pending",
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("status", status);

  try {
    return await apiPatchForm<ApiEnvelope<AppointmentListItem>>(
      `/appointments/${appointmentId}/`,
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getBookingHistory = async (accessToken?: string | null) => {
  try {
    return await apiGet<AppointmentListResponse>("/booking-history/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicSubmissionStatus = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<{ status: string; is_approved?: boolean; message?: string }>>(
      "/clinics/submission-status/",
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicDashboard = async (
  clinicId?: string | number,
  accessToken?: string | null
) => {
  try {
    return await apiGet<ApiEnvelope<any>>(
      clinicId ? `/clinics/dashboard/?clinic_id=${clinicId}` : "/clinics/dashboard/",
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicDashboardAppointments = async (accessToken?: string | null) => {
  try {
    return await apiGet<AppointmentListResponse>("/clinics/dashboard/appointments/", {
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const submitClinicRating = async (
  clinicId: string | number,
  rating: number,
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("clinic", String(clinicId));
  formData.append("rating", String(rating));

  try {
    return await apiPostForm<ApiEnvelope<any>>("/clinics/rating/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicProfile = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<{ clinic: ClinicDetailsItem }>>("/clinics/profile/", {
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const patchClinicProfile = async (
  profileData: Record<string, any>,
  accessToken?: string | null
) => {
  try {
    return await apiPatchJson<ApiEnvelope<{ clinic: ClinicDetailsItem }>>(
      "/clinics/profile/",
      profileData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const updateClinicTreatments = async (
  payload: {
    treatments: Array<{
      treatment_name: string;
      treatment_code?: string | null;
      price: string | number;
      duration?: string | null;
      description?: string | null;
    }>;
    accepted_infectious?: string[];
  },
  accessToken?: string | null
) => {
  return await patchClinicProfile(payload, accessToken);
};

export const updateClinicProfile = async (
  profileData: Record<string, any>,
  accessToken?: string | null
) => {
  try {
    return await apiPostJson<ApiEnvelope<ClinicDetailsItem>>(
      "/clinics/profile/",
      profileData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const updateClinicMediaAndAvailability = async (
  images?: File[],
  availabilities?: { date: string }[],
  accessToken?: string | null
) => {
  const formData = new FormData();
  if (images && images.length > 0) {
    images.forEach((img) => formData.append("images", img, img.name));
  }
  if (availabilities) {
    formData.append("availabilities", JSON.stringify(availabilities));
  }

  try {
    return await apiPatchForm<ApiEnvelope<ClinicDetailsItem>>(
      "/clinics/profile/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const checkoutAppointment = async (
  payload: {
    appointment_id: string | number;
    success_url: string;
    cancel_url: string;
    price_id?: string;
  },
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("appointment_id", String(payload.appointment_id));
  formData.append("success_url", payload.success_url);
  formData.append("cancel_url", payload.cancel_url);
  if (payload.price_id) formData.append("price_id", payload.price_id);

  try {
    return await apiPostForm<ApiEnvelope<{ url?: string; session_id?: string }>>(
      "/checkout/appointment/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicStats = async () => {
  try {
    return await apiGet<ApiEnvelope<any>>("/clinic/stats/");
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export type ClinicRegisterPayload = {
  clinic_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  password?: string;
  confirm_password?: string;
  join_network?: boolean;
  privacy_and_terms_accepted?: boolean;
  public_activation?: boolean;
  compliance_confirmed?: boolean;
  accepted_infectious?: string;
  total_beds?: string | number;
  facility_license_number?: string;
  accreditation_authority?: string;
  medical_license_document?: File | null;
};

export type ClinicRegisterResponse = {
  id?: number;
  clinic_name?: string;
  contact_person?: string;
  email?: string;
  phone_number?: string;
  status?: string;
  [key: string]: any;
};

export const registerClinic = async (
  payload: ClinicRegisterPayload,
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("clinic_name", payload.clinic_name);
  formData.append("contact_person", payload.contact_person);
  formData.append("email", payload.email);
  formData.append("phone_number", payload.phone_number);

  if (payload.password) formData.append("password", payload.password);
  if (payload.confirm_password) formData.append("confirm_password", payload.confirm_password);

  formData.append("join_network", payload.join_network ? "True" : "False");
  formData.append(
    "privacy_and_terms_accepted",
    payload.privacy_and_terms_accepted ? "True" : "False"
  );
  formData.append("public_activation", payload.public_activation ? "true" : "false");
  formData.append("compliance_confirmed", payload.compliance_confirmed ? "true" : "false");

  if (payload.accepted_infectious) {
    formData.append("accepted_infectious", payload.accepted_infectious);
  }
  if (payload.total_beds !== undefined && payload.total_beds !== null) {
    formData.append("total_beds", String(payload.total_beds));
  }
  if (payload.facility_license_number) {
    formData.append("facility_license_number", payload.facility_license_number);
  }
  if (payload.accreditation_authority) {
    formData.append("accreditation_authority", payload.accreditation_authority);
  }
  if (payload.medical_license_document) {
    formData.append("medical_license_document", payload.medical_license_document);
  }

  try {
    return await apiPostForm<ApiEnvelope<ClinicRegisterResponse>>(
      "/clinics/register/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const updateClinicRegistrationDocuments = async (
  payload: {
    facility_license_number?: string;
    accreditation_authority?: string;
    medical_license_document?: File | null;
  },
  accessToken?: string | null
) => {
  const formData = new FormData();
  if (payload.facility_license_number) {
    formData.append("facility_license_number", payload.facility_license_number);
  }
  if (payload.accreditation_authority) {
    formData.append("accreditation_authority", payload.accreditation_authority);
  }
  if (payload.medical_license_document) {
    formData.append("medical_license_document", payload.medical_license_document);
  }

  try {
    return await apiPutForm<ApiEnvelope<ClinicRegisterResponse>>(
      "/clinics/register/",
      formData,
      { accessToken }
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getClinicRegistration = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<ClinicRegisterResponse>>("/clinics/register/", {
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

// ─── Clinic Treatments ────────────────────────────────────────────────────────
export const getClinicTreatments = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>("/clinics/treatments/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

// ─── Available Slots & Capacity ───────────────────────────────────────────────
export const getAvailableSlots = async (clinicId: string | number, accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>(`/available-slots/?clinic_id=${clinicId}`, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getAppointmentPerSlotLimit = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>("/appointmentper-slot/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const createAppointmentPerSlotLimit = async (
  payload: { clinic: string | number; date: string; shift: string; max_limit: string | number },
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("clinic", String(payload.clinic));
  formData.append("date", payload.date);
  formData.append("shift", payload.shift);
  formData.append("max_limit", String(payload.max_limit));

  try {
    return await apiPostForm<ApiEnvelope<any>>("/appointmentper-slot/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const editSlotCapacity = async (
  slotId: string | number,
  formData: FormData,
  accessToken?: string | null
) => {
  try {
    return await apiPutForm<ApiEnvelope<any>>(`/slot-capacity/${slotId}/`, formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const deleteSlotCapacity = async (slotId: string | number, accessToken?: string | null) => {
  try {
    return await apiDelete<ApiEnvelope<any>>(`/slot-capacity/${slotId}/`, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

// ─── Availability & Shifts ────────────────────────────────────────────────────
export const getAvailabilityShifts = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>("/availability-shifts/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const updateAvailabilityShifts = async (scheduleData: Record<string, any>, accessToken?: string | null) => {
  try {
    return await apiPostJson<ApiEnvelope<any>>("/availability-shifts/", scheduleData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const addBlackoutDate = async (
  blackoutData: { clinic_id: number | string; date: string; reason: string },
  accessToken?: string | null
) => {
  try {
    return await apiPostJson<ApiEnvelope<any>>("/blackout-dates/", blackoutData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const getSubscriptionPackages = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>("/subscription/packages/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getCurrentSubscription = async (accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>("/current/subscription/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const cancelSubscription = async (priceId: string, accessToken?: string | null) => {
  const formData = new FormData();
  formData.append("price_id", priceId);

  try {
    return await apiPostForm<ApiEnvelope<any>>("/cancel/subscription/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const saveDeviceToken = async (
  token: string,
  deviceType: "android" | "ios" | "web",
  accessToken?: string | null
) => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("device_type", deviceType);

  try {
    return await apiPostForm<ApiEnvelope<any>>("/device-token/", formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getNotifications = async (tab: "new" | "earlier" = "new", accessToken?: string | null) => {
  try {
    return await apiGet<ApiEnvelope<any>>(`/notification-list/?tab=${tab}`, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const markNotificationRead = async (id: number | string, accessToken?: string | null) => {
  const formData = new FormData();
  try {
    return await apiPostForm<ApiEnvelope<any>>(`/mark-read/${id}/`, formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const markAllNotificationsRead = async (tab: "earlier" | "new" = "earlier", accessToken?: string | null) => {
  const formData = new FormData();
  try {
    return await apiPostForm<ApiEnvelope<any>>(`/mark-all-read/?tab=${tab}`, formData, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const deleteNotification = async (id: number | string, accessToken?: string | null) => {
  try {
    return await apiDelete<ApiEnvelope<any>>(`/delete/${id}/`, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};

export const deleteAllNotifications = async (accessToken?: string | null) => {
  try {
    return await apiDelete<ApiEnvelope<any>>("/delete-all/", { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new ClinicApiError(error.message, error.status);
    }
    throw error;
  }
};


