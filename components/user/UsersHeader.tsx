import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export default function UsersHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
      <div>
        <h1 className="text-3xl font-bold">Usuários</h1>
        <p className="text-muted-foreground mt-1">Gerencie os usuários do sistema</p>
      </div>
      <Button asChild>
        <Link href="/users/new">
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Link>
      </Button>
    </div>
  )
}