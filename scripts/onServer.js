import { getUserDataJSON } from "./handleReg";
export function sendDataToServer() {
  // Функция: Отправка JSON'а на сервер
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
