import React from "react";
import { generateChapters } from "../utils/insights";
export default function Chapters({ receipts, onSelect }) {
    const chapters = generateChapters(receipts);
    return <main className="page">
        <div className="page-title"><span className="eyebrow">NARRATIVE RECONSTRUCTION</span><h1>CHAPTERS</h1><p>Not months. Not folders. Story phases discovered from recurring behavior.</p></div>
        <div className="chapters">{chapters.map((c, i) => <article className="chapter" key={c.title}><div className="chapter-number">0{i + 1}</div><div className="chapter-body"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><div className="chapter-dates">{c.dates}</div><div className="chapter-stats">{c.stats.map(s => <span key={s}>{s}</span>)}</div><p>{c.description}</p><button onClick={() => onSelect(receipts.find(r => c.ids.includes(r.id)))}>OPEN FIRST TRACE <span>→</span></button></div></article>)}</div>
    </main>
}