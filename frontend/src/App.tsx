import { useState } from "react";

interface AnalysisResult {
  bug: {
    file: string;
    test: string;
    expected: string;
    received: string;
  };

  rootCause: string;

  regressionTest: {
    name: string;
    expected: string;
  };

  fix: {
    file: string;
    before: string;
    after: string;
  };

  validation: {
    status: string;
    testFile: string;
    testsPassed: number;
  };
}

export default function App() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [prCreated, setPrCreated] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalyzed(false);
    setAnalysis(null);
    setPrCreated(false);

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: "test-project/tests/userService.test.js",
          test: "getUserById(999)",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Analysis request failed with status ${response.status}`,
        );
      }

      const data: AnalysisResult = await response.json();

      setAnalysis(data);
      setAnalyzed(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the Bob Debug Pipeline backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePr = () => {
    setPrCreated(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#222",
      }}
    >
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              margin: 0,
              color: "#0f172a",
            }}
          >
            Bob Debugging Pipeline
          </h1>

          <p
            style={{
              color: "#64748b",
              margin: "8px 0 0",
            }}
          >
            AI-powered debugging, testing and GitHub workflow
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: "8px 0 0",
            }}
          >
            Repo: MBen213/bob-debug-pipeline
          </p>
        </header>

        {/* 1. Bug / Stack Trace */}
        <section
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginTop: 0,
              color: "#0f172a",
            }}
          >
            1. Bug / Stack Trace
          </h2>

          <textarea
            rows={9}
            readOnly
            style={{
              width: "100%",
              padding: "14px",
              fontFamily: "Consolas, Monaco, monospace",
              fontSize: "14px",
              lineHeight: "1.6",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              boxSizing: "border-box",
              resize: "vertical",
            }}
            value={`Jest failure:

Expected: null
Received: undefined

File:
tests/userService.test.js

Test:
getUserById(999)`}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              marginTop: "14px",
              padding: "11px 22px",
              backgroundColor: loading ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "7px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Bug"}
          </button>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
              }}
            >
              <strong>Analysis failed</strong>
              <p style={{ margin: "6px 0 0" }}>{error}</p>
            </div>
          )}
        </section>

        {/* Pipeline Results */}
        {analyzed && analysis && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* 2. Root Cause */}
            <section
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginTop: 0,
                  color: "#0f172a",
                }}
              >
                2. Root Cause Analysis
              </h2>

              <p
                style={{
                  lineHeight: "1.6",
                  color: "#475569",
                  marginBottom: 0,
                }}
              >
                {analysis.rootCause}
              </p>
            </section>

            {/* 3. Regression Test */}
            <section
              style={{
                padding: "20px",
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginTop: 0,
                  color: "#92400e",
                }}
              >
                3. Regression Test
              </h2>

              <p>
                Test case:{" "}
                <code
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "3px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {analysis.regressionTest.name}
                </code>
              </p>

              <p style={{ marginBottom: 0 }}>
                Expected:{" "}
                <strong>{analysis.regressionTest.expected}</strong>
              </p>
            </section>

            {/* 4. Fix */}
            <section
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #bae6fd",
                borderRadius: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginTop: 0,
                  color: "#0369a1",
                }}
              >
                4. Fix Generated by Bob
              </h2>

              <pre
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "16px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontFamily: "Consolas, Monaco, monospace",
                  fontSize: "13px",
                  lineHeight: "1.7",
                }}
              >
{`- ${analysis.fix.before}
+ ${analysis.fix.after}`}
              </pre>

              <p
                style={{
                  marginBottom: 0,
                  color: "#475569",
                }}
              >
                File:{" "}
                <code
                  style={{
                    backgroundColor: "#f1f5f9",
                    padding: "3px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {analysis.fix.file}
                </code>
              </p>
            </section>

            {/* 5. Validation */}
            <section
              style={{
                padding: "20px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginTop: 0,
                  color: "#166534",
                }}
              >
                5. Test Validation
              </h2>

              {analysis.validation.status === "passed" ? (
                <>
                  <p
                    style={{
                      color: "#15803d",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    PASS — {analysis.validation.testFile}
                  </p>

                  <p style={{ marginBottom: 0 }}>
                    {analysis.validation.testsPassed} tests passed
                  </p>
                </>
              ) : (
                <p
                  style={{
                    color: "#b91c1c",
                    fontWeight: 700,
                    marginBottom: 0,
                  }}
                >
                  Tests failed
                </p>
              )}
            </section>

            {/* 6. GitHub Pull Request */}
            <section
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  marginTop: 0,
                  color: "#0f172a",
                }}
              >
                6. GitHub Pull Request
              </h2>

              {!prCreated ? (
                <>
                  <p style={{ color: "#64748b" }}>
                    The fix has been validated. The next step is to create a
                    GitHub pull request.
                  </p>

                  <button
                    onClick={handleCreatePr}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "7px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Create GitHub PR
                  </button>
                </>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#15803d",
                      fontWeight: 700,
                      margin: "0 0 8px",
                    }}
                  >
                    PR workflow triggered
                  </p>

                  <p
                    style={{
                      color: "#475569",
                      margin: "0 0 12px",
                    }}
                  >
                    GitHub integration is ready for the next pipeline step.
                  </p>

                  <a
                    href="https://github.com/MBen213/bob-debug-pipeline/pulls"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                    }}
                  >
                    Open GitHub Pull Requests
                  </a>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}