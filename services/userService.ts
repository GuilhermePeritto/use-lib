import { generateToken } from "@/lib/utils";
import UserModel, { IUser } from "@/models/User";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: IUser } | null> => {
  const user = await UserModel.findOne({ email, status : "ativo"});
  if (user && (await user.matchPassword(password))) {
      const token = generateToken(user); // Gera o token com os dados do usuário
      return { token, user }; // Retorna ambos
  }
  return null;
};

export const createUser = async (userData: IUser): Promise<IUser> => {
  const user = new UserModel(userData);
  const savedUser = await user.save();
  return savedUser
};

export const getUsers = async (): Promise<IUser[]> => {
  return await UserModel.find().populate('permissionGroup');
};

export const getUserById = async (token: string): Promise<IUser | null> => {
  const payload = jwtDecode<{ user: IUser } & JwtPayload>(token);
  const user = await UserModel.findById(payload.user._id as string).populate('permissionGroup');
  return user ? user : null;

};

export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  const updatedUser = await UserModel
    .findByIdAndUpdate(id, userData, { new: true })
    .populate('permissionGroup');

  return updatedUser ? updatedUser : null;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser ? deletedUser : null;
};