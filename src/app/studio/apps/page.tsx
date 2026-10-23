import type { Metadata } from 'next';
import { AppsManager } from '@/components/studio/AppsManager';
export const metadata:Metadata={title:'Apps Manager / Studio',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{area?:string}>}){return <AppsManager initialArea={(await searchParams).area}/>;}
