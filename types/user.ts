import { PermissionGroup } from "./permission-group";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    status: "active" | "inactive";
    useGroupPermissions: boolean;
    permissionGroup: PermissionGroup;
    permissions?: {
        [key: string]: string[];
    };
    createdAt: Date;
    lastLogin?: Date;
    lastPasswordChange?: Date;
}