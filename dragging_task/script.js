document.addEventListener('DOMContentLoaded', () => {
    // Latin Square 배열
    const latinSquare = [
        [0, 20, 100, 40, 80, 60],
        [20, 40, 0, 60, 100, 80],
        [40, 60, 20, 80, 0, 100],
        [60, 80, 40, 100, 20, 0],
        [80, 100, 60, 0, 40, 20],
        [100, 0, 80, 20, 60, 40],
    ];

    let isValidInput = false;
    let selectedOrder = null;

    // Latin Square 입력
    while (!isValidInput) {
        let userInput = prompt("1부터 6 사이의 숫자를 입력하세요.");
        userInput = parseInt(userInput);

        if (userInput >= 1 && userInput <= 6) {
            selectedOrder = latinSquare[userInput - 1];
            console.log("선택된 Latin Square 순서:", selectedOrder);
            isValidInput = true;
        } else {
            alert("유효하지 않은 입력입니다. 1부터 6 사이의 숫자를 입력하세요.");
        }
    }

    // 시작 버튼 활성화
    const startButton = document.getElementById('startButton');
    startButton.disabled = false;

    // 작업 관련 변수 초기화
    let currentTaskIndex = 0; // 현재 작업 인덱스
    const targets = [
        "cornerTopLeft",
        "cornerTopRight",
        "cornerBottomLeft",
        "cornerBottomRight",
        "midTopLeft",
        "midTopRight",
        "midBottomLeft",
        "midBottomRight",
    ];

    // 작업 순서 랜덤 생성
    const taskOrder = [];
    for (let i = 0; i < 3; i++) {
        taskOrder.push(...targets);
    }
    shuffleArray(taskOrder);

    console.log("랜덤 작업 순서:", taskOrder);

    const centerCircle = document.getElementById('centerCircle');
    const allTargets = targets.map(id => document.getElementById(id));

    // 작업 진행 함수
    function startNextTask() {
        if (currentTaskIndex >= taskOrder.length) {
            alert("모든 작업이 완료되었습니다!");
            return;
        }
    
        // 현재 타겟 하이라이트
        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);
        allTargets.forEach(target => target.classList.remove('highlight'));
        currentTarget.classList.add('highlight');
    
        console.log(`현재 작업: ${currentTargetId}로 이동`);
    
        // centerCircle 위치 리셋
        resetCenterCirclePosition();
    }
    
    function resetCenterCirclePosition() {
        centerCircle.style.left = "50%";
        centerCircle.style.top = "50%";
        centerCircle.style.transform = "translate(-50%, -50%)";
    }

    // 터치 이동 변수
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // 터치 이벤트 등록
    centerCircle.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX - centerCircle.offsetLeft;
        startY = touch.clientY - centerCircle.offsetTop;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const moveX = touch.clientX - startX;
        const moveY = touch.clientY - startY;

        // centerCircle 이동
        centerCircle.style.left = `${moveX}px`;
        centerCircle.style.top = `${moveY}px`;
    });

    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // 현재 위치와 타겟 위치 비교
        const touch = e.changedTouches[0];
        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);

        const targetRect = currentTarget.getBoundingClientRect();
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // 타겟 영역 확인
        if (
            touchX >= targetRect.left &&
            touchX <= targetRect.right &&
            touchY >= targetRect.top &&
            touchY <= targetRect.bottom
        ) {
            console.log(`${currentTargetId}에 성공적으로 드롭되었습니다.`);
            currentTaskIndex++;
            startNextTask();
        } else {
            alert("잘못된 타겟입니다! 올바른 타겟으로 드롭하세요.");
        }
    });

    // 배열 섞기 유틸리티 함수
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 첫 작업 시작
    startButton.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none'; // 오버레이 숨기기
        startNextTask();
    });
});