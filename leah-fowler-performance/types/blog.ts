// Blog Type Definitions
export type ContentType = 'article' | 'case_study' | 'research_paper' | 'video_post';
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Author {
  id: string;
  user_id?: string;
  slug: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  expertise?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  meta_title?: string;
  meta_description?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string; // MDX content
  excerpt?: string;
  featured_image?: string;
  featured_image_alt?: string;
  featured_image_caption?: string;
  category_id?: string;
  category?: Category;
  author_id?: string;
  author?: Author;

  // Content type
  content_type: ContentType;

  // Status management
  status: PostStatus;
  published_at?: string;
  scheduled_for?: string;

  // SEO metadata
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  og_title?: string;
  og_description?: string;
  canonical_url?: string;

  // Content metadata
  reading_time?: number;
  word_count?: number;
  difficulty_level?: DifficultyLevel;

  // Engagement metrics
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;

  // Feature flags
  is_featured: boolean;
  is_premium: boolean;
  allow_comments: boolean;
  show_toc: boolean;
  show_related: boolean;

  // Additional metadata
  custom_css?: string;
  custom_js?: string;
  video_url?: string;
  research_data?: Record<string, unknown>;
  case_study_results?: Record<string, unknown>;

  // Relations
  tags?: Tag[];
  related_posts?: Post[];

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PostRevision {
  id: string;
  post_id: string;
  title: string;
  content: string;
  excerpt?: string;
  meta_data?: Record<string, unknown>;
  revision_number: number;
  revision_message?: string;
  author_id?: string;
  author?: Author;
  created_at: string;
}

export interface PostView {
  id: string;
  post_id: string;
  viewer_ip?: string;
  viewer_country?: string;
  viewer_city?: string;
  referrer_url?: string;
  user_agent?: string;
  session_id?: string;
  user_id?: string;
  viewed_at: string;
  time_on_page?: number;
}

export interface BlogSettings {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

// Form types for creating/editing
export interface PostFormData {
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  featured_image_alt?: string;
  featured_image_caption?: string;
  category_id?: string;
  content_type: ContentType;
  status: PostStatus;
  scheduled_for?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image?: string;
  og_title?: string;
  og_description?: string;
  canonical_url?: string;
  difficulty_level?: DifficultyLevel;
  is_featured: boolean;
  is_premium: boolean;
  allow_comments: boolean;
  show_toc: boolean;
  show_related: boolean;
  tags: string[]; // tag IDs
  video_url?: string;
  research_data?: Record<string, unknown>;
  case_study_results?: Record<string, unknown>;
}

// API response types
export interface BlogListResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface RelatedPostsResponse {
  posts: Post[];
}

export interface SearchResponse {
  posts: Post[];
  query: string;
  total: number;
}