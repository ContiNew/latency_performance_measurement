// 초기 변수들 선언
const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
let trialQueue = [];
let currentTrialIndex = 0;
let isTouchActive = false; // 터치 활성 상태
let touchStartX = 0; // 터치 시작 X좌표
let touchStartY = 0; // 터치 시작 Y좌표
let selectedOrder = [];

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
    highlightTarget(target);

    // 딜레이를 터치 입력과 움직임 사이에 적용
    centerCircle.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTimeout(() => moveCircle(target), delay);
        removeTargetHighlight(target); // 터치가 끝나면 강조 제거
        startNextTrial(); // 다음 트라이얼로 이동
    }, { once: true });

    currentTrialIndex++;
}

// 타겟 강조 함수
function highlightTarget(target) {
    target.classList.add('highlight');
}

// 타겟 강조 제거 함수
function removeTargetHighlight(target) {
    target.classList.remove('highlight');
}

// 원 이동 함수
function moveCircle(target) {
    const rect = target.getBoundingClientRect();
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = `${rect.left + rect.width / 2}px`;
    centerCircle.style.top = `${rect.top + rect.height / 2}px`;
}

// 실험 종료 처리
function endExperiment() {
    overlay.style.display = 'flex';
    overlay.querySelector('.message').textContent = '실험이 완료되었습니다!';
}

// 터치 동작 지원
centerCircle.addEventListener('touchstart', (e) => {
    isTouchActive = true;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

centerCircle.addEventListener('touchmove', (e) => {
    if (!isTouchActive) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    centerCircle.style.left = `${centerCircle.offsetLeft + deltaX}px`;
    centerCircle.style.top = `${centerCircle.offsetTop + deltaY}px`;

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

centerCircle.addEventListener('touchend', () => {
    isTouchActive = false;
});