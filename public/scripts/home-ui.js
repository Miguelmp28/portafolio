const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebarMenu");
const overlay = document.getElementById("menuOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const radioPlayStopBtn = document.getElementById("radioPlayStopBtn");
const radioStreamFrame = document.getElementById("radioStreamFrame");
const radioPlayIcon = document.getElementById("radioPlayIcon");
const radioStopIcon = document.getElementById("radioStopIcon");
const radioPlayStopLabel = document.getElementById("radioPlayStopLabel");

function openMenu() {
  if (!menuBtn || !sidebar || !overlay) return;
  sidebar.classList.remove("translate-x-full");
  sidebar.classList.add("translate-x-0");
  sidebar.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("overflow-hidden");
}

function closeMenu() {
  if (!menuBtn || !sidebar || !overlay) return;
  sidebar.classList.remove("translate-x-0");
  sidebar.classList.add("translate-x-full");
  sidebar.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overflow-hidden");
}

if (menuBtn) menuBtn.addEventListener("click", openMenu);
if (closeBtn) closeBtn.addEventListener("click", closeMenu);
if (overlay) overlay.addEventListener("click", closeMenu);
sidebarLinks.forEach((link) => link.addEventListener("click", closeMenu));

function syncScrollTopButton() {
  if (!scrollTopBtn) return;
  const shouldShow = window.scrollY > 320;
  if (shouldShow) {
    scrollTopBtn.classList.remove("hidden");
    scrollTopBtn.classList.add("inline-flex");
  } else {
    scrollTopBtn.classList.remove("inline-flex");
    scrollTopBtn.classList.add("hidden");
  }
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function stopRadio() {
  if (!radioPlayStopBtn || !radioStreamFrame) return;
  radioStreamFrame.setAttribute("src", "about:blank");
  setRadioButtonState(false);
}

function setRadioButtonState(isPlaying) {
  if (!radioPlayStopBtn) return;
  radioPlayStopBtn.dataset.playing = isPlaying ? "true" : "false";

  if (isPlaying) {
    radioPlayStopBtn.classList.remove(
      "border-green-200",
      "bg-green-600",
      "shadow-green-600/30",
      "hover:bg-green-700",
    );
    radioPlayStopBtn.classList.add(
      "border-red-200",
      "bg-red-600",
      "shadow-red-600/30",
      "hover:bg-red-700",
    );
    radioPlayStopBtn.setAttribute("aria-label", "Detener emisora");
    if (radioPlayIcon) radioPlayIcon.classList.add("hidden");
    if (radioStopIcon) radioStopIcon.classList.remove("hidden");
    if (radioPlayStopLabel) radioPlayStopLabel.textContent = "Stop";
    return;
  }

  radioPlayStopBtn.classList.remove(
    "border-red-200",
    "bg-red-600",
    "shadow-red-600/30",
    "hover:bg-red-700",
  );
  radioPlayStopBtn.classList.add(
    "border-green-200",
    "bg-green-600",
    "shadow-green-600/30",
    "hover:bg-green-700",
  );
  radioPlayStopBtn.setAttribute("aria-label", "Reproducir emisora");
  if (radioStopIcon) radioStopIcon.classList.add("hidden");
  if (radioPlayIcon) radioPlayIcon.classList.remove("hidden");
  if (radioPlayStopLabel) radioPlayStopLabel.textContent = "Play";
}

if (radioPlayStopBtn && radioStreamFrame) {
  setRadioButtonState(false);
  radioPlayStopBtn.addEventListener("click", () => {
    const isPlaying = radioPlayStopBtn.dataset.playing === "true";
    if (isPlaying) {
      stopRadio();
      return;
    }
    const streamUrl = radioStreamFrame.dataset.src;
    if (!streamUrl) return;
    radioStreamFrame.setAttribute("src", streamUrl);
    setRadioButtonState(true);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    stopRadio();
  }
});

function initCarousel(trackId, options = { auto: false }) {
  const track = document.getElementById(trackId);
  if (!track) return null;

  const viewport = track.parentElement;
  const items = Array.from(track.children);
  if (!viewport || items.length === 0) return null;
  const dotsContainer = document.querySelector(`[data-carousel-dots-for="${trackId}"]`);

  let index = 0;
  let step = 0;
  let maxIndex = 0;
  let itemsPerView = 1;
  let startX = 0;
  let endX = 0;
  const dots = [];
  let autoTimer = null;

  function measure() {
    const firstItem = items[0];
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    step = firstItem.getBoundingClientRect().width + gap;
    itemsPerView = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    maxIndex = Math.max(0, items.length - itemsPerView);
    if (index > maxIndex) index = maxIndex;
    buildDots();
    syncDots();
    render();
  }

  function render() {
    track.style.transform = `translateX(-${index * step}px)`;
    syncDots();
  }

  function next(cycle = false) {
    if (index >= maxIndex) {
      index = cycle ? 0 : maxIndex;
    } else {
      index = Math.min(maxIndex, index + itemsPerView);
    }
    render();
  }

  function prev(cycle = false) {
    if (index <= 0) {
      index = cycle ? maxIndex : 0;
    } else {
      index = Math.max(0, index - itemsPerView);
    }
    render();
  }

  function goTo(itemIndex) {
    index = Math.max(0, Math.min(maxIndex, itemIndex));
    render();
  }

  function activeDotIndex() {
    return Math.round(index / Math.max(1, itemsPerView));
  }

  function syncDots() {
    if (!dots.length) return;
    const active = activeDotIndex();
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === active) {
        dot.classList.remove("w-2.5");
        dot.classList.add("w-8", "dot-active");
      } else {
        dot.classList.remove("w-8", "dot-active");
        dot.classList.add("w-2.5");
      }
    });
  }

  function buildDots() {
    if (!dotsContainer) return;
    dots.length = 0;
    dotsContainer.innerHTML = "";
    const pages = Math.max(1, Math.ceil(items.length / Math.max(1, itemsPerView)));
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir a pagina ${i + 1}`);
      dot.className = "carousel-dot h-2.5 w-2.5 rounded-full border transition-all duration-500";
      dot.addEventListener("click", () => {
        goTo(i * itemsPerView);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
    syncDots();
  }

  viewport.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchmove", (event) => {
    endX = event.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    const delta = endX - startX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    if (delta > 0) prev();
    startX = 0;
    endX = 0;
  });

  function stopAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto() {
    if (!options.auto) return;
    stopAuto();
    if (maxIndex <= 0) return;
    autoTimer = setInterval(() => {
      next(true);
    }, 3800);
  }

  if (options.auto) {
    viewport.addEventListener("mouseenter", stopAuto);
    viewport.addEventListener("mouseleave", startAuto);
    viewport.addEventListener("touchstart", stopAuto, { passive: true });
    viewport.addEventListener("touchend", startAuto, { passive: true });
  }

  measure();
  startAuto();
  return { next, prev, goTo, items, measure, startAuto, stopAuto };
}

const carousels = {};
[
  { id: "agendaTrack", auto: false },
  { id: "faithGallery", auto: true },
  { id: "ministryTrack", auto: false },
].forEach(({ id, auto }) => {
  const instance = initCarousel(id, { auto });
  if (instance) carousels[id] = instance;
});

function normalizeDay(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const bogotaDay = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  timeZone: "America/Bogota",
}).format(new Date());

const dayAlias = {
  domingo: "Domingo",
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miercoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sabado",
};

const todayName = dayAlias[normalizeDay(bogotaDay)];
const todayCard = todayName ? document.querySelector(`[data-service-day="${todayName}"]`) : null;

if (todayCard) {
  todayCard.classList.add("today-highlight");
  const agendaCarousel = carousels.agendaTrack;
  if (agendaCarousel) {
    const dayIndex = agendaCarousel.items.indexOf(todayCard);
    if (dayIndex >= 0) agendaCarousel.goTo(dayIndex);
  }
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    Object.values(carousels).forEach((carousel) => {
      carousel.measure();
      carousel.stopAuto();
      carousel.startAuto();
    });
  }, 80);
});

window.addEventListener("scroll", syncScrollTopButton, { passive: true });
syncScrollTopButton();

// ──  er color sync with Hero ──────────────────────────────────────────────
(function () {
  const  er = document.getElementById("site er");
  const hero   = document.getElementById("inicio");
  if (! er || !hero) return;

  // Switch to "scrolled" (white) once the Hero section's bottom edge
  // passes behind the  er bar.
  function sync er() {
    const heroBottom    = hero.getBoundingClientRect().bottom;
    const  erBottom  =  er.offsetHeight;
     er.toggleAttribute("data-scrolled", heroBottom <=  erBottom);
  }

  window.addEventListener("scroll", sync er, { passive: true });
  sync er(); // run once on load
})();

// ── Scroll reveal ────────────────────────────────────────────────────────────
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Track pending re-shows: when an element leaves, we schedule its class removal
  // so the next entrance animates again from the start.
  const exitTimers = new WeakMap();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // Cancel any pending exit reset so the element doesn't flicker
          const t = exitTimers.get(el);
          if (t !== undefined) {
            clearTimeout(t);
            exitTimers.delete(el);
          }
          el.classList.add("is-visible");
        } else {
          // Wait for the transition to finish before resetting,
          // so the exit is invisible and the next entrance is fresh.
          const delay = parseFloat(getComputedStyle(el).transitionDuration || "0") * 1000;
          const t = setTimeout(() => {
            el.classList.remove("is-visible");
            exitTimers.delete(el);
          }, delay + 80);
          exitTimers.set(el, t);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
})();
