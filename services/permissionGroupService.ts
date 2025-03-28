import { IPermissionGroup, PermissionGroupModel } from "@/models/PermissionGroup";
import UserModel from "@/models/User";
import mongoose from "mongoose";

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

// Novo método para adicionar usuário ao grupo
export const addUserToGroup = async (groupId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Verificar se o usuário está em outro grupo
    const user = await UserModel.findById(userId).session(session);
    let previousGroupId = null;
    
    if (user?.permissionGroup) {
      previousGroupId = user.permissionGroup._id;
      
      // Remover do grupo anterior
      await PermissionGroupModel.findByIdAndUpdate(
        previousGroupId,
        { $pull: { users: userId } },
        { session }
      );
    }

    // 2. Adicionar ao novo grupo
    await PermissionGroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { users: userId } },
      { session, new: true }
    );

    // 3. Atualizar o usuário
    await UserModel.findByIdAndUpdate(
      userId,
      { permissionGroup: groupId },
      { session }
    );

    await session.commitTransaction();
    
    // Retornar o grupo atualizado e informações sobre o grupo anterior
    return {
      updatedGroup: await PermissionGroupModel.findById(groupId).populate("users"),
      previousGroupId
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Novo método para remover usuário do grupo
export const removeUserFromGroup = async (groupId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Remover o usuário do grupo
    await PermissionGroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId } },
      { session }
    );
    // 2. Remover o grupo do usuário
    await UserModel.findByIdAndUpdate(
      userId,
      { $unset: { permissionGroup: "" } },
      { session }
    );

    await session.commitTransaction();
    
    // Retornar o grupo atualizado
    return await PermissionGroupModel.findById(groupId).populate("users");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const findPermissionGroupByUserId = async (userId: string): Promise<IPermissionGroup | null> => {
    const permissionGroup = await PermissionGroupModel.findOne(
      { users: userId }
    )

    return permissionGroup;
  }