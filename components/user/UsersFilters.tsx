"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, RefreshCw, Search, X } from "lucide-react"
import { useState } from "react"

export default function UsersFilters() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
    const [permissionFilter, setPermissionFilter] = useState<"all" | "group" | "custom">("all")

    const clearFilters = () => {
        setSearchQuery("")
        setStatusFilter("all")
        setPermissionFilter("all")
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, email ou grupo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center">
                    {(searchQuery || statusFilter !== "all" || permissionFilter !== "all") && (
                        <Button variant="ghost" onClick={clearFilters} size="sm" className="h-9">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Limpar filtros
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-2 h-9">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                                {(statusFilter !== "all" || permissionFilter !== "all") && (
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                        {(statusFilter !== "all" ? 1 : 0) + (permissionFilter !== "all" ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={statusFilter} onValueChange={() => setStatusFilter}>
                                <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active">Ativos</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive">Inativos</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Tipo de Permissão</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={permissionFilter} onValueChange={() => setPermissionFilter}>
                                <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="group">Grupo</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="custom">Personalizadas</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {(statusFilter !== "all" || permissionFilter !== "all") && (
                <div className="flex flex-wrap gap-2">
                    {statusFilter !== "all" && (
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                            Status: {statusFilter === "active" ? "Ativos" : "Inativos"}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-muted"
                                onClick={() => setStatusFilter("all")}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {permissionFilter !== "all" && (
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                            Permissão: {permissionFilter === "group" ? "Grupo" : "Personalizadas"}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-muted"
                                onClick={() => setPermissionFilter("all")}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}