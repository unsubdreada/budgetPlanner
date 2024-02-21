import { loadForms } from "./scripts/formLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  loadForms();
  console.log("DOM загружен");
});
