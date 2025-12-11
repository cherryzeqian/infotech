// ========================================
// Beyond Garden page JavaScript
// - NYC Parks by borough (NYC Open Data)
// ========================================

function setupParksByBorough() {
  const parksGrid = document.getElementById("parksGrid");
  const boroughButtons = document.querySelectorAll(".borough-chip");

  // 不在 Beyond Garden 页面就退出
  if (!parksGrid || !boroughButtons.length) return;

  // NYC Open Data – Parks Properties
  const API_BASE = "https://data.cityofnewyork.us/resource/enfh-gkve.json";

  // 代码 -> 全名，用来显示和 where 过滤
  const BOROUGH_MAP = {
    M: "Manhattan",
    B: "Brooklyn",
    Q: "Queens",
    X: "Bronx",
    R: "Staten Island",
  };

  // load parks for one borough
  async function loadParks(code) {
    const boroughName = BOROUGH_MAP[code] || code; // full name for kids + API
    const boroughQueryValue = boroughName;         // use full name in API

    // 提示正在加载
    parksGrid.innerHTML =
      '<p class="parks-message">Loading parks for ' +
      boroughName +
      "…</p>";

    try {
      const url =
        API_BASE +
        "?borough=" +
        encodeURIComponent(boroughQueryValue) +
        "&$order=" +
        encodeURIComponent("acres DESC") +
        "&$limit=8";

      console.log("Fetching:", url); // debug

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network error: " + res.status);
      }

      // API sends park info in JSON, convert to JS
      const data = await res.json();

      if (!data.length) {
        parksGrid.innerHTML =
          '<p class="parks-message">No parks found for ' +
          boroughName +
          ".</p>";
        return;
      }

      const cardsHtml = data
        .map((park) => {
          const name = park.signname || "Park";
          const location = park.location || "";
          const acres = park.acres
            ? Number(park.acres).toFixed(1) + " acres"
            : "";
          const zip = park.zipcode ? "ZIP " + park.zipcode : "";

          return `
            <article class="place-card">
              <div class="place-card-header">
                <span class="place-card-emoji">🌳</span>
                <h2 class="place-card-title">${name}</h2>
              </div>
              <p>${location}</p>
              <p class="place-card-meta">
                ${[acres, zip].filter(Boolean).join(" · ")}
              </p>
            </article>
          `;
        })
        .join("");

      parksGrid.innerHTML = cardsHtml;
    } catch (err) {
      console.error(err);
      parksGrid.innerHTML =
        '<p class="parks-message error">Sorry, there was a problem loading park data.</p>';
    }
  }

  // 绑定 borough 小按钮
  boroughButtons.forEach((button) => {
    button.addEventListener("click", () => {
      boroughButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");

      const code = button.dataset.borough;
      loadParks(code);
    });
  });

  // 初始默认加载 Manhattan（M）
  loadParks("M");
}

// 页面加载完成后启动 Beyond Garden 功能
document.addEventListener("DOMContentLoaded", () => {
  setupParksByBorough();
});
