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
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">งานของฉัน</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            จัดการงานรอดำเนินการและงานที่เสร็จแล้ว
          </p>
        </div>
        <Button
          onClick={() => setShowCreate((s) => !s)}
          size="lg"
          className="shrink-0"
        >
          {showCreate ? "ยกเลิก" : "เพิ่มงานใหม่"}
        </Button>
      </div>

      {showCreate && (
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle>เพิ่มงานใหม่</CardTitle>
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-muted)]">กำลังโหลด...</p>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              รอดำเนินการ
            </h2>
            {pending.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-8 text-center text-sm text-[var(--text-muted)]">
                ยังไม่มีงานรอดำเนินการ — กด &quot;เพิ่มงานใหม่&quot; เพื่อสร้างงาน
              </p>
            ) : (
              <ul className="space-y-3">
                {pending.map((task) => (
                  <li key={task.id}>
                    <TaskItem task={task} onUpdate={fetchTasks} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              เสร็จแล้ว
            </h2>
            {completed.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] py-8 text-center text-sm text-[var(--text-muted)]">
                ยังไม่มีงานที่เสร็จแล้ว
              </p>
            ) : (
              <ul className="space-y-3">
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
