export type User = {
  id: number;
  username: string;
  email: string;
  points: number;
  password: string;
};

export type Post = {
  id: number;
  title: string;
  content?: string;
  user: User;
  comments: Comment[];
  createdAt: Date;
}

export type Comment = {
  id: number;
  text: string;
  points: number;
  createdBy: User;
  replies: Comment[];
  parent?: Comment;
  createdAt: Date;
}

export type Community = {
  id: number;
  name: string;
  description: string;
  posts: Post[];
  users: User[];
  createdAt: Date;
}

export interface UserData {
  token: string
  email: string
  id: string
}