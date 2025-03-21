"use client";

import { Button } from "@/components/ui/button";
import { UserBasicInfo } from "@/components/user/UserBasicInfo";
import { UserHeader } from "@/components/user/UserHeader";
import { UserPassword } from "@/components/user/UserPassword";
import { UserPermissions } from "@/components/user/UserPermissions";
import { Module } from "@/types/module";
import { IPermissionGroup } from "@/types/permission-group";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    status: "active",
    permissions: {},
    useGroupPermissions: false,
    permissionGroup: {
      id: "",
      name: "",
      description: "",
      permissions: {},
      users: [],
    },
    createdAt: new Date(),
    password: "",
    avatar: "",
    lastLogin: undefined,
    lastPasswordChange: undefined,
    id: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.json();
      toast.success("Usuário criado com sucesso!");
      router.push("/users");
    } catch (error) {
      toast.error("Erro ao criar usuário");
    }
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <UserHeader title="Novo Usuário" description="Crie um novo usuário no sistema" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <UserBasicInfo user={user} setUser={setUser} />
          <UserPassword
            isNewUser={true}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        </div>

        <div className="md:col-span-2">
          <UserPermissions
            user={user}
            setUser={setUser}
            modules={modules}
            permissionGroups={permissionGroups}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Criar Usuário</Button>
      </div>
    </div>
  );
}