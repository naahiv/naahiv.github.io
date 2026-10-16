const toc=document.querySelector<HTMLDetailsElement>('.contents details');
if(toc&&matchMedia('(max-width: 600px)').matches)toc.open=false;
const regions=[...document.querySelectorAll<HTMLElement>('.math-scroll,.diagram-scroll')];
// One hint per region; maintain it through font loading and viewport changes.
function refresh(){for(const region of regions){region.dataset.scrollId ||= `scroll-${regions.indexOf(region)}`;const existing=document.querySelector<HTMLElement>(`[data-scroll-for="${region.dataset.scrollId}"]`);if(existing){existing.hidden=region.scrollWidth<=region.clientWidth+2;continue;}if(region.scrollWidth>region.clientWidth+2){const hint=document.createElement('p');hint.className='scroll-hint';hint.dataset.scrollFor=region.dataset.scrollId;hint.textContent=`Scroll horizontally to read the full ${region.classList.contains('diagram-scroll')?'diagram':'expression'} ↔︎`;const target=region.classList.contains('math-scroll')?region.parentElement:region;target?.insertAdjacentElement('afterend',hint);}}}
if(regions.length){
  let frame=0;
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;refresh();});};
  const observer=new ResizeObserver(schedule);
  for(const region of regions)observer.observe(region);
  document.fonts.ready.then(schedule);
  schedule();
}
