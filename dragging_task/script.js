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

    let touchStartTime = 0;
    let touchMoves = [];

    // 작업 시작
    startButton.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none'; // 오버레이 숨기기
        centerCircle.style.zIndex = 1;
        startNextTask();
    });

    centerCircle.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 기본 스크롤 동작 방지
        touchStartTime = Date.now();
        touchMoves = []; // 이전 기록 초기화

        const delay = selectedOrder[currentTaskIndex % 6]; // delay 설정
        console.log(`현재 delay: ${delay}ms`);

        // 터치 시작 정보 기록
        const touch = e.touches[0];
        startX = touch.clientX - centerCircle.offsetLeft;
        startY = touch.clientY - centerCircle.offsetTop;

        // 이동 기록 시작
        document.addEventListener('touchmove', recordTouchMove);
        setTimeout(() => {
            isDragging = true;
            console.log("드래그 시작");
            replayTouchMoves();
        }, delay);
    });

    function recordTouchMove(e) {
        const touch = e.touches[0];
        const moveX = touch.clientX;
        const moveY = touch.clientY;
        const timestamp = Date.now() - touchStartTime;
        touchMoves.push({ moveX, moveY, timestamp });
    }

    function replayTouchMoves() {
        if (touchMoves.length === 0) return;

        const startTime = Date.now();
        let i = 0;

        function animate() {
            if (i >= touchMoves.length) {
                document.removeEventListener('touchmove', recordTouchMove);
                return;
            }

            const { moveX, moveY, timestamp } = touchMoves[i];
            const elapsedTime = Date.now() - startTime;

            if (elapsedTime >= timestamp) {
                centerCircle.style.left = `${moveX}px`;
                centerCircle.style.top = `${moveY}px`;
                i++;
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    document.addEventListener('touchend', (e) => {
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