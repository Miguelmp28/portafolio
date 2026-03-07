const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebarMenu");
const overlay = document.getElementById("menuOverlay");
const sidebarLinks = document.querySelectorAll(".sidebar-link");

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
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function initCarousel(trackId) {
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
        dot.classList.remove("w-2.5", "bg-zinc-200", "border-zinc-400/60");
        dot.classList.add("w-8", "bg-zinc-900", "border-zinc-900");
      } else {
        dot.classList.remove("w-8", "bg-zinc-900", "border-zinc-900");
        dot.classList.add("w-2.5", "bg-zinc-200", "border-zinc-400/60");
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
      dot.className =
        "h-2.5 w-2.5 rounded-full border border-zinc-400/60 bg-zinc-200 transition-all duration-300";
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
  });

  viewport.addEventListener("touchmove", (event) => {
    endX = event.touches[0].clientX;
  });

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
    stopAuto();
    if (maxIndex <= 0) return;
    autoTimer = setInterval(() => {
      next(true);
    }, 3800);
  }

  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);
  viewport.addEventListener("touchstart", stopAuto, { passive: true });
  viewport.addEventListener("touchend", startAuto, { passive: true });

  measure();
  startAuto();
  return { next, prev, goTo, items, measure, startAuto, stopAuto };
}

const carousels = {};
["agendaTrack", "faithGallery", "ministryTrack"].forEach((id) => {
  const instance = initCarousel(id);
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
  todayCard.classList.add("border-amber-600", "bg-amber-50", "shadow-md");
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
      carousel.startAuto();
    });
  }, 80);
});
