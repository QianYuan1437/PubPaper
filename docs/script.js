const cards = Array.from(document.querySelectorAll(".venue-card"));
const searchInput = document.querySelector("#searchInput");
const typeFilter = document.querySelector("#typeFilter");
const statusFilter = document.querySelector("#statusFilter");
const topicFilter = document.querySelector("#topicFilter");
const chipButtons = Array.from(document.querySelectorAll(".chip"));
const resultCount = document.querySelector("#resultCount");
const noResults = document.querySelector("#noResults");
const viewButtons = Array.from(document.querySelectorAll(".view-button"));
const cardsView = document.querySelector("#cardsView");
const tableViewSection = document.querySelector("#tableViewSection");
const venuesTableBody = document.querySelector("#venuesTableBody");

let chipMode = "all";
let currentView = "cards";
const rowMap = new Map();

function getFieldMap(card) {
  const fieldMap = new Map();
  const groups = card.querySelectorAll(".meta-list div");
  for (const group of groups) {
    const key = group.querySelector("dt")?.textContent?.trim();
    const valueNode = group.querySelector("dd");
    if (key && valueNode) {
      fieldMap.set(key, valueNode);
    }
  }
  return fieldMap;
}

function createTableLink(node) {
  const link = node?.querySelector("a");
  if (!link) {
    return node?.textContent?.trim() || "";
  }
  return `<a href="${link.href}" target="_blank" rel="noopener">${link.textContent.trim()}</a>`;
}

function buildTable() {
  if (!venuesTableBody) return;

  const rowsHtml = cards
    .map((card, index) => {
      const title = card.querySelector("h3")?.textContent?.trim() || "Untitled";
      const type = card.dataset.entryType === "journal" ? "期刊" : "会议";
      const statusText = card.querySelector(".status")?.textContent?.trim() || "";
      const fields = getFieldMap(card);
      const official = createTableLink(fields.get("官网"));
      const cfp = createTableLink(fields.get("收稿公告"));
      const deadline = fields.get("截稿日期")?.textContent?.trim() || "";
      const template = createTableLink(fields.get("投稿模板"));

      return `
        <tr data-row-index="${index}">
          <td><strong>${title}</strong></td>
          <td><span class="table-badge">${type}</span></td>
          <td>${statusText}</td>
          <td>${official}</td>
          <td>${cfp}</td>
          <td>${deadline}</td>
          <td>${template}</td>
        </tr>
      `;
    })
    .join("");

  venuesTableBody.innerHTML = rowsHtml;

  const rows = Array.from(venuesTableBody.querySelectorAll("tr"));
  for (const row of rows) {
    const index = Number(row.dataset.rowIndex);
    rowMap.set(index, row);
  }
}

function matchesChip(card) {
  if (chipMode === "all") return true;
  if (chipMode === "conference" || chipMode === "journal") {
    return card.dataset.entryType === chipMode;
  }
  const haystack = `${card.dataset.topics || ""} ${card.dataset.search || ""}`.toLowerCase();
  return haystack.includes(chipMode);
}

function updateCards() {
  const keyword = (searchInput?.value || "").trim().toLowerCase();
  const typeValue = typeFilter?.value || "all";
  const statusValue = statusFilter?.value || "all";
  const topicValue = topicFilter?.value || "all";

  let visibleCount = 0;

  for (const card of cards) {
    const searchText = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
    const matchesKeyword = !keyword || searchText.includes(keyword);
    const matchesType = typeValue === "all" || card.dataset.entryType === typeValue;
    const matchesStatus = statusValue === "all" || card.dataset.status === statusValue;
    const matchesTopic = topicValue === "all" || (card.dataset.topics || "").toLowerCase().includes(topicValue);
    const visible = matchesKeyword && matchesType && matchesStatus && matchesTopic && matchesChip(card);

    card.hidden = !visible;
    const row = rowMap.get(cards.indexOf(card));
    if (row) {
      row.hidden = !visible;
    }
    if (visible) visibleCount += 1;
  }

  if (resultCount) {
    resultCount.textContent = String(visibleCount);
  }

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

function setView(view) {
  currentView = view;
  if (cardsView) {
    cardsView.hidden = view !== "cards";
  }
  if (tableViewSection) {
    tableViewSection.hidden = view !== "table";
  }
  for (const button of viewButtons) {
    button.classList.toggle("is-active", button.dataset.view === view);
  }
}

for (const control of [searchInput, typeFilter, statusFilter, topicFilter]) {
  control?.addEventListener("input", updateCards);
  control?.addEventListener("change", updateCards);
}

for (const chip of chipButtons) {
  chip.addEventListener("click", () => {
    chipMode = chip.dataset.chipFilter || "all";
    for (const button of chipButtons) {
      button.classList.toggle("is-active", button === chip);
    }
    updateCards();
  });
}

for (const button of viewButtons) {
  button.addEventListener("click", () => {
    const nextView = button.dataset.view || "cards";
    setView(nextView);
    updateCards();
  });
}

buildTable();
setView(currentView);
updateCards();
