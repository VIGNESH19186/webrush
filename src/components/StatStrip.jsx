import React from "react";
export default function StatStrip({ stats }) {
  return <div className="stat-strip">{[
    ["MOMENTS", stats.moments, "Across all receipts"], ["CHAPTERS", String(stats.chapters).padStart(2, "0"), "Narrative phases"],
    ["CONNECTIONS", stats.connections, "Linked relationships"], ["PATTERNS", String(stats.patterns).padStart(2, "0"), "Recurring signals"]
  ].map(([label, value, sub]) => <div className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>)}</div>
}