import mongoose, { Document, Schema } from "mongoose";

export interface IPermissionGroup extends Document {
  name: string;
  description: string;
  permissions: {
    [key: string]: string[];
  };
  users: mongoose.Types.ObjectId[];
}

export const permissionGroupSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  permissions: { type: Map, of: [String], default: {} }, // Permissões como um mapa
  users: [{ type: Schema.Types.ObjectId, ref: "user" }], // Referência aos usuários
});

const PermissionGroupModel =
  mongoose.models.PermissionGroup ||
  mongoose.model("permissionGroup", permissionGroupSchema);

export default PermissionGroupModel;