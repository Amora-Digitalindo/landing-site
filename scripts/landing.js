// Landing-page-only interactive behavior (amora-landing-v2.html).
// Navbar-scroll, hamburger toggle, and logo-anim already live in global.js.
// A disabled Canvas2D cube demo (dead code behind an early `return`, never
// executed in the original page) was dropped — it had zero runtime effect.

    // Scroll reveal — with staggered entrance and per-element fallback
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => {
        observer.observe(el);
        // Per-element fallback: reveal this element if the observer hasn't
        // caught it within 1.5s (handles edge cases/timing misses).
        setTimeout(() => {
          if (!el.classList.contains('visible')) {
            el.classList.add('visible');
            observer.unobserve(el);
          }
        }, 1500);
      });
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }

    // ── Feature card mockup animations ──
    // ── Feature Showcase — icon tab switcher ──
    (function () {
      const sidebarTabs = Array.from(document.querySelectorAll('#featureTabs .feature-tab'));
      const pillTabs = [];
      const views = Array.from(document.querySelectorAll('.showcase-panel .showcase-view'));
      let current = 0;

      // ── Kustomisasi: live color cycling ──
      const kustSwatchWraps = Array.from(document.querySelectorAll('#svKustSwatches .sv-kust-swatch-wrap'));
      const kustSwatches = Array.from(document.querySelectorAll('#svKustSwatches .sv-kust-swatch'));
      const kustNav = document.getElementById('svKustNav');
      const kustCta = document.getElementById('svKustCta');
      const kustGrid = document.getElementById('svKustGrid');
      const kustThumbs = [document.getElementById('svKustThumb1'), document.getElementById('svKustThumb2'), document.getElementById('svKustThumb3')];
      const kustPrices = [document.getElementById('svKustPrice1'), document.getElementById('svKustPrice2'), document.getElementById('svKustPrice3')];
      const kustBtns = [document.getElementById('svKustBtn1'), document.getElementById('svKustBtn2'), document.getElementById('svKustBtn3')];
      const kustNames = [document.getElementById('svKustName1'), document.getElementById('svKustName2'), document.getElementById('svKustName3')];
      let kustIdx = 0, kustTimer = null;

      const kustTabBtns = Array.from(document.querySelectorAll('#svKustTabs .sv-kust-tab'));
      const kustPanes = Array.from(document.querySelectorAll('.sv-kust-controls .sv-kust-pane'));
      kustTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          kustTabBtns.forEach(b => b.classList.remove('active'));
          kustPanes.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const pane = document.querySelector(`.sv-kust-controls .sv-kust-pane[data-pane="${btn.dataset.tab}"]`);
          if (pane) pane.classList.add('active');
          if (btn.dataset.tab !== 'warna') stopKustCycle();
        });
      });

      document.querySelectorAll('.sv-kust-font-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.sv-kust-font-opt').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          const fontMap = { sans: 'Inter,sans-serif', serif: 'Georgia,serif', mono: "'SF Mono',monospace" };
          const ff = fontMap[opt.dataset.font] || 'Inter,sans-serif';
          kustNames.forEach(n => { if (n) n.style.fontFamily = ff; });
          if (kustNav) kustNav.querySelector('.sv-kust-nav-logo').style.fontFamily = ff;
        });
      });

      document.querySelectorAll('.sv-kust-layout-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.sv-kust-layout-opt').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          if (!kustGrid) return;
          kustGrid.classList.remove('layout-list', 'layout-mosaic');
          if (opt.dataset.layout === 'list') kustGrid.classList.add('layout-list');
          else if (opt.dataset.layout === 'mosaic') kustGrid.classList.add('layout-mosaic');
        });
      });

      function applyKustColor(idx) {
        const swatch = kustSwatches[idx];
        if (!swatch) return;
        kustSwatches.forEach((s, i) => s.classList.toggle('active', i === idx));
        kustSwatchWraps.forEach((w, i) => w.classList.toggle('active', i === idx));
        const solid = swatch.dataset.solid || '#6B8E5A';
        const nav = swatch.dataset.nav || 'rgba(107,142,90,0.3)';
        if (kustNav) kustNav.style.background = nav;
        if (kustCta) kustCta.style.background = solid;
        kustPrices.forEach(p => { if (p) p.style.color = solid; });
        kustBtns.forEach(b => { if (b) b.style.background = solid; });
        const h = solid.replace('#', '');
        const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        const opacities = [0.2, 0.13, 0.08];
        kustThumbs.forEach((t, i) => { if (t) t.style.background = `rgba(${r},${g},${b},${opacities[i]})`; });
      }

      function startKustCycle() {
        if (kustTimer) return;
        kustTimer = setInterval(() => {
          const activeTab = document.querySelector('#svKustTabs .sv-kust-tab.active');
          if (activeTab && activeTab.dataset.tab !== 'warna') return;
          kustIdx = (kustIdx + 1) % kustSwatches.length;
          applyKustColor(kustIdx);
        }, 2200);
      }
      function stopKustCycle() { clearInterval(kustTimer); kustTimer = null; }

      // ── Main tab switcher — directional slide animation ──
      const dots = Array.from(document.querySelectorAll('#showcaseDots .showcase-dot'));
      let isAnimating = false;

      function updateDots(idx) {
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }

      function goTo(idx) {
        if (idx === current || isAnimating) return;
        const dir = idx > current ? 1 : -1;
        const prevIdx = current;
        current = idx;
        isAnimating = true;

        // Update tab buttons and dots immediately
        sidebarTabs[prevIdx]?.classList.remove('active');
        pillTabs[prevIdx]?.classList.remove('active');
        sidebarTabs[current]?.classList.add('active');
        pillTabs[current]?.classList.add('active');
        updateDots(current);

        const outView = views[prevIdx];
        const inView = views[current];

        // Animate out current view
        outView.style.transition = 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.4,0,0.6,1)';
        outView.style.opacity = '0';
        outView.style.transform = `translateX(${dir > 0 ? -28 : 28}px)`;

        // Prepare incoming view off-screen
        inView.style.transition = 'none';
        inView.style.display = 'flex';
        inView.style.flexDirection = 'column';
        inView.style.opacity = '0';
        inView.style.transform = `translateX(${dir > 0 ? 28 : -28}px)`;

        // Trigger slide-in on next paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inView.style.transition = 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1)';
            inView.style.opacity = '1';
            inView.style.transform = 'translateX(0)';
          });
        });

        // Cleanup after animation completes
        setTimeout(() => {
          outView.classList.remove('active');
          outView.style.cssText = '';
          inView.classList.add('active');
          inView.style.cssText = '';
          isAnimating = false;
          if (current === 3) startKustCycle();
          else stopKustCycle();
        }, 360);
      }

      [...sidebarTabs, ...pillTabs].forEach(tab => {
        tab.addEventListener('click', () => goTo(parseInt(tab.dataset.idx)));
      });

      // Custom scrollbar for feature tabs (mobile)
      (function () {
        const row = document.getElementById('featureTabs');
        const track = document.getElementById('tabsScrollbar');
        const thumb = document.getElementById('tabsScrollbarThumb');
        if (!row || !track || !thumb) return;
        function updateThumb() {
          const ratio = row.scrollWidth > row.clientWidth
            ? row.clientWidth / row.scrollWidth : 1;
          const thumbW = Math.max(ratio * 100, 20);
          const maxScroll = row.scrollWidth - row.clientWidth;
          const scrollFrac = maxScroll > 0 ? row.scrollLeft / maxScroll : 0;
          const maxLeft = 100 - thumbW;
          thumb.style.width = thumbW + '%';
          thumb.style.left = (scrollFrac * maxLeft) + '%';
        }
        row.addEventListener('scroll', updateThumb, { passive: true });
        window.addEventListener('resize', updateThumb);
        updateThumb();
      })();

      // Dots click
      dots.forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx)));
      });

      // Touch swipe support
      (function () {
        const panel = document.querySelector('.showcase-panel');
        if (!panel) return;
        let tx = 0, ty = 0;
        panel.addEventListener('touchstart', e => {
          tx = e.touches[0].clientX;
          ty = e.touches[0].clientY;
        }, { passive: true });
        panel.addEventListener('touchend', e => {
          const dx = e.changedTouches[0].clientX - tx;
          const dy = e.changedTouches[0].clientY - ty;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
            if (dx < 0 && current < views.length - 1) goTo(current + 1);
            else if (dx > 0 && current > 0) goTo(current - 1);
          }
        }, { passive: true });
      })();

      // Init kust swatches click
      kustSwatches.forEach((s, i) => {
        s.addEventListener('click', () => { kustIdx = i; applyKustColor(i); stopKustCycle(); });
      });
    })();

    // ── Kustomisasi interactive ──────────────────────────────────
    (function () {
      var accentColor = '#9BE8C9';
      var accentRgba = '100,210,180';

      function applyColor(hex, rgba) {
        accentColor = hex; accentRgba = rgba;
        var nav = document.getElementById('kustNavBar');
        if (nav) {
          nav.style.background = 'rgba(' + rgba + ',0.08)';
          nav.style.borderColor = 'rgba(' + rgba + ',0.14)';
        }
        var cta = document.getElementById('kustCta');
        if (cta) {
          cta.style.background = 'rgba(' + rgba + ',0.14)';
          cta.style.borderColor = 'rgba(' + rgba + ',0.28)';
          cta.style.color = hex;
        }
        document.querySelectorAll('.kust-product-card').forEach(function (c) {
          c.style.borderColor = 'rgba(' + rgba + ',0.14)';
        });
        document.querySelectorAll('.kust-price').forEach(function (p) {
          p.style.color = hex;
        });
        document.querySelectorAll('.kust-color-dot').forEach(function (d) {
          d.style.boxShadow = (d.dataset.color === hex)
            ? '0 0 0 2px rgba(255,255,255,0.5),0 0 8px ' + hex + '88'
            : '';
        });
      }

      document.addEventListener('DOMContentLoaded', function () {
        applyColor('#9BE8C9', '100,210,180');

        document.querySelectorAll('.kust-color-dot').forEach(function (dot) {
          dot.addEventListener('click', function () {
            applyColor(this.dataset.color, this.dataset.rgba);
          });
        });

        document.querySelectorAll('.kust-font-opt').forEach(function (opt) {
          opt.addEventListener('click', function () {
            document.querySelectorAll('.kust-font-opt').forEach(function (o) {
              o.style.background = '';
              o.style.border = '';
              o.style.color = 'rgba(255,255,255,0.4)';
              o.style.fontWeight = '';
              o.innerHTML = o.innerHTML.replace(' <span style="opacity:0.6;">Aktif</span>', '');
            });
            this.style.background = 'rgba(' + accentRgba + ',0.1)';
            this.style.border = '1px solid rgba(' + accentRgba + ',0.2)';
            this.style.color = accentColor;
            this.style.fontWeight = '700';
            if (!this.innerHTML.includes('Aktif')) this.innerHTML += ' <span style="opacity:0.6;">Aktif</span>';
          });
        });

        document.querySelectorAll('.kust-layout-opt').forEach(function (opt) {
          opt.addEventListener('click', function () {
            document.querySelectorAll('.kust-layout-opt').forEach(function (o) {
              o.style.background = 'rgba(255,255,255,0.03)';
              o.style.border = '';
            });
            this.style.background = 'rgba(' + accentRgba + ',0.1)';
            this.style.border = '1px solid rgba(' + accentRgba + ',0.2)';
            var cols = parseInt(this.dataset.cols);
            var grid = document.getElementById('kustProductGrid');
            if (grid) grid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
          });
        });
      });

      // Also wire up immediately (in case DOMContentLoaded already fired)
      if (document.readyState !== 'loading') {
        applyColor('#9BE8C9', '100,210,180');
        document.querySelectorAll('.kust-color-dot').forEach(function (dot) {
          dot.addEventListener('click', function () {
            applyColor(this.dataset.color, this.dataset.rgba);
          });
        });
        document.querySelectorAll('.kust-font-opt').forEach(function (opt) {
          opt.addEventListener('click', function () {
            document.querySelectorAll('.kust-font-opt').forEach(function (o) {
              o.style.background = '';
              o.style.border = '';
              o.style.color = 'rgba(255,255,255,0.4)';
              o.style.fontWeight = '';
              o.innerHTML = o.innerHTML.replace(' <span style="opacity:0.6;">Aktif</span>', '');
            });
            this.style.background = 'rgba(' + accentRgba + ',0.1)';
            this.style.border = '1px solid rgba(' + accentRgba + ',0.2)';
            this.style.color = accentColor;
            this.style.fontWeight = '700';
            if (!this.innerHTML.includes('Aktif')) this.innerHTML += ' <span style="opacity:0.6;">Aktif</span>';
          });
        });
        document.querySelectorAll('.kust-layout-opt').forEach(function (opt) {
          opt.addEventListener('click', function () {
            document.querySelectorAll('.kust-layout-opt').forEach(function (o) {
              o.style.background = 'rgba(255,255,255,0.03)';
              o.style.border = '';
            });
            this.style.background = 'rgba(' + accentRgba + ',0.1)';
            this.style.border = '1px solid rgba(' + accentRgba + ',0.2)';
            var cols = parseInt(this.dataset.cols);
            var grid = document.getElementById('kustProductGrid');
            if (grid) grid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
          });
        });
      }
    })();

    // ── Responsive showcase grids ────────────────────────────────
    (function () {
      function adjustShowcaseGrids() {
        var isMobile = window.innerWidth < 600;
        var v0grid = document.getElementById('kustProductGrid') ? null : document.querySelector('.showcase-view[data-view="0"] [style*="grid-template-columns"]');
        if (v0grid) v0grid.style.gridTemplateColumns = isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)';
        var v1split = document.querySelector('.sv1-split');
        if (v1split) v1split.style.gridTemplateColumns = isMobile ? '1fr' : '1fr 1fr';
        var v2split = document.querySelector('.sv2-split');
        if (v2split) v2split.style.gridTemplateColumns = isMobile ? '1fr' : '1fr 1fr';
        var v3split = document.querySelector('.sv3-wrap');
        if (v3split) v3split.style.gridTemplateColumns = isMobile ? '1fr' : '1fr 190px';
      }
      window.addEventListener('resize', adjustShowcaseGrids);
      adjustShowcaseGrids();
    })();

    // ── Widget interactivity ──
    (function () {
      // Dashboard: click bars to highlight
      document.querySelectorAll('.sv-bar').forEach(bar => {
        bar.addEventListener('click', () => {
          document.querySelectorAll('.sv-bar').forEach(b => b.classList.remove('bar-selected'));
          bar.classList.add('bar-selected');
        });
      });
      // Dashboard sidebar: click to change active
      document.querySelectorAll('.sv-sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
          item.closest('.sv-sidebar').querySelectorAll('.sv-sidebar-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        });
      });
      // Website Toko: click product to toggle cart
      document.querySelectorAll('.sv-product').forEach(prod => {
        prod.addEventListener('click', () => prod.classList.toggle('in-cart'));
      });
      // Promo: click toggle to switch on/off
      document.querySelectorAll('.sv-promo-toggle').forEach(toggle => {
        toggle.style.cursor = 'pointer';
        toggle.addEventListener('click', () => {
          if (toggle.classList.contains('on')) {
            toggle.classList.replace('on', 'off');
          } else {
            toggle.classList.replace('off', 'on');
          }
        });
      });
      // Promo: "+ Promo Baru" flash
      document.querySelectorAll('.sv-promo-add, .sv-promo-create').forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
          btn.style.background = 'rgba(107,142,90,0.35)';
          setTimeout(() => btn.style.background = '', 400);
        });
      });
    })();

    // ── FAQ ──
    const faqs = [
      {
        q: 'Apa itu Amora dan apa bedanya dengan Tokopedia atau Shopee?',
        a: 'Amora adalah platform web builder berbasis langganan (SaaS) untuk membuat dan mengelola toko online sendiri — tanpa coding, tanpa developer. Berbeda dengan marketplace seperti Tokopedia atau Shopee, di Amora Anda memiliki toko sendiri dengan domain sendiri, dan data pelanggan sepenuhnya milik Anda.'
      },
      {
        q: 'Seberapa cepat toko saya bisa online?',
        a: 'Sangat cepat. Setup awal rata-rata selesai dalam 5 menit — toko Anda bisa langsung online tanpa proses teknis yang rumit.'
      },
      {
        q: 'Apa saja paket yang tersedia dan berapa harganya?',
        a: 'Tersedia dua paket: Starter (Rp 149.000/bulan) untuk hingga 100 produk dan 300 pesanan/bulan; serta Pro (Rp 209.000/bulan, diskon 40%) untuk hingga 250 produk, 1.000 pesanan/bulan, plus fitur Penjadwalan Peluncuran Toko.'
      },
      {
        q: 'Apakah ada biaya per transaksi?',
        a: 'Tidak ada selama pesanan masih dalam kuota bulanan. Jika kuota terlampaui, biaya tambahan sebesar 2% per pesanan (Starter) atau 1% per pesanan (Pro) akan ditagihkan di periode berikutnya.'
      },
      {
        q: 'Metode pembayaran apa yang didukung di toko saya?',
        a: 'Toko Amora mendukung Xendit, Midtrans, dan Doku — mencakup transfer bank, QRIS, e-wallet, serta kartu kredit/debit. Anda perlu mendaftar dan mengonfigurasi payment gateway secara mandiri.'
      },
      {
        q: 'Apakah saya bisa menggunakan domain sendiri?',
        a: 'Ya. Kedua paket (Starter dan Pro) mendukung integrasi domain kustom, sehingga toko Anda dapat diakses melalui alamat brand Anda sendiri, misalnya tokosaya.com.'
      },
      {
        q: 'Siapa yang memiliki data toko dan data pelanggan saya?',
        a: 'Anda sepenuhnya. Data toko, produk, dan pelanggan adalah milik Anda sebagai merchant. Amora tidak menjual atau memanfaatkan data Anda untuk kepentingan pihak lain.'
      },
      {
        q: 'Bagaimana cara menghubungi tim support Amora?',
        a: 'Tim support siap membantu melalui email support@amora.id atau WhatsApp/Telepon 0878 3201 1500, Senin–Jumat pukul 09.00–17.00 WIB.'
      },
    ];

    const faqList = document.getElementById('faqList');
    function initFaqs() {
      faqList.innerHTML = faqs.map((f, i) => `
      <div class="faq-item${i === 0 ? ' active' : ''}">
        <button class="faq-question" data-index="${i}">
          <span>${f.q}</span>
          <svg class="faq-chevron${i === 0 ? ' open' : ''}" data-icon viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer${i === 0 ? ' open' : ''}">
          <div class="faq-answer-body"><p>${f.a.replace(/<\/?p>/g, '')}</p></div>
        </div>
      </div>
    `).join('');
      faqList.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          const items = faqList.querySelectorAll('.faq-item');
          const clicked = items[idx];
          const wasOpen = clicked.classList.contains('active');
          items.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('open');
            item.querySelector('.faq-chevron').classList.remove('open');
          });
          if (!wasOpen) {
            clicked.classList.add('active');
            clicked.querySelector('.faq-answer').classList.add('open');
            clicked.querySelector('.faq-chevron').classList.add('open');
          }
        });
      });
    }
    // ── Count-up / countdown stats ──
    (function () {
      function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

      function animateCount(el, target, suffix, separator, duration) {
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.round(easeOutQuart(progress) * target);
          let display = value.toString();
          if (separator) display = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          el.textContent = display + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      function animateCountDown(el, from, to, suffix, duration) {
        const startTime = performance.now();
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.round(from - easeOutQuart(progress) * (from - to));
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      const statsSection = document.querySelector('.hero-stats');
      if (!statsSection) return;

      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);

          const statValues = document.querySelectorAll('.hero-stat-value');
          // statValues[0] = "5 menit", statValues[1] = "0%", statValues[2] = "100%"
          if (statValues[0]) animateCountDown(statValues[0], 120, 5, ' menit', 2000);
          // stat[1] and stat[2] — no animation needed, HTML values stay as-is
        });
      }, { threshold: 0.5 });

      statObserver.observe(statsSection);
    })();

    initFaqs();

    // ── Live Orders feed (Section: Pesanan Masuk) ──
    (function () {
      var list = document.getElementById('ordersList');
      if (!list) return;

      var ITEMS = [
        { item: 'Sneakers Classic White', price: 'Rp 249.000' },
        { item: 'Kaos Polos Premium', price: 'Rp 89.000' },
        { item: 'Tas Selempang Kanvas', price: 'Rp 175.000' },
        { item: 'Kopi Arabika 250g', price: 'Rp 65.000' },
        { item: 'Jaket Hoodie Oversize', price: 'Rp 219.000' },
        { item: 'Sandal Slip-On', price: 'Rp 129.000' },
        { item: 'Botol Minum Stainless', price: 'Rp 95.000' },
        { item: 'Dompet Kulit Asli', price: 'Rp 159.000' }
      ];

      var BAG_ICON = '<svg data-icon viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

      function randomOrderId() {
        return '#AMR-' + Math.floor(1000 + Math.random() * 9000);
      }

      function buildCard(data, animate) {
        var card = document.createElement('div');
        card.className = 'order-card' + (animate ? ' entering' : '');
        card.innerHTML = [
          '<div class="order-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;color:var(--accent-light)"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>',
          '<div class="order-card-info">',
          '<div class="order-card-top">',
          '<span class="order-card-label">Pesanan Baru</span>',
          '<span class="order-card-id">#AMR-' + (7000 + Math.floor(Math.random() * 999)) + '</span>',
          '</div>',
          '<div class="order-card-item">' + data.item + '</div>',
          '</div>',
          '<div class="order-card-price">' + data.price + '</div>'
        ].join('');
        return card;
      }

      function addOrder() {
        var data = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        var card = buildCard(data, true);
        list.insertBefore(card, list.firstChild);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card.classList.remove('entering');
            card.classList.add('just-in');
          });
        });

        var cards = list.querySelectorAll('.order-card');
        if (cards.length > 3) {
          var last = cards[cards.length - 1];
          last.classList.add('exiting');
          last.addEventListener('transitionend', function () {
            if (last.parentNode) last.parentNode.removeChild(last);
          }, { once: true });
        }
      }

      // Initial 3 cards, no entrance animation
      [ITEMS[0], ITEMS[1], ITEMS[2]].forEach(function (data) {
        list.appendChild(buildCard(data, false));
      });

      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      var widget = document.getElementById('ordersWidget');
      var started = false;
      function scheduleNext() {
        // Slightly randomized interval so new orders don't feel metronomic
        var delay = 1200 + Math.random() * 1000;
        setTimeout(function () {
          addOrder();
          scheduleNext();
        }, delay);
      }
      function start() {
        if (started) return;
        started = true;
        scheduleNext();
      }

      if ('IntersectionObserver' in window && widget) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              start();
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.2 });
        io.observe(widget);
      } else {
        start();
      }
    })();

    // ── Lacak Pesanan — looping step animation ──
    (function () {
      var tw = document.querySelector('.tracking-widget');
      if (!tw) return;
      var lineFill = tw.querySelector('.tracking-line-fill');
      var dot = tw.querySelector('.tracking-dot');
      var steps = Array.from(tw.querySelectorAll('.tracking-step'));
      if (!steps.length || !lineFill) return;

      // Heights per active step index (0-based)
      var heights = ['8%', '33%', '66%', '95%'];
      var labels = [
        { strong: 'Pesanan Dikonfirmasi', sub: 'Hari ini, 09:12' },
        { strong: 'Sedang Disiapkan', sub: 'Hari ini, 10:40' },
        { strong: 'Dikirim', sub: 'Dalam perjalanan' },
        { strong: 'Selesai', sub: 'Terkirim, 14:55' }
      ];
      var cur = 2; // start at "Dikirim"

      function goTo(idx) {
        steps.forEach(function (s, i) {
          s.classList.remove('done', 'active');
          if (i < idx) s.classList.add('done');
          else if (i === idx) s.classList.add('active');
          var node = s.querySelector('.tracking-node');
          if (node) {
            node.classList.remove('tracking-node-pulse');
            if (i === idx) node.classList.add('tracking-node-pulse');
          }
        });
        lineFill.style.height = heights[idx];
        if (dot) { dot.style.top = heights[idx]; dot.style.opacity = '1'; }
      }

      // Wait for initial reveal animation then start loop
      var started = false;
      function startLoop() {
        if (started) return;
        started = true;
        // already shown at state 2 on scroll-in, start cycling after 2.5s
        setInterval(function () {
          cur = (cur + 1) % 4;
          // brief "reset" pause when cycling from end back to 0
          if (cur === 0) {
            lineFill.style.transition = 'none';
            if (dot) dot.style.transition = 'none';
            lineFill.style.height = '0%';
            if (dot) { dot.style.top = '0%'; dot.style.opacity = '0'; }
            setTimeout(function () {
              lineFill.style.transition = 'height 1.2s cubic-bezier(0.22,1,0.36,1)';
              if (dot) dot.style.transition = 'top 1.2s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease';
              goTo(0);
            }, 200);
          } else {
            goTo(cur);
          }
        }, 2500);
      }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { startLoop(); io.disconnect(); }
        }, { threshold: 0.3 });
        io.observe(tw);
      } else {
        startLoop();
      }
    })();

// ── Hero glassmorphic parallax — pure CSS 3D, no WebGL ──

    (function () {
      const wrap = document.getElementById('heroWrap');
      const sc = document.getElementById('hscene');
      if (!wrap || !sc) return;

      const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let tx = 0, ty = 0, cx = 0, cy = 0;
      let mouseIn = false;

      const MAX_ROT_Y = 18;
      const MAX_ROT_X = 10;

      wrap.addEventListener('mousemove', e => {
        mouseIn = true;
        const r = wrap.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * MAX_ROT_Y * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * -MAX_ROT_X * 2;
      });
      wrap.addEventListener('mouseleave', () => { mouseIn = false; tx = 0; ty = 0; });

      const allCards = wrap.querySelectorAll('.gc');
      const depths = [];
      allCards.forEach(el => {
        const cs = getComputedStyle(el);
        const m = cs.transform;
        depths.push({ el, factor: el.classList.contains('gc-t1') ? 1.5 : el.classList.contains('gc-t3') ? 0.6 : 1 });
      });

      const floats = wrap.querySelectorAll('.gc-tr,.gc-bl,.gc-br');
      let t = 0;

      function tick() {
        if (!rm) {
          cx += (tx - cx) * 0.06;
          cy += (ty - cy) * 0.06;
          cx = Math.max(-MAX_ROT_Y, Math.min(MAX_ROT_Y, cx));
          cy = Math.max(-MAX_ROT_X, Math.min(MAX_ROT_X, cy));
          sc.style.transform = `rotateX(${cy}deg) rotateY(${cx}deg)`;

          t += 0.014;
          floats.forEach((el, i) => {
            const dy = Math.sin(t + i * 1.5) * 7;
            const dx = Math.cos(t * 0.6 + i * 2.2) * 4;
            el.style.setProperty('--float-x', dx + 'px');
            el.style.setProperty('--float-y', dy + 'px');
          });
        }
        requestAnimationFrame(tick);
      }

      let idleT = 0;
      function idleTick() {
        if (!mouseIn && !rm) {
          idleT += 0.005;
          tx = Math.sin(idleT * 0.5) * 5;
          ty = Math.cos(idleT * 0.35) * 3;
        }
        requestAnimationFrame(idleTick);
      }

      requestAnimationFrame(tick);
      requestAnimationFrame(idleTick);

      // ── Floating particles ──
      const pCanvas = document.createElement('canvas');
      pCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
      wrap.appendChild(pCanvas);
      const ctx = pCanvas.getContext('2d');
      const particles = [];
      const PCOUNT = 28;

      function initParticles() {
        pCanvas.width = wrap.offsetWidth * devicePixelRatio;
        pCanvas.height = wrap.offsetHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        particles.length = 0;
        const w = wrap.offsetWidth, h = wrap.offsetHeight;
        for (let i = 0; i < PCOUNT; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.4 - 0.1,
            o: Math.random() * 0.4 + 0.1,
            hue: Math.random() > 0.5 ? '143,184,122' : '80,190,170'
          });
        }
      }
      initParticles();
      window.addEventListener('resize', initParticles);

      function drawParticles() {
        const w = wrap.offsetWidth, h = wrap.offsetHeight;
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.hue},${p.o})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g.addColorStop(0, `rgba(${p.hue},${p.o * 0.4})`);
          g.addColorStop(1, `rgba(${p.hue},0)`);
          ctx.fillStyle = g;
          ctx.fill();
        });
        requestAnimationFrame(drawParticles);
      }
      if (!rm) requestAnimationFrame(drawParticles);
    })();

// ── 3D tilt for showcase panels and feature mockups ──

    (function () {
      // 3D tilt for showcase panels and feature mockups — skip on touch devices
      if (window.matchMedia('(hover: none)').matches) return;

      const tiltTargets = [];

      function init3DTilt(el, maxY, maxX) {
        const state = { tx: 0, ty: 0, cx: 0, cy: 0 };
        // Give direct parent perspective
        const wrap = el.parentElement;
        if (!wrap.style.perspective) wrap.style.perspective = '1400px';
        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          state.tx = ((e.clientX - r.left) / r.width - 0.5) * maxY * 2;
          state.ty = ((e.clientY - r.top) / r.height - 0.5) * -maxX * 2;
        });
        el.addEventListener('mouseleave', () => { state.tx = 0; state.ty = 0; });
        tiltTargets.push({ el, state });
      }

      document.querySelectorAll('.bento-widget, .feature-mockup').forEach(el => init3DTilt(el, 8, 5));

      function tiltTick() {
        tiltTargets.forEach(({ el, state: s }) => {
          s.cx += (s.tx - s.cx) * 0.07;
          s.cy += (s.ty - s.cy) * 0.07;
          if (Math.abs(s.cx) > 0.01 || Math.abs(s.cy) > 0.01 || s.tx !== 0 || s.ty !== 0) {
            el.style.transform = `rotateX(${s.cy.toFixed(2)}deg) rotateY(${s.cx.toFixed(2)}deg)`;
          }
        });
        requestAnimationFrame(tiltTick);
      }
      requestAnimationFrame(tiltTick);
    })();

