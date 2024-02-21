import "./style.css";
import { loadForms } from "./scripts/formLoader";

document.addEventListener("DOMContentLoaded", () => {
  loadForms();
  console.log("DOM загружен");
});
