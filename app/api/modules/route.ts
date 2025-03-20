import dbConnect from "@/lib/dbConnect";
import {
    createModule,
    deleteModule,
    getModules,
    updateModule
} from "@/services/moduleService";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const modules = await getModules();
    return NextResponse.json(modules, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const moduleData = await request.json();
    const module = await createModule(moduleData);
    return NextResponse.json(module, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { id, ...moduleData } = await request.json();
    const updatedModule = await updateModule(id, moduleData);

    if (!updatedModule) {
      return NextResponse.json({ error: "Módulo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedModule, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { id } = await request.json();
    const isDeleted = await deleteModule(id);

    if (!isDeleted) {
      return NextResponse.json({ error: "Módulo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}