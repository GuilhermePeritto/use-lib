import { Card } from "@/components/ui/card"
import UserContent from "@/components/user/UserContent"
import UsersFilters from "@/components/user/UsersFilters"
import UsersHeader from "@/components/user/UsersHeader"

export default async function UsersPage() {
  return (
    <div className="container mx-auto py-4 px-4">
      <UsersHeader />
      <Card className="mb-4">
        <UsersFilters />
      </Card>
      <UserContent />
    </div>
  )
}