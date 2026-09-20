import React from "react";
import Icon from "./Icon";
import { formatDate } from "../utils/insights";
const symbols = { MUSIC: "♫", MOVIES: "◉", PLACE: "⌖", PURCHASE: "₨", PHOTO: "▧", MESSAGE: "↗", SEARCH: "⌕", EVENT: "□", NOTE: "✎" };
export default function ReceiptCard({ receipt, connections = 0, onClick }) {
  return <button className="receipt-card" onClick={() => onClick(receipt)} aria-label={`Open ${receipt.title}`}>
    <div className="receipt-head"><span className="receipt-type"><i>{symbols[receipt.type]}</i>{receipt.type}</span><span>{connections} LINK{connections === 1 ? "" : "S"}</span></div>
    <h3>{receipt.title}</h3><p>{receipt.description}</p>
    <div className="receipt-meta"><span><Icon name="clock" size={12} />{receipt.time}</span><span>{formatDate(receipt.date)}</span></div>
    <div className="receipt-location">{receipt.location || "UNKNOWN LOCATION"} <Icon name="arrow" size={12} /></div>
  </button>
}