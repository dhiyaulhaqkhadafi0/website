import {LoaderCircle} from 'lucide-react';
import s from '@/components/commerce/commerce.module.css';
export default function Loading(){return <div className={s.loading} role="status"><LoaderCircle className={s.spin} size={20}/>Menyiapkan halaman…</div>;}
