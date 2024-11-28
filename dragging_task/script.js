document.addEventListener('DOMContentLoaded', () => {
    const latinSquare = [
        [0, 200, 100, 400, 800, 600],
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

    const startButton = document.getElementById('startButton');
    const centerCircle = document.getElementById('centerCircle');
    const allTargets = [
        "cornerTopLeft",
        "cornerTopRight",
        "cornerBottomLeft",
        "cornerBottomRight",
        "midTopLeft",
        "midTopRight",
        "midBottomLeft",
        "midBottomRight",
    ].map(id => document.getElementById(id));

    let currentTaskIndex = 0;
    const taskOrder = [];
    for (let i = 0; i < 3; i++) {
        taskOrder.push(...allTargets.map(target => target.id));
    }
    shuffleArray(taskOrder);

    console.log("랜덤 작업 순서:", taskOrder);

    startButton.disabled = false;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    let touchMoves = [];
    let delayTimeout = null;

    // 작업 시작
    startButton.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none'; // 오버레이 숨기기
        centerCircle.style.zIndex = 1;
        startNextTask();
    });

    centerCircle.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 기본 스크롤 동작 방지
        isDragging = false; // 초기 상태에서 드래그 비활성화
        touchMoves = []; // 이전 기록 초기화

        const touch = e.touches[0];
        startX = touch.clientX - centerCircle.offsetLeft;
        startY = touch.clientY - centerCircle.offsetTop;

        const delay = selectedOrder[currentTaskIndex % 6]; // delay 설정
        console.log(`현재 delay: ${delay}ms`);

        // 지연 시간 적용
        delayTimeout = setTimeout(() => {
            isDragging = true; // 지연 후 드래그 활성화
            console.log("드래그 시작");
        }, delay);
    });

    centerCircle.addEventListener('touchmove', (e) => {
        if (!isDragging) {
            const touch = e.touches[0];
            touchMoves.push({ x: touch.clientX, y: touch.clientY });
            return; // 지연 중에는 이동만 기록
        }

        e.preventDefault(); // 기본 스크롤 동작 방지
        const touch = e.touches[0];
        const moveX = touch.clientX - startX;
        const moveY = touch.clientY - startY;

        centerCircle.style.left = `${moveX}px`;
        centerCircle.style.top = `${moveY}px`;
    });

    centerCircle.addEventListener('touchend', (e) => {
        if (delayTimeout) {
            clearTimeout(delayTimeout); // delay 종료 시점 클리어
        }

        if (!isDragging) return;

        isDragging = false;
        e.preventDefault(); // 기본 스크롤 동작 방지

        const touch = e.changedTouches[0];
        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);

        const targetRect = currentTarget.getBoundingClientRect();
        const touchX = touch.clientX;
        const touchY = touch.clientY;

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

    function startNextTask() {
        if (currentTaskIndex >= taskOrder.length) {
            alert("모든 작업이 완료되었습니다!");
            return;
        }

        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);
        allTargets.forEach(target => target.classList.remove('highlight'));
        currentTarget.classList.add('highlight');

        console.log(`현재 작업: ${currentTargetId}로 이동`);
        resetCenterCirclePosition();
    }

    function resetCenterCirclePosition() {
        centerCircle.style.left = "50%";
        centerCircle.style.top = "50%";
        centerCircle.style.transform = "translate(-50%, -50%)";
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});