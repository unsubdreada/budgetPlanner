import { getMessageForTelegramm } from "./handleReg.js";

const botToken = "6847647933:AAGtvSpEluat2zYjXgrN7lEu1qMvZH1xrgk";
const chatId = "-1001656518086";
const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
export async function sendTelegramMessage() {
  const messageForTelegramm = getMessageForTelegramm();
  const data = new URLSearchParams();
  data.append("chat_id", chatId);
  data.append("text", messageForTelegramm);
  data.append("disable_notification", true); // Отправка без уведомлений

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    if (response.ok) {
      console.log("Сообщение успешно отправлено в Telegram!");
    } else {
      const errorMessage = await response.text();
      console.error(
        "Ошибка отправки сообщения в Telegram:",
        response.statusText,
        errorMessage
      );
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
}
