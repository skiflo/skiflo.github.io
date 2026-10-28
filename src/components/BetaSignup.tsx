import { useState, type FormEvent } from "react";
import { BETA_SIGNUP_URL } from "../config/betaSignup";
import "./BetaSignup.css";

const PLATFORMS = [
  ["ios", "iOS"],
  ["android", "Android"],
  ["both", "Both"],
] as const;

export function BetaSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const website = String(data.get("website") ?? "").trim();
    if (website) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(BETA_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          firstName: String(data.get("firstName") ?? "").trim() || undefined,
          platform: data.get("platform"),
          website: data.get("website"),
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="beta-signup beta-signup--success" role="status">
        You&apos;re on the list — we&apos;ll email you when beta invites go out.
      </p>
    );
  }

  return (
    <form className="beta-signup" onSubmit={onSubmit}>
      <label className="beta-signup__field">
        <span className="beta-signup__label">Email</span>
        <input className="beta-signup__input" type="email" name="email" autoComplete="email" required />
      </label>

      <label className="beta-signup__field">
        <span className="beta-signup__label">First name (optional)</span>
        <input className="beta-signup__input" type="text" name="firstName" autoComplete="given-name" />
      </label>

      <fieldset className="beta-signup__platform">
        <legend className="beta-signup__label">Platform</legend>
        <div className="beta-signup__platform-options">
          {PLATFORMS.map(([value, label], index) => (
            <label key={value} className="beta-signup__platform-option">
              <input type="radio" name="platform" value={value} defaultChecked={index === 0} required />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="beta-signup__honeypot" aria-hidden tabIndex={-1}>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button className="primary-cta primary-cta--block" type="submit" disabled={loading}>
        {loading ? "Joining…" : "Join the beta waitlist"}
      </button>

      <p className="beta-signup__notice">
        By joining, you agree Inbounds may email you about the beta, early access, and product updates. You can
        unsubscribe from any message.
      </p>

      {error ? (
        <p className="beta-signup__error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
