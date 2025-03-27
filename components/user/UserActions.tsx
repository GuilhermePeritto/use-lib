"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IUser } from "@/models/User"
import { CheckCircle, Edit, MenuSquareIcon, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function UserActions({ user, onUserUpdated }: {
  user: IUser,
  onUserUpdated: () => void
}) {
  const router = useRouter()

  const toggleStatus = async () => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user._id,
          status: user.status === 'ativo' ? 'inativo' : 'ativo'
        })
      })

      if (!response.ok) throw new Error('Falha ao atualizar status')

      toast.success(`Usuário ${user.status === 'ativo' ? 'inativado' : 'ativado'} com sucesso`)
      onUserUpdated()
    } catch (error) {
      toast.error('Erro ao alterar status do usuário')
    }
  }

  const handleEdit = () => {
    router.push(`/users/${user._id}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MenuSquareIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleStatus} className={cn("cursor-pointer", user.status === "ativo" ? "text-red-600" : "text-green-600")}>
          {user.status === "ativo" ? (
            <div onClick={toggleStatus} className="flex">
              <XCircle className="h-4 w-4 mr-4" />
              Inativar
            </div>
          ) : (
            <div onClick={toggleStatus} className="flex">
              <CheckCircle className="h-4 w-4 mr-4" />
              Ativar
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
