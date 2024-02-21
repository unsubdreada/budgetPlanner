function getInputValue(id) {
  // Функция: Получение данных с input
  return document.getElementById(id).value;
}

function addAction(event) {
  // Функция: Добавляем в таблицу: Дату, трата или доход, количество, причина
  event.preventDefault();
  const inputSelectDate = getInputValue("date-selector");
  const inputSelectBudget = getInputValue("budget-selector");
  const inputAnte = getInputValue("ante");
  const inputReason = getInputValue("reason");

  const { budget, ante } = getBudgetAndAnte(inputSelectBudget, inputAnte);

  const newRow = createRow();
  fillDataInRow(newRow, inputSelectDate, budget, ante, inputReason);
  delRow(newRow);
  updateForm();
}

function getBudgetAndAnte(inputSelectBudget, inputAnte) {
  // Функция: Определение знака перед тратами/доходами
  let budget = ""; // Расход или Доход в таблице вместо value
  let ante = ""; // Добавляет знаки + или -
  if (inputSelectBudget === "decline") {
    budget += "Расход";
    ante = "-" + inputAnte;
  } else if (inputSelectBudget === "income") {
    budget += "Доход";
    ante = "+" + inputAnte;
  }
  return { budget, ante };
}

function createRow() {
  // Функция: Создание новой строки таблицы
  return document.getElementById("action-table").insertRow(1);
}

function fillDataInRow(newRow, inputSelectDate, budget, ante, inputReason) {
  // Функция: Заполнения таблицы данными из input и selector
  newRow.insertCell(0).textContent = inputSelectDate;
  newRow.insertCell(1).textContent = budget;
  newRow.insertCell(2).textContent = ante;
  newRow.insertCell(3).textContent = inputReason;
}

function delRow(row) {
  // Функция: удаление строки при клике по ней
  row.addEventListener("click", function () {
    this.remove();
    updateForm();
  });
}

function updateForm() {
  // Функция: Обновление формы
  summaryOnFooter();
  updateSelectOptions(getUniqValues(0), "#select-date"); // Для столбца с датами
  updateSelectOptions(getUniqValues(3), "#select-reason"); // Для столбца с причинами
}

function summaryBudget() {
  // Функция: Складываем все траты и доходы из таблицы
  const tableBudget = document.getElementById("action-table"); // Находим таблицу на странице
  let summary = 0;

  for (let i = 1; i < tableBudget.rows.length; i++) {
    const columnAnte = parseFloat(
      tableBudget.rows[i].cells[2].textContent.trim()
    );
    summary += columnAnte;
  }
  return summary;
}

export function summaryOnFooter() {
  // Функция: Вывод суммы трат и доходов в футтер
  const summaryFooter = document.getElementById("summary");
  const totalSummary = summaryBudget();
  summaryFooter.textContent = totalSummary;
}

export function getUniqValues(column) {
  // Функция: Из таблицы получаем уникальные значения даты и причин для последующей фильтрации
  const tableBudget = document.getElementById("action-table"); // Находим таблицу на странице
  const valueSet = new Set(); // Создаем массив для хранения дат
  // Проходим по каждой строке таблицы, начиная со второй строки (с индекса 1)
  for (let i = 1; i < tableBudget.rows.length; i++) {
    const value = tableBudget.rows[i].cells[column].textContent.trim();
    valueSet.add(value); // Добавляем в массив
  }
  return Array.from(valueSet.values());
}

function updateSelectOptions(values, selector) {
  // Функция: Получение уникальных дат и причин трат/доходов
  const optionsHTML = values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
  document.querySelector(selector).innerHTML = optionsHTML;
}

const applicantAction = document.getElementById("workspace-container");
applicantAction.addEventListener("submit", addAction);
