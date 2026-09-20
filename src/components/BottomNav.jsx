import React from "react";
import Icon from "./Icon";
const nav = [["overview", "HOME", "grid"], ["explore", "EXPLORE", "search"], ["connections", "LINKS", "link"], ["chapters", "STORY", "book"], ["map", "MAP", "pin"]];
export default function BottomNav({ page, onNavigate }) {
    return <nav className="bottom-nav">{nav.map(([id, label, icon]) => <button key={id} className={page === id ? "active" : ""} onClick={() => onNavigate(id)}><Icon name={icon} size={17} /><span>{label}</span></button>)}</nav>
}