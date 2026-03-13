import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createTaskSchema } from "@/lib/validations";
import { toTaskDto, sortPendingTasks, sortCompletedByUpdatedAt } from "@/lib/task-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: "desc" },
    });
    const dtos = tasks.map(toTaskDto);
    const pending = sortPendingTasks(dtos);
    const completed = sortCompletedByUpdatedAt(tasks).map(toTaskDto);
    return NextResponse.json([...pending, ...completed]);
  } catch (err) {
    console.error("GET tasks error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to load tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { title, description, due_date } = parsed.data;
    await prisma.task.create({
      data: {
        userId: session.userId,
        title,
        description: description ?? null,
        dueDate: new Date(due_date),
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Task created successfully",
    });
  } catch (err) {
    console.error("POST task error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to create task" },
      { status: 500 }
    );
  }
}
