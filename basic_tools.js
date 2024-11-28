
document.addEventListener("DOMContentLoaded", function () {
    function balancedLatinSquare(array, participantId) {
        result = [];
        // Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
        for (var i = 0, j = 0, h = 0; i < array.length; ++i) {
            var val = 0;
            if (i < 2 || i % 2 != 0) {
                val = j++;
            } else {
                val = array.length - h - 1;
                ++h;
            }
    
            var idx = (val + participantId) % array.length;
            result.push(array[idx]);
        }
    
        if (array.length % 2 != 0 && participantId % 2 != 0) {
            result = result.reverse();
        }
    
        return result;
    }

    function generateBalancedLatinSquare(size) {
        if (size <= 0) {
            throw new Error("Size must be greater than 0");
        }
        const square = [];
        const arr = Array.from({ length: size }, (_, index) => index)
        if (size%2 == 0){
            for(let i = 0; i<size; i++){
                square.push(balancedLatinSquare(arr,i))
            }
        }
        if (size%2 != 0){
            for(let i = 0; i<size*2; i++){
                square.push(balancedLatinSquare(arr,i))
            }
        }
        return square;
    }
    

    // 이전 트라이얼 순서를 로컬 스토리지에서 가져오기
    function getPreviousLatinIndex() {
        const storedIndex = localStorage.getItem("latinIndex");
        return storedIndex !== null ? parseInt(storedIndex, 10) : 0; // 없으면 0으로 초기화
    }

    // 다음 순서를 계산하고 로컬에 저장
    function saveNextLatinIndex(currentIndex, size) {
        const nextIndex = (currentIndex + 1) % size;
        localStorage.setItem("latinIndex", nextIndex);
        return nextIndex;
    }

        // 라틴 스퀘어 초기화
    function resetLatinSquare() {
        localStorage.removeItem("latinIndex"); // 로컬 스토리지 초기화
        sessionStorage.removeItem("currentLatinOrder"); // 세션 스토리지 초기화
        alert("라틴 스퀘어 순서가 초기화되었습니다.");
        location.reload(); // 페이지 새로고침
    }

    // 라틴 스퀘어 설정 및 다음 순서 저장
    const conditionSize = 6; // 0ms ~ 200ms -> 5개의 조건
    const latinSquare = generateBalancedLatinSquare(conditionSize);

    // 이전 인덱스 가져오기
    const previousIndex = getPreviousLatinIndex(conditionSize);

    // 현재 실험에서 사용할 순서 계산
    const currentOrder = latinSquare[previousIndex];
    console.log("현재 라틴 스퀘어 순서:", currentOrder);
    console.log(latinSquare)

    // 다음 인덱스 계산 후 저장
    saveNextLatinIndex(previousIndex, conditionSize);

    // 현재 순서를 세션에 저장
    sessionStorage.setItem("currentLatinOrder", JSON.stringify(currentOrder));

    // 버튼 클릭 이벤트
    document.getElementById("startButton").addEventListener("click", function () {
        const selectedFlag = document.querySelector('input[name="flag"]:checked');
        if (!selectedFlag) {
            alert("옵션을 선택해주세요.");
            return;
        }

        const flagValue = selectedFlag.value;
        sessionStorage.setItem("experimentFlag", flagValue);

        // 플래그에 따라 다른 페이지로 이동
        const nextPage = flagValue === "1" ? "dragging task/drag.html" : "scrolling task/scroll_practice.html";
        window.location.href = nextPage;
    });

    document.getElementById("resetButton").addEventListener("click", resetLatinSquare);
});