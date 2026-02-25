// ===== Controle de comportamento do header ao rolar a página
// ===== Ajusta classes para modificar altura via CSS variables

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  const body = document.body;

  if (currentScrollY > 0) {
    body.classList.add("notAtTop");
  } else {
    body.classList.remove("notAtTop");
  }

  if (currentScrollY > lastScrollY) {
    body.classList.add("scrollingDown");
  } else {
    body.classList.remove("scrollingDown");
  }

  lastScrollY = currentScrollY;
});

// ===== Alternância de tema (Dark / Light)
// ===== Persiste escolha no localStorage

const themeButton = document.querySelector("[data-btn-theme-color]");
const root = document.documentElement;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.classList.add("-dark");
}

themeButton.addEventListener("click", () => {
  const isDark = root.classList.toggle("-dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== Sistema de Dropdown reutilizável
// ===== Controla altura via variável CSS

const dropdowns = document.querySelectorAll("[data-dropdown]");

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector("[data-drop-button]");
  const content = dropdown.querySelector("[data-drop-content]");
  const inner = dropdown.querySelector("[data-drop-inner]");

  function openDropdown() {
    const height = inner.clientHeight;
    content.style.setProperty("--dropdown_height", height + "px");
    dropdown.classList.add("-open");
  }

  function closeDropdown() {
    content.style.setProperty("--dropdown_height", "0px");
    dropdown.classList.remove("-open");
  }

  if (dropdown.classList.contains("-open")) {
    openDropdown();
  } else {
    closeDropdown();
  }

  button.addEventListener("click", () => {
    dropdown.classList.contains("-open") ? closeDropdown() : openDropdown();
  });

  window.addEventListener("resize", () => {
    if (dropdown.classList.contains("-open")) {
      openDropdown();
    }
  });
});

// ===== Validação de formulário + sistema de Toast

const form = document.querySelector("[data-contact-form]");
const toastArea = document.querySelector("[data-toast-area]");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateText(text) {
  const lettersOnly = text.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  return lettersOnly.length >= 3;
}

function showToast(message, type = "warning") {
  const toast = document.createElement("div");
  toast.classList.add("toast_notification", `-${type}`);
  toast.textContent = message;

  toastArea.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("-show");
  });

  setTimeout(() => {
    toast.classList.remove("-show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();

  if (!validateText(nameValue)) {
    showToast("O nome deve conter pelo menos 3 letras.");
    return;
  }

  if (!validateEmail(emailValue)) {
    showToast("Digite um e-mail válido.");
    return;
  }

  if (!validateText(messageValue)) {
    showToast("A mensagem deve conter pelo menos 3 letras.");
    return;
  }

  showToast("Mensagem enviada com sucesso!", "success");
  form.reset();

  setTimeout(() => {
    document.body.scrollIntoView({ behavior: "smooth" });
  }, 2000);
});
