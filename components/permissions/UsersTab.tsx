"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { useState } from "react";
import { toast } from "sonner";

interface UsersTabProps {
    group: IPermissionGroup;
    onAddUserToGroup: (userId: any) => void;
    onRemoveUserFromGroup: (userId: any) => void;
}

export default function UsersTab({ group, onAddUserToGroup, onRemoveUserFromGroup }: UsersTabProps) {
    const [userId, setUserId] = useState("");

    // Verifica se o campo `users` está populado
    const users = group.users as IUser[];

    const handleAddUserToGroup = async () => {
        if (!userId) {
            toast.error("Preencha o ID do usuário");
            return;
        }

        try {
            onAddUserToGroup(userId); // Chama a função passada como prop
            toast.success("Usuário adicionado ao grupo!");
            setUserId("");
        } catch (error) {
            toast.error("Erro ao adicionar usuário ao grupo");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="ID do usuário"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Button onClick={handleAddUserToGroup}>Adicionar Usuário</Button>
            </div>
            <div className="space-y-2">
                {users.map((user) => (
                    <div key={user._id as string} className="flex items-center justify-between p-2 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveUserFromGroup(user._id)}
                        >
                            Remover
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}