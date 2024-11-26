document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    const responseDelays = [0, 50, 100, 150, 200]; // 응답 지연 시간
    const latinSquare = [
        [0, 1, 2, 3, 4],
        [1, 2, 3, 4, 0],
        [2, 3, 4, 0, 1],
        [3, 4, 0, 1, 2],
        [4, 0, 1, 2, 3]
    ];

    const latinIndex = parseInt(localStorage.getItem("latinIndex"), 10) || 0; // 라틴 스퀘어 순서
    const trialOrder = latinSquare[latinIndex]; // 현재 라틴 스퀘어 순서
    let trialData = JSON.parse(localStorage.getItem("trialData")) || []; // 이전 데이터 불러오기
    let currentTrial = 1;
    let totalTrials = 10 * sections.length; // 각 DIV에 대해 10번씩 트라이얼 진행
    let currentDelayIndex = 0; // 응답 지연 인덱스
    let targetDivIndex;
    let scrollCount = 0;
    let trialStartTime;
    let isScrollPending = false; // 지연 중 스크롤 처리 방지
    let touchStartY = 0; // 터치 시작 위치

    // 타겟 섹션 확인 함수
    function isTargetFullyVisible(target) {
        const rect = target.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    // 트라이얼 시작 함수
    function startTrial() {
        if (currentTrial > totalTrials) {
            console.log("모든 트라이얼이 완료되었습니다!");
            return;
        }

        targetDivIndex = currentTrial % sections.length; // 순서대로 DIV 선택
        const delayIndex = trialOrder[currentDelayIndex % trialOrder.length]; // 라틴 스퀘어 순서에 따라 지연 선택
        const delay = responseDelays[delayIndex];

        targetInfo.textContent = `DIV ${targetDivIndex + 1}`;
        currentTrialElement.textContent = currentTrial;
        scrollCount = 0;
        trialStartTime = Date.now();
        currentDelayIndex++;

        // 디버깅: 적용된 지연 시간 출력
        console.log(`트라이얼 ${currentTrial}: 응답 지연 ${delay} ms 적용`);

        // START POINT로 이동
        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" });
    }

    // 트라이얼 종료 및 기록
    function endTrial(success) {
        if (success) {
            const timeTaken = (Date.now() - trialStartTime) / 1000; // 경과 시간 (초)
            const trialDelay = responseDelays[trialOrder[currentDelayIndex % trialOrder.length]];
            trialData.push({
                trial: currentTrial,
                target: `DIV ${targetDivIndex + 1}`,
                delay: trialDelay,
                time: timeTaken,
                scrollCount
            });

            localStorage.setItem("trialData", JSON.stringify(trialData));
            currentTrial++;
            startTrial(); // 다음 트라이얼 시작
        }
    }

    // 스크롤 속도가 0인지 확인
    function checkScrollStopped() {
        const delayIndex = trialOrder[(currentDelayIndex - 1) % trialOrder.length]; // 현재 적용된 응답 지연
        const delay = responseDelays[delayIndex];

        console.log(`응답 지연 ${delay} ms 대기 중...`);

        setTimeout(() => {
            if (isTargetFullyVisible(sections[targetDivIndex])) {
                console.log("스크롤 속도 0 확인 및 타겟이 온전하게 보임");
                endTrial(true);
            } else {
                console.log("타겟이 온전하게 보이지 않음");
            }
        }, delay + 1000); // 응답 지연 + 추가 대기 시간
    }

    // 마우스 휠 또는 터치 스크롤 처리
    function handleScroll(deltaY) {
        if (isScrollPending) {
            return; // 지연 중에는 추가 입력 무시
        }

        isScrollPending = true;
        scrollCount++;

        const delayIndex = trialOrder[(currentDelayIndex - 1) % trialOrder.length]; // 현재 적용된 응답 지연
        const delay = responseDelays[delayIndex];

        console.log(`응답 지연 ${delay} ms 대기 중...`);

        // 지연 시간 후 스크롤 실행
        setTimeout(() => {
            isScrollPending = false;

            // 스크롤 동작 수행
            window.scrollBy({
                top: deltaY,
                behavior: "smooth"
            });

            // 스크롤 속도가 0인지 확인
            if (isTargetFullyVisible(sections[targetDivIndex])) {
                setTimeout(() => {
                    if (isTargetFullyVisible(sections[targetDivIndex])) {
                        endTrial(true);
                    }
                }, 1000); // 성공 여부 1초 후 확인
            }
        }, delay); // 응답 지연 적용
    }

    // 터치 시작 이벤트
    window.addEventListener("touchstart", function (event) {
        touchStartY = event.touches[0].clientY; // 터치 시작 Y 좌표 저장
    }, { passive: false });

    // 터치 이동 이벤트
    window.addEventListener("touchmove", function (event) {
        const touchEndY = event.touches[0].clientY; // 터치 종료 Y 좌표
        const deltaY = touchStartY - touchEndY; // 터치 이동 거리 계산
        handleScroll(deltaY); // 터치 이동 거리로 스크롤 처리
        event.preventDefault(); // 기본 터치 동작 방지
    }, { passive: false });

    // 휠 스크롤 이벤트
    window.addEventListener("wheel", function (event) {
        handleScroll(event.deltaY); // 휠 이동 거리로 스크롤 처리
        event.preventDefault(); // 기본 휠 동작 방지
    }, { passive: false });

    // 초기 트라이얼 시작
    startTrial();
});
