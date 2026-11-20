import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "./models/User";

export const AUTH_COOKIE = "marketplace_token";
const TOKEN_DAYS = 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to .env.local (local) or to the Vercel environment variables."
    );
  }

  return secret;
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, getSecret(), { expiresIn: TOKEN_DAYS + "d" });
}

// The login token is kept in an HTTP-only cookie, so browser JavaScript
// and the API responses never see it.
export async function setAuthCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_DAYS * 24 * 60 * 60,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

// Reads the JWT cookie and loads the matching user.
// Returns null when there is no valid session.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, getSecret());
    const user = await User.findById(payload.sub);
    return user || null;
  } catch (error) {
    return null;
  }
}

// Small helper for API routes: returns { user } or { response }.
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: Response.json(
        { error: "You need to log in to do this." },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}
