import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import SidebarSearch from "./SidebarSearch"

export default function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/" className="text-white">
              <div className="bg-white/20 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">UseLib</span>
                <span className="opacity-80">v1.0.0 by Peritto</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarSearch />
    </SidebarHeader>
  )
}