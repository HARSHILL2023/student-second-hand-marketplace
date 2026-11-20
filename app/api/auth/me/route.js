import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Current user error:", error.message);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
