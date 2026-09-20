import React from "react";
export default function InsightCard({ pattern, onClick }) {
  return <button className="insight-card" onClick={onClick}>
    <div className="insight-top"><span className="red-dot"></span><span>{pattern.tag}</span><b>{pattern.value}</b></div>
    <h3>{pattern.title}</h3><p>{pattern.text}</p><span className="trace-link">TRACE SIGNALS →</span>
  </button>
}