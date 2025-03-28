import { encryptPassword, generateToken } from "@/lib/utils";
import UserModel, { IUser } from "@/models/User";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface GetUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ativo" | "inativo" | "all";
  permissionType?: "group" | "custom" | "all";
}

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: IUser } | null> => {
  const user = await UserModel.findOne({ email, status : "ativo"});
  if (user && (await user.matchPassword(password))) {
      const token = generateToken(user); // Gera o token com os dados do usuário
      return { token, user }; // Retorna ambos
  }
  return null;
};

export const createUser = async (userData: IUser): Promise<IUser> => {
  userData.lastPasswordChange = new Date();
  userData.password = await encryptPassword(userData.password as string);

  const user = new UserModel(userData);
  const savedUser = await user.save();
  return savedUser
};

export const getUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "all",
  permissionType = "all"
}: GetUsersOptions = {}): Promise<{ users: IUser[]; total: number; hasMore: boolean }> => {
  const skip = (page - 1) * limit;
  
  const query: any = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { "permissionGroup.name": { $regex: search, $options: "i" } }
    ];
  }
  
  if (status !== "all") {
    query.status = status;
  }
  
  if (permissionType !== "all") {
    query.useGroupPermissions = permissionType === "group";
  }

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .populate('permissionGroup')
      .skip(skip)
      .limit(limit)
      .lean<IUser[]>(),
    UserModel.countDocuments(query)
  ]);

  return {
    users,
    total,
    hasMore: skip + users.length < total
  };
};

export const getUserById = async (token: string): Promise<IUser | null> => {
  const payload = jwtDecode<{ user: IUser } & JwtPayload>(token);
  const user = await UserModel.findById(payload.user._id as string).populate('permissionGroup');
  return user ? user : null;

};

export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
  debugger
  userData.lastPasswordChange = new Date();
  if(userData.password) userData.password = await encryptPassword(userData.password);

  const updatedUser = await UserModel
    .findByIdAndUpdate(id, userData, { new: true })
    .populate('permissionGroup');

  return updatedUser ? updatedUser : null;
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser ? deletedUser : null;
};