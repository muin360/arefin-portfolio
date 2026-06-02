export type AdminStats = {
  totalPosts: number;
  totalProjects: number;
  totalSubmissions: number;
  unreadSubmissions: number;
};

export type AdminSubmission = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message?: string;
  _createdAt: string;
  read?: boolean;
};

export type AdminPost = {
  _id: string;
  title: string;
  slug: { current: string } | null;
  publishedAt: string | null;
  excerpt: string | null;
  coverImage: string | null;
};

export type AdminProject = {
  _id: string;
  title: string;
  slug: { current: string } | null;
  summary: string | null;
  url: string | null;
  tags: string[] | null;
  coverImage: string | null;
};
