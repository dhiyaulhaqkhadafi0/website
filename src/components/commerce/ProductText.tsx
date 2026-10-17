import { Fragment } from "react";
import s from "./commerce.module.css";
// Plain text/Markdown subset is rendered as React nodes; CMS HTML never executes.
function inline(text: string) { return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>); }
export function ProductText({ text }: { text: string }) {
  return <div className={s.productText}>{text.replace(/\r\n/g, "\n").split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    const lines = block.trim().split("\n");
    if (lines.every(line => /^\s*[-•]\s+/.test(line))) return <ul key={i}>{lines.map((line, n) => <li key={n}>{inline(line.replace(/^\s*[-•]\s+/, ""))}</li>)}</ul>;
    if (/^#{1,3} /.test(block)) return <h3 key={i}>{inline(block.replace(/^#{1,3} /, ""))}</h3>;
    return <p key={i}>{lines.map((line, n) => <Fragment key={n}>{n > 0 && <br />}{inline(line)}</Fragment>)}</p>;
  })}</div>;
}
