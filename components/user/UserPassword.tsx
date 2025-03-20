import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UseCard from "../UseCard";

interface UserPasswordProps {
  isNewUser: boolean;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
}

export function UserPassword({
  isNewUser,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: UserPasswordProps) {
  return (
    <UseCard>
      <CardHeader className="pb-2">
        <CardTitle>{isNewUser ? "Senha" : "Alterar Senha"}</CardTitle>
        <CardDescription>
          {isNewUser ? "Defina a senha do usuário" : "Deixe em branco para manter a senha atual"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{isNewUser ? "Senha" : "Nova Senha"}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isNewUser ? "" : "Deixe em branco para manter a senha atual"}
            required={isNewUser}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar {isNewUser ? "Senha" : "Nova Senha"}</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a senha"
            required={isNewUser}
          />
        </div>
      </CardContent>
    </UseCard>
  );
}