import { useEffect, useState } from "react";
import { api, clearToken, setToken } from "./lib/api";

import Navbar from "./components/Navbar";
import ConverterPanel from "./components/ConverterPanel";
import AuthPanel from "./components/AuthPanel";
import GuideSection from "./components/GuideSection";
import HistoryPanel from "./components/HistoryPanel";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";

export default function App() {
  const [user, setUser] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  useEffect(() => {
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function handleAuth(data) {
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <div className="app-shell">
      {/* Background Layer (must stay first) */}
      <AnimatedBackground />

      {/* Content Layer */}
      <div className="app-content">
        <Navbar user={user} onLogout={logout} />

        <main>
          <section className="hero section-container">
            <div className="hero-copy">
              <p className="eyebrow">Full-stack SaaS writing assistant</p>

              <h1>
                Type Banglish. Write Bangla faster. Learn every word.
              </h1>

              <p className="hero-text">
                BANGLISH TYPRO V1 helps users convert Banglish text into Bangla,
                get smart suggestions, learn word meanings, generate sentences,
                save history, and improve Bangla writing from one clean platform.
              </p>

              <div className="hero-actions">
                <a href="#converter" className="primary-link">
                  Start typing
                </a>

                <a href="#pricing" className="secondary-link">
                  View plans
                </a>
              </div>

              <div className="hero-points">
                <span>Smart conversion</span>
                <span>Saved history</span>
                <span>Word guide</span>
              </div>
            </div>

            <div className="hero-card glass-card">
              <div className="mini-window">
                <span />
                <span />
                <span />
              </div>

              <p className="demo-label">Live example</p>

              <div className="demo-box">
                <p className="demo-input-label">Banglish input</p>
                <h3>ami bangla shikhi.</h3>
              </div>

              <div className="demo-box output-preview">
                <p className="demo-input-label">Bangla output</p>
                <p className="demo-output">আমি বাংলা শিখি।</p>
              </div>

              <div className="demo-tags">
                <span>Fast</span>
                <span>Simple</span>
                <span>Beginner friendly</span>
              </div>
            </div>
          </section>

          <section id="converter" className="section-container">
            <ConverterPanel
              user={user}
              onSaved={() => setHistoryRefresh((n) => n + 1)}
            />
          </section>

          <section className="section-container two-col">
            <AuthPanel user={user} onAuth={handleAuth} onLogout={logout} />

            <HistoryPanel user={user} refreshKey={historyRefresh} />
          </section>

          <GuideSection />

          <PricingSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}