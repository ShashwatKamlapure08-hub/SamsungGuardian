import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const env = import.meta.env || {};
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const apiBase = env.VITE_API_BASE_URL || "http://localhost:8787";

function snapshot(rows) {
  const ordered = [...rows].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(-7);
  const trendData = ordered.map((r) => ({
    date: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    risk: Number(r.risk_score || 0),
  }));
  const avgRisk = trendData.length
    ? Math.round(trendData.reduce((acc, item) => acc + item.risk, 0) / trendData.length)
    : 0;
  return { trendData, avgRisk };
}

export default function Phase2App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [convo, setConvo] = useState("");
  const [reply, setReply] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("analyze");
  const [error, setError] = useState("");

  async function loadHistory(userId) {
    const { data, error: e } = await supabase
      .from("guardian_analyses")
      .select("id, created_at, label, risk_score, explanation, conversation_preview")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (e) setError(e.message);
    else setHistory(data || []);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const active = data.session || null;
      setSession(active);
      if (active?.user?.id) loadHistory(active.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next || null);
      if (next?.user?.id) loadHistory(next.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const snap = useMemo(() => snapshot(history), [history]);

  async function signIn() {
    setError("");
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) setError(e.message);
  }

  async function signUp() {
    setError("");
    const { error: e } = await supabase.auth.signUp({ email, password });
    if (e) setError(e.message);
  }

  async function analyze() {
    if (!convo.trim() || !session?.user?.id) return;
    setError("");
    const res = await fetch(`${apiBase}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation: convo }),
    });
    if (!res.ok) {
      setError("Analysis failed.");
      return;
    }
    const parsed = await res.json();
    setAnalysis(parsed);
    const { error: e } = await supabase.from("guardian_analyses").insert({
      user_id: session.user.id,
      label: parsed.label,
      confidence: parsed.confidence,
      risk_score: parsed.risk_score,
      explanation: parsed.explanation,
      recommendation: parsed.recommendation,
      signals: parsed.signals,
      conversation_preview: `${convo.slice(0, 70)}...`,
    });
    if (e) setError(e.message);
    await loadHistory(session.user.id);
  }

  async function coach() {
    if (!reply.trim()) return;
    const res = await fetch(`${apiBase}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rawReply: reply,
        analysisContext: analysis ? { label: analysis.label, explanation: analysis.explanation, risk_score: analysis.risk_score } : null,
      }),
    });
    if (!res.ok) {
      setError("Coaching failed.");
      return;
    }
    setCoaching(await res.json());
  }

  if (!session) {
    return (
      <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h2>Samsung Guardian</h2>
        <input style={{ width: "100%", marginBottom: 8 }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={{ width: "100%", marginBottom: 8 }} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signIn}>Sign in</button>
        <button onClick={signUp} style={{ marginLeft: 8 }}>Sign up</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", fontFamily: "sans-serif" }}>
      <h2>Samsung Guardian - Phase 2</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("analyze")}>Analyze</button>
        <button onClick={() => setTab("trends")}>Trends</button>
        <button onClick={() => setTab("coach")}>Reply Coach</button>
      </div>

      {tab === "analyze" && (
        <div>
          <textarea rows={7} style={{ width: "100%" }} value={convo} onChange={(e) => setConvo(e.target.value)} placeholder="Paste conversation here" />
          <button onClick={analyze} style={{ marginTop: 8 }}>Analyze and save</button>
          {analysis && (
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 12 }}>
              <p><strong>{analysis.label}</strong> ({analysis.confidence}%)</p>
              <p>Risk: {analysis.risk_score}/100</p>
              <p>{analysis.explanation}</p>
            </div>
          )}
        </div>
      )}

      {tab === "trends" && (
        <div>
          <p>Average Risk: {snap.avgRisk}/100</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={snap.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line dataKey="risk" stroke="#7F77DD" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "coach" && (
        <div>
          <textarea rows={4} style={{ width: "100%" }} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your raw reply" />
          <button onClick={coach} style={{ marginTop: 8 }}>Get safer alternatives</button>
          {coaching && (
            <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginTop: 12 }}>
              <p><strong>Balanced:</strong> {coaching.coached_reply}</p>
              <p><strong>Boundary:</strong> {coaching.boundary_reply}</p>
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
