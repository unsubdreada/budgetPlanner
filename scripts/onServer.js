import { getUserDataJSON } from "./handleReg.js";
export function sendDataToServer() {
  // Функция: Отправка JSON'а на сервер (Регистрация)
  const userDataJSON = getUserDataJSON();
  fetch("http://91.205.239.89:8888/api/v1/Registry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: userDataJSON,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ответ сети not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Возникла проблема с операцией получения:", error);
    });
  console.log(userDataJSON);
}

export async function checkAvailabilityLoginOnDB(inputNewLogin) {
  // Функция: Отправка JSON'а на сервер (Проверка на наличие логина в БД)
  console.log(`${inputNewLogin} это ${typeof inputNewLogin}`);
  try {
    const response = await fetch(
      `http://91.205.239.89:8888/api/v1/CheckUsername`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputNewLogin: inputNewLogin }),
      }
    );
    if (!response.ok) {
      throw new Error(`Ошибка при запросе на сервер`);
    }
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    return false;
  }
}

export async function autorisation(inputNewLoginAuth, inputPasswordAuth) {
  // Функция: Отправка JSON'а на сервер (Авторизация)
  console.log(`${inputNewLoginAuth} это ${typeof inputNewLoginAuth}`);
  try {
    const response = await fetch(`http://91.205.239.89:8888/api/v1/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputNewLogin: inputNewLoginAuth,
        inputPasswordAuth: inputPasswordAuth,
      }),
    });
    if (!response.ok) {
      throw new Error(`Ошибка при запросе на сервер`);
    }
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    return false;
  }
}
