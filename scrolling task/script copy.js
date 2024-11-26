document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    let trialData = JSON.parse(localStorage.getItem("trialData")) || []; // 이전 데이터 불러오기
    let currentTrial = 1;
    let targetDivIndex;
    let scrollCount = 0;
    let trialStartTime;

    // 타겟 섹션 확인 함수
    function isTargetFullyVisible(target) {
        const rect = target.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    // 트라이얼 시작 함수
    function startTrial() {
        targetDivIndex = Math.floor(Math.random() * sections.length); // 랜덤 타겟
        while (targetDivIndex === 3) { // START POINT는 타겟에서 제외
            targetDivIndex = Math.floor(Math.random() * sections.length);
        }

        targetInfo.textContent = `DIV ${targetDivIndex + 1}`;
        currentTrialElement.textContent = currentTrial;
        scrollCount = 0;
        trialStartTime = Date.now();

        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" }); // START POINT로 이동
    }

    // 트라이얼 종료 및 기록
    function endTrial(success) {
        if (success) {
            const timeTaken = (Date.now() - trialStartTime) / 1000; // 경과 시간 (초)
            trialData.push({
                trial: currentTrial,
                target: `DIV ${targetDivIndex + 1}`,
                time: timeTaken,
                scrollCount,
            });

            localStorage.setItem("trialData", JSON.stringify(trialData));
            currentTrial++;
            startTrial(); // 다음 트라이얼 시작
        }
    }

    // 스크롤 이벤트
    window.addEventListener("scroll", function () {
        scrollCount++;

        if (isTargetFullyVisible(sections[targetDivIndex])) {
            setTimeout(() => {
                if (isTargetFullyVisible(sections[targetDivIndex])) {
                    endTrial(true);
                }
            }, 700); // 0.7초로 수정
        }
    });

    // 초기 트라이얼 시작
    startTrial();
});
