import type React from "react"

import { Breadcrumbs } from "@/components/BreadCrumb"
import AppSidebar from "@/components/sidebar/AppSidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { PermissionProvider } from "@/contexts/usePermission"
import { UserAuthenticatedProvider } from "@/contexts/userAuthenticated"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" />
        <title>UseLib</title>
      </head>
      <body className={'antialiased overflow-hidden'} style={{
        fontFamily: 'sans-serif',
      }
      } >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <UserAuthenticatedProvider>
              <PermissionProvider>
              <div className="flex h-screen w-screen">
                <AppSidebar />
                <SidebarInset className="flex-1 h-full flex flex-col">
                  <header className="flex items-center h-16 px-4 border-b">
                    <div className="flex items-center w-full">
                      <SidebarTrigger />
                      <Breadcrumbs />
                    </div>
                  </header>
                  <ScrollArea className="h-full overflow-hidden">
                    <ScrollBar />
                    <main className="p-4">{children}</main>
                  </ScrollArea>
                </SidebarInset>
              </div>
              </PermissionProvider>
            </UserAuthenticatedProvider>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

