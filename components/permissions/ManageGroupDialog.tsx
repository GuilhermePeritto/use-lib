"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Component } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PermissionsTab from "./PermissionsTab";
import UsersTab from "./UsersTab";

interface ManageGroupDialogProps {
    group: IPermissionGroup;
    modules: IModule[];
    onUpdate: (updatedGroup: IPermissionGroup) => void;
}

export default function ManageGroupDialog({
    group,
    modules,
    onUpdate,
}: ManageGroupDialogProps) {
    const [permissionGroup, setPermissionGroup] = useState<IPermissionGroup>(group);
    const [openedDialog, setOpenedDialog] = useState(false);
    const [filteredModules, setFilteredModules] = useState<IModule[]>(modules);

    const filterModules = (name: string) => {
        setFilteredModules(modules.filter((module) => module.label.toLowerCase().includes(name.toLowerCase())));
    }

    const handleUpdateGroup = async () => {
        try {
            const response = await fetch(`/api/permission-groups/${group._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(permissionGroup),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar grupo");
            }

            onUpdate(permissionGroup);
            setOpenedDialog(false);
            toast.success("Grupo atualizado com sucesso");
        } catch (error) {
            toast.error("Erro ao atualizar grupo");
        }
    };

    const handlerAddUserToGroup = async (groupId: string, userId: string) => {
        try {
            const response = await fetch('/api/permission-groups/users', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId, userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setPermissionGroup(data.updatedGroup);
                onUpdate(data.updatedGroup); // Esta é a chave - atualiza o estado no componente pai
                toast.success("Usuário adicionado ao grupo com sucesso");
            } else {
                toast.error(data.error || "Falha ao adicionar usuário ao grupo");
            }
        } catch (error) {
            toast.error("Erro na comunicação com o servidor");
        }
    };

    const handlerRemoveUserFromGroup = async (groupId: string, userId: string) => {
        try {
            const response = await fetch('/api/permission-groups/users', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupId, userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setPermissionGroup(data);
                onUpdate(data); // Esta é a chave - atualiza o estado no componente pai
                toast.success("Usuário removido do grupo com sucesso");
            } else {
                toast.error(data.error || "Falha ao remover usuário do grupo");
            }
        } catch (error) {
            toast.error("Erro na comunicação com o servidor");
        }
    };

    return (
        <Dialog open={openedDialog} onOpenChange={setOpenedDialog}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline">Gerenciar</Button>
            </DialogTrigger>
            <DialogContent className="min-w-[50rem] min-h-[50rem] max-w-[50rem] max-h-[50rem] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Gropo de Permissão: {group.name}</DialogTitle>
                    <DialogDescription>{group.description}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="permissions" className="flex-1 flex flex-col w-full">
                    <TabsList className="grid grid-cols-2 mb-4 w-full">
                        <TabsTrigger value="permissions">Permissões</TabsTrigger>
                        <TabsTrigger value="users">Usuários</TabsTrigger>
                    </TabsList>
                    <TabsContent value="permissions">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                            <Component className="h-5 w-5" />
                            Módulos ({filteredModules.length})
                        </h3>
                        <Input
                            placeholder="Buscar módulos..."
                            className="w-full mb-2"
                            onChange={(e) => filterModules(e.target.value)}
                            type="search" />
                        <PermissionsTab
                            group={permissionGroup}
                            modules={filteredModules}
                            setGroup={setPermissionGroup}
                            handleUpdateGroup={handleUpdateGroup}

                        />
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTab
                            group={group}
                            setGroup={setPermissionGroup}
                            onAddUserToGroup={handlerAddUserToGroup}
                            onRemoveUserFromGroup={handlerRemoveUserFromGroup}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}