document.addEventListener('DOMContentLoaded', () => {
    const latinSquare = [
        [0, 50, 250, 100, 200, 150],
        [50, 100, 0, 150, 250, 200],
        [100, 150, 50, 200, 0, 250],
        [150, 200, 100, 250, 50, 0],
        [200, 250, 150, 0, 100, 50],
        [250, 0, 200, 50, 150, 100],
    ];

    let isValidInput = false;
    let selectedOrder = null;
    let initialX = 0;
    let initialY = 0;

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
    for (let i = 0; i < 10; i++) {
        taskOrder.push(...allTargets.map(target => target.id));
    }
    shuffleArray(taskOrder);

    console.log("랜덤 작업 순서:", taskOrder);

    startButton.disabled = false;

    let eventQueue = [];
    let dragEvents = [];
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
        dragEvents = []; // 이벤트 기록 초기화

        const centerRect = centerCircle.getBoundingClientRect();
        initialX = (centerRect.left + centerRect.right) / 2;
        initialY = (centerRect.top + centerRect.bottom) / 2;

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
        dragEvents.push(event); // 기록 저장
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

    function saveDragData(targetName, delay, currentTaskIndex, events, centerX, centerY, targetX, targetY, initialX, initialY, totalTime) {
        const rows = events.map(event => `${event.type},${event.x},${event.y},${event.timestamp}`);
        const csvHeader = "Type,X,Y,Timestamp";
        const summary = `End_Center_X,End_Center_Y,Target_Center_X,Target_Center_Y,Initial_X,Initial_Y,Total_Time\n${centerX},${centerY},${targetX},${targetY},${initialX},${initialY},${totalTime}`;
        const csvContent = `${csvHeader}\n${rows.join("\n")}\n\n${summary}`;
        const filename = `${targetName}_${delay}_${currentTaskIndex}.csv`;

        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function checkDropTarget(x, y) {
        const currentTargetId = taskOrder[currentTaskIndex];
        const currentTarget = document.getElementById(currentTargetId);

        const targetRect = currentTarget.getBoundingClientRect();
        const targetX = (targetRect.left + targetRect.right) / 2;
        const targetY = (targetRect.top + targetRect.bottom) / 2;

        const endTime = Date.now();
        const totalTime = endTime - dragEvents[0].timestamp;

        const centerX = x;
        const centerY = y;

        saveDragData(
            currentTargetId,
            delay,
            currentTaskIndex,
            dragEvents,
            centerX,
            centerY,
            targetX,
            targetY,
            initialX,
            initialY,
            totalTime
        );

        currentTaskIndex++;
        startNextTask();
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

        delay = selectedOrder[currentTaskIndex % 6];
        console.log(`현재 delay: ${delay}ms`);
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