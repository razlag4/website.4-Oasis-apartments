AOS.init({
      duration: 1200,
      once: true
    });


    
    // 🦋 Реалистическое плавание фигур
class FloatingShape {
  constructor(svgTemplate) {
    this.element = svgTemplate.cloneNode(true);
    this.element.classList.add('floating-decor');
    document.body.appendChild(this.element);

    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.3 + Math.random() * 0.5;
    this.element.style.opacity = '0.1';

    const g = this.element.querySelector('g');
    if (g) {
      g.style.transformOrigin = 'center';
    }
  }

  update() {
    this.angle += Math.sin(Date.now() / 2000 + this.x) * 0.002;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < -150) this.x = window.innerWidth + 150;
    if (this.x > window.innerWidth + 150) this.x = -150;
    if (this.y < -150) this.y = window.innerHeight + 150;
    if (this.y > window.innerHeight + 150) this.y = -150;

    const rotation = this.angle * 180 / Math.PI;
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${rotation}deg)`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const svgTemplate = document.querySelector('.decor-top-left');
  if (svgTemplate) {
    const shapes = [];
    const totalShapes = 8; // количество "бабочек"

    for (let i = 0; i < totalShapes; i++) {
      const shape = new FloatingShape(svgTemplate);
      shapes.push(shape);
    }

    // Прячем оригинальные svg-шаблоны
    svgTemplate.style.opacity = '0';
    svgTemplate.style.pointerEvents = 'none';
    svgTemplate.style.position = 'absolute';
    svgTemplate.style.left = '-9999px';

    const bottomSvg = document.querySelector('.decor-bottom-right');
    if (bottomSvg) {
      bottomSvg.style.opacity = '0';
      bottomSvg.style.pointerEvents = 'none';
      bottomSvg.style.position = 'absolute';
      bottomSvg.style.left = '-9999px';
    }

    // Анимация
    function animate() {
      shapes.forEach(shape => shape.update());
      requestAnimationFrame(animate);
    }
    animate();
  }
});


/* Pet Policy — interactive accordions, keyboard accessible, reveal on scroll
   Works with your provided <main id="pet-policy"> and sections inside.
*/

(function(){
  const main = document.getElementById('pet-policy');
  if(!main) return;

  const sections = Array.from(main.querySelectorAll('section'));
  const revealNodes = Array.from(main.querySelectorAll('.reveal'));

  // add controls (Expand all / Collapse all)
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = `
    <button type="button" id="expandAll">Expand All</button>
    <button type="button" id="collapseAll">Collapse All</button>
  `;
  main.insertBefore(controls, main.firstChild);

  const expandAllBtn = controls.querySelector('#expandAll');
  const collapseAllBtn = controls.querySelector('#collapseAll');

  // accessibility & interactivity setup for each section
  sections.forEach((section, idx) => {
    // find the clickable header (h3 or h2)
    const header = section.querySelector('h3, h2');
    if(!header) return;

    // mark header as a button for screen readers and keyboard
    header.tabIndex = 0;
    header.setAttribute('role','button');
    header.setAttribute('aria-expanded', 'false');
    section.setAttribute('data-index', String(idx));

    // Skip auto-collapsing for intro (open by default)
    if(section.classList.contains('intro')){
      section.classList.add('active');
      header.setAttribute('aria-expanded','true');
    }

    // click handler
    header.addEventListener('click', (e) => {
      toggleSection(section, {scrollIntoView:true});
    });

    // keyboard handler (Enter / Space)
    header.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleSection(section, {scrollIntoView:true});
      }
    });
  });

  // toggle logic: by default keep only one open (official look)
  const allowMultipleOpen = false; // если хочешь множественные, поставь true

  function toggleSection(section, opts = {}){
    const isActive = section.classList.contains('active');

    if(!allowMultipleOpen){
      // close others
      sections.forEach(s => {
        if(s !== section && s.classList.contains('active')){
          s.classList.remove('active');
          const h = s.querySelector('h3, h2');
          if(h) h.setAttribute('aria-expanded','false');
        }
      });
    }

    if(isActive){
      section.classList.remove('active');
      const h = section.querySelector('h3, h2');
      if(h) h.setAttribute('aria-expanded','false');
    } else {
      section.classList.add('active');
      const h = section.querySelector('h3, h2');
      if(h) h.setAttribute('aria-expanded','true');
      if(opts.scrollIntoView){
        setTimeout(()=> section.scrollIntoView({behavior:'smooth', block:'center'}), 160);
      }
    }
  }

  // expand/collapse all
  expandAllBtn.addEventListener('click', () => {
    sections.forEach(s => {
      s.classList.add('active');
      const h = s.querySelector('h3, h2'); if(h) h.setAttribute('aria-expanded','true');
    });
  });
  collapseAllBtn.addEventListener('click', () => {
    sections.forEach(s => {
      if(!s.classList.contains('intro')){ // keep intro optionally open if you want
        s.classList.remove('active');
        const h = s.querySelector('h3, h2'); if(h) h.setAttribute('aria-expanded','false');
      } else {
        // If you want to collapse intro too, remove this branch
        // s.classList.remove('active');
      }
    });
  });

  // Scroll reveal using IntersectionObserver for performance
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, {threshold: 0.12});
    revealNodes.forEach(n => io.observe(n));
  } else {
    // fallback
    revealNodes.forEach(n => n.classList.add('visible'));
  }

  // small touch: collapse on outside-click (optional)
  document.addEventListener('click', (e) => {
    const inside = e.composedPath().some(el => el === main);
    // do nothing if click inside main, only for strict UX we'd close; disabled for now
  });

})();