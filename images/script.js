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
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(selectedImage);
}
