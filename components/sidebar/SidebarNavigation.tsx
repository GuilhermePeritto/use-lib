'use client'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { BookOpen, FileText, Puzzle, Rocket, Search, Shield, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
    { title: "Introdução", url: "/", icon: BookOpen },
    { title: "Começando", url: "/getting-started", icon: Rocket },
    { title: "Componentes", url: "/components", icon: Puzzle },
    { title: "Documentação", url: "/documentation", icon: FileText },
    { title: "Referência da API", url: "/api-reference", icon: Search },
    { title: "Usuários", url: "/users", icon: Users },
    { title: "Permissões", url: "/permissions", icon: Shield },
]

export default function SidebarNavigation() {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-white/80">Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                                asChild
                                className={`text-white/90 hover:text-white hover:bg-white/10 ${pathname === item.url ? "bg-white/20 text-white" : ""
                                    }`}
                            >
                                <Link href={item.url}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}