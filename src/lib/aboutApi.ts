import { apiGet, ApiClientError, type ApiEnvelope } from "./apiClient";

export type AboutStatistic = {
  id: number;
  title: string;
  value: string;
  order: number;
};

export type AboutTeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  order: number;
};

export type AboutWhyChooseUs = {
  id: number;
  title: string;
  description: string;
  icon_class: string;
};

export type AboutMissionVision = {
  id: number;
  title: string;
  description: string;
  image: string;
  section_type: "mission" | "vision" | string;
};

export type AboutUsResponse = {
  statistics: AboutStatistic[];
  team_members: AboutTeamMember[];
  why_choose_us: AboutWhyChooseUs[];
  mission_vision: AboutMissionVision[];
};

export class AboutApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "AboutApiError";
  }
}

export const getAboutUs = async (): Promise<AboutUsResponse> => {
  try {
    const result = await apiGet<ApiEnvelope<AboutUsResponse> | AboutUsResponse>("/about-us/");

    if ("data" in result && result.data) {
      return result.data;
    }

    return result as AboutUsResponse;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new AboutApiError(error.message, error.status);
    }
    throw error;
  }
};
