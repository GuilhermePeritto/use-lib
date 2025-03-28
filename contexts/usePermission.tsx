'use client'

import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { createContext, useContext } from "react";

interface PermissionContextType {
    savePermissionGroup: (permissions: IPermissionGroup) => void;
    clearPermissionGroup: () => void;
    hasPermission: (module: string, action: string) => boolean;
    hasAnyPermission: (module: string, actions: string[]) => boolean;
    hasAllPermissions: (module: string, actions: string[]) => boolean;
    validatePermissionStructure: (
        permissions: IPermissionGroup['permissions'],
        modules: IModule[]
    ) => boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({
    children,
    initialModules = []
}: {
    children: React.ReactNode;
    initialModules?: IModule[];
}) => {

    // Valida se a estrutura de permissões está correta
    const validatePermissionStructure = (
        permissions: IPermissionGroup['permissions'],
        modules: IModule[]
    ): boolean => {
        if (!permissions) return false;

        return Object.entries(permissions).every(([moduleName, actions]) => {
            const module = modules.find(m => m.name === moduleName);
            if (!module) return false;

            return actions.every(action =>
                module.actions.includes(action) || action === "*"
            );
        });
    };

    const savePermissionGroup = (permissions: IPermissionGroup) => {
        try {
            localStorage.setItem("permissionGroup", JSON.stringify(permissions));
        } catch (error) {
            console.error("Failed to save permissions:", error);
            throw error;
        }
    };

    const clearPermissionGroup = () => {
        try {
            localStorage.removeItem("permissionGroup");
        } catch (error) {
            console.error("Failed to clear permissions:", error);
        }
    };

    const hasPermission = (module: string, action: string): boolean => {
        const permissionGroup = JSON.parse(localStorage.getItem("permissionGroup") || "null") as IPermissionGroup | null;
        if (!permissionGroup) return false;
        if (!permissionGroup?.permissions) return false;
        const modulePermissions = permissionGroup.permissions[module];
        return modulePermissions?.includes(action) || modulePermissions?.includes("*") || false;
    };

    const hasAnyPermission = (module: string, actions: string[]): boolean => {
        return actions.some(action => hasPermission(module, action));
    };

    const hasAllPermissions = (module: string, actions: string[]): boolean => {
        return actions.every(action => hasPermission(module, action));
    };

    return (
        <PermissionContext.Provider
            value={{
                savePermissionGroup,
                clearPermissionGroup,
                hasPermission,
                hasAnyPermission,
                hasAllPermissions,
                validatePermissionStructure
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermission must be used within a PermissionProvider');
    }
    return context;
};