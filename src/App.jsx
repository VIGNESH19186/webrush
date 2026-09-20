import React, { useMemo, useState } from "react";
import receipts from "./data/receipts.json";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Topbar from "./components/Topbar";
import ReceiptModal from "./components/ReceiptModal";
import Replay from "./components/Replay";
import Overview from "./pages/Overview";
import Explore from "./pages/Explore";
import Connections from "./pages/Connections";
import Chapters from "./pages/Chapters";
import Map from "./pages/Map";
import { calculateStatistics, connectionCountMap, findConnections, findPatterns } from "./utils/insights";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [replay, setReplay] = useState(false);
  const edges = useMemo(() => findConnections(receipts), []);
  const counts = useMemo(() => connectionCountMap(receipts, edges), [edges]);
  const stats = useMemo(() => calculateStatistics(receipts), []);
  const patterns = useMemo(() => findPatterns(receipts), []);
  const pages = {
    overview: <Overview receipts={receipts} stats={stats} patterns={patterns} onSelect={setSelected} onNavigate={setPage} />,
    explore: <Explore receipts={receipts} counts={counts} onSelect={setSelected} />,
    connections: <Connections receipts={receipts} onSelect={setSelected} />,
    chapters: <Chapters receipts={receipts} onSelect={setSelected} />,
    map: <Map receipts={receipts} onSelect={setSelected} />,
    replay: <Overview receipts={receipts} stats={stats} patterns={patterns} onSelect={setSelected} onNavigate={setPage} />
  };
  return <div className="app-shell">
    <Sidebar page={page} onNavigate={setPage} />
    <div className="main-shell"><Topbar page={page} onNavigate={setPage} onReplay={() => setReplay(true)} />{pages[page]}</div>
    <BottomNav page={page} onNavigate={setPage} />
    <ReceiptModal receipt={selected} connections={selected ? counts[selected.id] : 0} onClose={() => setSelected(null)} />
    {replay && <Replay receipts={receipts} onClose={() => setReplay(false)} />}
  </div>
}