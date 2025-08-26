// assets/js/bali-finder.js
// Minimal “one-div” balisong finder. Drop a <div id="bali-finder" data-index="/balisongs.json"></div> on a page,
// then include this script as a module. No other HTML required.

(function () {
  const css = `
  .bf-wrap{display:grid;gap:1rem}
  .bf-filters{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
  .bf-fieldset{border:1px solid #e3e3e3;border-radius:12px;padding:.75rem}
  .bf-legend{font-weight:600;color:#333;margin:0 0 .5rem}
  .bf-row{display:flex;gap:.5rem;align-items:center;justify-content:space-between;margin:.35rem 0}
  .bf-row>input,.bf-row>select{flex:1 1 auto}
  .bf-actions{display:flex;gap:.5rem}
  .bf-count{color:#666}
  .bf-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
  .bf-card{border:1px solid #e5e5e5;border-radius:14px;padding:1rem}
  .bf-muted{color:#666}
  .bf-badge{display:inline-block;border-radius:999px;padding:.1rem .5rem;font-size:.8em;border:1px solid #ddd;margin-right:.35rem}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  function el(tag, props={}, ...children){
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k,v]) => {
      if (k==='class') n.className=v;
      else if (k==='text') n.textContent=v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    children.flat().forEach(c => n.append(c));
    return n;
  }

  function norm(s){ return (s ?? '').toString().trim().toLowerCase(); }
  function toNum(v){ return (v===''||v==null)?null:Number(v); }

  function normalizeItem(x){
    // Accept both the “flat” shape and the earlier nested shape (data under key[1]).
    if (x && x.key && Array.isArray(x.key) && typeof x.key[1]==='object') {
      const d = x.key[1];
      const mats = [d?.handle?.material?.frame, d?.handle?.material?.liner, d?.handle?.material?.scale]
        .filter(Boolean).join(' ').trim() || '';
      let lo=null, hi=null; const r=d?.retail;
      if (typeof r==='number'){ lo=r; hi=r; }
      else if (r && typeof r==='object'){ lo=r.min ?? r.low ?? null; hi=r.max ?? r.high ?? null; }
      const hl=d?.handle?.measurement?.length, bl=d?.blade?.measurement?.length;
      const overallLen = d?.overall?.length ?? ((typeof hl==='number' && typeof bl==='number') ? (hl+bl) : null);
      const weightOz   = d?.overall?.weight ?? null;
      return {
        key: x.key[0], url: x.url ?? null,
        name: d?.name ?? null, maker: d?.maker ?? null,
        availability: d?.availability ?? null, has_ring: d?.has_ring ?? null,
        handle_construction: d?.handle?.construction?.type ?? null,
        handle_materials: mats,
        stop_system: d?.stop_system?.type ?? null,
        pivot_system: d?.pivot_system?.type ?? null,
        overall_length_in: overallLen, weight_oz: weightOz,
        retail_low: lo, retail_high: hi
      };
    }
    return x;
  }

  function rangeOK(ilo, ihi, min, max){
    if (ilo==null && ihi==null) return (min==null && max==null);
    const lo = (ilo==null && ihi!=null) ? ihi : ilo;
    const hi = (ihi==null && ilo!=null) ? ilo : ihi;
    if (min==null && max==null) return true;
    if (min!=null && max==null) return (hi!=null) && (hi>=min);
    if (min==null && max!=null) return (lo!=null) && (lo<=max);
    return (lo!=null && hi!=null) && (lo<=max && hi>=min);
  }

  function matchesHC(cell, sel){
    if (!sel) return true;
    const v = norm(cell||'');
    switch(sel){
      case 'channel': return v.includes('channel');
      case 'sandwich': return v.includes('sandwich');
      case 'chanwich': return v.includes('chanwich');
      case 'liners_and_scales': return v.includes('liner') && v.includes('scale');
      case 'channel_and_liners': return v.includes('channel') && v.includes('liner');
      default: return true;
    }
  }

  function card(item){
    const badge = b => el('span',{class:'bf-badge',text:b});
    const retail = (item.retail_low!=null && item.retail_high!=null && item.retail_low!==item.retail_high)
      ? `$${item.retail_low}–$${item.retail_high}`
      : (item.retail_low!=null ? `$${item.retail_low}` : '—');
    const title = item.name ?? 'Untitled';
    const head = item.url ? el('a',{href:item.url, text:title}) : el('span',{text:title});
    return el('article',{class:'bf-card'},
      el('h3',{style:'margin:.2rem 0;'}, head),
      el('div',{class:'bf-muted',style:'margin-bottom:.5rem',text:item.maker??''}),
      el('div',{style:'margin-bottom:.5rem'},
        item.availability?badge(item.availability):'',
        item.handle_construction?badge(item.handle_construction):'',
        item.stop_system?badge(item.stop_system):'',
        item.pivot_system?badge(item.pivot_system):'',
        (item.has_ring===true)?badge('Rings'):(item.has_ring===false)?badge('No ring'):''
      ),
      el('ul',{class:'bf-muted',style:'list-style:none;padding:0;margin:0'},
        el('li',{text:`Retail: ${retail}`}),
        el('li',{text:`Weight: ${item.weight_oz!=null?item.weight_oz+' oz':'—'}`}),
        el('li',{text:`Overall length: ${item.overall_length_in!=null?item.overall_length_in+' in':'—'}`}),
        item.handle_materials? el('li',{text:`Handle materials: ${item.handle_materials}`}) : ''
      )
    );
  }

  function buildUI(root, apply){
    const makeFieldset = (legend, rows) => el('div',{class:'bf-fieldset'},
      el('div',{class:'bf-legend',text:legend}),
      rows
    );

    const statusSel = el('select',{name:'status'},
      el('option',{value:'',text:'Any'}),
      ...['Available','Hiatus','Discontinued'].map(x=>el('option',{value:x,text:x}))
    );
    const ringSel = el('select',{name:'ring'},
      el('option',{value:'',text:'Any'}),
      el('option',{value:'yes',text:'Yes'}),
      el('option',{value:'no',text:'No'})
    );
    const retailMin = el('input',{type:'number',step:'1',name:'retail_min',inputmode:'decimal'});
    const retailMax = el('input',{type:'number',step:'1',name:'retail_max',inputmode:'decimal'});
    const wMin = el('input',{type:'number',step:'0.01',name:'weight_min',inputmode:'decimal'});
    const wMax = el('input',{type:'number',step:'0.01',name:'weight_max',inputmode:'decimal'});
    const lMin = el('input',{type:'number',step:'0.01',name:'len_min',inputmode:'decimal'});
    const lMax = el('input',{type:'number',step:'0.01',name:'len_max',inputmode:'decimal'});
    const hcSel = el('select',{name:'handle_construction'},
      el('option',{value:'',text:'Any'}),
      ...[
        ['channel','Channel'],
        ['liners_and_scales','Liners and Scales'],
        ['channel_and_liners','Channel and Liners'],
        ['sandwich','Sandwich'],
        ['chanwich','Chanwich']
      ].map(([v,t])=>el('option',{value:v,text:t}))
    );
    const matInput = el('input',{type:'text',name:'handle_mat_contains',placeholder:'e.g. titanium, g10'});
    const stopSel = el('select',{name:'stop_system'},
      el('option',{value:'',text:'Any'}),
      ...['zen','tang','pinless'].map(v=>el('option',{value:v,text:({zen:'Zen Pins',tang:'Tang Pins',pinless:'Pinless'})[v]}))
    );
    const pivotSel = el('select',{name:'pivot_system'},
      el('option',{value:'',text:'Any'}),
      ...['washer','bearing','bushing'].map(v=>el('option',{value:v,text:({washer:'Washers',bearing:'Bearings',bushing:'Bushings'})[v]}))
    );

    const filters = el('form',{class:'bf-filters',id:'bf-form'},
      makeFieldset('Status',[
        el('label',{class:'bf-row'}, el('span',{text:'Active Status'}), statusSel),
        el('label',{class:'bf-row'}, el('span',{text:'Has Ring?'}), ringSel),
      ]),
      makeFieldset('Retail',[
        el('label',{class:'bf-row'}, el('span',{text:'≥'}), retailMin),
        el('label',{class:'bf-row'}, el('span',{text:'≤'}), retailMax),
      ]),
      makeFieldset('Weight (oz)',[
        el('label',{class:'bf-row'}, el('span',{text:'≥'}), wMin),
        el('label',{class:'bf-row'}, el('span',{text:'≤'}), wMax),
      ]),
      makeFieldset('Overall length (in)',[
        el('label',{class:'bf-row'}, el('span',{text:'≥'}), lMin),
        el('label',{class:'bf-row'}, el('span',{text:'≤'}), lMax),
      ]),
      makeFieldset('Handle',[
        el('label',{class:'bf-row'}, el('span',{text:'Construction'}), hcSel),
        el('label',{class:'bf-row'}, el('span',{text:'Material (contains)'}), matInput),
      ]),
      makeFieldset('Systems',[
        el('label',{class:'bf-row'}, el('span',{text:'Stop System'}), stopSel),
        el('label',{class:'bf-row'}, el('span',{text:'Pivot System'}), pivotSel),
      ]),
      el('div',{class:'bf-actions'}, el('button',{type:'reset',text:'Reset'}))
    );

    filters.addEventListener('input', apply);
    filters.addEventListener('change', apply);
    filters.addEventListener('reset', ()=> setTimeout(apply,0));

    const count = el('p',{class:'bf-count',id:'bf-count'});
    const results = el('div',{class:'bf-grid',id:'bf-results'});

    root.append(filters, count, results);
    return {filters, count, results};
  }

  async function init(container){
    const indexURL = container.getAttribute('data-index') || '/balisongs.json';
    let DATA = [];
    try{
      const r = await fetch(indexURL, {cache:'no-store'});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      DATA = (await r.json()).map(normalizeItem);
    }catch(e){
      container.append(el('p',{class:'bf-muted',text:`Could not load ${indexURL}.`}));
      console.error(e);
      return;
    }

    const state = {};
    const {filters, count, results} = buildUI(container, apply);

    function read(){
      const fd = new FormData(filters);
      state.status = norm(fd.get('status'));
      state.ring = fd.get('ring'); // '', 'yes', 'no'
      state.retailMin = toNum(fd.get('retail_min'));
      state.retailMax = toNum(fd.get('retail_max'));
      state.weightMin = toNum(fd.get('weight_min'));
      state.weightMax = toNum(fd.get('weight_max'));
      state.lenMin = toNum(fd.get('len_min'));
      state.lenMax = toNum(fd.get('len_max'));
      state.hc = fd.get('handle_construction') || '';
      state.handleMatContains = norm(fd.get('handle_mat_contains'));
      state.stop = fd.get('stop_system') || '';
      state.pivot = fd.get('pivot_system') || '';
    }

    function matches(item){
      if (state.status && norm(item.availability)!==state.status) return false;
      if (state.ring){
        if (item.has_ring==null) return false;
        if (state.ring==='yes' && item.has_ring!==true) return false;
        if (state.ring==='no'  && item.has_ring!==false) return false;
      }
      if (!matchesHC(item.handle_construction, state.hc)) return false;
      if (state.handleMatContains){
        const mats = norm(item.handle_materials);
        if (!mats || !mats.includes(state.handleMatContains)) return false;
      }
      if (state.stop && !norm(item.stop_system).includes(state.stop)) return false;
      if (state.pivot && !norm(item.pivot_system).includes(state.pivot)) return false;

      const rlo = (item.retail_low==null?null:Number(item.retail_low));
      const rhi = (item.retail_high==null?null:Number(item.retail_high));
      if (!rangeOK(rlo,rhi,state.retailMin,state.retailMax)) return false;

      const w = (item.weight_oz==null?null:Number(item.weight_oz));
      if (!rangeOK(w,w,state.weightMin,state.weightMax)) return false;

      const L = (item.overall_length_in==null?null:Number(item.overall_length_in));
      if (!rangeOK(L,L,state.lenMin,state.lenMax)) return false;

      return true;
    }

    function apply(){
      read();
      const list = DATA.filter(matches);
      count.textContent = `${list.length} result${list.length===1?'':'s'}`;
      results.replaceChildren(...list.map(card));
    }

    apply();
  }

  const root = document.getElementById('bali-finder');
  if (root) init(root);
})();
