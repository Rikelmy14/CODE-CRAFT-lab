// ============================================================
// CODE CRAFT LAB — shared interactions
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- header scroll state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
    }));
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- hero pixel-logo mouse parallax ---- */
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo && !reduceMotion && matchMedia('(hover:hover)').matches) {
    const inner = heroLogo.querySelector('.hero-logo-inner');
    window.addEventListener('mousemove', (e) => {
      const rect = heroLogo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      inner.style.setProperty('--tilt-x', `${(dx * 10).toFixed(2)}deg`);
      inner.style.setProperty('--tilt-y', `${(-dy * 10).toFixed(2)}deg`);
    }, { passive: true });
  }

  /* ---- floating pixel particles in hero ---- */
  const field = document.querySelector('[data-particles]');
  if (field && !reduceMotion) {
    const count = window.innerWidth < 700 ? 8 : 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'pixel-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-20px';
      p.style.animationDelay = (Math.random() * 9) + 's';
      p.style.animationDuration = (7 + Math.random() * 6) + 's';
      field.appendChild(p);
    }
  }

  /* ---- code typing animation ---- */
  const codeEl = document.querySelector('[data-typecode]');
  if (codeEl) {
    const snippet = [
      { t: 'kw', v: 'const ' }, { t: '', v: 'site ' }, { t: '', v: '= ' },
      { t: 'fn', v: 'CodeCraftLab' }, { t: '', v: '.' }, { t: 'fn', v: 'build' }, { t: '', v: '({\n  ' },
      { t: '', v: 'cliente: ' }, { t: 'str', v: "'sua empresa'" }, { t: '', v: ',\n  ' },
      { t: '', v: 'design: ' }, { t: 'str', v: "'sob medida'" }, { t: '', v: ',\n  ' },
      { t: '', v: 'performance: ' }, { t: 'tag', v: 'true' }, { t: '', v: ',\n  ' },
      { t: '', v: 'responsivo: ' }, { t: 'tag', v: 'true' }, { t: '', v: ',\n  ' },
      { t: '', v: 'seo: ' }, { t: 'tag', v: 'true' }, { t: '', v: ',\n  ' },
      { t: '', v: 'integracoes: [' }, { t: 'str', v: "'whatsapp'" }, { t: '', v: ', ' }, { t: 'str', v: "'ia'" }, { t: '', v: ']\n});\n\n' },
      { t: 'com', v: '// pronto para converter visitantes em clientes' },
    ];

    let out = '';
    let idx = 0, sub = 0;
    const cursor = '<span class="caret"></span>';

    const classFor = (t) => t === 'kw' ? 'tok-kw' : t === 'str' ? 'tok-str' : t === 'tag' ? 'tok-tag' : t === 'com' ? 'tok-com' : t === 'fn' ? 'tok-fn' : '';

    function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function tick() {
      if (idx >= snippet.length) {
        codeEl.innerHTML = renderStatic() + cursor;
        return;
      }
      const chunk = snippet[idx];
      sub += 2;
      const done = sub >= chunk.v.length;
      const partial = chunk.v.slice(0, sub);
      let html = renderDone();
      const cls = classFor(chunk.t);
      html += cls ? `<span class="${cls}">${esc(partial)}</span>` : esc(partial);
      codeEl.innerHTML = html + cursor;
      if (done) { idx++; sub = 0; }
      const delay = reduceMotion ? 0 : 14;
      setTimeout(tick, delay);
    }
    function renderDone() {
      return snippet.slice(0, idx).map(c => {
        const cls = classFor(c.t);
        return cls ? `<span class="${cls}">${esc(c.v)}</span>` : esc(c.v);
      }).join('');
    }
    function renderStatic() { idx = snippet.length; return renderDone(); }

    if (reduceMotion) {
      codeEl.innerHTML = renderStatic() + cursor;
    } else {
      const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { tick(); codeObserver.disconnect(); }
        });
      }, { threshold: 0.3 });
      codeObserver.observe(codeEl);
    }
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---- quote mailto builder ---- */
  document.querySelectorAll('[data-quote-link]').forEach(link => {
    const subject = encodeURIComponent('Orçamento de site — Code Craft Lab');
    const body = encodeURIComponent(
`Olá, Code Craft Lab!

Gostaria de solicitar um orçamento para o meu site. Seguem minhas respostas:

Nome:
Empresa:
Segmento da empresa:
Já possui um site? (sim/não):
O que gostaria de melhorar:
Que tipo de site deseja (institucional, e-commerce, landing page, etc.):
Como imagina o site ideal:
Qual o principal objetivo do site:

Aguardo retorno, obrigado(a)!`
    );
    link.href = `mailto:silvarikelmy36@gmail.com?subject=${subject}&body=${body}`;
  });
});
