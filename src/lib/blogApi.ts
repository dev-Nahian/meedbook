import { apiGet, ApiClientError } from "./apiClient";

export type BlogSocialLink = {
  platform_name: string;
  link: string;
};

export type BlogListItem = {
  id: number;
  language: number;
  language_code: string;
  language_name: string;
  title: string;
  image_url: string | null;
  short_description: string;
  published_date: string;
  social_links: BlogSocialLink[];
};

export type BlogDetailItem = BlogListItem & {
  content: string;
};

export type BlogListResponse = {
  message: string;
  requested_language: string;
  count: number;
  data: BlogListItem[];
};

export type BlogDetailResponse = {
  message: string;
  blog_detail: BlogDetailItem;
};

export class BlogApiError extends ApiClientError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = "BlogApiError";
  }
}

export const getBlogs = async (): Promise<BlogListResponse> => {
  try {
    return await apiGet<BlogListResponse>("/blogs/");
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new BlogApiError(error.message, error.status);
    }
    throw error;
  }
};

export const getBlogDetails = async (blogId: string | number): Promise<BlogDetailItem> => {
  try {
    const res = await apiGet<BlogDetailResponse>(
      `/blogs/${encodeURIComponent(String(blogId))}/`
    );
    return res.blog_detail;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new BlogApiError(error.message, error.status);
    }
    throw error;
  }
};
