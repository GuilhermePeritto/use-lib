"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Fetch from "@/lib/api";
import { cn } from "@/lib/utils";
import { IUser } from "@/models/User"; // Importe a interface IUser
import { CheckCircle, Edit, MoreHorizontal, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface UserActionsProps {
  user: IUser;
  setUsers?: Dispatch<SetStateAction<IUser[]>>
}

export default function UserActions({ user, setUsers }: UserActionsProps) {
  const router = useRouter();
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const handleSetStatusUser = async () => {
    try {
      const response = await Fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: user.status === "ativo" ? "inativo" : "ativo",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao inativar usuário");
      }
      setUsers?.((prevUsers) => {
        return prevUsers.map((prevUser: IUser) => {
          if (prevUser._id === user._id) {
            return { ...prevUser, status: user.status === "ativo" ? "inativo" : "ativo" } as IUser;
          }
          return prevUser;
        });
      });
      toast.success(`Usuário ${user.name} ${user.status === "ativo" ? "inativado" : "ativado"} com sucesso`);
    }
    catch (error) {
      toast.error("Erro ao inativar usuário");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/users/${user._id}`)}>
          <Edit className="h-4 w-4 mr-2" />
        Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setShowDeactivateDialog(true)}
          className={cn("cursor-pointer", user.status === "ativo" ? "text-red-600" : "text-green-600")}
        >
          {user.status === "ativo" ? (
            <div onClick={handleSetStatusUser} className="flex">
              <XCircle className="h-4 w-4 mr-4" />
              Inativar
            </div>
          ) : (
            <div onClick={handleSetStatusUser} className="flex">
              <CheckCircle className="h-4 w-4 mr-4" />
              Ativar
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}