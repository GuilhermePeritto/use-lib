import { Skeleton } from "@/components/ui/skeleton";
import Fetch from "@/lib/api";
import { IUser } from "@/models/User";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import UseCard from "../UseCard";

interface UserBasicInfoProps {
  user?: IUser;
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
      formData.append("userId", user?._id as string);

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
      const response = await Fetch(`/api/imagens/${user?._id}`, {
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
        <CardTitle>
          {loading ? <Skeleton className="h-6 w-[200px]" /> : "Informações Básicas"}
        </CardTitle>
        <CardDescription>
          {loading ? <Skeleton className="h-4 w-[300px] mt-2" /> : "Dados pessoais e de acesso do usuário"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          {loading ? (
            <Skeleton className="h-20 w-20 rounded-full mb-2" />
          ) : (
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={`${user?.avatar}?v=${cacheBuster}`} alt="Avatar" />
              <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          )}

          <div className="flex gap-2">
            {loading ? (
              <>
                <Skeleton className="h-9 w-[120px]" />
                {user?.avatar && <Skeleton className="h-9 w-[100px]" />}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  disabled={isUploading || loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Enviando..." : "Alterar Avatar"}
                </Button>
                {user?.avatar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={isUploading || loading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                )}
              </>
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
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input
              id="name"
              value={user?.name}
              onChange={(e) => setUser({ ...user, name: e.target.value } as IUser)}
              required
              disabled={loading}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input
              id="email"
              type="email"
              value={user?.email}
              onChange={(e) => setUser({ ...user, email: e.target.value } as IUser)}
              required
              disabled={loading}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Select
              value={user?.status}
              onValueChange={(value: "ativo" | "inativo") => setUser({ ...user, status: value } as IUser)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </UseCard>
  );
}