import { isToday, isBefore, startOfDay } from "date-fns";

/**
 * Computed: is_overdue = current_date > due_date AND is_completed = false
 */
export function isOverdue(dueDate: Date, isCompleted: boolean): boolean {
  if (isCompleted) return false;
  const due = startOfDay(typeof dueDate === "string" ? new Date(dueDate) : dueDate);
  const today = startOfDay(new Date());
  return isBefore(due, today);
}

/**
 * Computed: is_due_today = current_date == due_date AND is_completed = false
 */
export function isDueToday(dueDate: Date, isCompleted: boolean): boolean {
  if (isCompleted) return false;
  const d = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return isToday(d);
}

export function parseDueDate(value: string): Date {
  return startOfDay(new Date(value));
}
