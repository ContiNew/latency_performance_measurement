const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
const message = overlay.querySelector('.message');
let currentTarget = null;

// 초기 설정 변수
const latinSquare = [
    [0, 20, 40, 60, 80, 100], // 첫 번째 행 수정: 유효한 딜레이 값 추가
    [0, 20, 100, 40, 80, 60],
    [20, 40, 0, 60, 100, 80],
    [40, 60, 20, 80, 0, 100],
    [60, 80, 40, 100, 20, 0],
    [80, 100, 60, 0, 40, 20],
    [100, 0, 80, 20, 60, 40],
];

let selectedOrder = [];
let trialQueue = [];
let currentTrialIndex = 0;

// 실험 시작 버튼 클릭
startButton.addEventListener('click', () => {
    const userOrder = parseInt(prompt('라틴 스퀘어 순서를 입력하세요 (0~6):'), 10);

    if (isNaN(userOrder) || userOrder < 0 || userOrder >= latinSquare.length) {
        alert('올바른 숫자를 입력하세요 (0~6).');
        return;
    }

    // 라틴 스퀘어 순서 설정
    selectedOrder = latinSquare[userOrder];

    // 트라이얼 준비
    setupTrials();
    currentTrialIndex = 0; // 트라이얼 인덱스 초기화
    overlay.style.display = 'none'; // 오버레이 숨기기
    startNextTrial(); // 첫 트라이얼 시작
});

// 8개의 타겟과 딜레이를 조합하여 24번의 실험 준비
function setupTrials() {
    const targets = Array.from(targetCircles);
    const repetitions = 3;

    trialQueue = []; // 트라이얼 큐 초기화
    for (let i = 0; i < repetitions; i++) {
        const shuffledTargets = shuffleArray(targets); // 타겟 순서를 랜덤으로 섞음
        shuffledTargets.forEach((target) => {
            trialQueue.push({
                target: target,
                delay: selectedOrder[trialQueue.length % selectedOrder.length],
            });
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

    // 현재 트라이얼 가져오기
    const currentTrial = trialQueue[currentTrialIndex];
    currentTarget = currentTrial.target;

    // 타겟 강조
    highlightTarget(currentTarget);

    console.log(`Trial ${currentTrialIndex + 1}: Target=${currentTarget.id}, Delay=${currentTrial.delay}ms`);

    currentTrialIndex++;
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

// 타겟 강조
function highlightTarget(target) {
    targetCircles.forEach((circle) => circle.classList.remove('highlight'));
    target.classList.add('highlight');
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