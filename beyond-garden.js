// ========================================
// Beyond Garden page JavaScript
// - NYC Parks by borough (NYC Open Data)
// ========================================
// main funtion to setup, get contianer where park cards , button right place 
function setupParksByBorough() {
  const parksGrid = document.getElementById("parksGrid");
  const boroughButtons = document.querySelectorAll(".borough-chip");

  // 不在 Beyond Garden 页面就退出
  if (!parksGrid || !boroughButtons.length) return;
//inorder to fecth api
  const API_BASE =
    "https://data.cityofnewyork.us/resource/enfh-gkve.json";

  // 代码 -> 全名，用来显示和 where 过滤
  const BOROUGH_MAP = {
    M: "Manhattan",
    B: "Brooklyn",
    Q: "Queens",
    X: "Bronx",
    R: "Staten Island",
  };

async function loadParks(code) {
  // 显示用的中文名字（给小朋友看的）
  const boroughName = BOROUGH_MAP[code] || code;

  // 提示正在加载
  parksGrid.innerHTML =
    '<p class="parks-message">Loading parks for ' +
    boroughName +
    "…</p>";

  try {
    // ✅ 最简单的过滤：只要 borough=M/B/Q/X/R 的记录，最多 12 条
    const url =
  API_BASE +
  "?borough=" +
  encodeURIComponent(code) +
  // 按面积从大到小排，先拿最大的公园
  "&$order=" +
  encodeURIComponent("acres DESC") +
  // 只取前 8 个，避免太多小公园
  "&$limit=8";

//fecth api 
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network error: " + res.status);
    }

    const data = await res.json(); //API send park info in Json, i use res.json to convert into javs

    // 如果一条都没有，就显示提示
    if (!data.length) {
      parksGrid.innerHTML =
        '<p class="parks-message">No parks found for ' +
        boroughName +
        ".</p>";
      return;
    }

    // 用 API 返回的数据生成卡片
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
      // 激活状态切换, alive
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
