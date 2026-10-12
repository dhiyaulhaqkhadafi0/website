'use client';
import { useState } from 'react';
import { Copy, Download, Printer, Check } from 'lucide-react';
import s from './resource-library.module.css';
export function CopyAction({text,label='Salin hasil'}:{text:string;label?:string}) {
 const [status,setStatus]=useState('');const [manual,setManual]=useState(false);
 async function copy() { try {await navigator.clipboard.writeText(text);setManual(false);setStatus('Berhasil disalin.');} catch {setManual(true);setStatus('Salin otomatis tidak tersedia. Pilih teks di bawah, lalu salin secara manual.');} }
 return <div className={s.copyAction}><button className={s.button} type="button" onClick={copy}>{status==='Berhasil disalin.'?<Check size={17}/>:<Copy size={17}/>} {label}</button><p role="status" aria-live="polite">{status}</p>{manual&&<textarea aria-label="Teks untuk disalin manual" readOnly value={text} onFocus={e=>e.target.select()} rows={8}/>}</div>;
}
export function TemplateActions({text,slug,invoice=false}:{text:string;slug:string;invoice?:boolean}) {
 const [message,setMessage]=useState('');
 return <div className={s.actions} data-no-print><CopyAction text={text} label="Salin Template"/><div><a className={s.secondaryButton} href={`/downloads/freelance/${slug}.md`} download={`${slug}.md`} onClick={()=>setMessage('File Markdown siap diunduh. Periksa daftar unduhan browser.')}><Download size={17}/> Unduh Template</a><p role="status" aria-live="polite">{message}</p></div>{invoice&&<button type="button" className={s.secondaryButton} onClick={()=>window.print()}><Printer size={17}/> Cetak / Simpan PDF</button>}</div>;
}
