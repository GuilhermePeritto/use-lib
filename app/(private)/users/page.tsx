'use client'

import UserContent from "@/components/user/UserContent"
import { UsersHeader } from "@/components/user/UsersHeader"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function UsersPage() {
  const searchParams = useSearchParams()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (searchParams.get('updated')) {
      setRefreshKey(prev => prev + 1)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto py-4 px-4">
      <UsersHeader 
        title="Gerenciamento de Usuários"
        description="Visualize e gerencie todos os usuários do sistema"
      />
      <UserContent key={refreshKey} />
    </div>
  )
}