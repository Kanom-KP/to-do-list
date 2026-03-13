import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "This email has already been registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: { email, passwordHash },
    });

    return NextResponse.json({
      status: "success",
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { status: "error", message: "Registration failed" },
      { status: 500 }
    );
  }
}
