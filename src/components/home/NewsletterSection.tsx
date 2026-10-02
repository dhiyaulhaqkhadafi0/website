"use client";
import { useState } from "react";
import styles from "./editorial-home.module.css";
// No subscription endpoint is configured. Prepare an email request rather than fake enrollment.
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  return (
    <div className={styles.newsletter}>
      <div>
        <p className={styles.eyebrow}>Field notes / Newsletter</p>
        <h2 id="newsletter-title">
          One useful thing
          <br />
          every week.
        </h2>
        <p>
          AI, products, freelance, and things I&apos;m learning while building
          on the internet.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          window.location.href = `mailto:daffadhiyaulhaqkhadafi@gmail.com?subject=${encodeURIComponent("Newsletter interest")}&body=${encodeURIComponent(`I'd like to receive your field notes at ${email}.`)}`;
          setPrepared(true);
        }}
      >
        <label htmlFor="newsletter-email">Your email</label>
        <div>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">
            Join <span aria-hidden="true">→</span>
          </button>
        </div>
        <p className={styles.formNote}>
          Send an email request to join. Newsletter signup is not yet automated.
        </p>
        <p role="status">
          {prepared
            ? "Email request prepared. Send it from your mail app to complete your request."
            : ""}
        </p>
      </form>
    </div>
  );
}
