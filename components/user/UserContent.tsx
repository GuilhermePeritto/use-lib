"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { IUser } from "@/models/User";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import UsersFilters from "./UsersFilters";
import UsersTable from "./UsersTable";

export default function UserContent() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as "all" | "ativo" | "inativo",
    permissionType: "all" as "all" | "group" | "custom"
  });

  const loadUsers = useCallback(async (reset = false) => {
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      const currentPage = reset ? 1 : page;
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        search: filters.search,
        status: filters.status,
        permissionType: filters.permissionType
      });

      const response = await fetch(`/api/users?${query.toString()}`);
      
      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }
      
      const { users: newUsers, hasMore: newHasMore } = await response.json();
      
      setUsers(prev => reset ? newUsers : [...prev, ...newUsers]);
      setHasMore(newHasMore);
      setPage(reset ? 2 : prev => prev + 1);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
      setHasMore(false);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [page, filters, isFetching]);

  const { loadingRef } = useInfiniteScroll({
    fetchMore: () => loadUsers(false),
    hasMore,
    threshold: 100
  });

  useEffect(() => {
    setPage(1);
    setUsers([]);
    setHasMore(true);
    loadUsers(true);
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleUserUpdated = useCallback(() => {
    setPage(1);
    setUsers([]);
    loadUsers(true);
  }, [loadUsers]);

  return (
    <Card className="px-5">
      <div className="mb-4">
        <UsersFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>
      <div className="relative">
        <UsersTable 
          users={users} 
          loading={loading}
          onUserUpdated={handleUserUpdated}
          loadingRef={loadingRef}
        />
        {hasMore && !loading && isFetching && (
          <div className="flex justify-center pt-4 animate-bounce">
              <Loader2 size={24} className="animate-spin"/>
              <span className="ml-2 animate-pulse">Carregando...</span>
          </div>
        )}
      </div>
    </Card>
  );
}