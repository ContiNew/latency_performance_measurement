document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    const responseDelays = [0, 20, 40, 60, 80, 100];
    const totalTrialsPerCombination = 3;
    const validSections = [...sections].filter((_, index) => index !== 3); // START POINT 제외
    const maxTrials = validSections.length * responseDelays.length * totalTrialsPerCombination;

    const trialData = JSON.parse(localStorage.getItem("trialData")) || [];
    const trialCounts = {};

    let currentTrial = trialData.length + 1;
    let scrollQueue = [];
    let isProcessing = false;
    let touchStartY = 0;
    let targetDivIndex, delayIndex;
    let scrollCount = 0;
    let trialStartTime = 0;
    let scrollStopTimeout = null;

    function goToResults() {
        alert("모든 트라이얼이 완료되었습니다! 결과 페이지로 이동합니다.");
        window.location.href = "../result/results.html";
    }

    function isTargetFullyVisible(target, tolerance = 1) {
        const targetTop = target.offsetTop;
        const targetBottom = targetTop + target.offsetHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;

        const isVisible =
            targetTop >= viewportTop - tolerance &&
            targetBottom <= viewportBottom + tolerance;

        console.log(
            `Checking visibility for ${target.className}: isVisible=${isVisible}, viewport=[${viewportTop}, ${viewportBottom}], target=[${targetTop}, ${targetBottom}]`
        );
        return isVisible;
    }

    let actualDivNumber = 0;

    function startTrial() {
        if (currentTrial > maxTrials) {
            goToResults();
            return;
        }
    
        // 라틴 스퀘어 순서를 세션 스토리지에서 가져옴
        const latinSquareOrder = JSON.parse(sessionStorage.getItem("currentLatinOrder"));
        if (!latinSquareOrder) {
            alert("라틴 스퀘어 순서가 설정되지 않았습니다. 이전 페이지를 확인하세요.");
            return;
        }
    
        // 현재 트라이얼에 해당하는 라틴 스퀘어의 지연 시간 인덱스 가져오기
        const trialIndex = (currentTrial - 1) % latinSquareOrder.length; // 순환적으로 인덱스를 사용
        delayIndex = latinSquareOrder[trialIndex]; // 라틴 스퀘어에 따른 지연 시간 인덱스
    
        do {
            targetDivIndex = Math.floor(Math.random() * validSections.length);
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
    
        console.log(`트라이얼 ${currentTrial}: DIV ${actualDivNumber}, 지연시간 ${delay} ms`);
    
        notifyUser(actualDivNumber);
    
        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" });
    
        trialStartTime = Date.now();
        scrollCount = 0;
        currentTrial++;
    }
    

    function notifyUser(divNumber) {
        alert(`다음 목표: DIV ${divNumber}로 이동하세요!`);
    }

    function processScrollQueue() {
        if (isProcessing) return;
        isProcessing = true;

        const delay = responseDelays[delayIndex];

        function process() {
            if (scrollQueue.length > 0) {
                const deltaY = scrollQueue.shift();

                setTimeout(() => {
                    window.scrollBy({ top: deltaY, behavior: "auto" });
                    scrollCount++;

                    clearTimeout(scrollStopTimeout);
                    scrollStopTimeout = setTimeout(() => {
                        checkScrollStopped();
                    }, 1000);

                    requestAnimationFrame(process);
                }, delay);
            } else {
                isProcessing = false;
            }
        }

        requestAnimationFrame(process);
    }

    function endTrial(success) {
        if (success) {
            const timeTaken = (Date.now() - trialStartTime) / 1000;
    
            const trialRecord = {
                trial: currentTrial - 1,
                target: `DIV ${actualDivNumber}`,
                delay: responseDelays[delayIndex],
                time: timeTaken,
                scrollCount: {
                    totalScrollCount,
                    upScrollCount,
                    downScrollCount,
                    reverseScrollCount,
                },
            };
    
            trialData.push(trialRecord);
            localStorage.setItem("trialData", JSON.stringify(trialData));
    
            // 카운트 초기화
            totalScrollCount = 0;
            upScrollCount = 0;
            downScrollCount = 0;
            reverseScrollCount = 0;
    
            startTrial();
        }
    }

    function checkScrollStopped() {
        console.log("스크롤 속도를 확인 중...");
        if (isTargetFullyVisible(validSections[targetDivIndex])) {
            console.log(`타겟 DIV ${actualDivNumber}이 뷰포트에 완전히 보입니다. 트라이얼 성공!`);
            endTrial(true);
        } else {
            console.log("타겟이 뷰포트 안에 완전히 보이지 않습니다.");
        }
    }

    let totalScrollCount = 0; // 총 스크롤 수
    let upScrollCount = 0; // 위로 스크롤
    let downScrollCount = 0; // 아래로 스크롤
    let reverseScrollCount = 0; // 반대 방향 스크롤

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

        scrollQueue.push(deltaY);
        processScrollQueue(); // 기존의 큐 처리 유지
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
