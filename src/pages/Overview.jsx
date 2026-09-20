import React from "react";
import StatStrip from "../components/StatStrip";
import ConnectionGraph from "../components/ConnectionGraph";
import InsightCard from "../components/InsightCard";
export default function Overview({ receipts, stats, patterns, onSelect, onNavigate }) {
  return <main className="page">
    <section className="hero panel-corner">
      <div className="hero-kicker"><span>INVESTIGATION PROTOCOL</span><em>DECONSTRUCTS TIMELINE</em></div>
      <h1>YOUR LIFE,<br /><span>RECONSTRUCTED.</span></h1>
      <p>Hundreds of tiny digital moments. One story waiting to be discovered.</p>
      <StatStrip stats={stats} />
    </section>
    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">VISUAL RELATIONSHIP ENGINE</span><h2>YOUR DIGITAL JOURNEY</h2></div><button className="text-button" onClick={() => onNavigate("connections")}>OPEN FULL GRAPH →</button></div>
      <ConnectionGraph receipts={receipts} onSelect={onSelect} compact />
    </section>
    <section className="section-block">
      <div className="section-heading"><div><span className="eyebrow">RECENT DISCOVERIES</span><h2>THE TRACE FOUND THESE SIGNALS</h2></div></div>
      <div className="insight-grid">{patterns.slice(0, 4).map(p => <InsightCard key={p.title} pattern={p} onClick={() => p.ids[0] && onSelect(receipts.find(r => r.id === p.ids[0]))} />)}</div>
    </section>
  </main>
}