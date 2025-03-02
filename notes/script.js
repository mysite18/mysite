// パスワードとメモの管理
const correctPassword = '12345'; // 正しいパスワード
let notes = JSON.parse(localStorage.getItem('notes')) || []; // ローカルストレージからメモを読み込む
let currentNoteIndex = null; // 現在編集中のメモのインデックス

// DOM要素の取得
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const noteSection = document.getElementById('note-section');
const noteTextArea = document.getElementById('note-text');
const saveButton = document.getElementById('save-btn');
const deleteButton = document.getElementById('delete-btn');
const newNoteButton = document.getElementById('new-note-btn');
const noteListSection = document.getElementById('note-list-section');
const noteList = document.getElementById('note-list');

// パスワード入力後の処理
loginButton.addEventListener('click', function() {
    const enteredPassword = passwordInput.value;

    // パスワードが正しいか確認
    if (enteredPassword === correctPassword) {
        passwordInput.value = ''; // パスワード入力欄を空にする
        document.getElementById('password-section').style.display = 'none';
        noteListSection.style.display = 'block';
        showNoteList(); // メモの一覧を表示
    } else {
        errorMessage.style.display = 'block'; // パスワードが間違っている場合、エラーメッセージ
    }
});

// メモ一覧を表示
function showNoteList() {
    noteList.innerHTML = ''; // リストを初期化

    // メモがない場合はその旨を表示
    if (notes.length === 0) {
        noteList.innerHTML = '<li>メモはまだありません。</li>';
    } else {
        // メモのタイトルをリストに表示
        notes.forEach((note, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = note.title;
            listItem.addEventListener('click', () => editNote(index));
            noteList.appendChild(listItem);
        });
    }
}

// 新しいメモを作成
newNoteButton.addEventListener('click', function() {
    currentNoteIndex = null; // 新しいメモなのでインデックスはnull
    noteTextArea.value = ''; // テキストエリアを空にする
    saveButton.textContent = 'メモを保存'; // ボタンのラベルを変更
    deleteButton.style.display = 'none'; // 削除ボタンは表示しない
    noteSection.style.display = 'block'; // メモ作成エリアを表示
});

// メモを編集
function editNote(index) {
    currentNoteIndex = index;
    noteTextArea.value = notes[index].content; // 既存のメモの内容をテキストエリアに表示
    saveButton.textContent = '変更を保存'; // ボタンのラベルを変更
    deleteButton.style.display = 'inline'; // 削除ボタンを表示
    noteSection.style.display = 'block'; // メモ編集エリアを表示
}

// メモを保存
saveButton.addEventListener('click', function() {
    const noteContent = noteTextArea.value;
    if (currentNoteIndex === null) {
        // 新しいメモの場合
        const noteTitle = prompt('メモのタイトルを入力してください:');
        notes.push({ title: noteTitle, content: noteContent });
    } else {
        // 既存のメモの場合
        notes[currentNoteIndex].content = noteContent;
    }

    // ローカルストレージに保存
    localStorage.setItem('notes', JSON.stringify(notes));

    noteSection.style.display = 'none'; // メモ作成・編集エリアを非表示
    noteListSection.style.display = 'block'; // メモ一覧エリアを表示
    showNoteList(); // メモのリストを更新
});

// メモを削除
deleteButton.addEventListener('click', function() {
    const confirmation = confirm('本当にこのメモを削除しますか?');
    if (confirmation) {
        notes.splice(currentNoteIndex, 1); // メモを削除
        // ローカルストレージに保存
        localStorage.setItem('notes', JSON.stringify(notes));

        noteSection.style.display = 'none'; // メモ編集エリアを非表示
        noteListSection.style.display = 'block'; // メモ一覧エリアを表示
        showNoteList(); // メモのリストを更新
    }
});
