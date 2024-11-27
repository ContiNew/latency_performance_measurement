document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const targetInfo = document.getElementById("targetDiv");
    const currentTrialElement = document.getElementById("currentTrial");

    const responseDelays = [0, 50, 100, 150, 200]; // 응답 지연 시간
    const totalTrialsPerCombination = 3; // 같은 DIV-지연시간 조합당 최대 트라이얼 횟수
    const validSections = [...sections].filter((_, index) => index !== 3); // START POINT 제외
    const maxTrials = validSections.length * responseDelays.length * totalTrialsPerCombination; // 총 트라이얼 수

    const trialData = JSON.parse(localStorage.getItem("trialData")) || []; // 이전 데이터 불러오기
    const trialCounts = {}; // 각 DIV-지연시간 조합의 트라이얼 횟수 저장

    let currentTrial = trialData.length + 1; // 시작할 트라이얼 번호
    let scrollQueue = []; // 스크롤 입력 큐
    let isProcessing = false; // 스크롤 처리가 진행 중인지 여부
    let touchStartY = 0; // 터치 시작 위치
    let targetDivIndex, delayIndex; // 선택된 DIV와 지연시간 인덱스
    let scrollCount = 0; // 스크롤 횟수 초기화
    let trialStartTime = 0; // 트라이얼 시작 시간 초기화
    let scrollStopTimeout = null; // 스크롤 멈춤 확인 타이머

    // 결과 페이지로 이동
    function goToResults() {
        alert("모든 트라이얼이 완료되었습니다! 결과 페이지로 이동합니다.");
        window.location.href = "../result/results.html"; // 결과 페이지 URL
    }

    function isTargetFullyVisible(target, tolerance = 1) {
        const targetTop = target.offsetTop; // 요소의 상단 위치 (문서 기준)
        const targetBottom = targetTop + target.offsetHeight; // 요소의 하단 위치
        const viewportTop = window.scrollY; // 현재 스크롤 위치
        const viewportBottom = viewportTop + window.innerHeight; // 뷰포트 하단 위치

        // 뷰포트 안에 완전히 포함되는 조건 (오차 허용)
        return (
            targetTop >= viewportTop - tolerance &&
            targetBottom <= viewportBottom + tolerance
        );
    }

    // 트라이얼 시작 함수
    let actualDivNumber = 0; // 전역 변수로 선언

    function startTrial() {
        if (currentTrial > maxTrials) {
            goToResults();
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
        actualDivNumber = targetDivIndex < 3? targetDivIndex + 1 :  targetDivIndex + 2 ; // START POINT 기준 조정
    
        targetInfo.textContent = `DIV ${actualDivNumber}, 지연시간 ${delay} ms`;
        currentTrialElement.textContent = currentTrial;
    
        console.log(`트라이얼 ${currentTrial}: DIV ${actualDivNumber}, 지연시간 ${delay} ms`);
    
        // **추가된 부분: 알림과 소리**
        notifyUser(actualDivNumber);
    
        window.scrollTo({ top: sections[3].offsetTop, behavior: "smooth" });
    
        trialStartTime = Date.now();
        currentTrial++;
    }

    // 사용자 알림 함수
    function notifyUser(divNumber) {
        // Alert 메시지
        alert(`다음 목표: DIV ${divNumber}로 이동하세요!`);
    }

    function processScrollQueue() {
        if (isProcessing) return; // 이미 스크롤 처리가 진행 중이면 종료
        isProcessing = true;

        const delay = responseDelays[delayIndex];

        const process = setInterval(() => {
            if (scrollQueue.length > 0) {
                const deltaY = scrollQueue.shift(); // 큐에서 입력을 꺼냄
                window.scrollBy({ top: deltaY, behavior: "auto" }); // 즉시 스크롤 이동

                // 스크롤 멈춤 확인 타이머 초기화
                clearTimeout(scrollStopTimeout);
                scrollStopTimeout = setTimeout(() => {
                    checkScrollStopped(); // 스크롤 멈춤 상태 확인
                }, 1000); // 멈춤 감지 대기 시간
            } else {
                clearInterval(process); // 큐가 비면 처리를 중단
                isProcessing = false;
            }
        }, delay);
    }

    function endTrial(success) {
        if (success) {
            const timeTaken = (Date.now() - trialStartTime) / 1000;
            trialData.push({
                trial: currentTrial - 1,
                target: `DIV ${actualDivNumber}`, // 전역 변수 사용
                delay: responseDelays[delayIndex],
                time: timeTaken,
                scrollCount
            });
    
            localStorage.setItem("trialData", JSON.stringify(trialData));
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
    

    function handleScroll(deltaY) {
        scrollQueue.push(deltaY); // 입력값을 큐에 추가
        processScrollQueue(); // 큐 처리 시작
    }

    const touchThreshold = 10; // 스크롤을 트리거하는 최소 이동 거리 (10px)
    let isTouchActive = false; // 터치가 활성 상태인지 여부
    
    // 터치 시작 이벤트
    window.addEventListener("touchstart", function (event) {
        touchStartY = event.touches[0].clientY; // 터치가 시작된 Y 위치 저장
        isTouchActive = true; // 터치 활성화
    });
    
    // 터치 이동 이벤트
    window.addEventListener(
        "touchmove",
        function (event) {
            if (!isTouchActive) return; // 터치가 비활성화된 상태에서는 처리하지 않음
    
            const touchEndY = event.touches[0].clientY; // 현재 터치 위치
            const deltaY = touchStartY - touchEndY; // 터치 이동 거리 계산
    
            // 이동 거리가 임계값을 초과한 경우에만 스크롤 처리
            if (Math.abs(deltaY) > touchThreshold) {
                const delay = responseDelays[delayIndex]; // 현재 지연 시간 가져오기
                handleScroll(deltaY, delay); // 터치 이동 거리로 스크롤 처리
                touchStartY = touchEndY; // 현재 위치를 새로운 시작점으로 설정
            }
    
            // 기본 동작 방지 (스크롤 이외의 터치 이벤트 방지)
            event.preventDefault();
        },
        { passive: false }
    );
    
    // 터치 종료 이벤트
    window.addEventListener("touchend", function () {
        isTouchActive = false; // 터치 비활성화
    });
    
    // 터치 취소 이벤트 (터치가 중단된 경우)
    window.addEventListener("touchcancel", function () {
        isTouchActive = false; // 터치 비활성화
    });

    window.addEventListener(
        "wheel",
        function (event) {
            handleScroll(event.deltaY); // 휠 이동 거리로 스크롤 처리
            event.preventDefault();
        },
        { passive: false }
    );

    startTrial();
});
