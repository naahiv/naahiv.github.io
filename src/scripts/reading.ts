const toc=document.querySelector<HTMLDetailsElement>('.contents details');
if(toc&&matchMedia('(max-width: 600px)').matches)toc.open=false;
const mathematicalDisclosures = [...document.querySelectorAll<HTMLDetailsElement>('details.math-block--collapsible')];
if (mathematicalDisclosures.length) {
  const revealFragment = () => {
    if (!location.hash) return;
    let id: string;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let revealed = false;
    for (let parent: HTMLElement | null = target; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement && parent.classList.contains('math-block--collapsible') && !parent.open) {
        parent.open = true;
        revealed = true;
      }
    }
    if (revealed) requestAnimationFrame(() => target.scrollIntoView());
  };
  revealFragment();
  window.addEventListener('hashchange', revealFragment);
  // Clicking the current fragment does not fire hashchange after a reader closes it.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (link && !link.hasAttribute('download') && (!link.target || link.target === '_self') && link.href === location.href) revealFragment();
  });
  let closedForPrint: HTMLDetailsElement[] | undefined;
  window.addEventListener('beforeprint', () => {
    if (closedForPrint) return;
    closedForPrint = mathematicalDisclosures.filter(details => !details.open);
    for (const details of closedForPrint) details.open = true;
  });
  window.addEventListener('afterprint', () => {
    for (const details of closedForPrint || []) details.open = false;
    closedForPrint = undefined;
  });
}
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
