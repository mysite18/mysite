let selectedImage = null;
let selectedFormat = null;

// 画像選択時
document.getElementById('images').addEventListener('change', handleFileSelect);
document.getElementById('format-select').addEventListener('change', enableDownloadButton);
document.getElementById('download-btn').addEventListener('click', downloadImage);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedImage = file;
        console.log('選択された画像:', selectedImage);  // デバッグ
        enableDownloadButton();
    }
}

function enableDownloadButton() {
    const formatSelect = document.getElementById('format-select');
    selectedFormat = formatSelect.value;
    console.log('選択された形式:', selectedFormat);  // デバッグ
    const downloadBtn = document.getElementById('download-btn');
    const errorMessage = document.getElementById('error-message');

    // 画像と形式が選択されていればボタンを有効化、エラーメッセージを非表示にする
    if (selectedImage && selectedFormat) {
        downloadBtn.disabled = false;
        errorMessage.style.display = 'none'; // エラーメッセージ非表示
    } else {
        downloadBtn.disabled = true;
        errorMessage.style.display = 'block'; // エラーメッセージ表示
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

            // JPG選択時にはJPEGとして処理
            let formatToUse = selectedFormat;
            if (selectedFormat === 'image/jpg') {
                formatToUse = 'image/jpeg'; // JPGはJPEGに変換
            }

            // 画像を選択した形式に変換してダウンロード
            canvas.toBlob(function(blob) {
                const link = document.createElement('a');

                // 元のファイル名から拡張子を除去
                const originalName = selectedImage.name.replace(/\.[^/.]+$/, "");

                // 拡張子を適切に設定（選択された形式がjpgの場合はjpgにする）
                const extension = selectedFormat.split('/')[1] === 'jpg' ? 'jpg' : selectedFormat.split('/')[1];
                const downloadFileName = `${originalName}.${extension}`;

                link.href = URL.createObjectURL(blob);
                link.download = downloadFileName;
                link.click();
            }, formatToUse);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(selectedImage);
}
