import { TaskList } from "@/components/features/task-list";
import { DashboardHeader } from "@/components/features/dashboard-header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl px-4 pt-10 pb-10 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8">
        <TaskList />
      </main>
    </div>
  );
}
