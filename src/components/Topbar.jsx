import React from "react";
import Icon from "./Icon";
export default function Topbar({ page, onNavigate, onReplay }) {
  return <header className="topbar">
    <button className="mobile-menu" aria-label="Open navigation"><Icon name="menu" /></button>
    <div className="crumb"><b>LIFE//TRACE</b><span>/</span><span>{page.toUpperCase()}</span></div>
    <div className="top-actions"><span className="query-status">● LIVE QUERY LOG</span><button className="replay-btn" onClick={onReplay}><Icon name="play" size={13} /> REPLAY ARCHIVE</button></div>
  </header>
}