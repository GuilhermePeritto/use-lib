import dbConnect from "@/lib/dbConnect";
import {
  createPermissionGroup,
  deletePermissionGroup,
  getPermissionGroups,
  updatePermissionGroup,
} from "@/services/permissionGroupService";
import { NextResponse } from "next/server";

// Buscar todos os grupos de permissões
export async function GET() {
  await dbConnect();

  try {
    const permissionGroups = await getPermissionGroups();
    return NextResponse.json(permissionGroups, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Criar um novo grupo de permissões
export async function POST(request: Request) {
  await dbConnect();

  try {
    const permissionGroupData = await request.json();
    const permissionGroup = await createPermissionGroup(permissionGroupData);
    return NextResponse.json(permissionGroup, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Atualizar um grupo de permissões
export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { id, ...permissionGroupData } = await request.json();
    const updatedPermissionGroup = await updatePermissionGroup(id, permissionGroupData);

    if (!updatedPermissionGroup) {
      return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedPermissionGroup, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Deletar um grupo de permissões
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { id } = await request.json();
    const isDeleted = await deletePermissionGroup(id);

    if (!isDeleted) {
      return NextResponse.json({ error: "Grupo de permissões não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}