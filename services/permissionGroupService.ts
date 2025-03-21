import { IPermissionGroup, PermissionGroupModel } from "@/models/PermissionGroup";

// Criar um novo grupo de permissões
export const createPermissionGroup = async (
  permissionGroupData: IPermissionGroup
): Promise<IPermissionGroup> => {
  const permissionGroup = new PermissionGroupModel(permissionGroupData);
  const savedPermissionGroup = await permissionGroup.save();
  return savedPermissionGroup;
};

// Buscar todos os grupos de permissões
export const getPermissionGroups = async (): Promise<IPermissionGroup[]> => {
  return await PermissionGroupModel.find().populate("users");
};

// Buscar um grupo de permissões por ID
export const getPermissionGroupById = async (
  id: string
): Promise<IPermissionGroup | null> => {
  const permissionGroup = await PermissionGroupModel.findById(id).populate("users");
  return permissionGroup;
};

// Atualizar um grupo de permissões por ID
export const updatePermissionGroup = async (
  id: string,
  permissionGroupData: Partial<IPermissionGroup>
): Promise<IPermissionGroup | null> => {
    debugger
  const updatedPermissionGroup = await PermissionGroupModel.findByIdAndUpdate(
    id,
    permissionGroupData,
    { new: true }
  ).populate("users");

  return updatedPermissionGroup;
};

// Deletar um grupo de permissões por ID
export const deletePermissionGroup = async (id: string): Promise<IPermissionGroup | null> => {
  const deletedPermissionGroup = await PermissionGroupModel.findByIdAndDelete(id);
  return deletedPermissionGroup;
};