import { TaskList } from "@/components/features/task-list";
import { DashboardHeader } from "@/components/features/dashboard-header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <TaskList />
      </main>
    </div>
  );
}
