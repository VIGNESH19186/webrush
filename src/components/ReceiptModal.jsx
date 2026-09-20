import React, { useEffect } from "react";
import Icon from "./Icon";
import { formatDate } from "../utils/insights";
export default function ReceiptModal({ receipt, onClose, connections = 0 }) {
  useEffect(() => { const fn = e => e.key === "Escape" && onClose(); window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn) }, [onClose]);
  if (!receipt) return null;
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <button className="modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <div className="modal-kicker">{receipt.type} / DIGITAL RECEIPT</div>
      <h2 id="receipt-title">{receipt.title}</h2>
      <p className="modal-description">{receipt.description}</p>
      <div className="modal-grid">
        <div><span>DATE</span><b>{formatDate(receipt.date)}</b></div><div><span>TIME</span><b>{receipt.time}</b></div>
        <div><span>LOCATION</span><b>{receipt.location || "—"}</b></div><div><span>CONNECTIONS</span><b>{connections}</b></div>
      </div>
      <div className="keyword-row">{(receipt.keywords || []).map(k => <span key={k}>#{k}</span>)}</div>
      <div className="metadata"><span>METADATA</span><pre>{JSON.stringify(receipt.metadata, null, 2)}</pre></div>
    </section>
  </div>
}