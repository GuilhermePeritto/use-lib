"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Component } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PermissionsTab from "./PermissionsTab";
import UsersTab from "./UsersTab";

interface ManageGroupDialogProps {
    group: IPermissionGroup;
    modules: IModule[];
    onUpdate: (updatedGroup: IPermissionGroup) => void;
    onAddUserToGroup: (groupId: any, userId: any) => void;
    onRemoveUserFromGroup: (groupId: any, userId: any) => void;
}

export default function ManageGroupDialog({
    group,
    modules,
    onUpdate,
    onAddUserToGroup,
    onRemoveUserFromGroup,
}: ManageGroupDialogProps) {
    const [permissionGroup, setPermissionGroup] = useState<IPermissionGroup>(group);

    const [filteredModules, setFilteredModules] = useState<IModule[]>(modules);

    const filterModules = (name: string) => {
        setFilteredModules(modules.filter((module) => module.name.toLowerCase().includes(name.toLowerCase())));
    }

    return (
        <Dialog>
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
                        <TabsTrigger value="users">Usuarios</TabsTrigger>
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
                        <ScrollArea className="flex h-[30rem]">
                            <PermissionsTab
                                group={permissionGroup}
                                modules={filteredModules}
                                setGroup={setPermissionGroup}
                            />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTab
                            group={group}
                            onAddUserToGroup={(userId) => onAddUserToGroup(group._id, userId)}
                            onRemoveUserFromGroup={(userId) => onRemoveUserFromGroup(group._id, userId)}
                        />
                    </TabsContent>
                </Tabs>
                <DialogFooter className="mt-auto border-t-2 pt-2">
                    <DialogClose>
                        <div className="bg-muted hover:bg-muted-foreground/20 rounded-md p-3 cursor-pointer">
                            <Label className="cursor-pointer" >Cancelar</Label>
                        </div>
                    </DialogClose>
                    <Button variant="default">Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}