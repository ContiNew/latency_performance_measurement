// 초기 변수들 선언
const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
const message = overlay.querySelector('.message');
let trialQueue = [];
let currentTrialIndex = 0;

// Latin Square 배열 정의
const latinSquare = [
    [0, 20, 100, 40, 80, 60],
    [20, 40, 0, 60, 100, 80],
    [40, 60, 20, 80, 0, 100],
    [60, 80, 40, 100, 20, 0],
    [80, 100, 60, 0, 40, 20],
    [100, 0, 80, 20, 60, 40],
];

let selectedOrder = [];

// 페이지 로드 시 Latin Square 순서 입력
window.addEventListener('DOMContentLoaded', () => {
    while (true) {
        const userOrder = prompt('라틴 스퀘어 순서를 입력하세요 (1~6):');
        if (userOrder && !isNaN(userOrder) && userOrder >= 1 && userOrder <= 6) {
            selectedOrder = latinSquare[userOrder - 1];
            alert(`선택한 라틴 스퀘어 순서: ${selectedOrder.join(', ')}`);
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
    trialQueue = []; // 기존 트라이얼 초기화
    const repetitions = 3;

    // 각 타겟이 3번씩 등장하도록 설정
    for (let i = 0; i < repetitions; i++) {
        const shuffledTargets = shuffleArray(Array.from(targetCircles)); // 타겟 순서를 랜덤으로 섞음
        shuffledTargets.forEach((target) => {
            const delay = selectedOrder[trialQueue.length % selectedOrder.length]; // 딜레이 결정
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
    console.log(`Trial ${currentTrialIndex + 1}: Target = ${target.id}, Delay = ${delay}ms`);

    // 딜레이 설정 후 사용자 입력 대기
    processTargetWithDelay(target, delay);

    currentTrialIndex++;
}

// 딜레이를 적용하여 타겟을 처리
function processTargetWithDelay(target, delay) {
    setTimeout(() => {
        alert(`다음 목표: ${target.id}`);
        // 타겟 강조 표시
        target.classList.add('highlight');

        // 일정 시간이 지나면 강조 제거
        setTimeout(() => target.classList.remove('highlight'), 500);
    }, delay);
}

// 실험 종료 처리
function endExperiment() {
    overlay.style.display = 'flex';
    message.textContent = '실험이 완료되었습니다!';
}

// 원을 정중앙으로 이동시키는 함수
function resetCenterCirclePosition() {
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = '50%';
    centerCircle.style.top = '50%';
    centerCircle.style.transform = 'translate(-50%, -50%)';
    centerCircle.style.zIndex = '0';
}

// 터치 동작 지원
centerCircle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    const circleRect = centerCircle.getBoundingClientRect();
    offsetX = touch.clientX - circleRect.left;
    offsetY = touch.clientY - circleRect.top;

    centerCircle.style.zIndex = '1';
});

centerCircle.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    centerCircle.style.left = `${touch.clientX - offsetX}px`;
    centerCircle.style.top = `${touch.clientY - offsetY}px`;
    centerCircle.style.transform = 'none';
});

centerCircle.addEventListener('touchend', (e) => {
    e.preventDefault();

    // 터치 입력 종료 후 정중앙으로 이동
    resetCenterCirclePosition();

    // 오버레이 활성화
    overlay.style.display = 'flex';
    message.textContent = '준비되시면 시작 버튼을 눌러주세요.';
});