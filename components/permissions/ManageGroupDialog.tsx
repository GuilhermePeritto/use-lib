"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Button } from "../ui/button";
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
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Gerenciar</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Gerenciar Grupo: {group.name}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="permissions">
                    <TabsList>
                        <TabsTrigger value="permissions">Permissões</TabsTrigger>
                        <TabsTrigger value="users">Usuários</TabsTrigger>
                    </TabsList>
                    <TabsContent value="permissions">
                        <PermissionsTab
                            group={group}
                            modules={modules}
                            onUpdate={onUpdate}
                        />
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTab
                            group={group}
                            onAddUserToGroup={(userId) => onAddUserToGroup(group._id, userId)}
                            onRemoveUserFromGroup={(userId) => onRemoveUserFromGroup(group._id, userId)}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}