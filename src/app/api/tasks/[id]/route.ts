import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateTaskSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: session.userId },
    });
    if (!task) {
      return NextResponse.json(
        { status: "error", message: "Task not found" },
        { status: 404 }
      );
    }
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const data: { title?: string; description?: string; dueDate?: Date; isCompleted?: boolean } = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.due_date !== undefined) data.dueDate = new Date(parsed.data.due_date);
    if (parsed.data.is_completed !== undefined) data.isCompleted = parsed.data.is_completed;

    await prisma.task.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (err) {
    console.error("PUT task error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: session.userId },
    });
    if (!task) {
      return NextResponse.json(
        { status: "error", message: "Task not found" },
        { status: 404 }
      );
    }
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("DELETE task error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
