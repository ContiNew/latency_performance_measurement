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

    let eventQueue = [];
    let delay = 0;

    // 작업 시작
    startButton.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none'; // 오버레이 숨기기
        centerCircle.style.zIndex = 1;
        delay = selectedOrder[currentTaskIndex % 6]; // 현재 작업의 delay 설정
        console.log(`현재 delay: ${delay}ms`);
        startNextTask();
    });

    centerCircle.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 기본 스크롤 동작 방지
        eventQueue = []; // 이벤트 큐 초기화
        queueEvent('start', e.touches[0]);
    });

    centerCircle.addEventListener('touchmove', (e) => {
        e.preventDefault(); // 기본 스크롤 동작 방지
        queueEvent('move', e.touches[0]);
    });

    centerCircle.addEventListener('touchend', (e) => {
        e.preventDefault(); // 기본 스크롤 동작 방지
        queueEvent('end', e.changedTouches[0]);
    });

    function queueEvent(type, touch) {
        const event = {
            type,
            x: touch.clientX,
            y: touch.clientY,
            timestamp: Date.now(),
        };
        eventQueue.push(event);

        setTimeout(() => {
            processEvent(event);
        }, delay);
    }

    function processEvent(event) {
        switch (event.type) {
            case 'start':
                console.log("드래그 시작");
                break;
            case 'move':
                centerCircle.style.left = `${event.x}px`;
                centerCircle.style.top = `${event.y}px`;
                break;
            case 'end':
                console.log("드래그 종료");
                checkDropTarget(event.x, event.y);
                break;
        }
    }

    function checkDropTarget(x, y) {
        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);

        const targetRect = currentTarget.getBoundingClientRect();

        if (
            x >= targetRect.left &&
            x <= targetRect.right &&
            y >= targetRect.top &&
            y <= targetRect.bottom
        ) {
            console.log(`${currentTargetId}에 성공적으로 드롭되었습니다.`);
            currentTaskIndex++;
            startNextTask();
        } else {
            alert("잘못된 타겟입니다! 올바른 타겟으로 드롭하세요.");
        }
    }

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