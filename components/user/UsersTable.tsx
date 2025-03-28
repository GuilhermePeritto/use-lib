import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { RefObject } from "react";
import { Skeleton } from "../ui/skeleton";
import UserActions from "./UserActions";

interface UsersTableProps {
  users: IUser[];
  loading: boolean;
  onUserUpdated: () => void;
  loadingRef:  RefObject<HTMLDivElement | null>
}

export default function UsersTable({
  users,
  loading,
  onUserUpdated,
  loadingRef
}: UsersTableProps) {
  if (loading) {
    return (
      <Skeleton className="h-80" />
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className="rounded-md border relative h-full">
      <div className="relative h-full">
        <ScrollArea className="h-[calc(100vh-23rem)] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-50 shadow-sm">
              <TableRow>
                <TableHead className="w-[200px]">Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const permissionGroup = user.permissionGroup as IPermissionGroup;

                return (
                  <TableRow className="even:bg-muted/50" key={`${user._id as string} - ${user.email}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`${user.avatar}?v=${new Date()}`} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.useGroupPermissions ? (
                        <Badge variant="secondary">
                          {permissionGroup?.name ?? "Sem grupo"}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Personalizadas</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.status === "ativo" ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActions user={user} onUserUpdated={onUserUpdated} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div ref={loadingRef} className="h-10" />
        </ScrollArea>
      </div>
    </div>
  );
}