import { convertModelToType, convertTypeToModel, generateToken } from "@/lib/utils";
import UserModel, { IUser } from "@/models/User";
import { User } from "@/types/user";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  const user = await UserModel.findOne({ email });
  if (user && (await user.matchPassword(password))) return generateToken(user._id.toString())
  return null;
};

export const createUser = async (userData: User): Promise<User> => {
  const userModelData = convertTypeToModel<User, IUser>(userData);
  const user = new UserModel(userModelData);
  const savedUser = await user.save();
  return convertModelToType<IUser, User>(savedUser);
};

export const getUsers = async (): Promise<User[]> => {
  const users = await UserModel.find().populate('permissionGroup');
  return users.map(convertModelToType<IUser, User>);
};

export const getUserById = async (token: string): Promise<User | null> => {
  const decodedToken = jwtDecode<{ user: string } & JwtPayload>(token);
  const user = await UserModel.findById(decodedToken.user).populate('permissionGroup');
  return user ? convertModelToType<IUser, User>(user) : null;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  const userModelData = convertTypeToModel<Partial<User>, IUser>(userData);
  const updatedUser = await UserModel.findByIdAndUpdate(id, userModelData, { new: true });
  return updatedUser ? convertModelToType<IUser, User>(updatedUser) : null;
};

export const deleteUser = async (id: string): Promise<User | null> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser ? convertModelToType<IUser, User>(deletedUser) : null;
};