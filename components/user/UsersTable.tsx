import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { User } from "@/types/user"
import { Calendar, CheckCircle, XCircle } from "lucide-react"
import UserActions from "./UserActions"

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Permissões</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.useGroupPermissions ? (
                <Badge variant="secondary">
                  {typeof user.permissionGroup === "object" && "name" in user.permissionGroup
                    ? user.permissionGroup.name
                    : "N/A"}
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
              {user.status === "active" ? (
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
              <UserActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}