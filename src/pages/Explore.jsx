import React, { useMemo, useState } from "react";
import ReceiptCard from "../components/ReceiptCard";
import Icon from "../components/Icon";
import { normalizeType } from "../utils/insights";
const filters = ["ALL", "MUSIC", "MOVIES", "PLACES", "PURCHASES", "PHOTOS", "MESSAGES", "SEARCHES", "EVENTS", "NOTES"];
export default function Explore({ receipts, counts, onSelect }) {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("ALL"); const [sort, setSort] = useState("newest");
  const result = useMemo(() => receipts.filter(r => {
    const q = query.toLowerCase(); const hay = [r.title, r.description, r.type, r.location, ...(r.keywords || [])].join(" ").toLowerCase();
    return (!q || hay.includes(q)) && (filter === "ALL" || normalizeType(r.type) === filter);
  }).sort((a, b) => sort === "oldest" ? new Date(a.timestamp) - new Date(b.timestamp) : sort === "connections" ? counts[b.id] - counts[a.id] : new Date(b.timestamp) - new Date(a.timestamp)), [receipts, query, filter, sort, counts]);
  return <main className="page">
    <div className="page-title"><span className="eyebrow">RAW RECEIPT INDEX</span><h1>EXPLORE</h1><p>Search the evidence. Then follow the relationships.</p></div>
    <div className="search-row"><div className="search-box"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your life..." aria-label="Search your life" /></div><label className="sort"><span>SORT</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="connections">Most Connected</option></select></label></div>
    <div className="filter-scroll">{filters.map(f => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}><Icon name="filter" size={12} />{f}</button>)}</div>
    {result.length ? <div className="receipt-grid">{result.map(r => <ReceiptCard key={r.id} receipt={r} connections={counts[r.id] || 0} onClick={onSelect} />)}</div> : <div className="empty"><strong>NO RECEIPTS FOUND</strong><span>Try changing your search or filters.</span></div>}
  </main>
}