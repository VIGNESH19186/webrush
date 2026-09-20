import React from "react";
import Icon from "./Icon";
const nav = [
  ["overview", "OVERVIEW", "grid"], ["explore", "EXPLORE", "search"], ["connections", "CONNECTIONS", "link"],
  ["chapters", "CHAPTERS", "book"], ["map", "MAP", "pin"], ["replay", "REPLAY", "play"]
];
export default function Sidebar({ page, onNavigate }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"></span><span>LIFE//TRACE</span><small>YOUR LIFE, IN RECEIPTS</small></div>
    <div className="nav-label">EXPLORATION SECTORS</div>
    <nav>{nav.map(([id, label, icon]) => <button key={id} className={page === id ? "active" : ""} onClick={() => onNavigate(id)}><Icon name={icon} size={14} /><span>{label}</span></button>)}</nav>
    <div className="sidebar-foot"><span>LOCAL DATASET</span><strong>● ONLINE</strong></div>
  </aside>
}