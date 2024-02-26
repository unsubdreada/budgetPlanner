import { getUniqValues, summaryOnFooter } from "./appWork.js";
import { handlerCheckInputReg, handleFormRegistration } from "./handleReg.js";
import { handleFormLogin, checkAuthData, handleLogout } from "./handleAuth.js";

export function loadForms() {
  // Функция: Загрузки форм авторизации, регистрации и рабочего простратства в DOM
  const loginForm = document.getElementById("login-container");
  const regForm = document.getElementById("reg-container");
  const workspaceForm = document.getElementById("workspace-container");
  // Загрузка формы авторизации
  fetch("./login-form.html")
    .then((response) => response.text())
    .then((html) => {
      loginForm.innerHTML = html;
      const switcherButtonOnReg = document.getElementById("btn-create");
      switcherButtonOnReg.addEventListener("click", switchForm);
      const buttonOnAuth = document.getElementById("btn-enter");
      buttonOnAuth.addEventListener("click", handleFormLogin);
    })
    .catch((error) =>
      console.error("Ошибка загрузки формы авторизации:", error)
    );

  // Загрузка формы регистрации
  fetch("./reg-form.html")
    .then((response) => response.text())
    .then((html) => {
      regForm.innerHTML = html;
      regForm.style.display = "none"; // Форма регистрации скрыта по умолчанию
      const switcherButtonOnLogin = document.getElementById("btn-login");
      switcherButtonOnLogin.addEventListener("click", switchForm);
    })
    .catch((error) =>
      console.error("Ошибка загрузки формы регистрации:", error)
    );

  // Загрузка формы рабочего пространства
  fetch("./workspace-form.html")
    .then((response) => response.text())
    .then((html) => {
      workspaceForm.innerHTML = html;
      workspaceForm.style.display = "none"; // Форма рабочего пространства скрыта по умолчанию
      //const loginButton = document.getElementById("btn-enter"); // При клике на Войти переход на форму рабочего пространства, пока без логики авторизации
      //loginButton.addEventListener("click", switchFormOnWork);
      getUniqValues();
      summaryOnFooter();
      handlerCheckInputReg();
      handleFormRegistration();
    });
}

export function switchForm(event) {
  // Функция: Перехода на форму регистрации и обратно на форму авторизации
  event.preventDefault();
  const loginForm = document.getElementById("login-container");
  const regForm = document.getElementById("reg-container");

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    regForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
    regForm.style.display = "block";
  }
}

export function switchFormOnWork() {
  // Функция: Перехода на форму рабочего пространства
  const loginForm = document.getElementById("login-container");
  const workspaceForm = document.getElementById("workspace-container");
  const userNameElement = document.getElementById("user-name");
  const exitButton = document.getElementById("exit");
  // Наличие токена и логина
  const { accessToken, userName } = checkAuthData();

  if (accessToken && userName) {
    loginForm.style.display = "none";
    workspaceForm.style.display = "block";
    userNameElement.textContent = userName;
    exitButton.addEventListener("click", handleLogout);
    const currentDate = new Date(); // Получаем текущую дату
    const formattedDate = currentDate.toISOString().split("T")[0]; // Формат даты до: YYYY-MM-DD        !!!!!   Исправить    !!!!
  } else {
    loginForm.style.display = "block";
    workspaceForm.style.display = "none";
    userNameElement.textContent = "";
    exitButton.removeEventListener("click", handleLogout);
  }
}
