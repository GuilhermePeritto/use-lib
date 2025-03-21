import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IUser } from "@/models/User"; // Importe a interface IUser
import { Upload } from "lucide-react";
import UseCard from "../UseCard";

interface UserBasicInfoProps {
  user: IUser;
  setUser: (user: IUser) => void;
}

export function UserBasicInfo({ user, setUser }: UserBasicInfoProps) {
  return (
    <UseCard>
      <CardHeader className="pb-2">
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Dados pessoais e de acesso do usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={user.avatar} alt="Avatar" />
            <AvatarFallback>{user.name.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Alterar Avatar
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => setUser(Object.assign(Object.create(Object.getPrototypeOf(user)), user, { name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser(Object.assign(Object.create(Object.getPrototypeOf(user)), user, { email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={user.status}
            onValueChange={(value: "active" | "inactive") => setUser(Object.assign(Object.create(Object.getPrototypeOf(user)), user, { status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </UseCard>
  );
}