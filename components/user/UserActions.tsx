"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IUser } from "@/models/User"; // Importe a interface IUser
import { CheckCircle, Eye, MoreHorizontal, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserActionsProps {
  user: IUser;
}

export default function UserActions({ user }: UserActionsProps) {
  const router = useRouter();
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/users/${user._id}`)}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setShowDeactivateDialog(true)}
          className={user.status === "active" ? "text-red-600" : "text-green-600"}
        >
          {user.status === "active" ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Inativar
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Ativar
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}