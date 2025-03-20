"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import UsersPagination from "./UsersPagination";
import UsersTable from "./UsersTable";

export default function UserContent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erro ao carregar usuários");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error("Erro ao carregar usuários");
      }
    };

    fetchUsers();
  }, []); // O array vazio garante que o fetch só seja executado uma vez

  return (
    <Card>
      <UsersTable users={users} />
      <UsersPagination totalItems={users.length} />
    </Card>
  );
}