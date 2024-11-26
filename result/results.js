document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveResultsButton");

    saveButton.addEventListener("click", function () {
        const trialData = JSON.parse(localStorage.getItem("trialData")) || [];
        if (trialData.length === 0) {
            alert("저장할 실험 결과가 없습니다.");
            return;
        }

        // JSON 데이터를 문자열로 변환
        const dataStr = JSON.stringify(trialData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });

        // 다운로드 링크 생성
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "experiment_results.json";
        a.click();

        // 메모리에서 URL 해제
        URL.revokeObjectURL(url);

        localStorage.removeItem("trialData");
        alert("실험 결과가 저장되었으며, 기존 데이터가 삭제되었습니다!");
    });
});