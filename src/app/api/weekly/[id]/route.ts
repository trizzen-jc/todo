import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import WeeklyPlan from "@/models/WeeklyPlan";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const plan = await WeeklyPlan.findById(params.id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const body = await request.json();
  const plan = await WeeklyPlan.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  const { index, done } = await request.json();
  const plan = await WeeklyPlan.findById(params.id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (plan.goals[index]) {
    plan.goals[index].done = done;
    await plan.save();
  }
  return NextResponse.json(plan);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isValidId(params.id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();
  await WeeklyPlan.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
