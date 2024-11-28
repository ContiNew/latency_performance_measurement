const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
const message = overlay.querySelector('.message');
let currentTarget = null;

// 초기 설정 변수
const delays = [0, 20, 40, 60, 80, 100];
const latinSquare = [
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

// 움직임 딜레이 설정
const moveDelay = 100;
let moveQueue = [];
let isProcessingQueue = false;

// 실험 시작 버튼 클릭
startButton.addEventListener('click', () => {
    const userOrder = prompt('라틴 스퀘어 순서를 입력하세요 (1~6):');
    if (!userOrder || isNaN(userOrder) || userOrder < 1 || userOrder > 6) {
        alert('올바른 숫자를 입력하세요 (1~6).');
        return;
    }

    selectedOrder = latinSquare[userOrder - 1];
    setupTrials();
    overlay.style.display = 'none';
    startNextTrial();
});

// 8개의 타겟과 딜레이를 조합하여 24번의 실험 준비
function setupTrials() {
    const targets = Array.from(targetCircles);
    const repetitions = 3;

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
        alert('실험이 완료되었습니다!');
        return;
    }

    const currentTrial = trialQueue[currentTrialIndex];
    currentTarget = currentTrial.target;
    moveDelay = currentTrial.delay;

    // 강조 및 딜레이 설정
    highlightTarget(currentTarget);
    const delay = currentTrial.delay;
    message.textContent = `타겟: ${currentTarget.id}, 딜레이: ${delay}ms`;

    console.log(`Trial ${currentTrialIndex + 1}: Target=${currentTarget.id}, Delay=${delay}ms`);
    currentTrialIndex++;
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

    centerCircle.style.zIndex = '1'; // 드래그 중 원을 맨 위로
});

centerCircle.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    moveQueue.push({
        left: touch.clientX - offsetX,
        top: touch.clientY - offsetY,
    });

    processMoveQueue();
});

centerCircle.addEventListener('touchend', (e) => {
    e.preventDefault();
    
    resetCenterCirclePosition();

    // 오버레이 활성화
    overlay.style.display = 'flex';
    message.textContent = '준비되시면 시작 버튼을 눌러주세요.';

    // 다음 트라이얼로 넘어가기
    if (currentTarget) {
        currentTarget.classList.remove('highlight');
        startNextTrial();
    }
    
});

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

// 원 위치 중앙으로 초기화
function resetCenterCirclePosition() {
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = '50%';
    centerCircle.style.top = '50%';
    centerCircle.style.transform = 'translate(-50%, -50%)';
}