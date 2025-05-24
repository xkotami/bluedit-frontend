export type User = {
  id?: number;
  username: string;
  email: string;
  points: number;
  password: string;
}

export type Comment = {
  id?: number;
  text: string;
  createdAt: Date;
  points: number;
  createdBy: User;
  parent?: Comment;
  replies: Comment[];
}

export type Post = {
  id?: number;
  title: string;
  content: string;
  user: User;
  comments: Comment[];
  createdAt: Date;
}

export type Community = {
  id?: number;
  posts: Post[];
  users: User[];
  name: string;
  description: string;
  createdAt: Date;
}