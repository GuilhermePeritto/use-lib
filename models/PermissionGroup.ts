import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IPermissionGroup extends Document {
  name: string;
  description: string;
  permissions: {
    [key: string]: string[];
  };
  users: mongoose.Types.ObjectId[] | IUser[];
}

export const permissionGroupSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  permissions: { type: Map, of: [String], default: {} }, // Permissões como um mapa
  users: [{ type: Schema.Types.ObjectId, ref: "User" }], // Referência aos usuários
}, { strict: false });

export const PermissionGroupModel =
  mongoose.models.PermissionGroup ||
  mongoose.model<IPermissionGroup>("PermissionGroup", permissionGroupSchema);