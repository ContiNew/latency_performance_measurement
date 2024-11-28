// 초기 변수들 선언
const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
let trialQueue = [];
let currentTrialIndex = 0;
let moveQueue = [];
let isProcessingQueue = false;
let selectedOrder = [];
let moveDelay = 0; // 딜레이는 각 트라이얼에서 설정

// Latin Square 배열 정의
const latinSquare = [
    [0, 20, 100, 40, 80, 60],
    [20, 40, 0, 60, 100, 80],
    [40, 60, 20, 80, 0, 100],
    [60, 80, 40, 100, 20, 0],
    [80, 100, 60, 0, 40, 20],
    [100, 0, 80, 20, 60, 40],
];

// 페이지 로드 시 Latin Square 순서 입력
window.addEventListener('DOMContentLoaded', () => {
    while (true) {
        const userOrder = prompt('라틴 스퀘어 순서를 입력하세요 (1~6):');
        if (userOrder && !isNaN(userOrder) && userOrder >= 1 && userOrder <= 6) {
            selectedOrder = latinSquare[userOrder - 1];
            overlay.style.display = 'flex'; // 시작 버튼 화면 표시
            break;
        } else {
            alert('올바른 숫자를 입력하세요 (1~6).');
        }
    }
});

// 시작 버튼 클릭 시 동작
startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    setupTrials(); // 트라이얼 설정
    startNextTrial(); // 첫 번째 트라이얼 시작
});

// 트라이얼 설정 함수
function setupTrials() {
    trialQueue = [];
    const repetitions = 3;

    for (let i = 0; i < repetitions; i++) {
        const shuffledTargets = shuffleArray(Array.from(targetCircles));
        shuffledTargets.forEach((target) => {
            const delay = selectedOrder[trialQueue.length % selectedOrder.length];
            trialQueue.push({ target, delay });
        });
    }
}

// 배열을 랜덤으로 섞는 함수
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 다음 트라이얼 시작
function startNextTrial() {
    if (currentTrialIndex >= trialQueue.length) {
        endExperiment();
        return;
    }

    const { target, delay } = trialQueue[currentTrialIndex];
    moveDelay = delay; // 현재 트라이얼의 딜레이 설정
    highlightTarget(target);

    // 터치 종료 시 동작 설정
    centerCircle.addEventListener('touchend', (e) => {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        moveQueue.push({
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height / 2,
        });
        processMoveQueue(); // 움직임 딜레이 처리
        resetCenterCirclePosition(); // 원을 정중앙으로 이동
        removeTargetHighlight(target); // 타겟 강조 제거
        startNextTrial(); // 다음 트라이얼로 이동
    }, { once: true });

    currentTrialIndex++;
}

// 움직임 딜레이 처리
function processMoveQueue() {
    if (isProcessingQueue || moveQueue.length === 0) return;

    isProcessingQueue = true;

    const move = moveQueue.shift();

    setTimeout(() => {
        centerCircle.style.position = 'absolute';
        centerCircle.style.left = `${move.left}px`;
        centerCircle.style.top = `${move.top}px`;
        centerCircle.style.transform = 'none';

        isProcessingQueue = false;
        if (moveQueue.length > 0) {
            processMoveQueue();
        }
    }, moveDelay);
}

// 타겟 강조 함수
function highlightTarget(target) {
    target.classList.add('highlight');
}

// 타겟 강조 제거 함수
function removeTargetHighlight(target) {
    target.classList.remove('highlight');
}

// 원을 정중앙으로 이동시키는 함수
function resetCenterCirclePosition() {
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = '50%';
    centerCircle.style.top = '50%';
    centerCircle.style.transform = 'translate(-50%, -50%)';
    centerCircle.style.zIndex = '0';
}

// 실험 종료 처리
function endExperiment() {
    overlay.style.display = 'flex';
    overlay.querySelector('.message').textContent = '실험이 완료되었습니다!';
}

// 터치 동작 지원
centerCircle.addEventListener('touchstart', (e) => {
    e.preventDefault();
});

centerCircle.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - centerCircle.offsetLeft;
    const deltaY = touch.clientY - centerCircle.offsetTop;

    centerCircle.style.left = `${centerCircle.offsetLeft + deltaX}px`;
    centerCircle.style.top = `${centerCircle.offsetTop + deltaY}px`;
});

centerCircle.addEventListener('touchend', (e) => {
    e.preventDefault();
});