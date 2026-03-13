import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain letters and numbers");

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Invalid date"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  due_date: z.string().refine((val) => !Number.isNaN(Date.parse(val))).optional(),
  is_completed: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
