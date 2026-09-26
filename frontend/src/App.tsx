import { useState } from 'react';

export default function App() {
  const [analyzed, setAnalyzed] = useState(false);
  const [prCreated, setPrCreated] = useState(false);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px', color: '#222' }}>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Bob Debugging Pipeline</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0' }}>Repo: MBen213/bob-debug-pipeline</p>
      </header>

      {/* 1. Bug / Stack Trace Input */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Bug / Stack Trace Input</label>
        <textarea 
          rows={4} 
          style={{ width: '100%', padding: '12px', fontFamily: 'monospace', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
          defaultValue="TypeError: Cannot read property 'id' of undefined at getUser (server.js:42)" 
        />
        <button 
          onClick={() => setAnalyzed(true)}
          style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Analyze Bug
        </button>
      </div>

      {/* Pipeline Output Flow */}
      {analyzed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* 2. Root Cause */}
          <div style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>Root Cause Analysis</h3>
            <p style={{ margin: 0, color: '#475569' }}>User lookup function fails when input parameter is missing or null.</p>
          </div>

          {/* 3. Regression Test Status */}
          <div style={{ padding: '15px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#d48806' }}>Regression Test Status</h3>
            <p style={{ margin: 0, fontFamily: 'monospace' }}>⚠️ Created test: <code>getUser_handles_null()</code> (Failing)</p>
          </div>

          {/* 4. Fix Generated */}
          <div style={{ padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0369a1' }}>Fix Generated</h3>
            <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', margin: 0, fontFamily: 'monospace', fontSize: '13px' }}>
              {`+ if (!id) return null;\n  const user = await db.find(id);`}
            </pre>
          </div>

          {/* 5. Test Results */}
          <div style={{ padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#15803d' }}>Test Validation</h3>
            <p style={{ margin: 0, color: '#16a34a', fontWeight: 'bold' }}>✅ All tests passed (1/1)</p>
          </div>

          {/* 6. GitHub PR Action */}
          <div style={{ marginTop: '10px' }}>
            {!prCreated ? (
              <button 
                onClick={() => setPrCreated(true)}
                style={{ padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
              >
                Create GitHub PR
              </button>
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <p style={{ color: '#15803d', fontWeight: 'bold', margin: '0 0 5px 0' }}>🚀 GitHub PR Created & Verified!</p>
                <a href="https://github.com/MBen213/bob-debug-pipeline/pulls" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                  View Pull Request #1 on GitHub
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}