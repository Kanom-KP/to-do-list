"use client";

import { useEffect, useState } from "react";
import type { TaskDto } from "@/types/task";
import { TaskItem } from "./task-item";
import { TaskForm } from "./task-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskList() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const pending = tasks.filter((t) => !t.is_completed);
  const completed = tasks.filter((t) => t.is_completed);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button onClick={() => setShowCreate((s) => !s)}>
          {showCreate ? "Cancel" : "New task"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>New task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              onSuccess={() => {
                setShowCreate(false);
                fetchTasks();
              }}
              onCancel={() => setShowCreate(false)}
            />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-zinc-500">Loading tasks...</p>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Pending Tasks</h2>
            {pending.length === 0 ? (
              <p className="text-sm text-zinc-500">No pending tasks. Add one above.</p>
            ) : (
              <ul className="space-y-2">
                {pending.map((task) => (
                  <li key={task.id}>
                    <TaskItem task={task} onUpdate={fetchTasks} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Completed Tasks</h2>
            {completed.length === 0 ? (
              <p className="text-sm text-zinc-500">No completed tasks yet.</p>
            ) : (
              <ul className="space-y-2">
                {completed.map((task) => (
                  <li key={task.id}>
                    <TaskItem task={task} onUpdate={fetchTasks} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
