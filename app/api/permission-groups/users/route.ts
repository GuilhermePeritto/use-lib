import dbConnect from "@/lib/dbConnect";
import { addUserToGroup, removeUserFromGroup } from "@/services/permissionGroupService";
import { NextResponse } from "next/server";

// Adicionar usuário ao grupo
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { groupId, userId } = await request.json();
    
    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "groupId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedGroup = await addUserToGroup(groupId, userId);
    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes("já pertence") ? 409 : 500 }
    );
  }
}

// Remover usuário do grupo
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { groupId, userId } = await request.json();
    
    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "groupId e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedGroup = await removeUserFromGroup(groupId, userId);
    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}