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
    position: 'absolute'
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
    cornerBoxes.forEach(box => box.classList.remove('highlight'));
    targetBox = cornerBoxes[Math.floor(Math.random() * cornerBoxes.length)];
    targetBox.classList.add('highlight');
}

// 드래그 시작 (항상 중앙을 기준으로 드래그 시작)
centerBox.addEventListener('dragstart', (e) => {
    const rect = centerBox.getBoundingClientRect();
    e.dataTransfer.setData('text/plain', '');
    
    // 마우스 위치가 아닌, 항상 검은색 상자의 중앙 위치를 기준으로 드래그
    e.dataTransfer.setDragImage(centerBox, rect.width / 2, rect.height / 2);
});

// 페이지 어디에든 드롭할 수 있도록 이벤트 추가
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();

    // 드롭 위치로 `centerBox` 이동
    const offsetX = e.clientX - centerBox.offsetWidth / 2;
    const offsetY = e.clientY - centerBox.offsetHeight / 2;
    centerBox.style.left = `${offsetX}px`;
    centerBox.style.top = `${offsetY}px`;
    centerBox.style.transform = 'none';

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
});

// 중앙 상자와 타겟 상자가 50% 이상 겹치는지 확인
function checkOverlap(draggedRect, targetRect) {
    // 겹치는 영역의 좌표를 계산
    const overlapLeft = Math.max(draggedRect.left, targetRect.left);
    const overlapRight = Math.min(draggedRect.right, targetRect.right);
    const overlapTop = Math.max(draggedRect.top, targetRect.top);
    const overlapBottom = Math.min(draggedRect.bottom, targetRect.bottom);

    // 겹치는 영역의 너비와 높이를 계산
    const overlapWidth = overlapRight - overlapLeft;
    const overlapHeight = overlapBottom - overlapTop;

    // 겹치는 영역이 존재하는지 확인 (음수 또는 0이 아니어야 함)
    if (overlapWidth > 0 && overlapHeight > 0) {
        const overlapArea = overlapWidth * overlapHeight;
        const targetArea = targetRect.width * targetRect.height;
        
        return overlapArea >= targetArea / 2;
    }

    return false;
}