// app/api/imagens/[userId]/route.ts
import dbConnect from "@/lib/dbConnect";
import { getGridFS } from "@/lib/gridfs";
import UserModel from "@/models/User";
import { deleteUserAvatar, getUserAvatar } from "@/services/imageService";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
;

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const { id } = await params;

        // Verifica se o userId é válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "ID de usuário inválido" },
                { status: 400 }
            );
        }

        const file = await getUserAvatar(id);

        if (!file) {
            return NextResponse.json(
                { error: "Avatar não encontrado" },
                { status: 404 }
            );
        }

        const gridFS = await getGridFS();
        const downloadStream = gridFS.openDownloadStream(file._id);

        // Cria um ReadableStream a partir do downloadStream
        const readableStream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (error) => controller.error(error));
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": file.contentType || "image/jpeg",
                "Content-Disposition": `inline; filename="${file.filename}"`,
                "Cache-Control": "no-store, max-age=0", // Desabilita cache
                "Pragma": "no-cache",
                "Expires": "0"
            },
        });
    } catch (error: any) {
        console.error("Erro ao recuperar avatar:", error);
        return NextResponse.json(
            {
                error: "Não foi possível recuperar o avatar",
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const { id } = await params;

        const deleted = await deleteUserAvatar(id);

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $unset: { avatar: 1 } },
            { new: true }
        );

        return NextResponse.json(
            {
                success: deleted,
                user: updatedUser
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erro ao deletar avatar:", error);
        return NextResponse.json(
            { error: error.message || "Erro no servidor" },
            { status: 500 }
        );
    }
}