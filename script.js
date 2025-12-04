// ========== HARD FACTS MULTIPLE-CHOICE QUIZ ==========

function setupFactsQuiz() {
  var quizSection = document.getElementById("facts-quiz");
  if (!quizSection) return; // only run on Hard Facts page

  var button = document.getElementById("checkFactsQuiz");
  var feedback = document.getElementById("quizFeedback");
  var selects = quizSection.querySelectorAll(".mcq");

  button.addEventListener("click", function () {
    var total = selects.length;
    var correctCount = 0;

    selects.forEach(function (select) {
      var userAnswer = (select.value || "").trim().toLowerCase();
      var correctAnswer = (select.getAttribute("data-answer") || "")
        .trim()
        .toLowerCase();

      select.classList.remove("correct", "incorrect");

      if (!userAnswer) {
        select.classList.add("incorrect");
      } else if (userAnswer === correctAnswer) {
        correctCount++;
        select.classList.add("correct");
      } else {
        select.classList.add("incorrect");
      }
    });

    feedback.textContent =
      "You got " + correctCount + " out of " + total + " correct." +
      (correctCount === total
        ? " Great job! You remembered all the garden facts!"
        : " Keep trying and read the sections again to fix the red answers.");
  });
}

// ========== NYC PARKS API (Beyond Garden) ==========

// Map borough code -> full name
function fullBorough(code) {
  var map = {
    X: "Bronx",
    Q: "Queens",
    B: "Brooklyn",
    M: "Manhattan",
    R: "Staten Island"
  };
  return map[code] || code || "New York City";
}

// Choose an image file per borough
function getBoroughImage(boroughName) {
  var b = (boroughName || "").toLowerCase();
  if (b === "bronx")         return "images/bronx-park.jpg";
  if (b === "brooklyn")      return "images/brooklyn-park.jpg";
  if (b === "queens")        return "images/queens-park.jpg";
  if (b === "manhattan")     return "images/manhattan-park.jpg";
  if (b === "staten island") return "images/statenisland-park.jpg";
  return "images/nyc-park.jpg";
}

// Short description per borough
function getBoroughDescription(boroughName) {
  switch (boroughName) {
    case "Bronx":
      return "The Bronx has big parks and nature areas where rivers, hills, and city streets meet.";
    case "Brooklyn":
      return "Brooklyn’s parks include beaches, playgrounds, and long walking paths.";
    case "Queens":
      return "Queens has many neighborhood playgrounds and sports fields in very diverse communities.";
    case "Manhattan":
      return "Manhattan parks are green spaces inside tall buildings and busy streets.";
    case "Staten Island":
      return "Staten Island has forests, wetlands, and waterfront parks that feel close to nature.";
    default:
      return "New York City parks connect people and nature in many different ways.";
  }
}

function loadParks() {
  var list = document.getElementById("parksList");
  var btn  = document.getElementById("loadParksBtn");

  if (!list || !btn) return;

  list.setAttribute("aria-busy", "true");
  list.innerHTML = "<li>Loading parks...</li>";
  btn.classList.add("loading");

  var url = "https://data.cityofnewyork.us/resource/enfh-gkve.json?$limit=100";

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      list.innerHTML = "";

      if (!Array.isArray(data) || !data.length) {
        list.innerHTML = "<li>No park data available right now.</li>";
        return;
      }

      // Filter to named parks
      var namedParks = data.filter(function (park) {
        return park.signname && park.signname.trim().length > 0;
      });

      if (!namedParks.length) {
        list.innerHTML = "<li>No named parks found in this dataset.</li>";
        return;
      }

      // Group by borough
      var groups = {};

      namedParks.forEach(function (park) {
        var boroughCode = park.borough || park.boro || "";
        var boroughName = fullBorough(boroughCode);

        if (!groups[boroughName]) {
          groups[boroughName] = [];
        }

        // keep up to 3 per borough
        if (groups[boroughName].length < 3) {
          groups[boroughName].push(park);
        }
      });

      var boroughNames = Object.keys(groups);
      if (!boroughNames.length) {
        list.innerHTML = "<li>No borough groups could be created.</li>";
        return;
      }

      boroughNames.forEach(function (boroughName) {
        var parks = groups[boroughName];

        var groupLi = document.createElement("li");
        groupLi.className = "borough-group";

        var imgSrc = getBoroughImage(boroughName);
        var desc   = getBoroughDescription(boroughName);

        groupLi.innerHTML =
          "<div class='borough-header'>" +
            "<img src='" + imgSrc + "' alt='" + boroughName + " park photo' class='borough-image'>" +
            "<div class='borough-text'>" +
              "<h3>" + boroughName + "</h3>" +
              "<p>" + desc + "</p>" +
            "</div>" +
          "</div>";

        var innerUl = document.createElement("ul");
        innerUl.className = "borough-parks";

        parks.forEach(function (park) {
          var parkLi = document.createElement("li");

          var name     = park.signname || "NYC Park";
          var boroughC = park.borough || park.boro || "";
          var boroughF = fullBorough(boroughC);
          var acres    = park.acres ? park.acres + " acres" : "";
          var type     = park.typecatego || park.typecategory || "";
          var location = park.location || park.locationdesc || "";

          var metaParts = [];
          if (boroughF) metaParts.push("Borough: " + boroughF);
          if (type)     metaParts.push("Type: " + type);
          if (acres)    metaParts.push("Size: " + acres);
          if (location) metaParts.push("Location: " + location);

          var metaText = metaParts.join(" · ");

          parkLi.innerHTML =
            "<strong>" + name + "</strong><br>" +
            "<span class='park-meta'>" + metaText + "</span>";

          innerUl.appendChild(parkLi);
        });

        groupLi.appendChild(innerUl);
        list.appendChild(groupLi);
      });
    })
    .catch(function () {
      list.innerHTML = "<li>Sorry, we could not load the parks.</li>";
    })
    .finally(function () {
      list.setAttribute("aria-busy", "false");
      btn.classList.remove("loading");
    });
}

function setupParksButton() {
  var btn = document.getElementById("loadParksBtn");
  if (!btn) return;
  btn.addEventListener("click", loadParks);
}

// ====== Init on page load ======
document.addEventListener("DOMContentLoaded", function () {
  setupFactsQuiz();
  setupParksButton();
});

// ========================
// Core ideas accordion
// ========================
document.querySelectorAll(".idea-bar").forEach((bar) => {
  bar.addEventListener("click", () => {
    const targetId = bar.dataset.target;
    const panel = document.getElementById(targetId);

    const isOpen = panel.classList.contains("open");

    // close all panels
    document.querySelectorAll(".idea-panel").forEach((p) => {
      p.classList.remove("open");
    });
    document.querySelectorAll(".idea-bar").forEach((b) => {
      b.classList.remove("open");
    });

    // if the clicked one was closed, open it
    if (!isOpen) {
      panel.classList.add("open");
      bar.classList.add("open");
    }
  });
});

// ===============================
// Beyond Garden: NYC Parks by Borough
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const parksGrid = document.getElementById("parksGrid");
  const boroughButtons = document.querySelectorAll(".borough-chip");

  // If we're not on the Beyond Garden page, do nothing
  if (!parksGrid || !boroughButtons.length) return;

  const API_BASE =
    "https://data.cityofnewyork.us/resource/enfh-gkve.json";

  async function loadParks(borough) {
    // Show a loading message
    parksGrid.innerHTML =
      '<p class="parks-message">Loading parks for ' +
      borough +
      "…</p>";

    try {
     // Build API URL: only bigger parks, largest first
const whereClause = encodeURIComponent("acres > 30");

const url =
  API_BASE +
  "?borough=" +
  encodeURIComponent(borough) +
  "&$where=" +
  whereClause +
  "&$order=acres DESC" +
  "&$limit=10";


      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network error: " + res.status);
      }

      const data = await res.json();

      if (!data.length) {
        parksGrid.innerHTML =
          '<p class="parks-message">No parks found for ' +
          borough +
          ".</p>";
        return;
      }

      // Build cards from the API data
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

  // Wire up the borough buttons
  boroughButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Toggle active state
      boroughButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");

      const borough = button.dataset.borough;
      loadParks(borough);
    });
  });

  // Initial load: Manhattan (code "M")
loadParks("M");

});
