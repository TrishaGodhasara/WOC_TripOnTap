/* =========================================================
   DESTINATIONS PAGE LOGIC
   Search + type filter + budget filter + sort + navigation.
   Self-contained, no dependency on script.js.
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("cardGrid");
  if (!grid) return; // not the destinations page

  const cards = Array.from(grid.querySelectorAll(".card"));
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const typeFilterWrap = document.getElementById("typeFilters");
  const budgetFilterWrap = document.getElementById("budgetFilters");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const resetBtn = document.getElementById("resetFilters");

  const state = {
    search: "",
    type: "all",
    budget: "all",
    sort: "default",
  };

  // ---- click a card to open its destination page ----
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const page = card.getAttribute("data-page");
      if (page) window.location.href = page;
    });
  });

  // ---- filter chip helper ----
  function bindChips(wrap, stateKey) {
    if (!wrap) return;
    wrap.querySelectorAll(".dest-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        wrap
          .querySelectorAll(".dest-chip")
          .forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state[stateKey] = chip.dataset[stateKey] || "all";
        render();
      });
    });
  }
  bindChips(typeFilterWrap, "type");
  bindChips(budgetFilterWrap, "budget");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      render();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.search = "";
      state.type = "all";
      state.budget = "all";
      state.sort = "default";
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "default";
      [typeFilterWrap, budgetFilterWrap].forEach((wrap) => {
        if (!wrap) return;
        wrap.querySelectorAll(".dest-chip").forEach((c, i) =>
          c.classList.toggle("active", i === 0)
        );
      });
      render();
    });
  }

  function cardMatches(card) {
    const name = card.querySelector("h3").innerText.toLowerCase();
    const desc = card.querySelector("p")?.innerText.toLowerCase() || "";
    const type = card.dataset.type || "";
    const budget = card.dataset.budget || "";

    const matchesSearch =
      !state.search ||
      name.includes(state.search) ||
      desc.includes(state.search) ||
      type.includes(state.search);

    const matchesType = state.type === "all" || type === state.type;
    const matchesBudget = state.budget === "all" || budget === state.budget;

    return matchesSearch && matchesType && matchesBudget;
  }

  function sortCards(visibleCards) {
    const sorted = [...visibleCards];
    switch (state.sort) {
      case "price-asc":
        sorted.sort(
          (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
        );
        break;
      case "name-asc":
        sorted.sort((a, b) =>
          a.querySelector("h3").innerText.localeCompare(
            b.querySelector("h3").innerText
          )
        );
        break;
      default:
        break; // featured / original order
    }
    return sorted;
  }

  function render() {
    let visibleCount = 0;
    const visible = [];

    cards.forEach((card) => {
      const match = cardMatches(card);
      card.classList.toggle("dest-hidden", !match);
      if (match) {
        visibleCount++;
        visible.push(card);
      }
    });

    // re-order DOM according to sort (only among visible cards, kept simple)
    if (state.sort !== "default") {
      const ordered = sortCards(visible);
      ordered.forEach((card) => grid.appendChild(card));
    }

    if (resultsCount) {
      resultsCount.textContent =
        visibleCount === cards.length
          ? `Showing all ${cards.length} haunted hideaways`
          : `Showing ${visibleCount} of ${cards.length} haunted hideaways`;
    }

    if (emptyState) {
      emptyState.classList.toggle("show", visibleCount === 0);
    }
  }

  render();
});
