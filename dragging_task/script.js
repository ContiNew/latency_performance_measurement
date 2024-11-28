const centerCircle = document.getElementById('centerCircle');
const targetCircles = document.querySelectorAll('.cornerCircle');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
let currentTarget = null;

// 중앙으로 돌아가는 초기 위치 저장
const initialPosition = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
};

// 터치 이동을 위한 변수
let isTouching = false;
let offsetX = 0;
let offsetY = 0;

// 시작 버튼 클릭 시 오버레이 숨기기 및 초기화
startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    resetCenterCirclePosition();
    highlightRandomTarget();
});

// 중앙 원을 초기 위치(정중앙)로 설정
function resetCenterCirclePosition() {
    Object.assign(centerCircle.style, initialPosition);
    centerCircle.style.zIndex = '0'; // 드래그 종료 후 초기화
}

// 타겟 원을 랜덤하게 강조
function highlightRandomTarget() {
    targetCircles.forEach((circle) => circle.classList.remove('highlight'));
    currentTarget = targetCircles[Math.floor(Math.random() * targetCircles.length)];
    currentTarget.classList.add('highlight');
}

// 터치 동작 지원
centerCircle.addEventListener(
    'touchstart',
    (e) => {
        e.preventDefault();
        const touch = e.touches[0];

        // 원의 현재 위치와 터치 위치 간의 오프셋 계산
        const circleRect = centerCircle.getBoundingClientRect();
        offsetX = touch.clientX - circleRect.left;
        offsetY = touch.clientY - circleRect.top;

        isTouching = true;
        centerCircle.style.zIndex = '1'; // 드래그 중 원을 맨 위로
    },
    { passive: false }
);

centerCircle.addEventListener(
    'touchmove',
    (e) => {
        if (!isTouching) return;

        e.preventDefault();
        const touch = e.touches[0];

        // `requestAnimationFrame`으로 움직임 최적화
        requestAnimationFrame(() => {
            const newLeft = touch.clientX - offsetX;
            const newTop = touch.clientY - offsetY;

            centerCircle.style.left = `${newLeft}px`;
            centerCircle.style.top = `${newTop}px`;
            centerCircle.style.position = 'absolute';
            centerCircle.style.transform = 'none';
        });
    },
    { passive: false }
);

centerCircle.addEventListener(
    'touchend',
    (e) => {
        e.preventDefault();
        isTouching = false;
        prepareNextStep();
    },
    { passive: false }
);

// 다음 단계를 준비하는 함수
function prepareNextStep() {
    // 현재 강조된 원의 강조 효과 제거
    if (currentTarget) currentTarget.classList.remove('highlight');

    resetCenterCirclePosition();

    // 새로운 오버레이 메시지 표시
    overlay.style.display = 'flex';
    overlay.querySelector('.message').textContent = '다음 단계를 준비하세요.';
}