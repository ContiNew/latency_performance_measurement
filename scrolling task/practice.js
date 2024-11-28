document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    const responseDelays = [0, 200]; // 응답 지연 시간
    const totalTrialsPerCombination = 1; // 같은 DIV-지연시간 조합당 최대 트라이얼 횟수
    const validSections = [...sections].filter((_, index) => index !== 3); // START POINT 제외
    const maxTrials = validSections.length * responseDelays.length * totalTrialsPerCombination; // 총 트라이얼 수

    const trialCounts = {}; // 각 DIV-지연시간 조합의 트라이얼 횟수 저장
    let currentTrial = 1; // 현재 트라이얼 번호
    let scrollQueue = []; // 스크롤 입력 큐
    let isProcessing = false; // 스크롤 처리가 진행 중인지 여부
    let touchStartY = 0; // 터치 시작 위치
    let targetDivIndex, delayIndex; // 선택된 DIV와 지연 시간 인덱스
    let actualDivNumber = 0; // 실제 타겟 DIV 번호
    let scrollStopTimeout = null; // 스크롤 멈춤 확인 타이머 추가

    // 스크롤 카운터 초기화
    let totalScrollCount = 0;
    let downScrollCount = 0;
    let upScrollCount = 0;
    let reverseScrollCount = 0;
    let scrollCount = 0; // 스크롤 처리 횟수 초기화

    function endPractice() {
        alert("연습이 완료되었습니다! 이제 본 실험을 진행하세요.");
        window.location.replace("scroll.html");
    }

    function isTargetFullyVisible(target, tolerance = 1) {
        const targetTop = target.offsetTop;
        const targetBottom = targetTop + target.offsetHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;

        return (
            targetTop >= viewportTop - tolerance &&
            targetBottom <= viewportBottom + tolerance
        );
    }

    function startTrial() {
        if (currentTrial > maxTrials) {
            endPractice();
            return;
        }

        do {
            targetDivIndex = Math.floor(Math.random() * validSections.length);
            delayIndex = Math.floor(Math.random() * responseDelays.length);

            const key = `${targetDivIndex}-${responseDelays[delayIndex]}`;
            if (!trialCounts[key]) trialCounts[key] = 0;
        } while (
            trialCounts[`${targetDivIndex}-${responseDelays[delayIndex]}`] >=
            totalTrialsPerCombination
        );

        const trialKey = `${targetDivIndex}-${responseDelays[delayIndex]}`;
        trialCounts[trialKey]++;

        const delay = responseDelays[delayIndex];
        actualDivNumber = targetDivIndex < 3 ? targetDivIndex + 1 : targetDivIndex + 2;

        targetInfo.textContent = `DIV ${actualDivNumber}, 지연시간 ${delay} ms`;
        currentTrialElement.textContent = currentTrial;

        console.log(`트라이얼 ${currentTrial}: 타겟 DIV ${actualDivNumber}, 지연시간 ${delay} ms`);
        alert(`다음 목표: DIV ${actualDivNumber}로 이동하세요!`);
        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" });

        trialStartTime = Date.now();
        currentTrial++;
    }

    function processScrollQueue() {
        if (isProcessing) return;
        isProcessing = true;

        function process() {
            if (scrollQueue.length > 0) {
                const deltaY = scrollQueue.shift();

                window.scrollBy({ top: deltaY, behavior: "auto" });
                scrollCount++; // 스크롤 처리 횟수 증가

                clearTimeout(scrollStopTimeout);
                scrollStopTimeout = setTimeout(() => {
                    checkScrollStopped();
                }, 1000);

                requestAnimationFrame(process);
            } else {
                isProcessing = false;
            }
        }

        requestAnimationFrame(process);
    }

    function checkScrollStopped() {
        console.log("스크롤 속도를 확인 중...");
        if (isTargetFullyVisible(validSections[targetDivIndex])) {
            console.log(`타겟 DIV ${actualDivNumber}이 뷰포트에 완전히 보입니다. 트라이얼 성공!`);
            startTrial();
        } else {
            console.log("타겟이 뷰포트 안에 완전히 보이지 않습니다.");
        }
    }

    function handleScroll(deltaY) {
        totalScrollCount++; // 모든 스크롤 동작에 대해 총 카운트 증가

        const isTargetAbove = actualDivNumber <= 3; // 타겟이 DIV 1,2,3인지 여부
        const isScrollDown = deltaY > 0; // 현재 스크롤 방향 (아래에서 위로 스크롤: true)

        if (isScrollDown) {
            // 아래에서 위로 스크롤
            downScrollCount++; // downScroll 증가
            if (isTargetAbove) {
                reverseScrollCount++; // 위로 가야 하지만 아래로 스크롤한 경우
            }
        } else {
            // 위에서 아래로 스크롤
            upScrollCount++; // upScroll 증가
            if (!isTargetAbove) {
                reverseScrollCount++; // 아래로 가야 하지만 위로 스크롤한 경우
            }
        }

        console.log(
            `Total Scrolls: ${totalScrollCount}, Up Scrolls: ${upScrollCount}, Down Scrolls: ${downScrollCount}, Reverse Scrolls: ${reverseScrollCount}`
        );

        const delay = responseDelays[delayIndex];

        setTimeout(() => {
            scrollQueue.push(deltaY); // 지연 후 큐에 추가
            processScrollQueue(); // 큐 처리 시작
        }, delay);
    }

    const touchThreshold = 10;
    let isTouchActive = false;

    window.addEventListener("touchstart", function (event) {
        touchStartY = event.touches[0].clientY;
        isTouchActive = true;
    });

    window.addEventListener(
        "touchmove",
        function (event) {
            if (!isTouchActive) return;

            const touchEndY = event.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) > touchThreshold) {
                handleScroll(deltaY);
                touchStartY = touchEndY;
            }

            event.preventDefault();
        },
        { passive: false }
    );

    window.addEventListener("touchend", function () {
        isTouchActive = false;
    });

    window.addEventListener("touchcancel", function () {
        isTouchActive = false;
    });

    window.addEventListener(
        "wheel",
        function (event) {
            handleScroll(event.deltaY);
            event.preventDefault();
        },
        { passive: false }
    );

    startTrial();
});
