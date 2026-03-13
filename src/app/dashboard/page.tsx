import { TaskList } from "@/components/features/task-list";
import { DashboardHeader } from "@/components/features/dashboard-header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <TaskList />
      </main>
    </div>
  );
}
