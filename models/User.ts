import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";
import { IPermissionGroup } from "./PermissionGroup";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status: "ativo" | "inativo";
  useGroupPermissions: boolean;
  permissionGroup: mongoose.Types.ObjectId | IPermissionGroup;
  permissions?: {
    [key: string]: string[];
  };
  createdAt: Date;
  lastLogin?: Date;
  lastPasswordChange?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "./placeholder.svg" },
  status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
  useGroupPermissions: { type: Boolean, default: true },
  permissionGroup: { type: Schema.Types.ObjectId, ref: "PermissionGroup" },
  permissions: { type: Map, of: [String], default: {} },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  lastPasswordChange: { type: Date },
}, { strict: false });

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;