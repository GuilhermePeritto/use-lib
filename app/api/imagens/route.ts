import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { saveUserAvatar } from "@/services/imageService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;

        if (!file || !userId) {
            return NextResponse.json(
                { error: "Arquivo e userId são obrigatórios" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Apenas arquivos de imagem são permitidos" },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "O arquivo deve ter no máximo 5MB" },
                { status: 400 }
            );
        }

        // Salva a imagem e obtém a URL
        const avatarUrl = await saveUserAvatar(userId, file);

        // Atualiza o usuário com a nova URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        );

        console.log("Avatar atualizado:", JSON.stringify(updatedUser));

        return NextResponse.json(
            {
                avatarUrl,
                user: updatedUser
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erro no upload:", error);
        return NextResponse.json(
            { error: error.message || "Erro no servidor" },
            { status: 500 }
        );
    }
}