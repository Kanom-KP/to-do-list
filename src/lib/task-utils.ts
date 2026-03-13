import type { Task } from ".prisma/client";
import { isOverdue, isDueToday } from "@/lib/date-utils";
import type { TaskDto } from "@/types/task";

export function toTaskDto(task: Task): TaskDto {
  const dueDate = task.dueDate;
  const completed = task.isCompleted;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    due_date: dueDate.toISOString().slice(0, 10),
    is_completed: completed,
    is_overdue: isOverdue(dueDate, completed),
    is_due_today: isDueToday(dueDate, completed),
  };
}

function sortKey(dto: TaskDto): number {
  if (dto.is_completed) return 1;
  if (dto.is_overdue) return -2;
  if (dto.is_due_today) return -1;
  return new Date(dto.due_date).getTime();
}

export function sortPendingTasks(tasks: TaskDto[]): TaskDto[] {
  const pending = tasks.filter((t) => !t.is_completed);
  return pending.sort((a, b) => {
    const ka = sortKey(a);
    const kb = sortKey(b);
    if (ka < 0 && kb < 0) return ka - kb; // overdue first, then due today
    if (ka < 0) return -1;
    if (kb < 0) return 1;
    return ka - kb; // then by due date ascending
  });
}

export function sortCompletedByUpdatedAt<T extends { isCompleted: boolean; updatedAt: Date }>(
  tasks: T[]
): T[] {
  return tasks
    .filter((t) => t.isCompleted)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
