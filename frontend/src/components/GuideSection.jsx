import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function GuideSection() {
  const [alphabet, setAlphabet] = useState([]);
  const [punctuation, setPunctuation] = useState([]);

  useEffect(() => {
    api.alphabet().then((data) => setAlphabet(data.alphabet));
    api.punctuation().then((data) => setPunctuation(data.punctuation));
  }, []);

  return (
    <section id="guides" className="section-container">
      <div className="section-heading">
        <p className="eyebrow">Learning guide</p>
        <h2>Letters, words, and Bangla punctuation</h2>
        <p>Users can check examples like A for Apple, B for Bee, plus punctuation usage.</p>
      </div>

      <div className="guide-grid">
        <div className="glass-card">
          <h3>Alphabet guide</h3>
          <div className="alphabet-grid">
            {alphabet.map((item) => (
              <div key={item.letter} className="alphabet-card">
                <b>{item.letter}</b>
                <span>{item.sound}</span>
                <p>{item.bangla}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3>Punctuation guide</h3>
          <div className="punctuation-list">
            {punctuation.map((item) => (
              <div key={item.symbol} className="punctuation-item">
                <b>{item.symbol} → {item.bangla}</b>
                <span>{item.name}</span>
                <p>{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
