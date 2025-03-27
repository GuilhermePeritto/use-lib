import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Fetch from "@/lib/api";
import { IUser } from "@/models/User"; // Importe a interface IUser
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import UseCard from "../UseCard";

interface UserBasicInfoProps {
  user: IUser;
  setUser: (user: IUser) => void;
  loading?: boolean;
}

export function UserBasicInfo({ user, setUser, loading }: UserBasicInfoProps) {
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user._id as string);

      const response = await Fetch("/api/imagens", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer upload");
      }

      setCacheBuster(Date.now()); // Força recarregamento da imagem
      setUser(data.user);
      router.push('/users?updated=' + Date.now());
      toast.success("Avatar alterado com sucesso.");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao fazer upload do avatar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await Fetch(`/api/imagens/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao remover avatar");
      }

      setUser(data.user);
      toast.success("Avatar removido com sucesso.");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao remover o avatar.");
    }
  };

  return (
    <UseCard>
      <CardHeader className="pb-2">
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Dados pessoais e de acesso do usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
      <div className="flex flex-col items-center mb-4">
          <Avatar  className="h-20 w-20 mb-2">
            <AvatarImage src={`${user.avatar}?v=${new Date()}`} alt="Avatar"/>
            <AvatarFallback>{user.name.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Enviando..." : "Alterar Avatar"}
            </Button>
            {user.avatar && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeleteAvatar}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
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
            onValueChange={(value: "ativo" | "inativo") => setUser(Object.assign(Object.create(Object.getPrototypeOf(user)), user, { status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </UseCard>
  );
}