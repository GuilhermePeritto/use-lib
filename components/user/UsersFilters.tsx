"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Filter, RefreshCw, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

interface UsersFiltersProps {
  filters: {
    search: string;
    status: "all" | "ativo" | "inativo";
    permissionType: "all" | "group" | "custom";
  };
  onFiltersChange: (filters: Partial<UsersFiltersProps['filters']>) => void;
}

export default function UsersFilters({ filters, onFiltersChange }: UsersFiltersProps) {
    const [localSearch, setLocalSearch] = useState(filters.search);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Atualiza o search local quando o filtro externo muda (ex: limpar filtros)
        setLocalSearch(filters.search);
    }, [filters.search]);

    const handleSearchChange = (value: string) => {
        setLocalSearch(value);
        
        // Limpa o timeout anterior
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Configura um novo timeout
        setTypingTimeout(
            setTimeout(() => {
                onFiltersChange({ search: value });
            }, 500) // 500ms de delay
        );
    };

    const clearFilters = () => {
        // Limpa o timeout se existir
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        onFiltersChange({
            search: "",
            status: "all",
            permissionType: "all"
        });
    };

    useEffect(() => {
        // Limpeza do timeout ao desmontar o componente
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="relative flex-1 w-full sm:max-w-md bg-card rounded-lg">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, email ou grupo..."
                        value={localSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center">
                    {(filters.search || filters.status !== "all" || filters.permissionType !== "all") && (
                        <Button variant="ghost" onClick={clearFilters} size="sm" className="h-9 ">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Limpar filtros
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-2 h-9 bg-card">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                                {(filters.status !== "all" || filters.permissionType !== "all") && (
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                        {(filters.status !== "all" ? 1 : 0) + (filters.permissionType !== "all" ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                                value={filters.status} 
                                onValueChange={(value) => onFiltersChange({ status: value as "all" | "ativo" | "inativo" })}
                            >
                                <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="ativo">Ativos</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inativo">Inativos</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Tipo de Permissão</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup 
                                value={filters.permissionType} 
                                onValueChange={(value) => onFiltersChange({ permissionType: value as "all" | "group" | "custom" })}
                            >
                                <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="group">Grupo</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="custom">Personalizadas</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {(filters.status !== "all" || filters.permissionType !== "all") && (
                <div className="flex flex-wrap gap-2">
                    {filters.status !== "all" && (
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                            Status: {filters.status === "ativo" ? "Ativos" : "Inativos"}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-muted"
                                onClick={() => onFiltersChange({ status: "all" })}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {filters.permissionType !== "all" && (
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                            Permissão: {filters.permissionType === "group" ? "Grupo" : "Personalizadas"}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-muted"
                                onClick={() => onFiltersChange({ permissionType: "all" })}
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