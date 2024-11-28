const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
let trialQueue = []; // 전체 task를 저장
let currentTrialIndex = 0;

// 라틴 스퀘어 정의
const latinSquare = [
    [0, 20, 40, 60, 80, 100],
    [0, 20, 100, 40, 80, 60],
    [20, 40, 0, 60, 100, 80],
    [40, 60, 20, 80, 0, 100],
    [60, 80, 40, 100, 20, 0],
    [80, 100, 60, 0, 40, 20],
    [100, 0, 80, 20, 60, 40],
];

// 실험 시작 버튼 클릭
startButton.addEventListener('click', () => {
    const userOrder = parseInt(prompt('라틴 스퀘어 순서를 입력하세요 (0~6):'), 10);

    if (isNaN(userOrder) || userOrder < 0 || userOrder >= latinSquare.length) {
        alert('올바른 숫자를 입력하세요 (0~6).');
        return;
    }

    setupTrials(latinSquare[userOrder]); // 선택된 라틴 스퀘어 순서로 task 준비
    currentTrialIndex = 0; // 트라이얼 인덱스 초기화
    overlay.style.display = 'none'; // 오버레이 숨기기
    startNextTrial(); // 첫 트라이얼 시작
});

// 24개의 task 준비 (8개의 타겟 × 3번 반복, 라틴 스퀘어 순서 적용)
function setupTrials(delayOrder) {
    const targets = Array.from(targetCircles);
    trialQueue = []; // 트라이얼 큐 초기화

    for (let i = 0; i < 3; i++) { // 3번 반복
        const shuffledTargets = shuffleArray([...targets]); // 타겟 랜덤 순서
        shuffledTargets.forEach((target, index) => {
            trialQueue.push({
                target: target,
                delay: delayOrder[index % delayOrder.length], // 선택된 delay 순서 반복 적용
            });
        });
    }
}

// 배열을 랜덤으로 섞는 함수
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 다음 task 시작
function startNextTrial() {
    if (currentTrialIndex >= trialQueue.length) {
        endExperiment();
        return;
    }

    // 현재 task 가져오기
    const currentTrial = trialQueue[currentTrialIndex];
    const { target, delay } = currentTrial;

    // 타겟 강조
    highlightTarget(target);

    console.log(`Trial ${currentTrialIndex + 1}: Target=${target.id}, Delay=${delay}ms`);

    // Delay 적용 (단순히 로그로 출력하거나 실제 적용 가능)
    setTimeout(() => {
        currentTrialIndex++;
        startNextTrial();
    }, delay); // delay 이후 다음 task 진행
}

// 실험 종료 처리
function endExperiment() {
    overlay.style.display = 'flex';
    overlay.querySelector('.message').textContent = '실험이 완료되었습니다!';
}

// 타겟 강조
function highlightTarget(target) {
    targetCircles.forEach((circle) => circle.classList.remove('highlight'));
    target.classList.add('highlight');
}

// 터치 입력 처리
centerCircle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = centerCircle.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    centerCircle.style.zIndex = '1';

    function onTouchMove(e) {
        e.preventDefault();
        const moveTouch = e.touches[0];
        centerCircle.style.left = `${moveTouch.clientX - offsetX}px`;
        centerCircle.style.top = `${moveTouch.clientY - offsetY}px`;
        centerCircle.style.transform = 'none';
    }

    function onTouchEnd(e) {
        e.preventDefault();
        centerCircle.style.zIndex = '0';
        resetCenterCirclePosition();
        overlay.style.display = 'flex'; // 다음 task 준비
        centerCircle.removeEventListener('touchmove', onTouchMove);
        centerCircle.removeEventListener('touchend', onTouchEnd);
    }

    centerCircle.addEventListener('touchmove', onTouchMove);
    centerCircle.addEventListener('touchend', onTouchEnd);
});

// 원을 정중앙으로 이동시키는 함수
function resetCenterCirclePosition() {
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = '50%';
    centerCircle.style.top = '50%';
    centerCircle.style.transform = 'translate(-50%, -50%)';
}