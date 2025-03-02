const API_URL = 'https://neon-obtainable-lint.glitch.me/api/memos';

// メモを取得
async function loadMemos() {
    const response = await fetch(API_URL);
    const memos = await response.json();
    const memoList = document.getElementById('note-list');
    memoList.innerHTML = '';

    memos.forEach(memo => {
        const li = document.createElement('li');
        li.textContent = memo.title;
        li.onclick = () => deleteMemo(memo.id);
        memoList.appendChild(li);
    });
}

// メモを保存
async function saveMemo() {
    const title = prompt('メモのタイトルを入力してください:');
    const content = document.getElementById('note-text').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    loadMemos();
}

// メモを削除
async function deleteMemo(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    loadMemos();
}

document.getElementById('save-btn').addEventListener('click', saveMemo);
document.getElementById('new-note-btn').addEventListener('click', saveMemo);

loadMemos();
