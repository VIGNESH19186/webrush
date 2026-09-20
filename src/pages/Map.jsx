import React from "react";
import { groupByLocation } from "../utils/insights";
export default function Map({ receipts, onSelect }) {
    const groups = Object.entries(groupByLocation(receipts)).sort((a, b) => b[1].length - a[1].length);
    const coords = [[24, 38], [68, 25], [45, 67], [79, 64], [18, 72], [57, 44]];
    return <main className="page">
        <div className="page-title"><span className="eyebrow">GEOGRAPHIC TRACE</span><h1>MAP</h1><p>Places become anchors when different kinds of receipts keep returning to them.</p></div>
        <div className="life-map"><div className="map-grid"></div><div className="map-label">LOCAL TRACE / BENGALURU</div>{groups.slice(0, 6).map(([place, items], i) => { const [x, y] = coords[i % coords.length]; return <button key={place} className="map-marker" style={{ left: `${x}%`, top: `${y}%` }} onClick={() => onSelect(items[0])}><i></i><span>{place}</span><b>{items.length}</b></button> })}<div className="map-route"></div></div>
        <div className="location-grid">{groups.map(([place, items]) => <button className="location-card" key={place} onClick={() => onSelect(items[0])}><span>LOCATION / {String(items.length).padStart(2, "0")}</span><h3>{place}</h3><p>{new Set(items.map(r => r.type)).size} receipt types · {items.length} connected moments</p><small>{items.map(r => r.type).join(" · ")}</small></button>)}</div>
    </main>
}