"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { Plus, Search, Trash2, User, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { ConfirmUserTransferDialog } from "./ConfirmUserTransferDialog";

interface UsersTabProps {
    group: IPermissionGroup;
    setGroup: (group: IPermissionGroup) => void;
    onAddUserToGroup: (groupId: string, userId: string) => Promise<void> | void;
    onRemoveUserFromGroup: (groupId: string, userId: string) => Promise<void> | void;
}

export default function UsersTab({ group, onAddUserToGroup, onRemoveUserFromGroup }: UsersTabProps) {
    const users = group.users as IUser[];
    const [userSearchOpen, setUserSearchOpen] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [popoverSearchQuery, setPopoverSearchQuery] = useState("");

    const [transferDialogOpen, setTransferDialogOpen] = useState(false);
    const [userToTransfer, setUserToTransfer] = useState<{ user: IUser, groupId: string } | null>(null);
    const [currentGroupName, setCurrentGroupName] = useState("");

    // Fetch available users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setAvailableUsers(data);
            } catch (error) {
                toast.error("Erro ao carregar usuários:" + error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users in the main list
    const filteredGroupUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(
            user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    // Filter available users in the popover (excluding already added users)
    const filteredAvailableUsers = useMemo(() => {
        const query = popoverSearchQuery.toLowerCase();
        return availableUsers
            .filter(user => !users.some(u => u._id === user._id))
            .filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
    }, [availableUsers, users, popoverSearchQuery]);

    const handleAddUser = async (groupId: string, userId: string) => {
        try {
            // Verificar se o usuário já está em algum grupo
            const user = availableUsers.find(u => u._id === userId);
            if (user?.permissionGroup) {
                // Se estiver em outro grupo, mostrar diálogo de confirmação
                const currentGroup = await fetch(`/api/permission-groups/${user.permissionGroup._id}`)
                    .then(res => res.json());

                setUserToTransfer({ user, groupId });
                setCurrentGroupName(currentGroup.name);
                setTransferDialogOpen(true);
            } else {
                // Se não estiver em nenhum grupo, adicionar diretamente
                await onAddUserToGroup(groupId, userId);
                setPopoverSearchQuery("");
                setUserSearchOpen(false);
            }
        } catch (error) {
            toast.error("Erro ao verificar grupo do usuário");
        }
    };

    const handleRemoveUser = async (groupId: string, userId: string) => {
        await onRemoveUserFromGroup(groupId, userId);
    };

    const handleConfirmTransfer = async () => {
        if (!userToTransfer) return;

        try {
            await onAddUserToGroup(userToTransfer.groupId, userToTransfer.user._id as string);
            
            setPopoverSearchQuery("");
            setUserSearchOpen(false);
            setTransferDialogOpen(false);
            toast.success("Usuário transferido com sucesso");
        } catch (error) {
            toast.error("Erro ao transferir usuário");
        }
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Membros do grupo ({users.length})
                </h3>

                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" /> Adicionar Usuário
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-80" align="end">
                        <div className="space-y-2 p-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar usuários..."
                                    value={popoverSearchQuery}
                                    onChange={(e) => setPopoverSearchQuery(e.target.value)}
                                    className="w-full pl-9"
                                />
                                {popoverSearchQuery && (
                                    <X
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                                        onClick={() => setPopoverSearchQuery("")}
                                    />
                                )}
                            </div>

                            <ScrollArea className="h-60">
                                {filteredAvailableUsers.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        {popoverSearchQuery ? (
                                            <p>Não foram encontrados usuários correspondentes à sua pesquisa</p>
                                        ) : (
                                            <p>Todos os usuários disponíveis já estão neste grupo</p>
                                        )}
                                    </div>
                                ) : (
                                    filteredAvailableUsers.map((user) => (
                                        <div
                                            key={user._id as string}
                                            className="flex items-center gap-2 p-2 hover:bg-muted/50 cursor-pointer rounded"
                                            onClick={() => handleAddUser(group._id as string, user._id as string)}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{user.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* User filter */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Filtrar usuários..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9"
                />
                {searchQuery && (
                    <X
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={() => setSearchQuery("")}
                    />
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-2">
                    {filteredGroupUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {users.length === 0 ? (
                                <>
                                    <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>Não há usuários neste grupo de permissão</p>
                                    <p className="text-sm">Clique em "Adicionar Usuário" para adicionar membros</p>
                                </>
                            ) : (
                                <>
                                    <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>Não há usuários correspondentes à sua pesquisa</p>
                                    <p className="text-sm">Tente um termo de pesquisa diferente</p>
                                </>
                            )}
                        </div>
                    ) : (
                        filteredGroupUsers.map((user) => (
                            <div
                                key={user._id as string}
                                className="group flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors w-full"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <Badge variant="outline" className={user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    >{user.status}</Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => handleRemoveUser(group._id as string, user._id as string)}
                                >
                                    {<Trash2 className="h-4 w-4 text-destructive" />}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <ConfirmUserTransferDialog
                open={transferDialogOpen}
                onOpenChange={setTransferDialogOpen}
                user={userToTransfer?.user as IUser}
                currentGroupName={currentGroupName}
                newGroupName={group.name}
                onConfirm={handleConfirmTransfer}
            />
        </div>
    );
}