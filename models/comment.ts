import { type IComment } from "@/lib/definitions";
import { Model, model, models, Schema } from "mongoose";

const CommentSchema = new Schema<IComment, Model<IComment>>(
  {
    postId: {
      type: String,
      required: [true, "Post ID is required"],
    },
    user: {
      name: {
        type: String,
        required: [true, "User name is required"],
      },
      image: {
        type: String,
        required: [true, "User image is required"],
      },
      userId: {
        type: String,
        required: [true, "User ID is required"],
      },
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
    },
    likes: [
      {
        type: String,
        default: [],
      },
    ],
    parentId: {
      type: String,
      default: null,
    },
    replies: [
      {
        type: String,
        default: [],
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
