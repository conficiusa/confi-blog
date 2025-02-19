import { Model, model, models, Schema } from "mongoose";
import { IUser } from "@/lib/definitions";

// User Schema
const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    image: { type: String },
    role: {
      type: String,
      enum: ["admin", "reader"],
      required: function (this: IUser) {
        return this.isNew ? false : true; // Required during onboarding
      },
    },
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
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre<IUser>("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }
  next();
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
