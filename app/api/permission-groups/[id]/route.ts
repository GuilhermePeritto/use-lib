// app/api/permission-groups/[id]/route.ts
import dbConnect from "@/lib/dbConnect";
import {
    deletePermissionGroup,
    getPermissionGroupById,
    updatePermissionGroup,
} from "@/services/permissionGroupService";
import { NextResponse } from "next/server";

// Buscar um grupo de permissões específico por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const permissionGroup = await getPermissionGroupById(id);

    if (!permissionGroup) {
      return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
    }

    return NextResponse.json(permissionGroup, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Atualizar um grupo de permissões específico por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
  
    try {
      const { id } = params;
      const updateData = await request.json(); // Aceita qualquer campo enviado no corpo
  
      const updatedPermissionGroup = await updatePermissionGroup(id, updateData);
  
      if (!updatedPermissionGroup) {
        return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
      }
  
      return NextResponse.json(updatedPermissionGroup, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

// Deletar um grupo de permissões específico por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const isDeleted = await deletePermissionGroup(id);

    if (!isDeleted) {
      return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}