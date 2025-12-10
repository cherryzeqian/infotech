// ==============================
// Hard Facts page JavaScript
// - Core ideas accordion
// - Garden facts quiz
// ==============================

// 1) Core ideas accordion，wait until DOM ready, idea-block exist
document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".idea-block");
//loop though idea block and make sure all element exist
  blocks.forEach((block) => {
    const button = block.querySelector(".idea-bar");
    const panel = block.querySelector(".idea-panel");
    if (!button || !panel) return; //safely skip any block html, so the script won't stop

    // 初始：收起
    panel.style.maxHeight = null;

    button.addEventListener("click", () => {
      const isOpen = button.classList.contains("open");

      // 只允许一个打开：先全部收起
      blocks.forEach((other) => {
        const otherBtn = other.querySelector(".idea-bar");
        const otherPanel = other.querySelector(".idea-panel");
        if (!otherBtn || !otherPanel) return;
        otherBtn.classList.remove("open"); // remove "open" class from all header so none stay visually active
        otherPanel.classList.remove("open"); // remove "open" class from panel
        otherPanel.style.maxHeight = null; // collapes fully
      });

      // 如果刚才是关闭 -> 打开；如果刚才是打开 -> 保持全部关闭
      if (!isOpen) {
        button.classList.add("open");
        panel.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});

// 2) Quiz 逻辑封装在一个函数里
function setupFactsQuiz() {
  const quizSection = document.getElementById("facts-quiz");
  if (!quizSection) return;

  // ✅ 和 HTML 对应：id="checkQuizBtn"
  const checkBtn = document.getElementById("checkQuizBtn");
  const feedback = document.getElementById("quizFeedback");
  const selects = quizSection.querySelectorAll(".mcq");
  if (!checkBtn || !feedback || !selects.length) return; // make sure we have all
//know when to grade, grade count from 0
  checkBtn.addEventListener("click", () => {
    const total = selects.length;
    let correctCount = 0;
// loop to make sure the it right
    selects.forEach((select) => {
      const userAnswer = (select.value || "").trim().toLowerCase();
      const correctAnswer = (select.getAttribute("data-answer") || "")
        .trim()
        .toLowerCase();

      const block = select.closest(".fact-block");

      // 清空旧状态
      select.classList.remove("correct", "incorrect");
      if (block) block.classList.remove("correct", "incorrect");

      if (!userAnswer) {
        // 未作答 -> 当成错误
        select.classList.add("incorrect");
        if (block) block.classList.add("incorrect");
      } else if (userAnswer === correctAnswer) {
        correctCount++;
        select.classList.add("correct");
        if (block) block.classList.add("correct");
      } else {
        select.classList.add("incorrect");
        if (block) block.classList.add("incorrect");
      }
    });

    feedback.textContent =
      "You got " +
      correctCount +
      " out of " +
      total +
      " correct." +
      (correctCount === total
        ? " Great job! You remembered all the garden facts!"
        : " Keep trying and read the sections again to fix the red answers.");
  });

  // 3) Clear all answers 按钮
  const clearBtn = document.getElementById("clearQuizBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      // 重置所有 select
      selects.forEach((select) => {
        select.value = "";
        select.classList.remove("correct", "incorrect");
        const block = select.closest(".fact-block");
        if (block) block.classList.remove("correct", "incorrect");
      });

      // 清空反馈文字
      feedback.textContent = "";
    });
  }
}

// 4) 在 DOM 加载后真正启动 quiz
document.addEventListener("DOMContentLoaded", () => {
  setupFactsQuiz();
});
