// Temporary types and empty data - will be replaced with real API data

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  image: string;
  timestamp: string;
  isViewed?: boolean;
  isLive?: boolean;
}

export const currentUser: User = {
  id: "",
  username: "",
  name: "",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
};

export const users: User[] = [];
export const posts: Post[] = [];
export const stories: Story[] = [];
export const suggestions: User[] = [];
export const messages: any[] = [];
export const notifications: any[] = [];
