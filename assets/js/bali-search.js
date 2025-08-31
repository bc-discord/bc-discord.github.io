(function () {
  const form = document.getElementById('filters');
  if (!form) return;

  const els = {
    status: document.getElementById('status'),
    min_price: document.getElementById('minPrice'),
    max_price: document.getElementById('maxPrice'),
    min_weight: document.getElementById('minWeight'),
    max_weight: document.getElementById('maxWeight'),
    stop_system: document.getElementById('stopSystem'),
    material: document.getElementById('handleMaterial'),
    handle_construction: document.getElementById('handleConstruction'),

    search: document.getElementById('searchBtn'),
    reset: document.getElementById('resetBtn'),

    results: document.getElementById('results'),
    count: document.getElementById('count'),

    maker_group: document.getElementById('maker-tpl'),
    maker_balisongs: document.getElementById('item-tpl')
  };

  const dataUrl = form.getAttribute('data-json');
  let DATA = null;

  async function loadDataOnce() {
    if (DATA) return;
    const res = await fetch(dataUrl, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Failed to load data');
    const raw = await res.json();
    DATA = raw.map((d) => {
      const retailNum = Number(d.retail);
      const weightNum = Number(d.weight);

      const lowercase_mats = Object.fromEntries(
        Object.entries(d.handle_materials).map(([key, value]) => [key, String(value).toLowerCase()])
      );

      return {
        name: d.name || '',
        maker: d.maker || '',
        url: d.url || '',
        status: String(d.status || '').trim(),
        _status: String(d.status || '').trim().toLowerCase(),
        retail: retailNum,
        _retail: Number.isFinite(retailNum) ? retailNum : 0,
        weight: weightNum,
        _weight: Number.isFinite(weightNum) ? weightNum : 0,
        stop_system: String(d.stop_system || '').trim(),
        _stop_system: String(d.stop_system || '').trim().toLowerCase(),
        _materials: d.handle_materials,
        _materials_joined: lowercase_mats,
        handle_construction: d.handle_construction.trim().toLowerCase()
      };
    });
  }

  function formatMaterials(dict) {
    return Object.entries(dict || {})
      .filter(([, v]) => v != null && v !== '' && v !== 'N/A')
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }

  function groupByMaker(list) {
    const groups = new Map();
    for (const it of list) {
      const maker = (it.maker || 'Unknown maker').trim();
      if (!groups.has(maker)) groups.set(maker, []);
      groups.get(maker).push(it);
    }
    return new Map([...groups.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { sensitivity: 'base' })
    ));
  }

  function render(list) {
    els.results.innerHTML = '';
    if (!list || !list.length) {
      els.count.textContent = '';
      return;
    }

    const frag = document.createDocumentFragment();
    const groups = groupByMaker(list);

    for (const [maker, items] of groups) {
      // maker block
      const makerNode = els.maker_group.content.cloneNode(true);
      makerNode.querySelector('.maker-name').textContent = maker;
      const ul = makerNode.querySelector('.maker-list');

      for (const it of items) {
        const liNode = els.maker_balisongs.content.cloneNode(true);

        const a = liNode.querySelector('.item-link');
        const status_label = liNode.querySelector('.status');
        const status_divider = liNode.getElementById('status-divider');
        const item_info = liNode.querySelector('.item-info');

        if (it.status != "") {
          status_label.classList.add(it._status)
          status_label.textContent = it.status
        }
        else {
          status_divider.remove();
          status_label.remove();
        }

        const into_info_parts = [
          Number.isFinite(it.retail) && it.retail != 0 ? `$${it.retail}` : '',
          Number.isFinite(it.weight) && it.weight != 0 ? `${it.weight} oz` : '',
        ].filter(Boolean);

        item_info.textContent = (into_info_parts.length > 0 ? '• ' : '') + into_info_parts.join(' • ')

        a.href = it.url || '#';
        a.textContent = it.name || '(Unnamed)';

        ul.appendChild(liNode);
      }

      frag.appendChild(makerNode);
    }

    els.results.appendChild(frag);
    els.count.textContent = `${list.length} result${list.length === 1 ? '' : 's'}`;
  }

  function number_range_check(key) {
    const minStr = els['min_' + key].value.trim();
    const maxStr = els['max_' + key].value.trim();
    const hasMin = minStr !== '' && !Number.isNaN(Number(minStr));
    const hasMax = maxStr !== '' && !Number.isNaN(Number(maxStr));
    const min = hasMin ? Number(minStr) : null;
    const max = hasMax ? Number(maxStr) : null;

    return [hasMin, hasMax, min, max]
  }

  function checkSubstrings(target, substrings) {
    const lists = substrings
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return lists.every(sub => target.includes(sub));
  }

  function search() {
    if (!DATA) return;
    const status = String(els.status.value || '').toLowerCase();
    const stop_system = String(els.stop_system.value || '').toLowerCase();

    let [hasMinPrice, hasMaxPrice, min_price, max_price] = number_range_check('price')
    let [hasMinWeight, hasMaxWeight, min_weight, max_weight] = number_range_check('weight')
    
    const material = String(els.material.value || '').toLowerCase();

    const out = DATA.filter((it) => {
      if (status && it._status !== status) return false;

      if (hasMinPrice && it._retail < min_price) return false;
      if (hasMaxPrice && it._retail > max_price) return false;

      if (hasMinWeight && it._weight < min_weight) return false;
      if (hasMaxWeight && it._weight > max_weight) return false;

      if (!checkSubstrings(it.handle_construction, els.handle_construction.value)) return false;

      if (stop_system && !it._stop_system.includes(stop_system)) return false;

      if (material && !Object.values(it._materials_joined).some(val => String(val).includes(material))) return false;

      return true;
    });

    render(out);
  }

  function reset() {
    els.status.value = '';

    els.min_price.value = '';
    els.max_price.value = '';

    els.min_weight.value = '';
    els.max_weight.value = '';

    els.stop_system.value = '';
    els.handle_construction.value = '';

    els.material.value = '';

    els.results.innerHTML = '';
    els.count.textContent = '';
  }

  els.search.addEventListener('click', async () => {
    try {
      await loadDataOnce();
      search();
    } catch (e) {
      console.error(e);
      els.count.textContent = 'Error loading data.';
    }
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    try {
      await loadDataOnce();
      search();
    } catch (e) {
      console.error(e);
      els.count.textContent = 'Error loading data.';
    }
  });

  els.reset.addEventListener('click', reset);
})();
