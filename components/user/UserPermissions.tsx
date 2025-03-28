import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { IUser } from "@/models/User";
import { Dispatch, SetStateAction } from "react";
import UseCard from "../UseCard";
import { Skeleton } from "../ui/skeleton";

interface UserPermissionsProps {
  user?: IUser;
  setUser: Dispatch<SetStateAction<IUser | null>>
  modules: IModule[];
  permissionGroups: IPermissionGroup[];
  loading?: boolean;
}

export function UserPermissions({ user, setUser, modules, permissionGroups, loading }: UserPermissionsProps) {
  const updatePermission = (module: string, action: string, checked: boolean) => {
    setUser((prev: IUser | null) => {
      const newPermissions = { ...(prev?.permissions || {}) };

      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }

      if (checked) {
        newPermissions[module] = [...newPermissions[module], action];
      } else {
        newPermissions[module] = newPermissions[module].filter((a) => a !== action);
      }

      return {
        ...prev,
        permissions: newPermissions,
      } as IUser;
    });
  };

  const hasPermissionChecked = (module: string, action: string) => {
    return user?.permissions?.[module]?.includes(action) || false;
  };

  // Verifica se o usuário tem um grupo de permissões e se ele existe na lista de grupos disponíveis
  const userPermissionGroup = permissionGroups.find(
    group => group._id === (user?.permissionGroup?._id || user?.permissionGroup)
  );

  return (
    <UseCard className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          {loading ? <Skeleton className="h-6 w-[120px]" /> : "Permissões"}
        </CardTitle>
        <CardDescription>
          {loading ? <Skeleton className="h-4 w-[250px] mt-2" /> : "Configure as permissões de acesso do usuário"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="useGroupPermissions">Usar Permissões de Grupo</Label>
            {loading ? (
              <Skeleton className="h-4 w-[200px] mt-1" />
            ) : (
              <p className="text-sm text-muted-foreground">
                O usuário herdará todas as permissões do grupo selecionado
              </p>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-5 w-9" />
          ) : (
            <Switch
              id="useGroupPermissions"
              checked={user?.useGroupPermissions}
              onCheckedChange={(checked) =>
                setUser({
                  ...user,
                  useGroupPermissions: checked,
                } as IUser)
              }
              disabled={loading}
            />
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <ScrollArea className="h-[calc(100vh-29rem)] pr-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="mb-4">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-4 w-[200px] mt-1" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-[80px]" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </div>
        ) : user?.useGroupPermissions ? (
          <div className="space-y-2">
            <Label htmlFor="permissionGroup">Grupo de Permissões</Label>
            <Select
              value={userPermissionGroup?._id as string}
              onValueChange={(value) => {
                const selectedGroup = permissionGroups.find((group) => group._id === value);
                setUser({
                  ...user,
                  permissionGroup: selectedGroup || null,
                } as IUser);
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo">
                  {userPermissionGroup ? userPermissionGroup.name : "Selecione um grupo"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {permissionGroups.map((group) => (
                  <SelectItem key={group._id as string} value={group._id as string}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-29rem)] pr-4">
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{module.label}</CardTitle>
                    <CardDescription>Permissões para o módulo {module.label.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {module.actions.map((action) => (
                        <div key={`${module.label}-${action}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${module.label}-${action}`}
                            checked={hasPermissionChecked(module.label, action)}
                            onCheckedChange={(checked) => {
                              if (typeof checked === "boolean") {
                                updatePermission(module.label, action, checked);
                              }
                            }}
                            disabled={loading}
                          />
                          <Label htmlFor={`${module.label}-${action}`} className="capitalize">
                            {action}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </UseCard>
  );
}