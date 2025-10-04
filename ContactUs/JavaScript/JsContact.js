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

    
  
  const toggleBtn = document.getElementById('toggleBtn');
  const hiddenText = document.getElementById('hiddenText');

  toggleBtn.addEventListener('click', () => {
    hiddenText.classList.toggle('show');
    if (hiddenText.classList.contains('show')) {
      toggleBtn.textContent = 'Show less';
    } else {
      toggleBtn.textContent = 'Show more';
    }
  });


  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');

  dropdownBtn.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  // Закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('show');
    }
  });

  // Пример: выбор элемента из списка
  dropdownContent.querySelectorAll('div').forEach(item => {
    item.addEventListener('click', () => {
      dropdownBtn.textContent = item.textContent + ' ▾';
      dropdownContent.classList.remove('show');
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-container"); // форма
  const inputs = form.querySelectorAll("input[required], textarea[required], input[type='email'], input[type='tel']");

  form.querySelector(".submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      const group = input.closest(".input-group");
      let errorEl = group.querySelector(".error-message");

      if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.classList.add("error-message");
        group.appendChild(errorEl);
      }

      // Проверка
      if (!input.value.trim()) {
        group.classList.add("error");
        errorEl.textContent = "This field is required";
        isValid = false;
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        group.classList.add("error");
        errorEl.textContent = "Please enter a valid email";
        isValid = false;
      } else if (input.type === "tel" && !/^[0-9\-\+\(\)\s]{7,}$/.test(input.value)) {
        group.classList.add("error");
        errorEl.textContent = "Please enter a valid phone number";
        isValid = false;
      } else {
        group.classList.remove("error");
        errorEl.textContent = "";
      }
    });

    if (isValid) {
      form.submit();
    }
  });
});







