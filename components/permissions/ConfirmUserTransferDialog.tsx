"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { IUser } from "@/models/User";

interface ConfirmUserTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
  currentGroupName: string;
  newGroupName: string;
  onConfirm: () => void;
}

export function ConfirmUserTransferDialog({
  open,
  onOpenChange,
  user,
  currentGroupName,
  newGroupName,
  onConfirm,
}: ConfirmUserTransferDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transferir usuário?</AlertDialogTitle>
          <AlertDialogDescription>
            <span>O usuário </span><span className="font-bold">{user?.name}</span> já pertence ao grupo <span className="font-bold">{currentGroupName}</span>. Deseja transferi-lo para o grupo <span className="font-bold">{newGroupName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirmar Transferência
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}