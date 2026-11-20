"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
import { useUser } from "@/components/UserProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, refresh } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: { name, email, phone, password },
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
      <h2>Create an Account</h2>
      <p className="page-intro">
        Join the campus marketplace. Your email is private and never shown on listings.
      </p>

      <div className="form-page">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Riya Sharma"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="register-phone">Phone (optional)</label>
            <input
              id="register-phone"
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="e.g. 98765 43210"
              autoComplete="tel"
            />
            <small>Buyers will see this so they can contact you about an item.</small>
          </div>

          <div className="form-row">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Type the same password again"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="auth-alt">
          Already have an account? <Link href="/login">Log in</Link>.
        </p>
      </div>
    </div>
  );
}
