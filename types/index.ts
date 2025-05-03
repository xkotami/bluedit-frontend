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
  description?: string;
  user: User;
  comments: Comment[];
}

export type Comment = {
  id: number;
  text: string;
  createdAt: Date;
  points: number;
  createdBy: User;
  replies: Comment[];
  parent?: Comment;
}

export type Community = {
  id: number;
  name: string;
  description: string;
  posts: Post[];
  users: User[];
}