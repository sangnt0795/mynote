export type UserRole = 'root' | 'admin' | 'user';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'locked';
export type Visibility = 'private' | 'public' | 'shared';
export type TopicType = 'skill' | 'lesson' | 'tool' | 'other';
export type MediaType = 'image' | 'video' | 'file' | 'link';
export type MediaSource = 'google_drive' | 'facebook' | 'youtube' | 'local' | 'other';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  employeeCode?: string;
  phone?: string;
  department?: string;
  position?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
  approvedAt?: unknown | null;
  approvedBy?: string | null;
  deletedAt?: unknown | null;
  deletedBy?: string | null;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  active: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown | null;
  deletedBy?: string | null;
}

export interface Topic {
  topicId: string;
  categoryId: string;
  title: string;
  slug: string;
  description?: string;
  type: TopicType;
  order: number;
  active: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown | null;
  deletedBy?: string | null;
}

export interface MediaLink {
  type: MediaType;
  source: MediaSource;
  url: string;
  title?: string;
  thumbnail?: string;
  description?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  durationSeconds?: number | null;
  order?: number;
}

export interface Note {
  noteId: string;
  userId: string;
  categoryId: string;
  topicId?: string | null;
  title: string;
  description?: string;
  content?: string;
  mediaLinks: MediaLink[];
  visibility: Visibility;
  tags: string[];
  searchKeywords: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown | null;
  deletedBy?: string | null;
  deleteReason?: string | null;
}

export interface QuickFilter {
  filterId: string;
  name: string;
  categoryId?: string | null;
  topicId?: string | null;
  tags?: string[];
  visibility: 'system' | 'private' | 'public';
  userId?: string | null;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  deletedAt?: unknown | null;
  deletedBy?: string | null;
}
