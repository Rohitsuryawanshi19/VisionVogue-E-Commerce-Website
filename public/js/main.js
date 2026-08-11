// ===================== VisionVogue Client Interactions =====================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- GSAP Reveal on Scroll ---------- */
  if (window.gsap) {
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: window.ScrollTrigger ? {
          trigger: el, start: 'top 88%'
        } : undefined,
        delay: (i % 4) * 0.05
      });
    });
  } else {
    // Fallback IntersectionObserver reveal if GSAP/ScrollTrigger unavailable
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- Add to Cart (AJAX) ---------- */
  document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const btn = form.querySelector('.btn-add-cart');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = 'Adding...'; btn.disabled = true; }

      try {
        const res = await fetch('/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          document.querySelectorAll('.cart-count-badge').forEach(b => {
            b.textContent = data.cartCount;
            b.classList.remove('animate-pop'); void b.offsetWidth; b.classList.add('animate-pop');
          });
          if (btn) { btn.innerHTML = 'Added to Bag ✓'; }
          setTimeout(() => {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
            if (form.dataset.gotoCart !== 'false') {
              window.location.href = '/cart';
            }
          }, 600);
        }
      } catch (err) {
        console.error(err);
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      }
    });
  });

  /* ---------- Live Search Autocomplete ---------- */
  const searchInput = document.getElementById('navSearchInput');
  const searchSuggest = document.getElementById('searchSuggest');
  let searchTimer;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const q = searchInput.value.trim();
    if (!q) { searchSuggest.classList.remove('active'); return; }
    searchTimer = setTimeout(async () => {
      const res = await fetch('/search?q=' + encodeURIComponent(q));
      const items = await res.json();
      searchSuggest.innerHTML = items.length
        ? items.map(p => `<a href="/products/${p.id}" class="search-suggest-item">
            <img src="${p.image}" alt="">
            <div><div style="font-weight:600;font-size:13.5px;">${p.name}</div>
            <div style="font-size:12px;color:#999;">₹${p.price.toLocaleString('en-IN')}</div></div>
          </a>`).join('')
        : `<div style="padding:16px;font-size:13px;color:#999;">No products found</div>`;
      searchSuggest.classList.add('active');
    }, 250);
  });
  document.addEventListener('click', (e) => {
    if (searchSuggest && !searchSuggest.contains(e.target) && e.target !== searchInput) {
      searchSuggest.classList.remove('active');
    }
  });

  /* ---------- PDP: Thumbnail Gallery Swap ---------- */
  const mainImg = document.getElementById('pdpMainImage');
  document.querySelectorAll('.pdp-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg) {
        mainImg.style.opacity = 0;
        setTimeout(() => { mainImg.src = thumb.dataset.img; mainImg.style.opacity = 1; }, 180);
      }
    });
  });

  /* ---------- PDP: Type / Color / Size Pills ---------- */
  function bindPillGroup(selector) {
    document.querySelectorAll(selector).forEach(group => {
      group.querySelectorAll('[data-pill]').forEach(pill => {
        pill.addEventListener('click', () => {
          group.querySelectorAll('[data-pill]').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
      });
    });
  }
  bindPillGroup('.type-pills');
  bindPillGroup('.color-dots');
  bindPillGroup('.size-pills');

  /* ---------- PDP: Lens Upgrade Selection ---------- */
  const lensOptions = document.querySelectorAll('.lens-option');
  const lensInput = document.getElementById('selectedLensName');
  const lensPriceInput = document.getElementById('selectedLensPrice');
  const priceDisplay = document.getElementById('pdpLivePrice');
  const basePrice = priceDisplay ? Number(priceDisplay.dataset.base) : 0;

  function updatePrice() {
    const qty = Number(document.getElementById('qtyDisplay')?.textContent || 1);
    const lensPrice = Number(lensPriceInput?.value || 0);
    const total = (basePrice + lensPrice) * qty;
    if (priceDisplay) priceDisplay.textContent = '₹' + total.toLocaleString('en-IN');
  }

  lensOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      lensOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (lensInput) lensInput.value = opt.dataset.name;
      if (lensPriceInput) lensPriceInput.value = opt.dataset.price;
      updatePrice();
    });
  });

  /* ---------- PDP: Quantity Counter ---------- */
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyDisplay = document.getElementById('qtyDisplay');
  const qtyHidden = document.getElementById('qtyHidden');
  qtyPlus?.addEventListener('click', () => {
    qtyDisplay.textContent = Number(qtyDisplay.textContent) + 1;
    if (qtyHidden) qtyHidden.value = qtyDisplay.textContent;
    updatePrice();
  });
  qtyMinus?.addEventListener('click', () => {
    const val = Math.max(1, Number(qtyDisplay.textContent) - 1);
    qtyDisplay.textContent = val;
    if (qtyHidden) qtyHidden.value = val;
    updatePrice();
  });

  /* ---------- PDP: Prescription Accordion ---------- */
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      body.classList.toggle('open');
      const icon = head.querySelector('i');
      if (icon) icon.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
    });
  });

  /* ---------- PDP: Pincode Checker ---------- */
  const pincodeForm = document.getElementById('pincodeForm');
  pincodeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('pincodeInput');
    const result = document.getElementById('pincodeResult');
    const val = input.value.trim();
    if (/^\d{6}$/.test(val)) {
      result.textContent = '✓ Express Delivery Available by Tomorrow to ' + val;
      result.className = 'pincode-result show success';
    } else {
      result.textContent = 'Please enter a valid 6-digit pincode';
      result.className = 'pincode-result show';
      result.style.background = '#fdeaea'; result.style.color = '#b23b3b';
    }
  });

  /* ---------- PDP: Tabs ---------- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.pdp-tabs');
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tabGroup.querySelector('#' + btn.dataset.tab).classList.add('active');
    });
  });

  /* ---------- Filter Pills (catalog page) ---------- */
  document.querySelectorAll('.filter-pill[data-tier]').forEach(pill => {
    pill.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('tier', pill.dataset.tier);
      window.location.href = url.toString();
    });
  });

});
