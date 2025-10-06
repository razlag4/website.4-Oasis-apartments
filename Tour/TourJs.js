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




// --- Инициализация элементов ---
const datesGrid = document.getElementById('datesGrid');
const timesGrid = document.getElementById('timesGrid');
const dateRange = document.getElementById('dateRange');
const availableText = document.getElementById('availableText');
const confirmBtn = document.getElementById('confirmBtn');

// --- Слоты времени ---
const timeSlots = [
  '10:00 AM','11:00 AM','12:00 PM','01:00 PM',
  '02:00 PM','03:00 PM','04:00 PM','05:00 PM'
];

// --- Начальная неделя (текущая) ---
let currentWeekStart = new Date();
currentWeekStart.setHours(0, 0, 0, 0);

// --- Основная функция отрисовки недели ---
function renderWeek() {
  datesGrid.innerHTML = '';

  const end = new Date(currentWeekStart);
  end.setDate(end.getDate() + 6);

  // Диапазон дат (например: October 5, 2025 - October 11, 2025)
  dateRange.textContent = `${currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}`;

  // ⏪ кнопка "предыдущая неделя"
  const prev = document.createElement('label');
  prev.className = 'date-item special';
  prev.innerHTML = `<span><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M15 6L9 12L15 18"
        stroke="#61C0D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>`;
  prev.addEventListener('click', () => {
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    const temp = new Date(currentWeekStart);
    temp.setDate(temp.getDate() - 7);
    if (temp >= minDate) {
      currentWeekStart = temp;
      renderWeek();
    }
  });
  datesGrid.appendChild(prev);

  // 7 дней недели
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);

    const label = document.createElement('label');
    label.className = 'date-item';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'date';
    input.value = date;

    const span = document.createElement('span');
    span.innerHTML = `${date.toLocaleDateString('en-US', { weekday: 'short' })}<br>${String(date.getDate()).padStart(2, '0')}`;

    label.appendChild(input);
    label.appendChild(span);

    // По умолчанию первый день недели выбран
    if (i === 0) {
      input.checked = true;
      label.classList.add('selected');
      updateTimes(date);
    }

    // При выборе другой даты
    input.addEventListener('change', () => {
      document.querySelectorAll('.date-item').forEach(el => el.classList.remove('selected'));
      label.classList.add('selected');
      updateTimes(date);
    });

    datesGrid.appendChild(label);
  }

  // ⏩ кнопка "следующая неделя"
  const next = document.createElement('label');
  next.className = 'date-item special';
  next.innerHTML = `<span><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M9 6L15 12L9 18"
        stroke="#61C0D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>`;
  next.addEventListener('click', () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // максимум на год вперёд
    const temp = new Date(currentWeekStart);
    temp.setDate(temp.getDate() + 7);
    if (temp <= maxDate) {
      currentWeekStart = temp;
      renderWeek();
    }
  });
  datesGrid.appendChild(next);
}

// --- Обновление списка времён ---
function updateTimes(selectedDate) {
  timesGrid.innerHTML = '';
  availableText.textContent = `Available times on ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;

  timeSlots.forEach((time, index) => {
    const label = document.createElement('label');
    label.className = 'time-item';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'time';
    input.value = time;

    const span = document.createElement('span');
    span.textContent = time;

    // Первый слот активен по умолчанию
    if (index === 0) {
      input.checked = true;
      label.classList.add('selected');
      updateConfirmText(selectedDate, time);
    }

    input.addEventListener('change', () => {
      document.querySelectorAll('.time-item').forEach(el => el.classList.remove('selected'));
      label.classList.add('selected');
      updateConfirmText(selectedDate, time);
    });

    label.appendChild(input);
    label.appendChild(span);
    timesGrid.appendChild(label);
  });
}

// --- Обновление текста кнопки подтверждения ---
function updateConfirmText(date, time) {
  confirmBtn.textContent = `CONFIRM ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} AT ${time}`;
}

// --- Первичный рендер ---
renderWeek();
