"use client";

import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: IPermissionGroup[];
    modules: IModule[];
    onUpdate: (updatedGroup: IPermissionGroup) => void;
    onDelete: (groupId: string) => void;
}

export default function GroupList({
    groups,
    modules,
    onUpdate,
    onDelete,
}: GroupListProps) {
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