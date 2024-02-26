import { switchFormOnWork } from "./formLoader";

let tokenExpirationInterval;
export async function handleFormLogin(event) {
  // Функция: Отправки данных на авторизацию
  event.preventDefault();
  const inputLoginValue = document.getElementById("login").value;
  const inputPasswordValue = document.getElementById("password").value;

  if (!inputLoginValue || !inputPasswordValue) {
    console.log("Поля пустые");
    return;
  }

  console.log("Логин: " + inputLoginValue + " Пароль: " + inputPasswordValue);

  try {
    const { accessToken, userName, error } = await autorisation(
      inputLoginValue,
      inputPasswordValue
    );
    if (error) {
      console.log("Ошибка авторизации: ", error);
    } else {
      console.log("Успешная авторизация!");
      console.log("Токен доступа:", accessToken);
      console.log("Имя пользователя:", userName);
      if (accessToken) {
        switchFormOnWork();
        document.getElementById("user-name").textContent = userName;
      } else {
        console.log("Нет токена доступа");
      }
    }
  } catch (error) {
    console.error("Произошла ошибка при авторизации:", error);
  }
}

async function autorisation(inputNewLoginAuth, inputPasswordAuth) {
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
      throw new Error(`Ошибка при запросе на сервер: ${response.status}`);
    }
    const data = await response.json();
    const accessToken = data.access_token;
    const userName = data.user_name;
    saveAuthData(accessToken, userName);
    decodingJWT(accessToken);
    // localStorage.setItem("access_token", accessToken);
    // localStorage.setItem("user_name", userName);
    return { accessToken, userName };
  } catch (error) {
    console.error("Произошла ошибка: ", error);
    return false;
  }
}

function decodingJWT(accessToken) {
  // Функция: Декодирование JWT
  const splitToken = accessToken.split(".");
  const header = JSON.parse(atob(splitToken[0]));
  const payload = JSON.parse(atob(splitToken[1]));
  const expTime = new Date(payload.exp * 1000);
  const hours = expTime.getHours().toString().padStart(2, "0");
  const minutes = expTime.getMinutes().toString().padStart(2, "0");
  const seconds = expTime.getSeconds().toString().padStart(2, "0");
  console.log("Заголовок: ", header);
  console.log("Нагрузка: ", payload);
  console.log(`Время: ${hours}:${minutes}:${seconds}`);
}

function saveAuthData(accessToken, userName, expIn) {
  // Функция: Сохранение токена доступа и имени пользователя в локальном хранилище
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("user_name", userName);

  const expirationTime = Date.now() + expIn * 1000; // expIn в секундах
  tokenExpirationInterval = setInterval(
    checkTokenExpiration,
    5000,
    expirationTime
  ); // Проверяем каждые 5 секунд
}

export function clearAuthData() {
  // Функция: Удаление токена доступа и имени пользователя из локального хранилища
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_name");
}

export function checkAuthData() {
  // Функция: Проверка наличия данных авторизации в локальном хранилище
  const accessToken = localStorage.getItem("access_token");
  const userName = localStorage.getItem("user_name");
  return { accessToken, userName };
}

function checkTokenExpiration(expirationTime) {
  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;

  if (timeRemaining <= 0) {
    clearInterval(tokenExpirationInterval); // Останавливаем таймер
    handleLogout(); // Выходим из учетной записи
  }
}

export function handleLogout() {
  // Функция: Обработка выхода из учетной записи
  clearAuthData(); // Удаляем данные авторизации из локального хранилища
  switchFormOnWork(); // Переключаем форму на форму входа
  clearInterval(tokenExpirationInterval); // Останавливаем таймер перед выходом
}
