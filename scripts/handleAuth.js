export function handleFormLogin(event) {
  // Функция: Отправки данных на авторизацию
  event.preventDefault();
  const inputLoginValue = document.getElementById("login").value;
  const inputPasswordValue = document.getElementById("password").value;
  console.log("Логин: " + inputLoginValue + " Пароль: " + inputPasswordValue);
}
