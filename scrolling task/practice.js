document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    const validSections = [...sections].filter((_, index) => index !== 3); // START POINT 제외
    const responseDelays = [0, 100]; // 연습용 지연 시간 (0ms, 100ms)
    const totalTrialsPerCombination = 2; // 각 DIV-지연시간 조합당 2번씩 진행
    const maxTrials = validSections.length * responseDelays.length * totalTrialsPerCombination; // 총 24번의 트라이얼

    const trialCounts = {}; // 각 DIV-지연 시간 조합의 트라이얼 횟수 저장
    let currentTrial = 1; // 현재 트라이얼 번호
    let scrollTimer = null; // 스크롤 멈춤 확인 타이머
    let scrollCount = 0; // 스크롤 횟수
    let touchStartY = 0; // 터치 시작 위치
    let targetDivIndex, delayIndex; // 선택된 DIV와 지연 시간 인덱스
    let actualDivNumber = 0; // 실제 타겟 DIV 번호

    // 타겟이 뷰포트에 완전히 보이는지 확인
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

    // 트라이얼 시작
    function startTrial() {
        if (currentTrial > maxTrials) {
            endPractice();
            return;
        }

        // 랜덤으로 START POINT 제외한 DIV와 지연 시간 선택
        do {
            targetDivIndex = Math.floor(Math.random() * validSections.length); // 유효 섹션에서 선택
            delayIndex = Math.floor(Math.random() * responseDelays.length);

            const key = `${targetDivIndex}-${responseDelays[delayIndex]}`;
            if (!trialCounts[key]) trialCounts[key] = 0;
        } while (
            trialCounts[`${targetDivIndex}-${responseDelays[delayIndex]}`] >=
            totalTrialsPerCombination
        );

        // 선택된 조합의 트라이얼 횟수 증가
        const trialKey = `${targetDivIndex}-${responseDelays[delayIndex]}`;
        trialCounts[trialKey]++;

        const delay = responseDelays[delayIndex];

        // 실제 DIV 번호 계산
        actualDivNumber =
            targetDivIndex < 3 ? targetDivIndex + 1 : targetDivIndex + 2; // START POINT 기준 조정

        targetInfo.textContent = `DIV ${actualDivNumber}, 지연시간 ${delay} ms`;
        currentTrialElement.textContent = currentTrial;

        console.log(`트라이얼 ${currentTrial}: 타겟 DIV ${actualDivNumber}, 지연시간 ${delay} ms`);

        // 알림 메시지
        alert(`트라이얼 ${currentTrial}: 타겟은 DIV ${actualDivNumber}입니다. (지연시간: ${delay}ms)`);

        // START POINT로 스크롤 이동
        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" });

        scrollCount = 0;
    }

    // 스크롤 속도 0 확인
    function checkScrollStopped() {
        if (scrollTimer) {
            clearTimeout(scrollTimer); // 기존 타이머 초기화
        }

        scrollTimer = setTimeout(() => {
            setTimeout(() => {
                if (isTargetFullyVisible(validSections[targetDivIndex])) {
                    console.log("타겟이 뷰포트 안에 완전히 보입니다. 트라이얼 성공!");
                    currentTrial++;
                    startTrial();
                } else {
                    console.log("타겟이 뷰포트 안에 완전히 보이지 않습니다.");
                }
            }, 0); // 1000ms 대기 후 확인
        }, 1000); // 스크롤 멈춤을 감지하는 시간
    }

    function handleScroll(deltaY, delay) {
        console.log(`스크롤 입력: deltaY=${deltaY}, 지연시간 ${delay}ms`);

        setTimeout(() => {
            window.scrollBy({ top: deltaY, behavior: "instant" });
            checkScrollStopped(); // 스크롤 후 멈춤 감지
        }, delay);
    }

    function endPractice() {
        alert("연습이 완료되었습니다! 이제 본 실험을 진행하세요.");
        window.location.replace("scroll.html");
    }

    window.addEventListener("touchstart", function (event) {
        touchStartY = event.touches[0].clientY; // 터치 시작 위치 저장
    });

    window.addEventListener(
        "touchmove",
        function (event) {
            const touchEndY = event.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            const delay = responseDelays[delayIndex];
            handleScroll(deltaY, delay); // 터치 이동 거리로 스크롤 처리
            event.preventDefault();
        },
        { passive: false }
    );

    window.addEventListener(
        "wheel",
        function (event) {
            const delay = responseDelays[delayIndex];
            handleScroll(event.deltaY, delay); // 휠 이동 거리로 스크롤 처리
            event.preventDefault();
        },
        { passive: false }
    );

    startTrial(); // 첫 트라이얼 시작
});
