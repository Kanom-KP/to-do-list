import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "This email is not registered", redirect_to: "/register" },
        { status: 404 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { status: "error", message: "Incorrect password" },
        { status: 400 }
      );
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      status: "success",
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { status: "error", message: "Login failed" },
      { status: 500 }
    );
  }
}
