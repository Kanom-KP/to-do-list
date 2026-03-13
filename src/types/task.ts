export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  is_completed: boolean;
  is_overdue: boolean;
  is_due_today: boolean;
}

export interface ApiSuccess {
  status: "success";
  message: string;
  data?: unknown;
}

export interface ApiError {
  status: "error";
  message: string;
  redirect_to?: string;
}
