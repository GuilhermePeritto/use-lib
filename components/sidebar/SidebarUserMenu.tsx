'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUserAuthenticated } from "@/contexts/userAuthenticated"
import { ChevronDown, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SidebarUserMenu() {
  const router = useRouter()
  const { user, setUser } = useUserAuthenticated()

  const logOut = () => {
    setUser(null)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    localStorage.removeItem('token'); // Remove o token
    router.push("/login")
  }

  return (
    <div className=" flex items-start">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex w-full items-center justify-start text-white/80 hover:text-white hover:bg-white/10"
          >
            <Avatar className="h-7.5 w-7.5 ">
              <AvatarImage src={`${user?.avatar}?v=${new Date()}`} alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="ml-2">{user?.name}</span>
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}