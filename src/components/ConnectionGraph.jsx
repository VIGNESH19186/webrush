import React, { useMemo, useState } from "react";
import { findConnections, connectionCountMap } from "../utils/insights";
const palette = { MUSIC: "MUSIC", MOVIES: "MOVIE", PLACE: "PLACE", PURCHASE: "BUY", PHOTO: "PHOTO", MESSAGE: "MSG", SEARCH: "SEARCH", EVENT: "EVENT", NOTE: "NOTE" };
export default function ConnectionGraph({ receipts, onSelect, compact = false }) {
  const edges = useMemo(() => findConnections(receipts), [receipts]);
  const counts = useMemo(() => connectionCountMap(receipts, edges), [receipts, edges]);
  const [selected, setSelected] = useState(null);
  const nodes = useMemo(() => receipts.filter(r => counts[r.id] > 0).slice(0, compact ? 12 : 18), [receipts, counts, compact]);
  const positions = nodes.map((r, i) => { const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2; const rx = compact ? 170 : 250, ry = compact ? 85 : 125; return { ...r, x: 300 + Math.cos(angle) * rx, y: 160 + Math.sin(angle) * ry }; });
  const pos = Object.fromEntries(positions.map(n => [n.id, n]));
  const related = selected ? new Set(edges.filter(e => e.source === selected || e.target === selected).flatMap(e => [e.source, e.target])) : null;
  return <div className={`graph ${compact ? "compact" : ""}`}>
    <div className="graph-legend"><span><i className="black-node"></i> NODES</span><span><i className="red-line"></i> DISCOVERED CONNECTIONS</span></div>
    <svg viewBox="0 0 600 320" role="img" aria-label="Interactive connection graph">
      {edges.map((e, i) => { const a = pos[e.source], b = pos[e.target]; if (!a || !b) return null; const active = !selected || related?.has(e.source) && related?.has(e.target); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={active ? "edge active" : "edge dim"} /> })}
      {positions.map(n => <g key={n.id} className={`graph-node ${selected === n.id ? "selected" : ""} ${selected && selected !== n.id && !related?.has(n.id) ? "dim" : ""}`} onClick={() => { setSelected(n.id); onSelect?.(n) }} onKeyDown={e => e.key === "Enter" && onSelect?.(n)} tabIndex="0">
        <circle cx={n.x} cy={n.y} r={selected === n.id ? 8 : 6} /><text x={n.x + 11} y={n.y + 4}>{palette[n.type] || n.type}</text>
      </g>)}
      <text x="300" y="156" textAnchor="middle" className="graph-center-label">CONNECTION ENGINE</text>
      <text x="300" y="176" textAnchor="middle" className="graph-center-sub">SELECT A NODE</text>
    </svg>
    {selected && <div className="graph-selection"><span>SELECTED TRACE</span><b>{pos[selected]?.title}</b><button onClick={() => onSelect(pos[selected])}>OPEN RECEIPT →</button></div>}
  </div>
}