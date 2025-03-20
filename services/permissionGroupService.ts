import { convertModelToType, convertTypeToModel } from "@/lib/utils";
import PermissionGroupModel, { IPermissionGroup } from "@/models/PermissionGroup";
import { PermissionGroup } from "@/types/permission-group";

export const createPermissionGroup = async (
  permissionGroupData: PermissionGroup
): Promise<PermissionGroup> => {
  const permissionGroupModelData = convertTypeToModel<PermissionGroup, IPermissionGroup>(permissionGroupData);
  const permissionGroup = new PermissionGroupModel(permissionGroupModelData);
  const savedPermissionGroup = await permissionGroup.save();
  return convertModelToType<IPermissionGroup, PermissionGroup>(savedPermissionGroup);
};

export const getPermissionGroups = async (): Promise<PermissionGroup[]> => {
  const permissionGroups = await PermissionGroupModel.find().populate("users");
  return permissionGroups.map(convertModelToType<IPermissionGroup, PermissionGroup>);
};

export const getPermissionGroupById = async (
  id: string
): Promise<PermissionGroup | null> => {
  const permissionGroup = await PermissionGroupModel.findById(id).populate("users");
  return permissionGroup
    ? convertModelToType<IPermissionGroup, PermissionGroup>(permissionGroup)
    : null;
};

export const updatePermissionGroup = async (
  id: string,
  permissionGroupData: Partial<PermissionGroup>
): Promise<PermissionGroup | null> => {
  const permissionGroupModelData = convertTypeToModel<Partial<PermissionGroup>, IPermissionGroup>(permissionGroupData);
  const updatedPermissionGroup = await PermissionGroupModel.findByIdAndUpdate(
    id,
    permissionGroupModelData,
    { new: true }
  ).populate("users");

  return updatedPermissionGroup
    ? convertModelToType<IPermissionGroup, PermissionGroup>(updatedPermissionGroup)
    : null;
};

export const deletePermissionGroup = async (id: string): Promise<PermissionGroup | null> => {
  const deletedPermissionGroup = await PermissionGroupModel.findByIdAndDelete(id);
  return deletedPermissionGroup
    ? convertModelToType<IPermissionGroup, PermissionGroup>(deletedPermissionGroup)
    : null;
};