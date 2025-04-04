"use client";

import { Button } from "@/components/ui/button";
import { UserBasicInfo } from "@/components/user/UserBasicInfo";
import { UserHeader } from "@/components/user/UserHeader";
import { UserPassword } from "@/components/user/UserPassword";
import { UserPermissions } from "@/components/user/UserPermissions";
import Fetch from "@/lib/api";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>({
    name: "",
    email: "",
    status: "ativo",
    permissions: {},
    useGroupPermissions: false,
    permissionGroup: {
      id: "",
      name: "",
      description: "",
      permissions: {},
      users: [] as IUser[],
    } as IPermissionGroup,
    createdAt: new Date(),
    password: "",
    avatar: "",
    lastLogin: undefined,
    lastPasswordChange: undefined,
  } as IUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modules, setModules] = useState<IModule[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);

    useEffect(() => {
      const FetchData = async () => {
        try {  
          // Buscar módulos e grupos de permissões
          const modulesResponse = await Fetch("/api/modules");
          const modulesData = await modulesResponse.json();
          setModules(modulesData);
  
          const permissionGroupsResponse = await Fetch("/api/permission-groups");
          const permissionGroupsData = await permissionGroupsResponse.json();
          setPermissionGroups(permissionGroupsData);
        } catch (error) {
          toast.error("Erro ao carregar dados");
        }
      };
  
      FetchData();
    }, []);

  const handleSubmit = async () => {
    try {
      const response = await Fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
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
          <UserBasicInfo user={user || undefined} setUser={setUser} />
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
            user={user || undefined}
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