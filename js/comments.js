import { getCurrentUser } from './auth.js';

const COMMENTS_KEY = 'codecoffee_comments';

let editingId = null;
let replyingToId = null;

export function initComments() {
    renderComments();
    document.getElementById('commentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addComment();
    });
    document.getElementById('commentsList').addEventListener('click', handleListClick);
    document.getElementById('commentsList').addEventListener('submit', (e) => {
        if (e.target.matches('form[data-reply-form]')) {
            e.preventDefault();
            submitReply(e.target.dataset.replyForm, e.target);
        }
    });
}

function getComments() {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]').map(c => ({
        ...c,
        likes: c.likes || [],
        replies: c.replies || []
    }));
}

function saveComments(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function requireUser() {
    const user = getCurrentUser();
    if (user) return user;
    alert("Bạn cần đăng nhập để đánh giá!");
    document.getElementById('loginModal').classList.add('active');
    return null;
}

function addComment() {
    const currentUser = requireUser();
    if (!currentUser) return;

    const comments = getComments();
    comments.push({
        id: Date.now().toString(),
        author: currentUser.username,
        rating: Number(document.getElementById('ratingInput').value),
        content: document.getElementById('commentInput').value,
        date: new Date().toLocaleDateString('vi-VN'),
        likes: [],
        replies: []
    });
    saveComments(comments);
    document.getElementById('commentInput').value = '';
    renderComments();
}

function submitReply(parentId, form) {
    const currentUser = requireUser();
    if (!currentUser) return;

    const input = form.querySelector('textarea');
    const content = input.value.trim();
    if (!content) {
        alert("Nội dung trả lời không được để trống!");
        return;
    }

    const comments = getComments();
    const comment = comments.find(c => c.id === parentId);
    if (!comment) return;

    comment.replies.push({
        id: Date.now().toString(),
        author: currentUser.username,
        content,
        date: new Date().toLocaleDateString('vi-VN')
    });
    saveComments(comments);
    replyingToId = null;
    renderComments();
}

function toggleLike(id) {
    const currentUser = requireUser();
    if (!currentUser) return;

    const comments = getComments();
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    const user = currentUser.username;
    comment.likes = comment.likes.includes(user)
        ? comment.likes.filter(u => u !== user)
        : [...comment.likes, user];

    saveComments(comments);
    renderComments();
}

function canModify(comment, currentUser) {
    return !!currentUser && comment.author === currentUser.username;
}

function handleListClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const { id, action } = btn.dataset;

    if (action === 'edit') {
        editingId = id;
        renderComments();
    } else if (action === 'cancel') {
        editingId = null;
        renderComments();
    } else if (action === 'save') {
        saveEdit(id);
    } else if (action === 'delete') {
        deleteComment(id);
    } else if (action === 'like') {
        toggleLike(id);
    } else if (action === 'reply') {
        replyingToId = replyingToId === id ? null : id;
        renderComments();
    }
}

function saveEdit(id) {
    const currentUser = getCurrentUser();
    const comments = getComments();
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    if (!canModify(comment, currentUser)) {
        alert("Bạn chỉ có thể sửa bình luận của mình!");
        editingId = null;
        renderComments();
        return;
    }

    const contentEl = document.getElementById(`editContent-${id}`);
    const ratingEl = document.getElementById(`editRating-${id}`);
    const content = contentEl ? contentEl.value.trim() : '';

    if (!content) {
        alert("Nội dung bình luận không được để trống!");
        return;
    }

    comment.content = content;
    if (ratingEl) comment.rating = Number(ratingEl.value);
    comment.date = new Date().toLocaleDateString('vi-VN');

    saveComments(comments);
    editingId = null;
    renderComments();
}

function deleteComment(id) {
    const currentUser = getCurrentUser();
    const comments = getComments();
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    if (!canModify(comment, currentUser)) {
        alert("Bạn chỉ có thể xoá bình luận của mình!");
        return;
    }

    if (!confirm("Bạn có chắc muốn xoá bình luận này không?")) return;

    saveComments(comments.filter(c => c.id !== id));
    if (editingId === id) editingId = null;
    if (replyingToId === id) replyingToId = null;
    renderComments();
}

function buildActionsHTML(comment, currentUser) {
    const liked = currentUser && comment.likes.includes(currentUser.username);
    const likeBtn = `
        <button type="button" class="comment-btn comment-btn--like${liked ? ' comment-btn--liked' : ''}" data-action="like" data-id="${comment.id}">
            <i class="fa-solid fa-heart"></i> Thích${comment.likes.length ? ` (${comment.likes.length})` : ''}
        </button>
    `;
    const replyBtn = `
        <button type="button" class="comment-btn comment-btn--reply" data-action="reply" data-id="${comment.id}">
            <i class="fa-solid fa-reply"></i> Trả lời
        </button>
    `;

    if (editingId === comment.id) {
        return `
            <div class="comment-actions">
                <button type="button" class="comment-btn comment-btn--save" data-action="save" data-id="${comment.id}">
                    <i class="fa-solid fa-check"></i> Lưu
                </button>
                <button type="button" class="comment-btn comment-btn--cancel" data-action="cancel" data-id="${comment.id}">
                    <i class="fa-solid fa-xmark"></i> Huỷ
                </button>
            </div>
        `;
    }

    const ownerBtns = canModify(comment, currentUser)
        ? `
            <button type="button" class="comment-btn comment-btn--edit" data-action="edit" data-id="${comment.id}">
                <i class="fa-solid fa-pen"></i> Sửa
            </button>
            <button type="button" class="comment-btn comment-btn--delete" data-action="delete" data-id="${comment.id}">
                <i class="fa-solid fa-trash"></i> Xoá
            </button>
        `
        : '';

    return `
        <div class="comment-actions">
            ${likeBtn}
            ${replyBtn}
            ${ownerBtns}
        </div>
    `;
}

function buildReplyFormHTML(comment) {
    if (replyingToId !== comment.id) return '';
    return `
        <form class="comment-reply-form" data-reply-form="${comment.id}">
            <textarea rows="2" placeholder="Trả lời ${escapeHtml(comment.author)}..." required></textarea>
            <button type="submit" class="comment-btn comment-btn--save">
                <i class="fa-solid fa-paper-plane"></i> Gửi
            </button>
        </form>
    `;
}

function buildRepliesHTML(comment) {
    if (comment.replies.length === 0) return '';
    return `
        <ul class="comment-replies">
            ${comment.replies.map(r => `
                <li class="comment-reply">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHtml(r.author)}</span>
                        <span class="comment-date">${escapeHtml(r.date)}</span>
                    </div>
                    <div class="comment-content">${escapeHtml(r.content)}</div>
                </li>
            `).join('')}
        </ul>
    `;
}

const RATING_LABELS = { 5: 'Tuyệt vời', 4: 'Rất tốt', 3: 'Bình thường', 2: 'Kém', 1: 'Tệ' };

function buildRatingOptions(value) {
    return Object.entries(RATING_LABELS)
        .map(([r, label]) => {
            const n = Number(r);
            return `<option value="${r}" ${n === value ? 'selected' : ''}>${'⭐'.repeat(n)} (${label})</option>`;
        })
        .join('');
}

function renderComments() {
    const listEl = document.getElementById('commentsList');
    const comments = getComments();
    if (comments.length === 0) {
        listEl.innerHTML = '<p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>';
        return;
    }
    const currentUser = getCurrentUser();

    listEl.innerHTML = [...comments].reverse().map(c => {
        const isEditing = editingId === c.id && canModify(c, currentUser);

        const body = isEditing
            ? `
                <div class="comment-edit">
                    <div class="rating-select">
                        <select id="editRating-${c.id}">
                            ${buildRatingOptions(c.rating)}
                        </select>
                    </div>
                    <textarea id="editContent-${c.id}" rows="3">${escapeHtml(c.content)}</textarea>
                </div>
            `
            : `
                <div class="comment-rating">${'⭐'.repeat(c.rating)}</div>
                <div class="comment-content">${escapeHtml(c.content)}</div>
            `;

        return `
        <div class="comment-item${isEditing ? ' comment-item--editing' : ''}">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(c.author)}</span>
                <span class="comment-date">${escapeHtml(c.date)}</span>
            </div>
            ${body}
            ${buildActionsHTML(c, currentUser)}
            ${buildReplyFormHTML(c)}
            ${buildRepliesHTML(c)}
        </div>
    `;
    }).join('');
}