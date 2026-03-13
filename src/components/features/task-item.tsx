"use client";

import { useState } from "react";
import type { TaskDto } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { TaskForm } from "./task-form";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: TaskDto;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  async function handleToggleComplete() {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onUpdate();
      } else {
        toast(data.message ?? "Update failed", "error");
      }
    } catch {
      toast("Network error", "error");
    }
  }

  async function handleDelete() {
    if (!confirm("ลบงานนี้?")) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast("ลบงานแล้ว", "success");
        onUpdate();
      } else {
        toast(data.message ?? "ลบล้มเหลว", "error");
      }
    } catch {
      toast("Network error", "error");
    }
  }

  const highlightOverdue = !task.is_completed && task.is_overdue;
  const highlightDueToday = !task.is_completed && task.is_due_today;

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-200",
        highlightOverdue &&
          "border-[var(--overdue-border)] bg-[var(--overdue-bg)]",
        highlightDueToday &&
          !highlightOverdue &&
          "border-[var(--due-today-border)] bg-[var(--due-today-bg)]"
      )}
    >
      <CardContent className="p-4 sm:p-5">
        {isEditing ? (
          <TaskForm
            task={task}
            onSuccess={() => {
              setIsEditing(false);
              onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={handleToggleComplete}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--accent)] transition-colors focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                  aria-label={task.is_completed ? "ยกเลิกทำเสร็จ" : "ทำเสร็จ"}
                />
                <span
                  className={cn(
                    "font-medium text-[var(--text-primary)]",
                    task.is_completed && "text-[var(--text-muted)] line-through"
                  )}
                >
                  {task.title}
                </span>
                {highlightOverdue && (
                  <span className="rounded-lg bg-[var(--overdue-bg)] px-2 py-0.5 text-xs font-medium text-[var(--overdue-text)] ring-1 ring-[var(--overdue-border)]">
                    เลยกำหนด
                  </span>
                )}
                {highlightDueToday && !highlightOverdue && (
                  <span className="rounded-lg bg-[var(--due-today-bg)] px-2 py-0.5 text-xs font-medium text-[var(--due-today-text)] ring-1 ring-[var(--due-today-border)]">
                    ครบกำหนดวันนี้
                  </span>
                )}
              </div>
              {task.description && (
                <p className="pl-7 text-sm text-[var(--text-muted)]">
                  {task.description}
                </p>
              )}
              <p className="pl-7 text-xs text-[var(--text-muted)]">
                ครบกำหนด: {task.due_date}
              </p>
            </div>
            <div className="flex gap-2 pl-7 sm:pl-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                แก้ไข
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                ลบ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
