"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center text-[var(--text-muted)]">
      กำลังโหลด Swagger UI...
    </div>
  ),
});

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
          API Documentation
        </h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          เอกสาร OpenAPI สำหรับ To-do List API
        </p>
        <div className="[&_.swagger-ui]:!bg-[var(--bg-card)] [&_.swagger-ui_.opblock]:!border-[var(--border)] [&_.swagger-ui_.opblock-summary-path]:!text-[var(--text-primary)] [&_.swagger-ui_.opblock-summary-description]:!text-[var(--text-muted)] [&_.swagger-ui_.info_.title]:!text-[var(--text-primary)] [&_.swagger-ui_.info_p]:!text-[var(--text-muted)] [&_.swagger-ui_table thead th]:!border-[var(--border)] [&_.swagger-ui_table tbody td]:!border-[var(--border)] [&_.swagger-ui_.model]:!text-[var(--text-primary)] [&_.swagger-ui_.model-title]:!text-[var(--text-primary)] [&_.swagger-ui input]:!bg-[var(--bg-page)] [&_.swagger-ui input]:!text-[var(--text-primary)] [&_.swagger-ui input]:!border-[var(--border)]">
          <SwaggerUI url="/api/openapi" />
        </div>
      </div>
    </div>
  );
}
