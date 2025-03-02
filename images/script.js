document.getElementById('images').addEventListener('change', handleFileSelect);
document.getElementById('format-select').addEventListener('change', enableDownloadButton);
document.getElementById('download-btn').addEventListener('click', downloadImage);

let selectedImage = null;
let selectedFormat = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedImage = file;
        enableDownloadButton();  // 画像が選択されたらボタンを有効に
    }
}

function enableDownloadButton() {
    const formatSelect = document.getElementById('format-select');
    selectedFormat = formatSelect.value;
    const downloadBtn = document.getElementById('download-btn');

    if (selectedImage && selectedFormat) {
        downloadBtn.disabled = false;
        document.getElementById('error-message').style.display = 'none';  // エラーメッセージを隠す
    } else {
        downloadBtn.disabled = true;
        document.getElementById('error-message').style.display = 'block';  // エラーメッセージを表示
    }
}

function downloadImage() {
    if (!selectedImage || !selectedFormat) {
        return;  // 画像または形式が選択されていない場合は処理しない
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            // 画像をcanvasに描画
            ctx.drawImage(img, 0, 0);

            // 画像を選択した形式に変換してダウンロード
            canvas.toBlob(function(blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `converted_image.${selectedFormat.split('/')[1]}`;
                link.click();
            }, selectedFormat);
        };
        img.onerror = function() {
            console.error('画像の読み込みに失敗しました');
            alert('画像の読み込みに失敗しました。再度選択してください。');
        };
        img.src = event.target.result;
    };
    reader.onerror = function() {
        console.error('ファイルの読み込みに失敗しました');
        alert('ファイルの読み込みに失敗しました。再度選択してください。');
    };
    reader.readAsDataURL(selectedImage);
}
