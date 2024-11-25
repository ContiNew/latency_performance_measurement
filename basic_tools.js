
function startExperiment() {
    // 선택된 라디오 버튼 값 가져오기
    const selectedFlag = document.querySelector('input[name="flag"]:checked');
    if (!selectedFlag) {
        alert("옵션을 선택해주세요.");
        return;
    }
    // 플래그 값 저장 (sessionStorage 사용)
    const flagValue = selectedFlag.value;
    sessionStorage.setItem("experimentFlag", flagValue);
    // 플래그 값에 따라 다른 페이지로 이동
    if (flagValue === "1") {
        window.location.href = "dragging task/drag.html";
    } else if (flagValue === "2") {
        window.location.href = "scrolling task/scroll.html";
    }
}