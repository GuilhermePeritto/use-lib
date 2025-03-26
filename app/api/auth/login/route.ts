import dbConnect from "@/lib/dbConnect";
import { loginUser } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    const token = await loginUser(email, password);

    if (token) {
      // Retorna o token no corpo da resposta
      return NextResponse.json(
        { success: true, token }, // Inclui o token na resposta
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}