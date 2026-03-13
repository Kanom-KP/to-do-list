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
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast("Task deleted", "success");
        onUpdate();
      } else {
        toast(data.message ?? "Delete failed", "error");
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
        "transition-colors",
        highlightOverdue && "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/40",
        highlightDueToday && !highlightOverdue && "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40"
      )}
    >
      <CardContent className="p-4">
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={handleToggleComplete}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <span className={cn("font-medium", task.is_completed && "text-zinc-500 line-through")}>
                  {task.title}
                </span>
                {highlightOverdue && (
                  <span className="rounded bg-red-200 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    Overdue
                  </span>
                )}
                {highlightDueToday && !highlightOverdue && (
                  <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    Due Today
                  </span>
                )}
              </div>
              {task.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{task.description}</p>
              )}
              <p className="mt-1 text-xs text-zinc-500">Due: {task.due_date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
