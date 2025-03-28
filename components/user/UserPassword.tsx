import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UseCard from "../UseCard";
import { Skeleton } from "../ui/skeleton";

interface UserPasswordProps {
  isNewUser: boolean;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  loading?: boolean;
}

export function UserPassword({
  isNewUser,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
}: UserPasswordProps) {
  return (
    <UseCard>
      <CardHeader className="pb-2">
        <CardTitle>
          {loading ? <Skeleton className="h-6 w-[120px]" /> : isNewUser ? "Senha" : "Alterar Senha"}
        </CardTitle>
        <CardDescription>
          {loading ? (
            <Skeleton className="h-4 w-[300px] mt-2" />
          ) : (
            isNewUser ? "Defina a senha do usuário" : "Deixe em branco para manter a senha atual"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{isNewUser ? "Senha" : "Nova Senha"}</Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isNewUser ? "" : "Deixe em branco para manter a senha atual"}
              required={isNewUser}
              disabled={loading}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar {isNewUser ? "Senha" : "Nova Senha"}</Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              required={isNewUser}
              disabled={loading}
            />
          )}
        </div>
      </CardContent>
    </UseCard>
  );
}