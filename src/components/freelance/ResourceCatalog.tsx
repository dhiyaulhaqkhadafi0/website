'use client';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { filterResources, PUBLISHED_RESOURCES, RESOURCE_LABELS } from '@/content/freelance-resources';
import { ResourceCard } from './ResourceCard';
import s from './resource-library.module.css';
export function ResourceCatalog() {
 const params=useSearchParams();
 const q=params.get('q')??''; const rawType=params.get('type')??'all';
 const type=rawType in RESOURCE_LABELS?rawType:'all';
 const rows=filterResources(q,type);
 function update(query:string, nextType:string) { const next=new URLSearchParams();if(query)next.set('q',query);if(nextType!=='all')next.set('type',nextType); const url=`/freelance/tools${next.size?'?'+next:''}`; if(nextType!==type)window.history.pushState(null,'',url);else window.history.replaceState(null,'',url); }
 return <section id="katalog" className={s.catalog} aria-labelledby="catalog-title"><div className={s.sectionHead}><div><span className={s.eyebrow}>Library / 01—09</span><h2 id="catalog-title">Bekal kerja, sesuai kebutuhan.</h2></div><p>Mulai dari satu hal yang ingin kamu bereskan hari ini.</p></div><div className={s.search}><Search size={21} aria-hidden="true"/><input aria-label="Cari resource" type="search" value={q} onChange={e=>update(e.target.value,type)} placeholder="Cari panduan, proposal, invoice, atau tools…"/>{q&&<button type="button" aria-label="Bersihkan pencarian" onClick={()=>update('',type)}><X size={19}/></button>}<kbd aria-hidden="true">Cari</kbd></div><div className={s.filterBar}><div className={s.filters} aria-label="Jenis resource">{[['all','Semua'],...Object.entries(RESOURCE_LABELS)].map(([value,label])=><button key={value} type="button" aria-pressed={type===value} onClick={()=>update(q,value)}>{label}<small>{value==='all'?PUBLISHED_RESOURCES.length:PUBLISHED_RESOURCES.filter(r=>r.type===value).length}</small></button>)}</div><span role="status" aria-live="polite">{rows.length} resource</span></div>{rows.length?<div className={s.grid}>{rows.map(r=><ResourceCard key={r.id} resource={r}/>)}</div>:<div className={s.empty}><Search size={28}/><h3>Belum ada yang cocok.</h3><p>Coba kata yang lebih sederhana, atau tampilkan seluruh koleksi.</p><button className={s.button} type="button" onClick={()=>update('','all')}>Reset pencarian</button></div>}</section>;
}
