import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(request.url);
  const filter: Record<string, unknown> = { userId: user._id };
  const status = searchParams.get("status");
  const weeklyPlanId = searchParams.get("weeklyPlanId");
  const goalId = searchParams.get("goalId");
  if (status) filter.status = status;
  if (weeklyPlanId) filter.weeklyPlanId = weeklyPlanId;
  if (goalId) filter.goalId = goalId;
  const todos = await Todo.find(filter).sort({ status: 1, order: 1 });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const todo = await Todo.create({
    title: body.title,
    description: body.description,
    status: body.status ?? "todo",
    priority: body.priority ?? "medium",
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    dayOfWeek: body.dayOfWeek,
    order: body.order ?? "a0",
    weeklyPlanId: body.weeklyPlanId || undefined,
    goalId: body.goalId || undefined,
    userId: user._id,
  });
  return NextResponse.json(todo, { status: 201 });
}
