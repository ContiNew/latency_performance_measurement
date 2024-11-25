

let isDragging = false;
let startY;
let lastScrollY;

// 마우스 다운 시 드래그 시작
document.addEventListener('mousedown', (event) => {
    isDragging = true;
    startY = event.clientY; // 마우스 클릭 위치 저장
    lastScrollY = window.scrollY; // 초기 스크롤 위치 저장
    event.preventDefault();
});

// 마우스 이동 시 스크롤
document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaY = startY - event.clientY; // 움직인 거리 계산
        window.scrollTo(0, lastScrollY + deltaY); // 스크롤 위치 상대적으로 업데이트
    }
});

// 마우스 업 시 드래그 종료
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 마우스가 창을 벗어날 때 드래그 종료
document.addEventListener('mouseleave', () => {
    isDragging = false;
});


document.addEventListener("DOMContentLoaded", function() {
    // 페이지가 열릴 때 4번째 DIV로 스크롤
    
    document.querySelector(".section4").scrollIntoView();

    const sections = [".section1", ".section2", ".section3", ".section5", ".section6", ".section7"];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    const targetDiv = document.querySelector(randomSection);
    alert(randomSection + "로 스크롤 하세요!");
    
    // 특정 DIV에 도달했는지 확인하는 함수
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {  // 화면에 요소가 들어온 경우
                alert("성공!");
                observer.unobserve(targetDiv);  // 관찰 중지
            }
        });
    }, { threshold: 1.0 });  // 요소가 100% 화면에 들어왔을 때 감지

    // 선택된 타겟 DIV 관찰 시작
    observer.observe(targetDiv);
});