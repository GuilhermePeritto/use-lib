import dbConnect from "@/lib/dbConnect";
import { getUserById } from "@/services/userService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect();

    try {
      const token = cookies().get("token")?.value;
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