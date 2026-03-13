"use client";

import { useState } from "react";
import type { TaskDto } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

interface TaskFormProps {
  task?: TaskDto | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!task;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast("Title is required", "error");
      return;
    }
    if (!dueDate) {
      toast("Due date is required", "error");
      return;
    }
    setIsLoading(true);
    try {
      const url = isEdit ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { title: title.trim(), description: description.trim() || undefined, due_date: dueDate }
        : { title: title.trim(), description: description.trim() || undefined, due_date: dueDate };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.status === "success") {
        toast(isEdit ? "Task updated" : "Task created", "success");
        onSuccess();
        if (!isEdit) {
          setTitle("");
          setDescription("");
          setDueDate("");
        }
      } else {
        toast(data.message ?? "Failed", "error");
      }
    } catch {
      toast("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-desc">Description (optional)</Label>
        <Input
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-due">Due date</Label>
        <Input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
