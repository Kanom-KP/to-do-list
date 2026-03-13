import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const path = join(process.cwd(), "swagger.yaml");
    const yaml = await readFile(path, "utf-8");
    return new NextResponse(yaml, {
      headers: { "Content-Type": "application/yaml" },
    });
  } catch (err) {
    console.error("OpenAPI spec read error:", err);
    return NextResponse.json(
      { error: "Failed to load OpenAPI spec" },
      { status: 500 }
    );
  }
}
