import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"
import SidebarHeader from "./SidebarHeader"
import SidebarNavigation from "./SidebarNavigation"
import SidebarUserMenu from "./SidebarUserMenu"
import ThemeToggle from "./ThemeToggle"

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="overflow-hidden" style={{
      background: "linear-gradient(to bottom,#6051e6 6%, #5966e7 25%, #4f81e9 55%, #499bea 69%, #43a5eb 83%, #3bbeec 99%)",
    }}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter className="space-y-2">
        <SidebarUserMenu />
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}