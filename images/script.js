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
                        link.href = URL.createObjectURL(blob);
                        link.download = `converted_image.${selectedFormat.split('/')[1]}`;
                        link.click();
                    }, selectedFormat);
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(selectedImage);
        }