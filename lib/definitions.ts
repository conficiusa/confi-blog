import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  role: string;
  interests: string[];
}

export interface IComment extends Document {
  postId: string;
  user?: {
    name: string;
    userId: string;
    image: string;
  };
  content: string;
  likes: string[]; // array of userIds who liked the comment
  parentId?: string | null; // if this is a reply, the parent comment's id
  createdAt: Date;
  updatedAt: Date;
  replies?: string[];
}

export interface Comment {
  postId: string;
  id: string;
  user?: {
    name: string;
    userId: string;
    image: string;
  };
  content: string;
  likes: string[]; // array of userIds who liked the comment
  parentId?: string | null; // if this is a reply, the parent comment's id
  createdAt: Date;
  updatedAt: Date;
  replies: string[];
}

// You can also export a type for creating a comment, omitting _id, createdAt, updatedAt
export interface CommentInput {
  postId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}
