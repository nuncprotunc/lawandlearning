async function llInjectPartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return;
    target.innerHTML = await res.text();
  } catch {
    return;
  }
}

function llSetActiveNavLinks(root) {
  const path = window.location.pathname.replace(/\/$/, '');
  const links = root.querySelectorAll('a[href]');

  links.forEach((a) => {
    try {
      const url = new URL(a.getAttribute('href'), window.location.origin);
      const linkPath = url.pathname.replace(/\/$/, '');
      if (linkPath === path) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('ll-active');
      }
    } catch {
      // ignore
    }
  });
}

function llWireMobileMenu(root) {
  const button = root.querySelector('.ll-mobile-menu-button');
  const menu = root.querySelector('.ll-mobile-menu');
  const overlay = root.querySelector('.ll-mobile-menu-overlay');

  if (!button || !menu || !overlay) return;

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('ll-active');
    menu.classList.remove('ll-active');
    overlay.hidden = true;
    menu.hidden = true;
  };

  const open = () => {
    button.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;
    menu.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('ll-active');
      menu.classList.add('ll-active');
    });
  };

  const toggle = () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (expanded) close();
    else open();
  };

  button.addEventListener('click', toggle);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  menu.querySelectorAll('a[href]').forEach((a) => {
    a.addEventListener('click', close);
  });

  // Ensure closed state initially
  close();
}

function llSetFooterSource() {
  const footerHost = document.getElementById('ll-footer');
  if (!footerHost) return;

  const source = footerHost.dataset.source || document.body.dataset.source || window.location.pathname.replace(/^\//, '') || 'index';
  const sourceInput = footerHost.querySelector('input[name="source"]');
  if (sourceInput) sourceInput.value = source;
}

async function llInitChrome() {
  await llInjectPartial('ll-header', '/partials/header.html');
  await llInjectPartial('ll-footer', '/partials/footer.html');

  const headerHost = document.getElementById('ll-header');
  if (headerHost) {
    llSetActiveNavLinks(headerHost);
    llWireMobileMenu(headerHost);
  }

  llSetFooterSource();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', llInitChrome);
} else {
  llInitChrome();
}
