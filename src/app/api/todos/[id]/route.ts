import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getCurrentUser } from "@/lib/auth";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const todo = await Todo.findOne({ _id: params.id, userId: user._id });
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(todo);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const body = await request.json();
  const todo = await Todo.findOneAndUpdate(
    { _id: params.id, userId: user._id },
    body,
    { new: true }
  );
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(todo);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const body = await request.json();
  const todo = await Todo.findOneAndUpdate(
    { _id: params.id, userId: user._id },
    body,
    { new: true }
  );
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(todo);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  await Todo.deleteOne({ _id: params.id, userId: user._id });
  return NextResponse.json({ ok: true });
}
