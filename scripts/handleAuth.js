import { autorisation } from "./onServer";
export async function handleFormLogin(event) {
  // Функция: Отправки данных на авторизацию
  event.preventDefault();
  const inputLoginValue = document.getElementById("login").value;
  const inputPasswordValue = document.getElementById("password").value;
  console.log("Логин: " + inputLoginValue + " Пароль: " + inputPasswordValue);

  try {
    const isLoggedIn = await autorisation(inputLoginValue, inputPasswordValue);
    if (isLoggedIn) {
      // Если пользователь успешно авторизован, выполните необходимые действия
      console.log("Авторизация прошла успешно");
    } else {
      // Если авторизация не удалась, выполните необходимые действия
      console.log("Ошибка авторизации");
    }
  } catch (error) {
    console.error("Произошла ошибка при авторизации:", error);
  }
}
