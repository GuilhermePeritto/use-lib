import { useRouter } from "next/navigation";
import CreateGroupDialog from "./CreateGroupDialog";

interface PermissionHeaderProps {
    onAddNewGroup: (newGroup: any) => void;
    }

export function PermissionHeader({ onAddNewGroup }: PermissionHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
      <div>
        <h1 className="text-3xl font-bold">Grupos de Permissões</h1>
        <p className="text-muted-foreground mt-1">Gerencie os grupos de permissões da aplicação.</p>
      </div>
      <CreateGroupDialog onAddNewGroup={onAddNewGroup} />
    </div>
  );
}