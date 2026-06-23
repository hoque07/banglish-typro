import { useEffect, useState } from "react";
import { Clipboard, Lightbulb, Save, Wand2 } from "lucide-react";
import { api } from "../lib/api";

export default function ConverterPanel({ user, onSaved }) {
  const [text, setText] = useState("ami bangla shikhi.");
  const [output, setOutput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [guide, setGuide] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [message, setMessage] = useState("");

  async function convert(value = text) {
    try {
      const data = await api.convert(value);
      setOutput(data.output);

      const guideData = await api.guide(value);
      setGuide(guideData.guide);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleTyping(value) {
    setText(value);

    const lastWord = value.trim().split(/\s+/).pop() || "";
    if (lastWord) {
      try {
        const data = await api.suggest(lastWord);
        setSuggestions(data.suggestions);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }

  function applySuggestion(item) {
    const parts = text.trim().split(/\s+/);
    parts[parts.length - 1] = item.banglish;
    const nextText = parts.join(" ") + " ";
    setText(nextText);
    setSuggestions([]);
    convert(nextText);
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage("Copied to clipboard");
    setTimeout(() => setMessage(""), 1400);
  }

  async function saveHistory() {
    if (!user) {
      setMessage("Login first to save history");
      return;
    }
    if (!text || !output) {
      setMessage("Convert text first");
      return;
    }
    await api.saveHistory({ input_text: text, output_text: output });
    setMessage("Saved to history");
    onSaved();
  }

  async function generateSentences() {
    const seed = text.trim().split(/\s+/).pop() || "bangla";
    const data = await api.sentences(seed);
    setSentences(data.sentences);
  }

  useEffect(() => {
    convert(text);
  }, []);

  return (
    <div className="converter-grid">
      <div className="glass-card converter-card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Smart converter</p>
            <h2>Banglish input</h2>
          </div>
          <Wand2 className="icon-blue" />
        </div>

        <textarea
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type Banglish here..."
        />

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item) => (
              <button key={item.banglish} onClick={() => applySuggestion(item)}>
                {item.banglish} <span>{item.bangla}</span>
              </button>
            ))}
          </div>
        )}

        <div className="button-row">
          <button className="primary-btn" onClick={() => convert()}>
            Convert
          </button>
          <button className="ghost-btn" onClick={generateSentences}>
            <Lightbulb size={17} /> Generate sentences
          </button>
        </div>
      </div>

      <div className="glass-card converter-card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Unicode Bangla</p>
            <h2>Bangla output</h2>
          </div>
          <Clipboard className="icon-blue" />
        </div>

        <div className="output-box">{output || "Converted Bangla will appear here."}</div>

        <div className="button-row">
          <button className="primary-btn" onClick={copyOutput}>
            Copy output
          </button>
          <button className="ghost-btn" onClick={saveHistory}>
            <Save size={17} /> Save
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}

        <div className="word-guide-mini">
          <h3>Word guide</h3>
          {guide.slice(0, 4).map((item) => (
            <div key={item.banglish} className="guide-chip">
              <b>{item.banglish}</b> → {item.bangla} · {item.meaning}
            </div>
          ))}
        </div>

        {sentences.length > 0 && (
          <div className="sentence-list">
            <h3>Sentence generator</h3>
            {sentences.map((item) => (
              <div key={item.level} className="sentence-item">
                <span>{item.level}</span>
                <p>{item.bangla}</p>
                <small>{item.english}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
