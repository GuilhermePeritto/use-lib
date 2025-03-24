"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { Trash, Users } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import UseCard from "../UseCard";
import ManageGroupDialog from "./ManageGroupDialog";

interface GroupCardProps {
  group: IPermissionGroup;
  modules: IModule[];
  onUpdate: (updatedGroup: IPermissionGroup) => void;
  onDelete: (groupId: string) => void;
}

export default function GroupCard({
  group,
  modules,
  onUpdate,
  onDelete,
}: GroupCardProps) {
  const users = group.users as IUser[];

  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(`/api/permission-groups/${group._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir grupo");
      }

      toast.success("Grupo excluído com sucesso");
      onDelete(group._id as string); // Notifica o componente pai para atualizar a lista
    } catch (error) {
      toast.error("Erro ao excluir grupo");
    }
  };

  return (
    <UseCard>
      <CardHeader>
        <div className="flex justify-between items-start pb-2">
          <div>
            <div className="flex items-center gap-5">
              <CardTitle>{group.name}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <div className="flex gap-2 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild className="cursor-pointer">
                <Trash className="h-4 w-4 text-red-500" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o grupo{" "}
                    <strong>{group.name}</strong>? Esta ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteGroup}
                    className="bg-red-500 hover:bg-red-600 cursor-pointer"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Diálogo de gerenciamento de grupo */}
            <ManageGroupDialog
              group={group}
              modules={modules}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-4">
          {Object.entries(group.permissions)
            .filter(([module, permissions]) => permissions && permissions.length > 0) // Filtra módulos com permissões
            .map(([module, permissions]) => (
              <div key={module} className="space-y-1">
                <Label className="mb-4">{module}</Label>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission) => (
                    <Badge
                      key={`${module}-${permission}`}
                      variant="outline"
                      className="capitalize"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className="absolute flex items-center text-muted-foreground right-6 bottom-0">
                <Users className="h-4 w-4" />
                ({users.length})
              </div>
      </CardContent>
    </UseCard>
  );
}