(() => {
  const html = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-menu");

  const closeMenu = () => {
    if (!toggle || !menu) return;
    menu.classList.remove("open");
    html.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      html.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a:not([data-pending-link])").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    });
  }

  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (!item) return;
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      const plus = btn.querySelector(".faq-plus");
      if (plus) plus.textContent = open ? "−" : "+";
    });
  });

  document.querySelectorAll("[data-pending-link]").forEach(link => {
    link.addEventListener("click", event => event.preventDefault());
  });

  document.querySelectorAll("[data-countdown]").forEach(el => {
    const target = new Date(el.dataset.countdown).getTime();
    const update = () => {
      if (!Number.isFinite(target)) return;
      const diff = target - Date.now();
      if (diff <= 0) {
        el.classList.add("expired");
        el.textContent = "The next gathering date will be announced soon.";
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor(diff / 3600000) % 24;
      const m = Math.floor(diff / 60000) % 60;
      const sec = Math.floor(diff / 1000) % 60;
      const vals = [d, h, m, sec];
      el.querySelectorAll("[data-unit]").forEach((node, i) => {
        node.textContent = String(vals[i]).padStart(2, "0");
      });
    };
    update();
    const timer = setInterval(update, 1000);
    window.addEventListener("beforeunload", () => clearInterval(timer), { once: true });
  });

  const newsletter = document.querySelector(".newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", event => {
      event.preventDefault();
      const input = newsletter.querySelector("input[type=\"email\"]");
      if (!input || !input.checkValidity()) {
        input?.reportValidity();
        return;
      }
      let status = newsletter.parentElement.querySelector(".form-status");
      if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        newsletter.after(status);
      }
      status.textContent = "Your email is captured locally for now. Connect a newsletter provider before launch.";
      input.value = "";
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const status = document.querySelector("#contact-form-status");
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      if (status) status.textContent = "Form validated. Connect the form endpoint to deliver this message.";
    });
  }
})();

// No Walls Live video modal
(() => {
  const modal = document.querySelector('#no-walls-video');
  if (!modal) return;
  const video = modal.querySelector('video');
  const openers = document.querySelectorAll('[data-video-open]');
  const closers = modal.querySelectorAll('[data-video-close]');
  let lastFocused = null;

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (video) video.pause();
    if (lastFocused) lastFocused.focus();
  };

  const open = event => {
    event.preventDefault();
    lastFocused = event.currentTarget;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  openers.forEach(link => link.addEventListener('click', open));
  closers.forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();
