import {posts} from '../lib/posts';
export async function GET(){return new Response(JSON.stringify((await posts()).map(p=>({slug:p.slug,title:p.title,summary:p.summary,tags:p.tags,text:p.searchText,url:p.url}))),{headers:{'Content-Type':'application/json'}});}
