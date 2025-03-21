'use client';

import GroupList from "@/components/permissions/GroupList";
import { PermissionHeader } from "@/components/permissions/PermissionHeader";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PermissionsPage() {
    const [groups, setGroups] = useState<IPermissionGroup[]>([]);
    const [modules, setModules] = useState<IModule[]>([]);

    // Função para carregar os dados iniciais
    const fetchData = async () => {
        try {
            const [groupsResponse, modulesResponse] = await Promise.all([
                fetch("/api/permission-groups"),
                fetch("/api/modules"),
            ]);

            if (!groupsResponse.ok || !modulesResponse.ok) {
                throw new Error("Erro ao carregar dados");
            }

            const groupsData = await groupsResponse.json();
            const modulesData = await modulesResponse.json();

            setGroups(groupsData);
            setModules(modulesData);
        } catch (error) {
            toast.error("Erro ao carregar dados");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Função para adicionar um novo grupo
    const handleAddNewGroup = (newGroup: IPermissionGroup) => {
        setGroups((prevGroups) => [...prevGroups, newGroup]);
    };

    // Função para atualizar um grupo existente
    const handleUpdateGroup = (updatedGroup: IPermissionGroup) => {
        setGroups((prevGroups) =>
            prevGroups.map((group) =>
                group._id === updatedGroup._id ? updatedGroup : group
            )
        );
    };

    // Função para excluir um grupo
    const handleDeleteGroup = (groupId: string) => {
        setGroups((prevGroups) =>
            prevGroups.filter((group) => group._id !== groupId)
        );
    };

    return (
        <div className="container mx-auto py-4 px-4">
            <PermissionHeader onAddNewGroup={handleAddNewGroup}/>
            <GroupList
                groups={groups}
                modules={modules}
                onUpdate={handleUpdateGroup}
                onDelete={handleDeleteGroup}
            />
        </div>
    );
}