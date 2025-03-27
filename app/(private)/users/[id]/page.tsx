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
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modules, setModules] = useState<IModule[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);

  const { id } = use(params);

  // Buscar dados do usuário e permissões
  useEffect(() => {
    const FetchData = async () => {
      try {
        // Buscar usuário
        const userResponse = await Fetch(`/api/users/${id}`);
        if (!userResponse.ok) {
          throw new Error("Erro ao carregar usuário");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Buscar módulos e grupos de permissões
        const modulesResponse = await Fetch("/api/modules");
        const modulesData = await modulesResponse.json();
        setModules(modulesData);

        const permissionGroupsResponse = await Fetch("/api/permission-groups");
        const permissionGroupsData = await permissionGroupsResponse.json();
        setPermissionGroups(permissionGroupsData);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    FetchData();
  }, [id]); // Usar id como dependência

  // Atualizar usuário
  const handleSubmit = async () => {
    try {
      const response = await Fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      const data = await response.json();
      toast.success("Usuário atualizado com sucesso!");
      router.push("/users");
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p className="text-center">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <UserHeader
        title="Editar Usuário"
        description="Edite as informações do usuário no sistema"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <UserBasicInfo user={user} setUser={setUser} loading={loading}/>
          <UserPassword
            isNewUser={false} // Modo de edição (não é novo usuário)
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
          />
        </div>

        <div className="md:col-span-2">
          <UserPermissions
            user={user}
            setUser={setUser}
            modules={modules}
            permissionGroups={permissionGroups}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Salvar Alterações</Button>
      </div>
    </div>
  );
}