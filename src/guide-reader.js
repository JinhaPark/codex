const STORAGE_KEY = 'central-asia-reader-v1';
const validTabs = ['days', 'guide', 'fx', 'list'];
// The route uses a fragment so GitHub Pages and offline navigation need no server rewrite.
export function parseGuideRoute(hash, entries) {
  const parts = hash.replace(/^#/, '').split('/');
  if (parts[0] === 'tab' && validTabs.includes(parts[1])) return {tab:parts[1]};
  if (parts[0] === 'guide') {
    const entry = entries.find(e=>e.id === parts[2]);
    return {tab:'guide', category:entry?.category || (['core','cities','kazakhstan'].includes(parts[1]) ? parts[1] : 'core'), article:entry?.id || '', section:parts[3] || ''};
  }
  const aliases = {'central-asia-geography-climate':'geography','silk-road-introduction':'history','central-asia-power-datacenters':'resources','central-asia-economy':'economy'};
  const id = aliases[parts[0]] || parts[0];
  const entry = entries.find(e=>e.id === id);
  if (entry) return {tab:'guide', category:entry.category, article:entry.id, section:''};
  if (id === 'city-guides' || id === 'kazakhstan-deep-dives') return {tab:'guide',category:id === 'city-guides' ? 'cities' : 'kazakhstan',article:'',section:''};
  return null;
}
export function createGuideReader({root, entries, onNavigate}) {
  let saved;
  try {saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');} catch {saved = {};}
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const memory = {positions:{}, opens:{}};
  for (const key of ['positions', 'opens']) if (saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key])) memory[key] = saved[key];
  let state = {tab:'guide', category:['core','cities','kazakhstan'].includes(saved.category) ? saved.category : 'core', article:'', section:''};
  const initial = parseGuideRoute(location.hash, entries);
  if (initial) state = {...state, ...initial};
  let url = location.href, timer, restoreFrame, positionFrame, restoring = false, mountSerial = 0;
  history.scrollRestoration = 'manual';
  const persist = () => {try {localStorage.setItem(STORAGE_KEY, JSON.stringify({...memory, category:state.category}));} catch { /* Reading still works with storage disabled. */ }};
  const currentKey = () => {
    const article = root.querySelector('[data-guide-article]');
    if (article) return `article:${article.dataset.guideArticle}`;
    return root.querySelector('.guide-library') ? 'list:all' : '';
  };
  function save() {
    if (restoring) return;
    const key = currentKey();
    if (!key) return;
    memory.positions[key] = scrollY;
    memory.opens[key] = [...root.querySelectorAll('.guide-reader details, [data-guide-inline]')].map(d=>d.open);
    persist();
  }
  function hashFor(next) {
    return next.tab === 'guide' ? `#guide/${next.category}${next.article ? '/'+next.article : ''}${next.section ? '/'+next.section : ''}` : `#tab/${next.tab}`;
  }
  function navigate(next) {
    save();
    state = {...state, section:'', ...next};
    history.pushState(null, '', hashFor(state));
    url = location.href;
    onNavigate(state.tab);
    if (state.tab !== 'guide') window.scrollTo(0, 0);
  }
  function followLocation() {
    if (url === location.href) return;
    save();
    state = {...state, section:'', ...(parseGuideRoute(location.hash, entries) || {tab:'days'})};
    url = location.href;
    onNavigate(state.tab);
    if (state.tab !== 'guide') window.scrollTo(0, 0);
  }
  addEventListener('popstate', followLocation);
  addEventListener('hashchange', followLocation);
  addEventListener('pagehide', save);
  function updatePosition() {
    const button = root.querySelector('[data-guide-toc]');
    if (!button) return;
    const sections = [...root.querySelectorAll('[data-reader-section]')];
    const boundary = root.querySelector('.reader-toolbar').getBoundingClientRect().bottom + 30;
    let current = 0;
    sections.forEach((section,i)=>{if (section.getBoundingClientRect().top <= boundary) current=i;});
    button.textContent = `목차 · ${current + 1}/${sections.length}`;
    button.setAttribute('aria-label', `이 글의 목차 · 현재 ${sections[current]?.querySelector('summary').textContent.trim()}`);
  }
  addEventListener('scroll', () => {
    clearTimeout(timer);timer = setTimeout(save, 180);
    cancelAnimationFrame(positionFrame);positionFrame = requestAnimationFrame(updatePosition);
  }, {passive:true});
  root.addEventListener('toggle', e => {if (e.target.matches('.guide-reader details, [data-guide-inline]') && e.target.isConnected) {clearTimeout(timer);timer = setTimeout(save, 180);}}, true);
  function mount() {
    cancelAnimationFrame(restoreFrame);
    const serial = ++mountSerial;
    restoring = true;
    root.dataset.guideRestoring = 'true';
    const key = currentKey();
    root.style.setProperty('--guide-nav-height', `${root.querySelector('nav[aria-label="여행 메뉴"]').getBoundingClientRect().height}px`);
    const details = [...root.querySelectorAll('.guide-reader details, [data-guide-inline]')];
    if (Array.isArray(memory.opens[key])) details.forEach((d,i)=>{if (typeof memory.opens[key][i] === 'boolean') d.open = memory.opens[key][i];});
    const toc = root.querySelector('[data-guide-toc-items]');
    if (toc) {
      for (const section of root.querySelectorAll('[data-reader-section]')) {
        const button = document.createElement('button');
        button.type = 'button';button.dataset.guideJump = section.id;
        button.textContent = section.querySelector(':scope > summary').textContent.trim();
        toc.append(button);
      }
    }
    restoreFrame = requestAnimationFrame(async () => {
      // Text metrics may change after reload, especially with a user's Korean webfont.
      await document.fonts.ready;
      if (serial !== mountSerial) return;
      if (key !== currentKey()) {restoring = false;delete root.dataset.guideRestoring;return;}
      const target = state.section && document.getElementById(state.section);
      if (target && root.querySelector('.guide-reader')?.contains(target)) {reveal(target);state.section = '';}
      else {
        const position = memory.positions[key];
        window.scrollTo(0, Number.isFinite(position) && position >= 0 ? position : root.querySelector('main').offsetTop - 60);
      }
      updatePosition();
      restoring = false;
      delete root.dataset.guideRestoring;
    });
  }
  function reveal(target) {
    for (let p = target; p && p !== root; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
    target.scrollIntoView({block:'start'});
    const focus = target.querySelector(':scope > summary') || target;
    if (!focus.matches('summary')) focus.tabIndex = -1;
    focus.focus({preventScroll:true});
  }
  root.addEventListener('click', e => {
    const button = e.target.closest('button, a');
    if (!button) return;
    if (button.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
    if (button.hasAttribute('data-guide-category')) navigate({tab:'guide',category:button.dataset.guideCategory,article:''});
    else if (button.hasAttribute('data-guide-open')) {
      e.preventDefault();const entry = entries.find(item=>item.id === button.dataset.guideOpen);
      if (entry) navigate({tab:'guide',category:entry.category,article:entry.id});
    } else if (button.hasAttribute('data-guide-list')) navigate({tab:'guide',article:''});
    else if (button.hasAttribute('data-guide-expand') || button.hasAttribute('data-guide-collapse')) {
      const open = button.hasAttribute('data-guide-expand');
      root.querySelectorAll('[data-reader-section]').forEach(d=>{d.open = open;});save();
    } else if (button.hasAttribute('data-guide-toc')) root.querySelector('.reader-toc').showModal();
    else if (button.hasAttribute('data-guide-close')) root.querySelector('.reader-toc').close();
    else if (button.hasAttribute('data-guide-jump')) {
      root.querySelector('.reader-toc').close();
      navigate({tab:'guide',section:button.dataset.guideJump});
    } else if (button.getAttribute('href')?.startsWith('#') && root.querySelector('.guide-reader')?.contains(button)) {
      const route = parseGuideRoute(button.getAttribute('href'), entries);
      if (route) {e.preventDefault();navigate(route);}
    }
  });
  return {get state(){return state;}, initialTab:initial?.tab, save, mount, goTab:tab=>navigate({tab})};
}
