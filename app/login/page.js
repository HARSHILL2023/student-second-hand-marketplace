"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import { useUser } from "@/components/UserProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, refresh } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go straight to the marketplace.
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await refresh();
      router.replace("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Log In</h2>
      <p className="page-intro">
        Log in with your college email to buy, sell and message other students.
      </p>

      <div className="form-page">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="auth-alt">
          New here? <Link href="/register">Create an account</Link>.
        </p>
      </div>
    </div>
  );
}
