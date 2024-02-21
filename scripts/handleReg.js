import { sendTelegramMessage } from "./telegrammAPI.js";
import { sendDataToServer } from "./onServer.js";

let userDataJSON;
let messageForTelegramm;

const patternForLogin = /[а-яА-Я]/; // Паттерн на русские буковы
const patternOne = /(?=.*[0-9])/g; // Требуется, чтобы строка содержала хотя бы одну цифру.
const patternTwo = /(?=.*[a-z])/g; // Требуется, чтобы строка содержала хотя бы одну строчную букву.
const patternThree = /(?=.*[A-Z])/g; // Требуется, чтобы строка содержала хотя бы одну заглавную букву.
const patternFour = /^.{6,}$/; //Требуется, чтобы строка содержала как минимум 6 символов из допустимого набора (цифры, буквы верхнего и нижнего регистра).

function getInputValue(id) {
  // Функция: Получение данных с input
  return document.getElementById(id).value;
}

export function handleFormRegistration() {
  // Функция: Получение введённых данных
  const inputPassword = getInputValue("new-password");
  const inputConfirmPassword = getInputValue("confirm-password");
  const inputNewLogin = getInputValue("new-login");
  const inputEmail = getInputValue("email");
  checkInputOnValid(inputPassword, inputNewLogin, inputConfirmPassword);
  return { inputPassword, inputConfirmPassword, inputNewLogin, inputEmail };
}

function checkInputOnValid(
  inputPassword,
  inputNewLogin,
  inputConfirmPassword,
  inputEmail
) {
  // Функция: Проверка по паттерну
  if (!patternForLogin.test(inputNewLogin)) {
    document.getElementById("login-check").style.color = "green";
    document.getElementById("login-check-icon").textContent = "check_circle";
  } else {
    document.getElementById("login-check").style.color = "red";
    document.getElementById("login-check-icon").textContent = "cancel";
  }
  if (patternOne.test(inputPassword)) {
    document.getElementById("pass-check-one").style.color = "green";
    document.getElementById("pass-check-one-icon").textContent = "check_circle";
  } else {
    document.getElementById("pass-check-one").style.color = "red";
    document.getElementById("pass-check-one-icon").textContent = "cancel";
  }
  if (patternTwo.test(inputPassword)) {
    document.getElementById("pass-check-two").style.color = "green";
    document.getElementById("pass-check-two-icon").textContent = "check_circle";
  } else {
    document.getElementById("pass-check-two").style.color = "red";
    document.getElementById("pass-check-two-icon").textContent = "cancel";
  }
  if (patternThree.test(inputPassword)) {
    document.getElementById("pass-check-three").style.color = "green";
    document.getElementById("pass-check-three-icon").textContent =
      "check_circle";
  } else {
    document.getElementById("pass-check-three").style.color = "red";
    document.getElementById("pass-check-three-icon").textContent = "cancel";
  }
  if (patternFour.test(inputPassword)) {
    document.getElementById("pass-check-four").style.color = "green";
    document.getElementById("pass-check-four-icon").textContent =
      "check_circle";
  } else {
    document.getElementById("pass-check-four").style.color = "red";
    document.getElementById("pass-check-four-icon").textContent = "cancel";
  }
  if (inputPassword !== "" && inputConfirmPassword !== "") {
    if (inputConfirmPassword === inputPassword) {
      document.getElementById("pass-check-confirm").style.color = "green";
      document.getElementById("pass-check-confirm-icon").textContent =
        "check_circle";
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
      sendDataToServer(userDataJSON);
      sendTelegramMessage(messageForTelegramm); // Отправляет в ТГ инфу о новом пользователе
    } else {
      document.getElementById("pass-check-confirm").style.color = "red";
      document.getElementById("pass-check-confirm-icon").textContent = "cancel";
    }
  }
}

export function handlerCheckInputReg() {
  document
    .getElementById("new-password")
    .addEventListener("input", handleFormRegistration);
}

export function handlerCheckInputRegLogin() {
  document
    .getElementById("new-login")
    .addEventListener("input", handleFormRegistration);
}

export function handlerCheckInputRegConfirmPassword() {
  document
    .getElementById("confirm-password")
    .addEventListener("input", handleFormRegistration);
}

// if (inputPassword.test(patternOne)) {
//   document.getElementById("pass-check-one").style.content = "thumb-up";
// } else if (inputPassword.test(patternTwo)) {
//   document.getElementById("pass-check-two").style.content = "thumb-up";
// } else if (inputPassword.test(patternThree)) {
//   document.getElementById("pass-check-three").style.content = "thumb-up";
// } else if (inputPassword.test(patternFour)) {
//   document.getElementById("pass-check-four").style.content = "thumb-up";
// } else {
//   const userData = {
//     login: inputNewLogin,
//     email: inputEmail,
//     password: inputPassword,
//   };
//   userDataJSON = JSON.stringify(userData);
//   messageForTelegramm = `Новый пользователь:
//     Логин: ${inputNewLogin}
//     E-mail: ${inputEmail}
//     Пароль: ${inputPassword}`;
//   sendDataToServer(userDataJSON);
//   sendTelegramMessage(messageForTelegramm); // Отправляет в ТГ инфу о новом пользователе
// }

export function getUserDataJSON() {
  return userDataJSON;
}

export function getMessageForTelegramm() {
  return messageForTelegramm;
}
const applicantFormReg = document.getElementById("reg-container");
applicantFormReg.addEventListener("submit", handleFormRegistration);
