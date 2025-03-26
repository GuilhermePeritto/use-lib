import dbConnect from "@/lib/dbConnect";
import { loginUser } from "@/services/userService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    const resolve = await loginUser(email, password);

    if (resolve?.token) {
      // Retorna o token no corpo da resposta
      const response = NextResponse.json(
        { success: true, token: resolve?.token, user: resolve.user },
        { status: 200 }
      );

      response.cookies.set("token", resolve.token, {
        /* httpOnly: true,
        secure: process.env.NODE_ENV === "production", */
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}