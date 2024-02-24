import { sendTelegramMessage } from "./telegrammAPI.js";
import { sendDataToServer } from "./onServer.js";
import { checkAvailabilityLoginOnDB } from "./onServer.js";

let userDataJSON;
let messageForTelegramm;

const patterns = {
  // Паттерны для логина и пароля
  login: /[а-яА-Я]/,
  one: /(?=.*[0-9])/g,
  two: /(?=.*[a-z])/g,
  three: /(?=.*[A-Z])/g,
  four: /^.{6,}$/,
};

function getInputValue(id) {
  // Функция: Получение данных с input
  return document.getElementById(id).value;
}

function updateRuleDisplay(elementId, isValid) {
  // Функция: Изменение правил при вводе данных
  const element = document.getElementById(elementId);
  const icon = element.querySelector(".material-icons");
  element.style.color = isValid ? "green" : "red";
  icon.textContent = isValid ? "check_circle" : "cancel";
}

function checkPasswordOnValid(password, confirmPassword) {
  // Функция: Проверка пароля по паттерну
  if (password === "" && confirmPassword === "") {
    updateRuleDisplay("pass-check-confirm", false);
  }
  const isValid = {
    one: patterns.one.test(password),
    two: patterns.two.test(password),
    three: patterns.three.test(password),
    four: patterns.four.test(password),
    confirm: password === confirmPassword,
  };

  if (password === "") {
    isValid.one = false;
    isValid.two = false;
    isValid.three = false;
    isValid.four = false;
    isValid.confirm = false;
  }

  let isValidPassword = true;
  for (const [rule, valid] of Object.entries(isValid)) {
    updateRuleDisplay(`pass-check-${rule}`, valid);
    if (!valid) {
      isValidPassword = false; // Если хотя бы одно правило не выполняется, пароль невалидный
    }
  }
  return isValidPassword;
}

export async function handleFormRegistration() {
  // Функция: Сбора данных с полей и отправки в ТГ+сервер
  const inputPassword = getInputValue("new-password").trim();
  const inputConfirmPassword = getInputValue("confirm-password").trim();
  const inputNewLogin = getInputValue("new-login").trim();
  const inputEmail = getInputValue("email").trim();

  const isLoginValid = !patterns.login.test(inputNewLogin); // Проверка логина на паттерн
  updateRuleDisplay("login-check", isLoginValid);

  const isPasswordValid = checkPasswordOnValid(
    inputPassword,
    inputConfirmPassword
  );

  if (isLoginValid && isPasswordValid) {
    const loginExists = await checkAvailabilityLoginOnDB(inputNewLogin);
    console.log(loginExists); // Проверяем полученное значение
    const loginCheckElement = document.getElementById("login-check");
    const loginCheckElementInput = document.getElementById("new-login");

    if (loginExists) {
      // Логин занят
      loginCheckElementInput.style.color = "red";
      loginCheckElement.textContent = "Такой логин уже существует";
      loginCheckElement.style.color = "red";
      loginCheckElement.querySelector(".material-icons").textContent = "cancel";
    } else {
      // Логин свободен
      loginCheckElementInput.style.color = "green";
      loginCheckElement.textContent = "Логин свободен";
      loginCheckElement.style.color = "green";
      loginCheckElement.querySelector(".material-icons").textContent =
        "check_circle";
    }
    const userData = {
      login: inputNewLogin,
      email: inputEmail,
      password: inputPassword,
    };
    userDataJSON = JSON.stringify(userData);
    messageForTelegramm = `Новый пользователь:
    Логин: ${inputNewLogin}
    E-mail: ${inputEmail}
    Пароль: ${inputPassword}`;
  }
}

export function handlerCheckInputReg() {
  const applicantFormReg = document.getElementById("reg-container");
  applicantFormReg.addEventListener("submit", handleFormRegistration);
  applicantFormReg.addEventListener("submit", sendDataToServer);
  applicantFormReg.addEventListener("submit", sendTelegramMessage);
  applicantFormReg.addEventListener("reset", () => {
    // Правила false при нажатии на reset
    updateRuleDisplay("pass-check-one", false);
    updateRuleDisplay("pass-check-two", false);
    updateRuleDisplay("pass-check-three", false);
    updateRuleDisplay("pass-check-four", false);
    updateRuleDisplay("pass-check-confirm", false);
  });
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      // При изменении содержимого любого поля ввода - функция проверки
      handleFormRegistration();
    });
  });
}

export function getUserDataJSON() {
  return userDataJSON;
}

export function getMessageForTelegramm() {
  return messageForTelegramm;
}
