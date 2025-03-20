'use client'

import { Input } from "@/components/ui/input"
import { SidebarGroup, SidebarGroupContent, useSidebar } from "@/components/ui/sidebar"
import { Search } from "lucide-react"
import { Label } from "../ui/label"

export default function SidebarSearch() {
    const { open } = useSidebar()

    return (
        <form>
            <SidebarGroup className={`${open ? "" : "hidden"} py-0`}>
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Pesquisar
                    </Label>
                    <Input
                        id="search"
                        placeholder="Pesquisar na documentação..."
                        className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none text-white/60" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}