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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast("ลบงานแล้ว", "success");
        setShowDeleteConfirm(false);
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
      <CardContent className="pt-5 px-4 pb-4 sm:p-5">
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
                <label className="group relative mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={handleToggleComplete}
                    className="peer sr-only"
                    aria-label={task.is_completed ? "ยกเลิกทำเสร็จ" : "ทำเสร็จ"}
                  />
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-xl border-2 transition-all duration-200",
                      "border-[var(--checkbox-border)] bg-[var(--bg-card)]",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--checkbox-checked)] peer-focus-visible:ring-offset-2",
                      "group-hover:border-[var(--checkbox-checked)]",
                      task.is_completed &&
                        "border-[var(--checkbox-checked)] bg-[var(--checkbox-checked)] text-white"
                    )}
                  >
                    {task.is_completed && (
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                </label>
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
            <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0">
              {showDeleteConfirm ? (
                <>
                  <span className="text-sm text-[var(--text-muted)]">
                    แน่ใจหรือไม่?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    ยืนยันลบ
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    ลบ
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
