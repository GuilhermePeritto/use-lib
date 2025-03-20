import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Module } from "@/types/module";
import { PermissionGroup } from "@/types/permission-group";
import { User } from "@/types/user";
import UseCard from "../UseCard";

interface UserPermissionsProps {
  user: User;
  setUser: (user: User) => void;
  modules: Module[];
  permissionGroups: PermissionGroup[];
}

export function UserPermissions({ user, setUser, modules, permissionGroups }: UserPermissionsProps) {
  const updatePermission = (module: string, action: string, checked: boolean) => {
    setUser((prev: User) => {
      const newPermissions = { ...(prev.permissions || {}) };

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
      };
    });
  };

  const hasPermissionChecked = (module: string, action: string) => {
    return user.permissions?.[module]?.includes(action) || false;
  };

  return (
    <UseCard className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Permissões</CardTitle>
        <CardDescription>Configure as permissões de acesso do usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="useGroupPermissions">Usar Permissões de Grupo</Label>
            <p className="text-sm text-muted-foreground">
              O usuário herdará todas as permissões do grupo selecionado
            </p>
          </div>
          <Switch
            id="useGroupPermissions"
            checked={user.useGroupPermissions}
            onCheckedChange={(checked) =>
              setUser({
                ...user,
                useGroupPermissions: checked,
              })
            }
          />
        </div>

        {user.useGroupPermissions ? (
          <div className="space-y-2">
            <Label htmlFor="permissionGroup">Grupo de Permissões</Label>
            <Select
              value={user.permissionGroup.id}
              onValueChange={(value) => {
                const selectedGroup = permissionGroups.find((group) => group.id === value);
                if (selectedGroup) {
                  setUser({
                    ...user,
                    permissionGroup: selectedGroup,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                {permissionGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
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
                <Card key={module.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{module.label}</CardTitle>
                    <CardDescription>Permissões para o módulo {module.label.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {module.actions.map((action) => (
                        <div key={`${module.name}-${action}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${module.name}-${action}`}
                            checked={hasPermissionChecked(module.name, action)}
                            onCheckedChange={(checked) => {
                              if (typeof checked === "boolean") {
                                updatePermission(module.name, action, checked);
                              }
                            }}
                          />
                          <Label htmlFor={`${module.name}-${action}`} className="capitalize">
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