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
centerCircle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    // 원의 현재 위치와 터치 위치 간의 오프셋 계산
    const circleRect = centerCircle.getBoundingClientRect();
    const offsetX = touch.clientX - circleRect.left;
    const offsetY = touch.clientY - circleRect.top;

    // 오프셋 저장
    centerCircle.dataset.offsetX = offsetX;
    centerCircle.dataset.offsetY = offsetY;

    centerCircle.style.zIndex = '1'; // 드래그 중 원을 맨 위로
});

centerCircle.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    // 터치 이동 좌표 계산
    const offsetX = parseFloat(centerCircle.dataset.offsetX);
    const offsetY = parseFloat(centerCircle.dataset.offsetY);

    // 터치한 위치를 기준으로 원의 위치 업데이트
    centerCircle.style.position = 'absolute';
    centerCircle.style.left = `${touch.clientX - offsetX}px`;
    centerCircle.style.top = `${touch.clientY - offsetY}px`;
    centerCircle.style.transform = 'none';
});

centerCircle.addEventListener('touchend', (e) => {
    e.preventDefault();
    prepareNextStep();
});

// 다음 단계를 준비하는 함수
function prepareNextStep() {
    // 현재 강조된 원의 강조 효과 제거
    if (currentTarget) currentTarget.classList.remove('highlight');

    resetCenterCirclePosition();

    // 새로운 오버레이 메시지 표시
    overlay.style.display = 'flex';
    overlay.querySelector('.message').textContent = '다음 단계를 준비하세요.';
}