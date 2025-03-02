// パスワードとメモの管理
const correctPassword = '12345'; // 正しいパスワード
let savedNote = ''; // 保存されたメモの内容

// DOM要素の取得
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const noteSection = document.getElementById('note-section');
const noteTextArea = document.getElementById('note-text');
const saveButton = document.getElementById('save-btn');

// パスワード入力後の処理
loginButton.addEventListener('click', function() {
    const enteredPassword = passwordInput.value;

    // パスワードが正しいか確認
    if (enteredPassword === correctPassword) {
        // パスワードが正しければメモ作成エリアを表示
        passwordInput.value = ''; // パスワード入力欄を空にする
        document.getElementById('password-section').style.display = 'none';
        noteSection.style.display = 'block';
        
        // もし既に保存されているメモがあれば、その内容を表示
        if (savedNote) {
            noteTextArea.value = savedNote;
        }
    } else {
        // パスワードが間違っている場合、エラーメッセージを表示
        errorMessage.style.display = 'block';
    }
});

// メモ保存処理
saveButton.addEventListener('click', function() {
    // メモを保存
    savedNote = noteTextArea.value;
    alert('メモが保存されました!');
});
