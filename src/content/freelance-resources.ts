import data from './freelance-resources.json';
export type ResourceType = 'guide' | 'calculator' | 'template' | 'tool' | 'system';
export interface FreelanceResource {
  id: string; slug: string; title: string; description: string; type: ResourceType;
  keywords: string[]; audience: string; status: 'draft' | 'published'; featured: boolean;
  updatedAt: string; relatedIds: string[]; contentFile: string; pricingModel: 'free' | 'freemium';
  officialUrl?: string; pricingUrl?: string; lastVerified?: string; pricingNote?: string;
}
export const RESOURCE_LABELS: Record<ResourceType, string> = {guide:'Panduan',calculator:'Kalkulator',template:'Template',tool:'Tools',system:'Sistem'};
export const RESOURCE_ACTIONS: Record<ResourceType, string> = {guide:'Baca panduan',calculator:'Hitung tarif',template:'Buka template',tool:'Kenali tool',system:'Jelajahi sistem'};
const ids = new Set<string>();
const slugs = new Set<string>();
for (const r of data) {
  if (ids.has(r.id) || slugs.has(r.slug) || !/^[a-z0-9-]+$/.test(r.slug) || !(r.type in RESOURCE_LABELS) || !['draft','published'].includes(r.status) || !Number.isFinite(Date.parse(r.updatedAt)) || !r.contentFile || !r.audience) throw new Error('Invalid resource: '+r.id);
  if (r.type === 'tool' && (!r.officialUrl?.startsWith('https://') || !r.pricingUrl?.startsWith('https://') || !r.lastVerified)) throw new Error('Missing tool sources: '+r.id);
  ids.add(r.id); slugs.add(r.slug);
}
for (const r of data) if (r.relatedIds.some(id => !ids.has(id) || id === r.id)) throw new Error('Invalid related resource: '+r.id);
export const FREELANCE_RESOURCES = data as FreelanceResource[];
export const PUBLISHED_RESOURCES = FREELANCE_RESOURCES.filter(r => r.status === 'published');
export const resourceHref = (r: FreelanceResource) => `/freelance/tools/${r.slug}`;
export const findResource = (slug: string) => PUBLISHED_RESOURCES.find(r => r.slug === slug);
export const relatedResources = (r: FreelanceResource) => r.relatedIds.map(id => PUBLISHED_RESOURCES.find(item => item.id === id)).filter((item): item is FreelanceResource => Boolean(item)).slice(0,3);
export function filterResources(query: string, type: string = 'all') {
  const tokens = query.normalize('NFKD').toLocaleLowerCase('id').trim().split(/\s+/).filter(Boolean);
  return PUBLISHED_RESOURCES.filter(r => (type === 'all' || r.type === type) && tokens.every(t => `${r.title} ${r.description} ${r.keywords.join(' ')} ${r.audience} ${RESOURCE_LABELS[r.type]}`.toLocaleLowerCase('id').includes(t)));
}
