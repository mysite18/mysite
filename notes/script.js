const API_URL = 'https://neon-obtainable-lint.glitch.me/api/memos';

let currentNoteId = null;

// メモを取得
async function loadMemos() {
    const response = await fetch(API_URL);
    const memos = await response.json();
    const memoList = document.getElementById('note-list');
    memoList.innerHTML = '';

    memos.forEach(memo => {
        const li = document.createElement('li');
        li.textContent = memo.title;
        li.onclick = () => editMemo(memo);
        memoList.appendChild(li);
    });
}

// メモを保存（新規作成）
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

// メモを編集
function editMemo(memo) {
    currentNoteId = memo.id;
    document.getElementById('note-title').value = memo.title;
    document.getElementById('note-text').value = memo.content;
    document.getElementById('note-section').style.display = 'block';
}

// メモを削除
async function deleteMemo() {
    if (currentNoteId === null) return;

    if (!confirm('本当にこのメモを削除しますか？')) return;

    await fetch(`${API_URL}/${currentNoteId}`, { method: 'DELETE' });

    currentNoteId = null;
    document.getElementById('note-section').style.display = 'none';
    loadMemos();
}

document.getElementById('save-btn').addEventListener('click', saveMemo);
document.getElementById('delete-btn').addEventListener('click', deleteMemo);
document.getElementById('new-note-btn').addEventListener('click', () => {
    currentNoteId = null;
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
    document.getElementById('note-section').style.display = 'block';
});

loadMemos();