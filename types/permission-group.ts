import { User } from "@/types/user";

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: {
    [key: string]: string[];
  };
  users: User[];
}