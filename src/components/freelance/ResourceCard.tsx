import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calculator, FileText, Layers, Clock3, Video } from 'lucide-react';
import { RESOURCE_LABELS, RESOURCE_ACTIONS, resourceHref, type FreelanceResource } from '@/content/freelance-resources';
import s from './resource-library.module.css';
export function ResourceIcon({resource:r}:{resource:FreelanceResource}) {
  const Icon = r.id==='E02'?Clock3:r.id==='E03'?Video:r.type==='guide'?BookOpen:r.type==='calculator'?Calculator:r.type==='template'?FileText:Layers;
  return <span className={s.icon}><Icon size={23} strokeWidth={1.5} aria-hidden="true"/></span>;
}
export function ResourceCard({resource:r}:{resource:FreelanceResource}) {
 return <Link href={resourceHref(r)} className={s.card} data-resource={r.id}><div className={s.cardTop}><ResourceIcon resource={r}/><span>{RESOURCE_LABELS[r.type]} <span aria-hidden="true">/</span> {r.id}</span></div><h3>{r.title}</h3><p>{r.description}</p><div className={s.cardFoot}><span>{RESOURCE_ACTIONS[r.type]} <ArrowUpRight size={17} aria-hidden="true"/></span><small>{r.pricingModel==='freemium'?'Freemium':'Gratis'}</small></div></Link>;
}
