import { useRef } from "react";
import { HeroScene } from "./components/HeroScene";
import { SkiFloLogo } from "./components/SkiFloLogo";
import { BetaSignup } from "./components/BetaSignup";
import { useHeroPointer } from "./hooks/useHeroPointer";
import "./App.css";

const FEATURES = [
  {
    index: "01",
    title: "Live mountain picture",
    body: "Crowd, lifts, and conditions on one map — telemetry for the hill, not guesswork in the lot.",
  },
  {
    index: "02",
    title: "Plans that match you",
    body: "Level, terrain, and pace tuned to how you ski so every lap feels intentional.",
  },
  {
    index: "03",
    title: "Every run connected",
    body: "Record sessions, share quick feedback, and build a history that sharpens your next day.",
  },
] as const;

export default function App() {
  const year = new Date().getFullYear();
  const heroRef = useRef<HTMLElement>(null);
  const { onMouseMove, onMouseLeave } = useHeroPointer(heroRef);

  return (
    <div className="page">
      <header
        className="hero"
        ref={heroRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <HeroScene />
        <div className="hero__copy-backdrop" aria-hidden />
        <div className="hero__inner">
          <SkiFloLogo layout="stacked" theme="dark" glitchName className="hero__brand" />
          <div className="hero__copy">
            <h1 className="hero__title">Your ski day companion built on real-time data</h1>
            <p className="hero__lead">
              Ski Flo helps you read the mountain, avoid the crowds, and stay in the flow from first chair to last
              tracks.
            </p>
            <a className="primary-cta primary-cta--hero" href="#waitlist">
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="features" aria-labelledby="features-heading">
          <div className="features__inner">
            <p className="section-label">Capabilities</p>
            <h2 id="features-heading" className="features__heading">
              Built for real ski days
            </h2>
            <ul className="features__grid">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="feature-card">
                  <span className="feature-card__index">{feature.index}</span>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__body">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cta" id="waitlist" aria-labelledby="cta-heading">
          <div className="cta__inner">
            <p className="section-label">Waitlist</p>
            <h2 id="cta-heading" className="cta__title">
              Join the waitlist
            </h2>
            <p className="cta__body">
              Share your email to request a beta invite. We&apos;ll only use it for beta access and Ski Flo updates.
            </p>
            <BetaSignup />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <SkiFloLogo layout="horizontal" theme="dark" className="footer__brand" />
          <div className="footer__meta">
            <a className="footer__contact" href="mailto:info@skiflo.co">
              info@skiflo.co
            </a>
            <p className="footer__copy">© {year} SKI FLO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
