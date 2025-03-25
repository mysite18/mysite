const API_URL = 'https://neon-obtainable-lint.glitch.me/api/memos';
const API_URL2 = 'https://neon-obtainable-lint.glitch.me/api/validate';
const PASSWORD = '12345';  // 正しいパスワード（仮）

let currentNoteId = null;

// ログイン処理
document.getElementById('login-btn').addEventListener('click', async () => {
    const enteredPassword = document.getElementById('password').value;

    try {
        const response = await fetch(API_URL2, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: enteredPassword })
        });

        const data = await response.json();
        const TorF = data.valid;
        if (TorF) {
            document.getElementById('password-section').style.display = 'none';
            document.getElementById('note-list-section').style.display = 'block';
            loadMemos();
        } else if (!TorF){
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('error-message').style.display = 'block';
    }
});

// メモ一覧を取得
async function loadMemos() {
    try {
        const response = await fetch(API_URL);
        const memos = await response.json();
        console.log(memos);  // 追加: memosの内容を確認
        if (Array.isArray(memos)) {
            const memoList = document.getElementById('note-list');
            memoList.innerHTML = '';

            memos.forEach(memo => {
                const li = document.createElement('li');
                li.textContent = memo.title;
                li.onclick = () => editMemo(memo);
                memoList.appendChild(li);
            });
        } else {
            console.error("Received data is not an array", memos);
        }
    } catch (error) {
        console.error('Error loading memos:', error);
    }
}


// メモを保存（新規作成 or 編集）
async function saveMemo() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-text').value;

    if (!title.trim() || !content.trim()) {
        alert('タイトルと内容を入力してください');
        return;
    }

    if (currentNoteId === null) {
        // 新規作成
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
    } else {
        // 既存のメモを編集
        await fetch(`${API_URL}/${currentNoteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
    }

    currentNoteId = null;
    document.getElementById('note-section').style.display = 'none';
    loadMemos();
}

// メモを編集（タイトルと内容をセット）
function editMemo(memo) {
    currentNoteId = memo.id;
    document.getElementById('note-title').value = memo.title;
    document.getElementById('note-text').value = memo.content;
    document.getElementById('note-section').style.display = 'block';
    document.getElementById('delete-btn').style.display = 'block'; // ← メモを選択したときだけ削除ボタンを表示
}

// メモを削除
async function deleteMemo() {
    if (currentNoteId === null) return;

    if (!confirm('本当にこのメモを削除しますか？')) return;

    await fetch(`${API_URL}/${currentNoteId}`, { method: 'DELETE' });

    currentNoteId = null;
    document.getElementById('note-section').style.display = 'none';
    document.getElementById('delete-btn').style.display = 'none'; // ← 削除後にボタンを隠す
    loadMemos();
}

document.getElementById('save-btn').addEventListener('click', saveMemo);
document.getElementById('delete-btn').addEventListener('click', deleteMemo);

// 新しいメモ作成
document.getElementById('new-note-btn').addEventListener('click', () => {
    currentNoteId = null;
    document.getElementById('note-title').value = '';  // 新規作成時は空に
    document.getElementById('note-text').value = '';
    document.getElementById('note-section').style.display = 'block';
    document.getElementById('delete-btn').style.display = 'none'; // ← 新規作成時は削除ボタンを非表示
});
