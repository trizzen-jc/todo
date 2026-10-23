import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Goal from "@/models/Goal";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  const goal = await Goal.findById(params.id);
  if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(goal);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  const body = await request.json();
  const goal = await Goal.findByIdAndUpdate(params.id, body, { new: true });
  if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(goal);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  await Goal.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
