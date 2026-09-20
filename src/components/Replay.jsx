import React, { useEffect, useState } from "react";
import Icon from "./Icon";
const symbols = { MUSIC: "♫", MOVIES: "◉", PLACE: "⌖", PURCHASE: "₨", PHOTO: "▧", MESSAGE: "↗", SEARCH: "⌕", EVENT: "□", NOTE: "✎" };
export default function Replay({ receipts, onClose }) {
  const [index, setIndex] = useState(0); const [playing, setPlaying] = useState(true);
  const ordered = [...receipts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(0, 8);
  useEffect(() => { if (!playing) return; const t = setInterval(() => setIndex(i => i + 1 >= ordered.length ? i : i + 1), 1500); return () => clearInterval(t) }, [playing, ordered.length]);
  const current = ordered[index] || ordered[0];
  return <div className="replay-overlay">
    <div className="replay-frame">
      <div className="replay-header"><span>LIFE//TRACE / REPLAY</span><button onClick={onClose} aria-label="Close replay"><Icon name="close" /></button></div>
      <div className="replay-count">MOMENT {String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}</div>
      <div className="replay-main">
        <div className="replay-time">{current.time}</div><div className="replay-symbol">{symbols[current.type]}</div>
        <div className="replay-type">{current.type}</div><h2>{current.title}</h2><p>{current.description}</p>
        <div className="replay-place">{current.location} · {current.date}</div>
      </div>
      <div className="replay-timeline">{ordered.map((r, i) => <button key={r.id} className={i === index ? "on" : ""} onClick={() => setIndex(i)} aria-label={`Replay ${r.title}`}></button>)}</div>
      <div className="replay-controls"><button onClick={() => setPlaying(!playing)}><Icon name={playing ? "pause" : "play"} /> {playing ? "PAUSE" : "PLAY"}</button><button onClick={() => setIndex(0)}>RESTART</button></div>
      {index === ordered.length - 1 && <div className="replay-end"><strong>{ordered.length} MOMENTS.</strong><strong>{Math.round((new Date(ordered.at(-1).timestamp) - new Date(ordered[0].timestamp)) / 60000)} MINUTES.</strong><strong>ONE MEMORY.</strong></div>}
    </div>
  </div>
}