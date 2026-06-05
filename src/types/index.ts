export interface User {
  id: string;
  name: string;
  avatar_url: string | null;
  memory_message: string | null;
  visitor_identifier: string;
  created_at: string;
}

export interface Photo {
  id: string;
  image_url: string;
  drive_file_id: string | null;
  caption: string | null;
  heart_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Signature {
  id: string;
  user_id: string | null;
  author_name: string;
  note: string | null;
  position_x: number;
  position_y: number;
  color: string;
  created_at: string;
}

export interface PhotoHeart {
  id: string;
  photo_id: string;
  visitor_identifier: string;
  created_at: string;
}

export interface Stats {
  totalPhotos: number;
  totalMessages: number;
  totalSignatures: number;
  totalHearts: number;
  totalVisitors: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  emoji: string;
  photo?: string;
}

export interface VisitorProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  memory_message: string | null;
  visitor_identifier: string;
}
