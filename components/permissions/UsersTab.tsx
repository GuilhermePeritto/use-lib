"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { Badge, Plus, Search, Trash2, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

interface UsersTabProps {
    group: IPermissionGroup;
    onAddUserToGroup: (userId: any) => void;
    onRemoveUserFromGroup: (userId: any) => void;
}

export default function UsersTab({ group, onAddUserToGroup, onRemoveUserFromGroup }: UsersTabProps) {
    // Verifica se o campo `users` está populado
    const users = group.users as IUser[];
    const [userSearchOpen, setUserSearchOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setAvailableUsers(data);
            } catch (error) {
                toast.error("Failed to fetch users");
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Group Members ({users.length})
                </h3>

                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" /> Adicionar Usuário
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="end">
                        <div className="space-y-2 p-2">
                            <input
                                placeholder="Search users..."
                                value={userSearchQuery}
                                onChange={(e) => setUserSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <div className="max-h-60 overflow-y-auto">
                                {Array.isArray(availableUsers) && availableUsers.map((user) => (
                                    <div
                                        key={user._id as string}
                                        className="flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer"
                                        onClick={() => onAddUserToGroup(user._id)}
                                    >
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* User filter */}
            <div className="mb-4">
                <Input
                    placeholder="Filter users..."
                    className="w-full"
                    type="search"
                />
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-2">
                    {users.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {users.length === 0 ? (
                                <>
                                    <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>Não existe usuários neste grupo de permissão</p>
                                    <p className="text-sm">Clique em "Adicionar Usuário" para adicionar membros</p>
                                </>
                            ) : (
                                <>
                                    <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>No users match your filter</p>
                                    <p className="text-sm">Try a different search term</p>
                                </>
                            )}
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id as string}
                                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Badge >{user.status}</Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}