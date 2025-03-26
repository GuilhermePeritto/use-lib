"use client";

import Fetch from "@/lib/api";
import { IUser } from "@/models/User";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import UsersPagination from "./UsersPagination";
import UsersTable from "./UsersTable";

export default function UserContent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const FetchUsers = async () => {
      try {
        const response = await Fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erro ao carregar usuários");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error("Erro ao carregar usuários");
      }
    };

    FetchUsers();
  }, []);

  return (
    <Card>
      <UsersTable users={users} setUsers={setUsers as Dispatch<SetStateAction<IUser[]>>}/>
      <UsersPagination totalItems={users.length} />
    </Card>
  );
}