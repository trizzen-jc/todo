import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Goal from "@/models/Goal";

export async function GET() {
  await connectDB();
  const goals = await Goal.find().sort({ createdAt: -1 });
  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const goal = await Goal.create({
    title: body.title,
    description: body.description ?? "",
  });
  return NextResponse.json(goal, { status: 201 });
}
