"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Fetch from "@/lib/api";
import { IPermissionGroup } from "@/models/PermissionGroup";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CreateGroupDialogProps {
    onAddNewGroup: (newGroup: IPermissionGroup) => void; // Callback para adicionar o novo grupo
}

export default function CreateGroupDialog({ onAddNewGroup }: CreateGroupDialogProps) {
    const [newGroup, setNewGroup] = useState({ name: "", description: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar a abertura do diálogo
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

    const handleCreateGroup = async () => {
        if (!newGroup.name || !newGroup.description) {
            toast.error("Preencha todos os campos");
            return;
        }

        setIsLoading(true); // Ativa o estado de carregamento

        try {
            const response = await Fetch("/api/permission-groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newGroup),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar grupo");
            }

            const createdGroup = await response.json();
            onAddNewGroup(createdGroup); // Adiciona o novo grupo à lista
            toast.success("Grupo criado com sucesso!");

            // Limpa o formulário e fecha o diálogo
            setNewGroup({ name: "", description: "" });
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Erro ao criar grupo");
        } finally {
            setIsLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Novo Grupo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Grupo</Label>
                        <Input
                            id="name"
                            placeholder="Digite o nome do grupo"
                            value={newGroup.name}
                            onChange={(e) =>
                                setNewGroup({ ...newGroup, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            placeholder="Digite a descrição do grupo"
                            value={newGroup.description}
                            onChange={(e) =>
                                setNewGroup({ ...newGroup, description: e.target.value })
                            }
                        />
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <DialogClose>
                            <div className="bg-muted hover:bg-muted-foreground/20 rounded-md p-3 cursor-pointer">
                                <Label className="cursor-pointer" >Cancelar</Label>
                            </div>
                        </DialogClose>
                        <Button onClick={handleCreateGroup} >
                            Criar Grupo
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}