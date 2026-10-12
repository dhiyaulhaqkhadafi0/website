'use client';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateFreelanceRate, DEFAULT_RATE_INPUTS, formatCurrency, type RateInputs } from '@/lib/freelance-rate';
import { CopyAction } from './ResourceActions';
import s from './resource-library.module.css';
const fields = [
 ['desiredMonthlyTakeHome','Target penghasilan bersih / bulan','Pendapatan yang ingin dibawa pulang setelah biaya usaha.',0,1e12],
 ['monthlyBusinessCosts','Biaya operasional / bulan','Software, internet, alat kerja, dan biaya usaha lainnya.',0,1e12],
 ['weeklyWorkHours','Jam kerja / minggu','Seluruh waktu kerja, termasuk administrasi dan mencari klien.',1,80],
 ['billablePercent','Jam yang bisa ditagihkan (%)','Porsi waktu untuk pekerjaan klien. Administrasi tidak selalu billable.',0,100],
 ['reservePercent','Cadangan dari omzet (%)','Porsi untuk tabungan usaha, waktu libur, dan kebutuhan lain.',0,99],
 ['quoteBufferPercent','Buffer penawaran (%)','Ruang tambahan di atas tarif minimum untuk negosiasi dan risiko.',0,300],
] as const;
type NumericKey=typeof fields[number][0];
const defaults=()=>Object.fromEntries(fields.map(([key])=>[key,String(DEFAULT_RATE_INPUTS[key])])) as Record<NumericKey,string>;
export function RateCalculator() {
 const [currency,setCurrency]=useState<RateInputs['currency']>('IDR');const [values,setValues]=useState(defaults);
 let result:ReturnType<typeof calculateFreelanceRate>|undefined;let error='';
 try {const input={currency,...Object.fromEntries(fields.map(([key])=>[key,values[key].trim()===''?NaN:Number(values[key])]))} as RateInputs;result=calculateFreelanceRate(input);}catch(e){error=e instanceof Error?e.message:'Periksa input kamu.';}
 const money=(n:number)=>formatCurrency(n,currency);
 const rows=result?[['Jam billable / bulan',`${new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(result.monthlyBillableHours)} jam`],['Target omzet / bulan',money(result.requiredMonthlyRevenue)],['Tarif minimum / jam',money(result.minimumHourlyRate)],['Tarif penawaran / jam',money(result.quoteHourlyRate)]]:[];
 const summary=result?`Estimasi tarif freelance (${currency})\n${rows.map(([a,b])=>`${a}: ${b}`).join('\n')}\nSaran pembulatan / jam: ${money(result.suggestedRoundedQuote)}\nAsumsi: ${fields.map(([key,label])=>`${label}: ${values[key]}`).join('; ')}\nCurrency hanya satuan, tanpa konversi kurs.`:'';
 return <section className={s.calculator} aria-label="Kalkulator tarif freelance"><div className={s.calculatorInputs}><h2>Mulai dari kebutuhanmu.</h2><label className={s.inputLabel}>Mata uang<select value={currency} onChange={e=>setCurrency(e.target.value as RateInputs['currency'])}><option value="IDR">IDR — Rupiah</option><option value="USD">USD — Dolar AS</option></select><small>Hanya satuan. Angka tidak dikonversi dengan kurs.</small></label>{fields.map(([key,label,help,min,max])=><label key={key} className={s.inputLabel} htmlFor={key}>{label}<input id={key} type="number" min={min} max={max} step="any" inputMode="decimal" value={values[key]} aria-describedby={`${key}-help`} onChange={e=>setValues({...values,[key]:e.target.value})}/><small id={`${key}-help`}>{help}</small></label>)}<button type="button" className={s.secondaryButton} onClick={()=>{setCurrency('IDR');setValues(defaults());}}><RotateCcw size={16}/> Reset ke contoh</button></div><div className={s.calculatorResult}><span className={s.eyebrow}>Estimasi langsung</span><h2>Tarif yang memberi<br/>ruang untuk tumbuh.</h2>{error?<p className={s.error} role="alert">{error}</p>:result&&<><dl>{rows.map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl><div className={s.recommended}><span>Saran pembulatan / jam</span><strong data-testid="suggested-rate">{money(result.suggestedRoundedQuote)}</strong><small>Dibulatkan ke atas per {currency==='IDR'?'Rp5.000':'US$5'}.</small></div><CopyAction key={summary} text={summary}/></>}<p className={s.privacyNote}>Perhitungan berjalan di browser. Nilai pendapatanmu tidak dikirim ke database atau analytics.</p></div></section>;
}
