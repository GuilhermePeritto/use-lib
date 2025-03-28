"use client"

import { PermissionProvider } from "@/contexts/usePermission"
import { Toaster } from "sonner"
import "./globals.css"

export default function DashboardLayout({
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
      <body>
        <PermissionProvider>
          <main>{children}</main>
        </PermissionProvider>
        <Toaster />
      </body>
    </html>
  )
}