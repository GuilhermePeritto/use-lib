// services/permissionGroupService.ts
import { convertModelToType } from "@/lib/utils";
import PermissionGroupModel, { IPermissionGroup } from "@/models/PermissionGroup";
import { PermissionGroup } from "@/types/permission-group";

// Criar um novo grupo de permissões
export const createPermissionGroup = async (
  permissionGroupData: Partial<IPermissionGroup>
): Promise<PermissionGroup> => {
  const permissionGroup = new PermissionGroupModel(permissionGroupData);
  const savedPermissionGroup = await permissionGroup.save();
  return convertModelToType<IPermissionGroup, PermissionGroup>(savedPermissionGroup);
};

// Buscar todos os grupos de permissões
export const getPermissionGroups = async (): Promise<PermissionGroup[]> => {
  const permissionGroups = await PermissionGroupModel.find().populate("users");
  return permissionGroups.map(convertModelToType<IPermissionGroup, PermissionGroup>);
};

// Buscar um grupo de permissões por ID
export const getPermissionGroupById = async (
  id: string
): Promise<PermissionGroup | null> => {
  const permissionGroup = await PermissionGroupModel.findById(id).populate("users");
  return permissionGroup
    ? convertModelToType<IPermissionGroup, PermissionGroup>(permissionGroup)
    : null;
};

// Atualizar um grupo de permissões
export const updatePermissionGroup = async (
  id: string,
  permissionGroupData: Partial<IPermissionGroup>
): Promise<PermissionGroup | null> => {
  const updatedPermissionGroup = await PermissionGroupModel.findByIdAndUpdate(
    id,
    permissionGroupData,
    { new: true }
  ).populate("users");

  return updatedPermissionGroup
    ? convertModelToType<IPermissionGroup, PermissionGroup>(updatedPermissionGroup)
    : null;
};

// Deletar um grupo de permissões
export const deletePermissionGroup = async (id: string): Promise<boolean> => {
  const result = await PermissionGroupModel.findByIdAndDelete(id);
  return !!result;
};