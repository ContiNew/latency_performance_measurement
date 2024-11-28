const centerBox = document.getElementById('centerBox');
const cornerBoxes = document.querySelectorAll('.cornerBox');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');
let targetBox = null;

// 중앙으로 돌아가는 초기 위치 저장
const initialPosition = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
};

// 시작 버튼 클릭 시 오버레이 숨기기 및 정중앙 위치 설정, 랜덤 강조
startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    resetCenterBoxPosition();
    highlightRandomBox();
});

// 중앙 상자를 초기 위치(정중앙)로 설정
function resetCenterBoxPosition() {
    centerBox.style.position = initialPosition.position;
    centerBox.style.left = initialPosition.left;
    centerBox.style.top = initialPosition.top;
    centerBox.style.transform = initialPosition.transform;
}

// 8개의 빨간 상자 중 하나를 랜덤하게 강조
function highlightRandomBox() {
    cornerBoxes.forEach((box) => box.classList.remove('highlight'));
    targetBox = cornerBoxes[Math.floor(Math.random() * cornerBoxes.length)];
    targetBox.classList.add('highlight');
}

// 드래그 가능한 상태로 만듦
centerBox.addEventListener('mousedown', (e) => {
    e.preventDefault();

    const boxRect = centerBox.getBoundingClientRect();
    const offsetX = e.clientX - boxRect.left;
    const offsetY = e.clientY - boxRect.top;

    // 드래그 시작 시 `z-index`를 높게 설정
    centerBox.style.zIndex = '1000';

    function onMouseMove(e) {
        centerBox.style.position = 'absolute';
        centerBox.style.left = `${e.clientX - offsetX}px`;
        centerBox.style.top = `${e.clientY - offsetY}px`;
        centerBox.style.transform = 'none';
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // 드롭된 위치에서의 `centerBox` 좌표를 다시 가져옴
        const draggedRect = centerBox.getBoundingClientRect();
        const targetRect = targetBox.getBoundingClientRect();

        if (checkOverlap(draggedRect, targetRect)) {
            alert('성공');
        } else {
            alert(`실패\n\nDrag Element (centerBox) Coordinates:\nLeft: ${draggedRect.left}, Right: ${draggedRect.right}, Top: ${draggedRect.top}, Bottom: ${draggedRect.bottom}\n\nTarget Element (targetBox) Coordinates:\nLeft: ${targetRect.left}, Right: ${targetRect.right}, Top: ${targetRect.top}, Bottom: ${targetRect.bottom}`);
        }

        resetCenterBoxPosition(); // 드롭 후 중앙 위치로 돌아감
        highlightRandomBox(); // 새 타겟 강조
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// 중앙 상자와 타겟 상자가 50% 이상 겹치는지 확인
function checkOverlap(draggedRect, targetRect) {
    const overlapLeft = Math.max(draggedRect.left, targetRect.left);
    const overlapRight = Math.min(draggedRect.right, targetRect.right);
    const overlapTop = Math.max(draggedRect.top, targetRect.top);
    const overlapBottom = Math.min(draggedRect.bottom, targetRect.bottom);

    const overlapWidth = overlapRight - overlapLeft;
    const overlapHeight = overlapBottom - overlapTop;

    if (overlapWidth > 0 && overlapHeight > 0) {
        const overlapArea = overlapWidth * overlapHeight;
        const targetArea = targetRect.width * targetRect.height;

        return overlapArea >= targetArea / 2;
    }

    return false;
}