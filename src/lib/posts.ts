import { getCollection } from 'astro:content';
export const site = 'https://naahiv.github.io';
export async function posts() {
  return (await getCollection('posts')).map(entry => entry.data).sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', { year:'numeric', month:'long', day:'numeric', timeZone:'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
export const tagSlug = (tag: string) => tag.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const xml = (value: string) => value.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
