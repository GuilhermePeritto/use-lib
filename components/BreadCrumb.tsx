"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { Label } from "./ui/label"

export function Breadcrumbs() {
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(path)
  }

  const pathSegments = pathname.split("/").filter(Boolean)

  const getTitleFromSegment = (segment: string) => {
    switch (segment) {
      case "getting-started":
        return "Começando"
      case "components":
        return "Componentes"
      case "documentation":
        return "Documentação"
      case "api-reference":
        return "Referência da API"
      case "users":
        return "Usuários"
      case "permissions":
        return "Permissões"
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1)
    }
  }

  return (
    <Breadcrumb className="flex overflow-x-auto h-16 items-center">
      <BreadcrumbItem>
        <BreadcrumbLink className="ml-1" href="/" onClick={handleClick("/")}>
          <Label className="cursor-pointer">Home</Label>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`
        const title = getTitleFromSegment(segment)

        return (
          <React.Fragment key={path}>
            <ChevronRight className="mx-1 w-5 h-5" />
            <BreadcrumbItem>
              <BreadcrumbLink href={path} onClick={handleClick(path)}>
                <Label className="cursor-pointer">{title}</Label>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        )
      })}
    </Breadcrumb>
  )
}