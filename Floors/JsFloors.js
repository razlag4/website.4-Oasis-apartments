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


// Универсальная функция открытия/закрытия
function toggleDropdown(id) {
  document.querySelectorAll('[id^="dropdown-"]').forEach(drop => {
    if (drop.id !== id) drop.style.display = "none";
  });
  const dropdown = document.getElementById(id);
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Выбор опции — подсветка и активные кнопки
document.querySelectorAll('.option1, .option2').forEach(option => {
  option.addEventListener('click', () => {
    const parent = option.parentElement;
    parent.querySelectorAll('.option1, .option2').forEach(el => el.classList.remove('selected'));
    option.classList.add('selected');

    // подсветка кнопок Done и Clear
    const actions = parent.querySelector('.actions1, .actions2');
    if (actions) actions.classList.add('active');
  });
});

// Done — обновляем текст кнопки
function doneSelection(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const button = document.querySelector(`.dropdown-btn${dropdownId.match(/\d+/)[0]}`);
  const selected = dropdown.querySelector('.option1.selected, .option2.selected');
  button.textContent = selected ? selected.textContent : button.dataset.defaultText;
  dropdown.style.display = "none";
  applyFilters();
}

// Clear — сброс выбора
function clearSelection(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.querySelectorAll('.option1, .option2').forEach(el => el.classList.remove('selected'));
  
  const actions = dropdown.querySelector('.actions1, .actions2');
  if (actions) actions.classList.remove('active');

  const button = document.querySelector(`.dropdown-btn${dropdownId.match(/\d+/)[0]}`);
  button.textContent = button.dataset.defaultText;
  applyFilters();
}

// Закрытие при клике вне
document.addEventListener("click", function(event) {
  if (!event.target.closest(".block, .block4, .block5, .block6")) {
    document.querySelectorAll('[id^="dropdown-"]').forEach(drop => drop.style.display = "none");
  }
});

// ✅ Форматирование кнопки Price Range
function donePriceRange(buttonClass, minId, maxId) {
  const button = document.querySelector(`.${buttonClass}`);
  const minVal = document.getElementById(minId).value.trim();
  const maxVal = document.getElementById(maxId).value.trim();

  let text = '';
  if (minVal && maxVal) {
    text = `$${minVal} - $${maxVal}`;
  } else if (minVal) {
    text = `From $${minVal}`;
  } else if (maxVal) {
    text = `Up to $${maxVal}`;
  } else {
    text = button.dataset.defaultText;
  }

  button.textContent = text;

  const dropdownId = 'dropdown-' + buttonClass.match(/\d+/)[0];
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) dropdown.style.display = 'none';

  applyFilters();
}


function doneInput(buttonClass, inputIds, formatFn) {
  const button = document.querySelector(`.${buttonClass}`);
  if (!button) return;

  const values = inputIds.map(id => document.getElementById(id)?.value || '');
  button.textContent = formatFn(...values);
  
  // Закрываем дропдаун
  const dropdownId = 'dropdown-' + buttonClass.match(/\d+/)[0];
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) dropdown.style.display = 'none';

  applyFilters();
}

let allPlans = [];

 // Загружаем JSON
fetch('App.json')
  .then(response => response.json())
  .then(plans => {
    const container = document.getElementById('plansContainer');
    container.innerHTML = '';

    plans.forEach(plan => {
      const card = document.createElement('div');
      card.className = 'plan-card';

      // Формируем кнопки
      const buttonsHtml = plan.buttons.map(btn => {
        return `<a href="${btn.url}" target="_blank" class="plan-btn">${btn.text}</a>`;
      }).join('');

      card.innerHTML = `
        <h2 class="plan-title">${plan.title}</h2>
        <div class="plan-info">
          <p>🏠 ${plan.bedrooms}</p>
          <p>🛁 ${plan.bathrooms}</p>
        </div>
        <p class="plan-size">📐 ${plan.size}</p>
        <p class="plan-availability">${plan.available}</p>
        <img class="plan-image" src="${plan.image}" alt="${plan.title}" onerror="this.style.display='none';">
        <div class="plan-price">
          <h2>Starting at ${plan.price}</h2>
          <p>Deposit: ${plan.deposit}</p>
        </div>
        <div class="plan-buttons">
          ${buttonsHtml}
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error('Ошибка загрузки JSON:', err));

// ✅ Фильтрация по выбранным параметрам
function applyFilters() {
  const selectedBedroom = document.querySelector('#dropdown-bed1 .selected')?.textContent || '';
  const selectedBathroom = document.querySelector('#dropdown-bath2 .selected')?.textContent || '';

  const minSize = parseFloat(document.getElementById('min-size3').value) || null;
  const maxSize = parseFloat(document.getElementById('max-size3').value) || null;

  const minPrice = parseFloat(document.getElementById('min-price4').value) || null;
  const maxPrice = parseFloat(document.getElementById('max-price4').value) || null;

  const filtered = allPlans.filter(plan => {
    // Bedrooms
    if (selectedBedroom && plan.bedrooms !== selectedBedroom) return false;

    // Bathrooms
    if (selectedBathroom && plan.bathrooms !== selectedBathroom) return false;

    // Size
    const sizeNum = parseFloat(plan.size);
    if (minSize && sizeNum < minSize) return false;
    if (maxSize && sizeNum > maxSize) return false;

    // Price
    const priceNum = parseFloat(plan.price.replace(/[^0-9]/g, ''));
    if (minPrice && priceNum < minPrice) return false;
    if (maxPrice && priceNum > maxPrice) return false;

    return true;
  });

  // Анимация плавного исчезновения/появления
  const container = document.getElementById('plansContainer');
  const cards = container.querySelectorAll('.plan-card');

  cards.forEach(card => {
    card.classList.remove('visible');
  });

  setTimeout(() => {
    renderPlans(filtered);
  }, 200);
}


// ====== АКТИВАЦИЯ / ДЕАКТИВАЦИЯ DONE ДЛЯ PRICE RANGE 1 ======
const minPriceInput4 = document.getElementById('min-price4');
const maxPriceInput4 = document.getElementById('max-price4');
const donePriceButton = document.querySelector('.done4');

function toggleDonePriceButton() {
  const minVal = minPriceInput4.value.trim();
  const maxVal = maxPriceInput4.value.trim();
  
  donePriceButton.disabled = (minVal === '' && maxVal === '');
}

minPriceInput4.addEventListener('input', toggleDonePriceButton);
maxPriceInput4.addEventListener('input', toggleDonePriceButton);
toggleDonePriceButton();


document.querySelector('.done4')?.addEventListener('click', () => {
  donePriceRange('dropdown-btn4', 'min-price4', 'max-price4');
});

document.querySelector('.done2')?.addEventListener('click', () => {
  donePriceRange('dropdown-btn2', 'min-price', 'max-price');
});

// ====== АКТИВАЦИЯ / ДЕАКТИВАЦИЯ DONE ДЛЯ UNIT SIZE ======
const minSizeInput = document.getElementById('min-size3');
const maxSizeInput = document.getElementById('max-size3');
const doneSizeButton = document.querySelector('.done3');
const unitSizeBtn = document.querySelector('.dropdown-btn3');

function toggleDoneSizeButton() {
  const minVal = minSizeInput.value.trim();
  const maxVal = maxSizeInput.value.trim();

  // Активируем кнопку Done, если введено хотя бы одно значение
  doneSizeButton.disabled = (minVal === '' && maxVal === '');
}

minSizeInput.addEventListener('input', toggleDoneSizeButton);
maxSizeInput.addEventListener('input', toggleDoneSizeButton);

toggleDoneSizeButton(); // проверка при загрузке

// ====== Обновление текста на кнопке Unit Size ======
doneSizeButton.addEventListener('click', () => {
  const minVal = minSizeInput.value.trim();
  const maxVal = maxSizeInput.value.trim();

  let text = '';
  if (minVal && maxVal) {
    text = `${minVal} - ${maxVal} Sq.Ft.`;
  } else if (minVal) {
    text = `${minVal}+ Sq.Ft.`;
  } else if (maxVal) {
    text = `Up to ${maxVal} Sq.Ft.`;
  } else {
    text = unitSizeBtn.dataset.defaultText;
  }

  unitSizeBtn.textContent = text;
  closeDropdown('dropdown-size3');
});


// ====== CLEAR ДЛЯ UNIT SIZE ======
const clearSizeButton = document.querySelector('.clear3');

clearSizeButton.addEventListener('click', () => {
  minSizeInput.value = '';
  maxSizeInput.value = '';
  toggleDoneSizeButton(); // выключаем Done
  unitSizeBtn.textContent = unitSizeBtn.dataset.defaultText; // возвращаем текст
});


// ====== CLEAR ДЛЯ PRICE RANGE ======
const clearPriceButton = document.querySelector('.clear4');
const priceBtn = document.querySelector('.dropdown-btn4');

clearPriceButton.addEventListener('click', () => {
  minPriceInput4.value = '';
  maxPriceInput4.value = '';
  toggleDonePriceButton(); // выключаем Done
  priceBtn.textContent = priceBtn.dataset.defaultText; // возвращаем текст
});


function clearInputs(buttonId, inputIds, formatFn) {
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  doneInput(buttonId, inputIds, formatFn);
}



