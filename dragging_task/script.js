// Latin Square 배열
const latinSquare = [
    [0, 20, 100, 40, 80, 60],
    [20, 40, 0, 60, 100, 80],
    [40, 60, 20, 80, 0, 100],
    [60, 80, 40, 100, 20, 0],
    [80, 100, 60, 0, 40, 20],
    [100, 0, 80, 20, 60, 40],
];

// 페이지 로드 시 작업 초기화
document.addEventListener('DOMContentLoaded', () => {
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
    }

    // 드래그 앤 드롭 이벤트 설정
    centerCircle.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text/plain", "centerCircle");
    });

    allTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault(); // 드롭 가능하도록 설정
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData("text/plain");

            if (draggedId === "centerCircle" && target.id === taskOrder[currentTaskIndex]) {
                console.log(`${target.id}에 성공적으로 드롭되었습니다.`);
                currentTaskIndex++;
                startNextTask();
            } else {
                alert("잘못된 타겟입니다! 올바른 타겟으로 드롭하세요.");
            }
        });
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