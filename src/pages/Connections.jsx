import React from "react";
import ConnectionGraph from "../components/ConnectionGraph";
import { findConnections } from "../utils/insights";
export default function Connections({ receipts, onSelect }) {
    const edges = findConnections(receipts);
    const top = edges.slice(0, 6).map(e => ({ e, a: receipts.find(r => r.id === e.source), b: receipts.find(r => r.id === e.target) }));
    return <main className="page">
        <div className="page-title"><span className="eyebrow">RELATIONSHIP ENGINE</span><h1>CONNECTIONS</h1><p>Same date. Same place. Close time. Shared language. The trace is calculated locally.</p></div>
        <div className="connection-note"><span className="red-dot"></span><b>NO FAKE AI.</b><span>Every link is explained by a deterministic frontend score.</span><code>DATE +1 · PLACE +2 · TIME +2 · KEYWORD +2 · EVENT +3</code></div>
        <ConnectionGraph receipts={receipts} onSelect={onSelect} />
        <section className="section-block"><div className="section-heading"><div><span className="eyebrow">HIGHEST SIGNALS</span><h2>ONE CONNECTED MOMENT</h2></div></div>
            <div className="connection-list">{top.map(({ e, a, b }) => <button key={a.id + b.id} onClick={() => onSelect(a)}><span className="score">SCORE {e.score}</span><div><b>{a.title}</b><span>↔</span><b>{b.title}</b></div><small>{a.location} · {a.date}</small></button>)}</div></section>
    </main>
}