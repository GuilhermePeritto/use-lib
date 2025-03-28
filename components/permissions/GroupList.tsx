"use client";

import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Skeleton } from "../ui/skeleton";
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: IPermissionGroup[];
    modules: IModule[];
    onUpdate: (updatedGroup: IPermissionGroup) => void;
    onDelete: (groupId: string) => void;
    loading?: boolean;
}

export default function GroupList({
    groups,
    modules,
    onUpdate,
    onDelete,
    loading,
}: GroupListProps) {

    if (loading) {
        return (
            <div className="space-y-6">
            <Skeleton className="h-80"/>
            <Skeleton className="h-30"/>
            <Skeleton className="h-50"/>
            </div>
        );
    }

    if (groups.length === 0 && !loading) {
        return (
            <div className="flex justify-center items-center h-64 text-muted-foreground">
                Nenhum grupo de permissões encontrado
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <GroupCard
                    key={group._id as string}
                    group={group}
                    modules={modules}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}