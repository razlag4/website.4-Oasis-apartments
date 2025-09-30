AOS.init({
      duration: 1200,
      once: true
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





