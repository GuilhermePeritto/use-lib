import mongoose from "mongoose";
import { User } from "./user";

export interface PermissionGroup {
    id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    permissions: {
        [key: string]: string[];
    };
    users: User[];
}