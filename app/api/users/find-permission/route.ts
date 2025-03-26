import dbConnect from "@/lib/dbConnect";
import { getUserById } from "@/services/userService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    try {
        // Extrai o token do cabeçalho 'Authorization'
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1]; // Remove o 'Bearer '

        if (!token) {
            return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
        }

        const user = await getUserById(token);
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}