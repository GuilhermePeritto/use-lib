import UserContent from "@/components/user/UserContent"
import { UsersHeader } from "@/components/user/UsersHeader"

export default async function UsersPage() {
  return (
    <div className="container mx-auto py-4 px-4">
      <UsersHeader 
        title="Gerenciamento de Usuários"
        description="Visualize e gerencie todos os usuários do sistema"
      />
      <UserContent />
    </div>
  )
}