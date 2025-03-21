"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { toast } from "sonner";

interface PermissionsTabProps {
    group: IPermissionGroup;
    modules: IModule[];
    onUpdate: (updatedGroup: IPermissionGroup) => void;
}

export default function PermissionsTab({ group, modules, onUpdate }: PermissionsTabProps) {
    const handleUpdatePermissions = async (moduleName: string, action: string, checked: boolean) => {
        try {
            // Cria uma cópia das permissões atuais
            const updatedPermissions = { ...group.permissions };

            // Adiciona ou remove a permissão com base no estado do checkbox
            if (checked) {
                updatedPermissions[moduleName] = [...(updatedPermissions[moduleName] || []), action];
            } else {
                updatedPermissions[moduleName] = updatedPermissions[moduleName]?.filter(
                    (perm) => perm !== action
                ) || [];
            }

            // Envia a requisição para atualizar as permissões
            const response = await fetch(`/api/permission-groups/${group._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ permissions: updatedPermissions }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar permissões");
            }

            // Atualiza o grupo com a resposta da API
            const updatedGroup = await response.json();
            onUpdate(updatedGroup); // Chama o callback para atualizar o estado no componente pai
            toast.success("Permissões atualizadas com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar permissões");
        }
    };

    return (
        <div className="space-y-4">
            {modules.map((module) => (
                <div key={`${module._id as string} - ${module.name}`} className="space-y-2">
                    <h3 className="font-medium">{module.label}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {module.actions.map((action) => (
                            <div key={`${module.name}-${action}-${module._id}`} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${module.name}-${action}`}
                                    checked={group.permissions[module.name]?.includes(action)}
                                    onCheckedChange={(checked) =>
                                        handleUpdatePermissions(module.name, action, !!checked)
                                    }
                                />
                                <Label htmlFor={`${module.name}-${action}`} className="capitalize">
                                    {action}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}