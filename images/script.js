document.getElementById('image-input').addEventListener('change', handleFileSelect);
document.getElementById('format-select').addEventListener('change', enableDownloadButton);
document.getElementById('download-btn').addEventListener('click', downloadImage);

let selectedImage = null;
let selectedFormat = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedImage = file;
        enableDownloadButton();
    }
}

function enableDownloadButton() {
    const formatSelect = document.getElementById('format-select');
    selectedFormat = formatSelect.value;
    const downloadBtn = document.getElementById('download-btn');
    if (selectedImage && selectedFormat) {
        downloadBtn.disabled = false;
    } else {
        downloadBtn.disabled = true;
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
                
                // 元のファイル名から拡張子を除去
                const originalName = selectedImage.name.replace(/\.[^/.]+$/, "");
                
                // 拡張子に応じたファイル名を設定（例：a.jpg → a.png）
                const extension = selectedFormat.split('/')[1];  // jpeg -> jpg に変換
                const downloadFileName = `${originalName}.${extension}`;

                link.href = URL.createObjectURL(blob);
                link.download = downloadFileName;
                link.click();
            }, selectedFormat);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(selectedImage);
}
