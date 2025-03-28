import dbConnect from "@/lib/dbConnect";
import { findPermissionGroupByUserId } from "@/services/permissionGroupService";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
  
    try {
      const { id } = params;
      const permissionGroup = await findPermissionGroupByUserId(id);
  
      if (!permissionGroup) {
        return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
      }
  
      return NextResponse.json(permissionGroup, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }