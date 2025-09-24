AOS.init({ duration: 1200, once: true });

const AUTO_DELAY = 2500;
const PAUSE_AFTER_INTERACT = 8000;

const hero = document.getElementById("hero");
const heroImages = [
  "photos/UpPhoto1.png",
  "photos/UpPhoto2.png",
  "photos/UpPhoto3.png",
  "photos/UpPhoto4.png"
];

heroImages.forEach((src, i) => {
  const bg = document.createElement("div");
  bg.className = "hero-bg" + (i === 0 ? " active" : "");
  bg.style.backgroundImage = `url(${src})`;
  hero.append(bg);
});

let slides = Array.from(hero.querySelectorAll(".hero-bg"));
let current = 0;
let autoTimer = null;
let lastUserInteraction = 0;
let isHovering = false;

function getOrCreateButton(id, html, className) {
  let btn = document.getElementById(id);
  if (!btn) {
    btn = document.createElement("button");
    btn.id = id;
    btn.innerHTML = html;
    btn.className = `arrow ${className}`;
    hero.appendChild(btn);
  }
  return btn;
}

const nextBtn = getOrCreateButton("next", "&#10095;", "right");
const prevBtn = getOrCreateButton("prev", "&#10094;", "left");

let dotsContainer = document.createElement("div");
dotsContainer.className = "hero-dots";
hero.appendChild(dotsContainer);

const dots = slides.map((_, i) => {
  const dot = document.createElement("span");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.title = `Slide ${i + 1}`;
  dot.addEventListener("click", () => showSlide(i, { interaction: true }));
  dotsContainer.appendChild(dot);
  return dot;
});

function setActive(index) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
    s.style.transform = i === index ? "scale(1) translateZ(0)" : "scale(1.08) translateX(30px)";
    s.style.transition = "opacity 1.2s ease-in-out, transform 1.6s ease";
  });
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
  const hc = hero.querySelector(".hero-content");
  if (hc) {
    hc.classList.remove("slide-animate");
    void hc.offsetWidth;
    hc.classList.add("slide-animate");
  }
}

function showSlide(index, opts = {}) {
  current = (index + slides.length) % slides.length;
  setActive(current);
  if (opts.interaction) markUserInteraction();
}

function showNext() { showSlide(current + 1, { interaction: true }); }
function showPrev() { showSlide(current - 1, { interaction: true }); }

function scheduleAuto() {
  clearTimeout(autoTimer);
  const timeSinceInteraction = Date.now() - lastUserInteraction;
  const pause = timeSinceInteraction < PAUSE_AFTER_INTERACT ? (PAUSE_AFTER_INTERACT - timeSinceInteraction) : 0;
  const delay = pause > 0 ? pause : AUTO_DELAY;
  autoTimer = setTimeout(() => {
    if (!isHovering && Date.now() - lastUserInteraction >= PAUSE_AFTER_INTERACT) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * slides.length);
      } while (randomIndex === current && slides.length > 1);
      showSlide(randomIndex, { interaction: false });
    }
    scheduleAuto();
  }, delay);
}

function markUserInteraction() {
  lastUserInteraction = Date.now();
  scheduleAuto();
}

nextBtn.addEventListener("click", () => { showNext(); markUserInteraction(); });
prevBtn.addEventListener("click", () => { showPrev(); markUserInteraction(); });

hero.addEventListener("mouseenter", () => { isHovering = true; });
hero.addEventListener("mouseleave", () => { isHovering = false; });

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { showNext(); markUserInteraction(); }
  if (e.key === "ArrowLeft")  { showPrev(); markUserInteraction(); }
});

let touchStartX = null;
hero.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; });
hero.addEventListener("touchend", e => {
  if (touchStartX == null) return;
  const dx = (e.changedTouches[0].clientX - touchStartX);
  if (Math.abs(dx) > 40) { if (dx < 0) showNext(); else showPrev(); markUserInteraction(); }
  touchStartX = null;
});

hero.addEventListener("mousemove", e => {
  const w = hero.clientWidth;
  const h = hero.clientHeight;
  const x = (e.clientX / w - 0.5) * 18;
  const y = (e.clientY / h - 0.5) * 10;
  slides.forEach(s => {
    if (s.classList.contains("active")) {
      s.style.backgroundPosition = `calc(50% + ${x * 0.6}px) calc(50% + ${y * 0.4}px)`;
    } else {
      s.style.backgroundPosition = `calc(50% + ${x * 0.25}px) calc(50% + ${y * 0.15}px)`;
    }
  });
});

hero.addEventListener("mouseleave", () => {
  slides.forEach(s => s.style.backgroundPosition = "center");
});

const ctaButton = document.querySelector('#cta-button');
if (ctaButton) {
  ctaButton.addEventListener('click', () => { alert("Checking availability..."); });
}

try {
  const swiper = new Swiper('.swiper', {
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,
    slidesPerView: 1,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'coverflow',
    coverflowEffect: { rotate: 30, stretch: 0, depth: 200, modifier: 1, slideShadows: true }
  });
} catch (e) {}

(function(){
  const css = `
    .hero-content.slide-animate { animation: heroPop .5s ease; }
    @keyframes heroPop { 0% { transform: translateY(6px); opacity: 0; } 60% { transform: translateY(-4px); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
    .dot { transition: transform .22s ease, opacity .22s ease; }
    .dot:hover { transform: scale(1.25); opacity: 1; }
    .arrow { transition: transform .18s ease, background .18s ease; }
    .arrow:active { transform: scale(.96); }
  `;
  const s = document.createElement("style");
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
})();

setActive(current);
scheduleAuto();

function createMiniSlider(containerId, images) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const slides = images.map((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " active" : "");
    slide.style.backgroundImage = `url(${src})`;
    container.appendChild(slide);
    return slide;
  });
  const prev = document.createElement("div");
  prev.className = "arrow left";
  prev.innerHTML = "&#10094;";
  const next = document.createElement("div");
  next.className = "arrow right";
  next.innerHTML = "&#10095;";
  container.appendChild(prev);
  container.appendChild(next);
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "dots";
  container.appendChild(dotsWrap);
  const dots = images.map((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dotsWrap.appendChild(dot);
    dot.addEventListener("click", () => show(i));
    return dot;
  });
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
}

createMiniSlider("slider-left", heroImages);
createMiniSlider("slider-right", heroImages);

document.querySelectorAll("img").forEach(img => {
  img.style.transition = "transform 0.25s ease";
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.05) translate(${x * 15}px, ${y * 10}px)`;
  });
  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1) translate(0,0)";
  });
});

document.querySelectorAll("img").forEach(img => {
  img.style.transition = "transform 0.25s ease";
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.05) translate(${x * 15}px, ${y * 10}px)`;
  });
  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1) translate(0,0)";
  });
});

document.querySelectorAll("*").forEach(el => {
  const bg = window.getComputedStyle(el).backgroundImage;
  if (bg && bg !== "none" && el !== document.body) {
    el.style.transition = "background-position 0.25s ease";
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.backgroundPosition = `calc(50% + ${x * 15}px) calc(50% + ${y * 10}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.backgroundPosition = "center";
    });
  }
});

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault()); 
  img.setAttribute("draggable", "false");
  img.addEventListener("mousedown", e => e.preventDefault()); 
});



