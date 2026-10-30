
import { useState } from "react";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function analyzeCode() {
    if (!code.trim() || !error.trim()) {
      alert("Please enter your code and error message.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/fix",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            error,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Something went wrong."
        );
      }

      setResult({
        explanation: data.explanation,
        rootCause: data.root_cause,
        fixedCode: data.fixed_code,
        confidence: data.confidence,
        suggestions: data.suggestions,
      });
    } catch (err) {
      alert("DevFix AI error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">⚡</span>
          DevFix <span className="brand-ai">AI</span>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Dashboard
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="eyebrow">
            YOUR AI DEBUGGING ASSISTANT
          </div>

          <h1>
            Debug smarter.
            <br />
            <span>Build better.</span>
          </h1>

          <p>
            Find bugs, understand errors, and generate fixes
            with your AI-powered coding assistant.
          </p>
        </section>

        <section className="workspace">
          <div className="editor-panel">
            <div className="panel-heading">
              <div>
                <h2>Code Analyzer</h2>
                <p>Paste your code and error details below.</p>
              </div>

              <span className="panel-icon">{"</>"}</span>
            </div>

            <label htmlFor="language">Programming Language</label>

            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="TypeScript">TypeScript</option>
            </select>

            <label htmlFor="code">Your Code</label>

            <textarea
              id="code"
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={10}
              spellCheck={false}
            />

            <label htmlFor="error">Error Message</label>

            <textarea
              id="error"
              className="error-input"
              value={error}
              onChange={(e) => setError(e.target.value)}
              placeholder="Paste the error message here..."
              rows={3}
              spellCheck={false}
            />

            <button
              className="analyze-button"
              onClick={analyzeCode}
              disabled={loading}
            >
              {loading
                ? "Analyzing your code..."
                : "⚡ Analyze & Fix Code"}
            </button>
            <button
              className="reset-button"
              onClick={() => {
                setCode("");
                setError("");
                setResult(null);
              }}
              disabled={loading}
            >
              Clear All
            </button>
          </div>

          <div className="result-panel">
            <div className="panel-heading">
              <div>
                <h2>Analysis Results</h2>
                <p>Understand the problem and fix it.</p>
              </div>

              <span className="panel-icon">✦</span>
            </div>

            {!result ? (
              <div className="empty-result">
                <div className="empty-icon">⚡</div>
                <h3>Ready to debug?</h3>
                <p>
                  Enter your code and error message, then click
                  Analyze & Fix Code to see the AI results here.
                </p>
              </div>
            ) : (
              <div className="results">
                <div className="result-card">
                  <h3>Problem Explanation</h3>
                  <p>
                    {result.explanation || "No explanation returned."}
                  </p>
                </div>

                <div className="result-card">
                  <h3>Root Cause</h3>
                  <p>
                    {result.rootCause || "No root cause returned."}
                  </p>
                </div>

                <div className="result-card">
                  <div className="result-title-row">
                    <h3>Fixed Code</h3>

                    <button
                      className="copy-button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(result.fixedCode || "");
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        } catch {
                          alert("Unable to copy code.");
                        }
                      }}
                    >
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>

                  <pre>
                    <code>
                      {result.fixedCode || "No fixed code returned."}
                    </code>
                  </pre>
                </div>

                {result.confidence !== undefined && (
                  <div className="result-card">
                    <h3>Confidence</h3>
                    <p>{String(result.confidence)}</p>
                  </div>
                )}

                <div className="result-card">
                  <h3>Suggestions</h3>

                  {Array.isArray(result.suggestions) ? (
                    result.suggestions.length > 0 ? (
                      <ul>
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No additional suggestions.</p>
                    )
                  ) : (
                    <p>
                      {result.suggestions || "No suggestions returned."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>⚡ DevFix AI</span>
          <span>AI-powered debugging assistant</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
