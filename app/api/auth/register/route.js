import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";
import { cleanString, isValidEmail } from "@/lib/validation";
import { clientKey, isRateLimited } from "@/lib/rateLimit";

export async function POST(request) {
  if (isRateLimited(clientKey(request, "register"), 20)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = cleanString(body.name);
  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const phone = cleanString(body.phone);

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { error: "Please enter your name (2 to 80 characters)." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (password.length < 6 || password.length > 100) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long." },
      { status: 400 }
    );
  }

  if (phone.length > 30) {
    return NextResponse.json(
      { error: "Phone number is too long." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      password: await hashPassword(password),
      phone,
    });

    await setAuthCookie(signToken(user._id));

    return NextResponse.json({ user: publicUser(user) }, { status: 201 });
  } catch (error) {
    // A duplicate email can also arrive here if two requests race.
    if (error && error.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 }
      );
    }

    console.error("Register error:", error.message);
    return NextResponse.json(
      { error: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }
}
