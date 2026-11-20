import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { setAuthCookie, signToken, verifyPassword } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";
import { cleanString } from "@/lib/validation";
import { clientKey, isRateLimited } from "@/lib/rateLimit";

export async function POST(request) {
  if (isRateLimited(clientKey(request, "login"), 10)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // The password hash is hidden by default, so ask for it explicitly.
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: "Email or password is incorrect." },
        { status: 401 }
      );
    }

    await setAuthCookie(signToken(user._id));

    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    return NextResponse.json(
      { error: "Could not log you in. Please try again." },
      { status: 500 }
    );
  }
}
