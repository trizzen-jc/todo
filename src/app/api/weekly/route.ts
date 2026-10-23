import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WeeklyPlan from "@/models/WeeklyPlan";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get("weekStart");
  if (weekStart) {
    const plan = await WeeklyPlan.findOne({ weekStart: new Date(weekStart) });
    return NextResponse.json(plan);
  }
  const plans = await WeeklyPlan.find().sort({ weekStart: -1 }).limit(4);
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const existing = await WeeklyPlan.findOne({
    weekStart: new Date(body.weekStart),
  });
  if (existing) {
    return NextResponse.json(
      { error: "이미 해당 주의 계획이 존재합니다" },
      { status: 409 }
    );
  }
  const plan = await WeeklyPlan.create({
    weekStart: new Date(body.weekStart),
    goals: body.goals ?? [],
    memo: body.memo ?? "",
    goalId: body.goalId || undefined,
  });
  return NextResponse.json(plan, { status: 201 });
}
