"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

interface PermissionsTabProps {
    group: IPermissionGroup;
    modules: IModule[];
    setGroup: (group: IPermissionGroup) => void;
}

export default function PermissionsTab({ group, modules, setGroup }: PermissionsTabProps) {

    const selectAll = (module: IModule) => {
        const updatedPermissions = { ...group.permissions };
        updatedPermissions[module.name] = [...module.actions];
        setGroup({ ...group, permissions: updatedPermissions } as IPermissionGroup);
    }

    const deselectAll = (module: IModule) => {
        const updatedPermissions = { ...group.permissions };
        updatedPermissions[module.name] = [];
        setGroup({ ...group, permissions: updatedPermissions } as IPermissionGroup);
    }

    return (
        <div className="space-y-4 gap-5">
            {modules.map((module) => (
                <div key={`${module._id as string} - ${module.name}`} className="flex flex-col w-full">
                    <Card className="h-50 mb-2">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <Label className="text-lg font-semibold">
                                    {module.label}
                                </Label>
                                <div className="flex gap-2 justify-end w-full">
                                    <Button className="h-7" variant={"outline"} onClick={() => selectAll(module)}>Selecionar todos</Button>
                                    <Button className="h-7" variant={"outline"} onClick={() => deselectAll(module)}>Desmarcar todos</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {module.actions.map((action) => {
                                    const isChecked = group.permissions[module.name]?.includes(action);
                                    return (
                                        <div
                                            key={`${module.name}-${action}`}
                                            className={`flex items-center space-x-2 p-2 cursor-pointer rounded-md transition-colors ${isChecked
                                                ? "bg-primary/10 border border-primary/20"
                                                : "border border-transparent hover:bg-muted/50"
                                                }`}
                                            onClick={() => {
                                                const updatedPermissions = { ...group.permissions };
                                                if (isChecked) {
                                                    updatedPermissions[module.name] = updatedPermissions[module.name]?.filter(
                                                        (perm) => perm !== action
                                                    ) || [];
                                                } else {
                                                    updatedPermissions[module.name] = [...(updatedPermissions[module.name] || []), action];
                                                }
                                                setGroup({ ...group, permissions: updatedPermissions } as IPermissionGroup);
                                            }}
                                        >
                                            <Checkbox
                                                id={`${module.name}-${action}`}
                                                checked={isChecked}
                                                className={isChecked ? "border-primary" : ""}
                                                onCheckedChange={() => {
                                                    const updatedPermissions = { ...group.permissions };
                                                    if (isChecked) {
                                                        updatedPermissions[module.name] = updatedPermissions[module.name]?.filter(
                                                            (perm) => perm !== action
                                                        ) || [];
                                                    } else {
                                                        updatedPermissions[module.name] = [...(updatedPermissions[module.name] || []), action];
                                                    }
                                                    setGroup({ ...group, permissions: updatedPermissions } as IPermissionGroup);
                                                }}
                                            />
                                            <Label
                                                htmlFor={`${module.name}-${action}`}
                                                className="text-sm font-medium capitalize cursor-pointer"
                                                onClick={() => {
                                                    const updatedPermissions = { ...group.permissions };
                                                    if (isChecked) {
                                                        updatedPermissions[module.name] = updatedPermissions[module.name]?.filter(
                                                            (perm) => perm !== action
                                                        ) || [];
                                                    } else {
                                                        updatedPermissions[module.name] = [...(updatedPermissions[module.name] || []), action];
                                                    }
                                                    setGroup({ ...group, permissions: updatedPermissions } as IPermissionGroup);
                                                }}
                                            >
                                                {action}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}