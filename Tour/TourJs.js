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
  prev.innerHTML = `<span><svg width="45" height="auto" viewBox="0 0 24 24" fill="none"
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
  next.innerHTML = `<span><svg width="45" height="auto" viewBox="0 0 24 24" fill="none"
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


confirmBtn.addEventListener('click', () => {
  const selectedDateInput = document.querySelector('input[name="date"]:checked');
  const selectedTimeInput = document.querySelector('input[name="time"]:checked');

  if (!selectedDateInput || !selectedTimeInput) {
    alert('Please select a date and time first.');
    return;
  }

  const dateObj = new Date(selectedDateInput.value);
  const formatted = `${dateObj.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })} at ${selectedTimeInput.value}`;

  openFormWithSelection(formatted);
});


function openFormWithSelection(formatted) {
  const bookingSection = document.querySelector('.booking-section');

  // Создаём контейнер для формы (или переиспользуем существующий)
  let formWrap = document.getElementById('formWrap');
  if (!formWrap) {
    formWrap = document.createElement('div');
    formWrap.id = 'formWrap';
    // вставляем после bookingSection
    bookingSection.parentNode.insertBefore(formWrap, bookingSection.nextSibling);
  }

  // Вставляем ТОЛЬКО нужную форму (без <html>/<head>/<body> и без дублирования header/footer)
  formWrap.innerHTML = `
    <div id="YourSelect">
      <p id="selected" class="required-note">You selected ${formatted}</p>
      <button id="changeselect" type="button" class="btn-link">CHANGE</button>
    </div>

    <section class="register-section" data-aos="fade-up">
      <div class="form-container">
        <p class="required-note" id="requiredNote">IMPORTANT: Please enter your name exactly as it appears on your government-issued photo ID</p>

        <h1>Personal Information</h1>
        <form id="contactForm">
          <div class="input-row">
            <div class="input-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" required>
            </div>
            <div class="input-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" required>
            </div>
          </div>

          <div class="input-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" id="sms" name="sms" checked>
            <label for="sms">Yes, I'd be happy to receive text messages!</label>
          </div>

          <div id="hiddenText" class="hidden" style="margin-bottom:12px;">
            <p style="font-size:13px; color:#bbb;">
              By checking this box, you agree to receive marketing text messages from The Oasis Management.
              You may unsubscribe at any time. Msg and Data rates may apply. See <a class="policy-text" href="../Policy/Policy.html">Privacy Policy</a> and <a class="policy-text" href="../Terms/Terms.html">Terms.</a>
            </p>
          </div>

          <div class="input-group">
            <label for="moveInDate">Move-In Date</label>
            <input type="date" id="moveInDate" name="moveInDate">
          </div>

          <div class="input-group">
            <label for="message">Message*</label>
            <textarea id="message" name="message" required></textarea>
            <p class="error-message" id="error-message" style="display:none;">Please enter a message</p>
          </div>

          <p class="policy-text">
            <a href="../Policy/Policy.html" target="_blank">Privacy Policy</a> and 
            <a href="../Terms/Terms.html" target="_blank">Terms of Service</a> apply.
          </p>

          <button id="submitBtn" type="submit" class="submit-btn">Send My Message</button>
        </form>
      </div>
    </section>
  `;

  // Скрываем секцию выбора и показываем форму
  bookingSection.style.display = 'none';
  formWrap.style.display = 'block';

  // ---- привязываем обработчики к вставленным элементам ----
  const changeBtn = document.getElementById('changeselect');
  changeBtn.addEventListener('click', () => {
    formWrap.style.display = 'none';
    bookingSection.style.display = '';
    // оставляем renderWeek как есть — элементы сохранены
  });

  const toggleBtn = document.getElementById('toggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const hidden = document.getElementById('hiddenText');
      if (!hidden) return;
      hidden.classList.toggle('hidden');
      toggleBtn.textContent = hidden.classList.contains('hidden') ? 'Show more' : 'Show less';
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // простая валидация сообщения
      const msg = document.getElementById('message').value.trim();
      if (!msg) {
        document.getElementById('error-message').style.display = 'block';
        return;
      }
      // Здесь можно отправить форму через fetch/ajax или показать подтверждение
      alert('Спасибо! Ваша заявка отправлена.\\nВы выбрали: ' + formatted);
      // при желании — очистить форму или перенаправить
      contactForm.reset();
    });
  }
}


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


