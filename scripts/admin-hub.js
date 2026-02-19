// scripts/admin-hub.js

$(document).ready(function() {
    'use strict';

    // Initialize Materialize components
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton();

    // Load admin data
    loadAdminInfo();
    loadStats();
    loadRecentArticles();
    loadPendingComments();
    loadDrafts();
    updateDateTime();

    // Refresh data every 30 seconds
    setInterval(() => {
        loadStats();
        loadRecentArticles();
        loadPendingComments();
    }, 30000);

    // Update time every second
    setInterval(updateDateTime, 1000);

    /**
     * Load admin information from session
     */
    function loadAdminInfo() {
        const session = JSON.parse(localStorage.getItem('newspaper_session') || 
                                  sessionStorage.getItem('newspaper_session') || 'null');
        
        if (session && session.name) {
            $('#adminName').text(session.name.split(' ')[0]);
        } else {
            $('#adminName').text('Admin');
        }
    }

    /**
     * Update date and time
     */
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        $('#currentDateTime').text(now.toLocaleDateString('en-US', options));
    }

    /**
     * Load statistics
     */
    function loadStats() {
        const articles = ArticleStorage.getAll();
        const comments = getAllComments();
        const users = getUsers();
        
        // Calculate stats
        const totalArticles = articles.length;
        const totalUsers = users.length;
        const totalComments = countAllComments(comments);
        const totalViews = calculateTotalViews();
        
        // Update UI
        $('#totalArticles').text(totalArticles);
        $('#totalUsers').text(totalUsers);
        $('#totalComments').text(totalComments);
        $('#totalViews').text(formatNumber(totalViews));
        
        // Calculate weekly changes (simulated for now)
        updateWeeklyChanges();
    }

    /**
     * Get all users from storage
     */
    function getUsers() {
        return JSON.parse(localStorage.getItem('newspaper_users') || '[]');
    }

    /**
     * Get all comments from storage
     */
    function getAllComments() {
        return JSON.parse(localStorage.getItem('the_leaders_comments') || '{}');
    }

    /**
     * Count all comments including replies
     */
    function countAllComments(commentsObj) {
        let count = 0;
        Object.values(commentsObj).forEach(articleComments => {
            count += countCommentsInArray(articleComments);
        });
        return count;
    }

    /**
     * Count comments in array recursively
     */
    function countCommentsInArray(comments) {
        let count = comments.length;
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                count += countCommentsInArray(comment.replies);
            }
        });
        return count;
    }

    /**
     * Calculate total views (simulated)
     */
    function calculateTotalViews() {
        const articles = ArticleStorage.getAll();
        let total = 0;
        articles.forEach(article => {
            // Get likes count as a proxy for views (temporary)
            const likes = CommentsStorage.getArticleLikes(article.id);
            total += likes * 10; // Rough estimate
        });
        return total;
    }

    /**
     * Format number with K/M suffix
     */
    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    /**
     * Update weekly changes (simulated)
     */
    function updateWeeklyChanges() {
        // Random changes for demo
        $('#articlesChange').text(getRandomChange() + ' this week');
        $('#usersChange').text(getRandomChange() + ' this week');
        $('#commentsChange').text(getRandomChange() + ' this week');
        $('#viewsChange').text(getRandomChange('views') + ' this week');
    }

    /**
     * Generate random change
     */
    function getRandomChange(type = 'default') {
        const sign = Math.random() > 0.5 ? '+' : '-';
        if (type === 'views') {
            const num = Math.floor(Math.random() * 2000) + 500;
            return sign + formatNumber(num);
        }
        const num = Math.floor(Math.random() * 20) + 5;
        return sign + num;
    }

    /**
     * Load recent articles
     */
    function loadRecentArticles() {
        const articles = ArticleStorage.getAll();
        const tbody = $('#recentArticlesBody');
        
        if (articles.length === 0) {
            tbody.html('<tr><td colspan="6" class="center">No articles found</td></tr>');
            return;
        }
        
        // Get 5 most recent articles
        const recent = articles.slice(0, 5);
        let html = '';
        
        recent.forEach(article => {
            const date = new Date(article.createdAt || article.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const status = article.status || 'published';
            const statusClass = status === 'published' ? 'status-published' : 
                               status === 'draft' ? 'status-draft' : 'status-pending';
            
            html += `
                <tr data-id="${article.id}">
                    <td>${escapeHtml(article.title.substring(0, 50))}${article.title.length > 50 ? '...' : ''}</td>
                    <td>${escapeHtml(article.author)}</td>
                    <td>${escapeHtml(article.category || 'Uncategorized')}</td>
                    <td>${date}</td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit" onclick="editArticle('${article.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn view" onclick="viewArticle('${article.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteArticle('${article.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tbody.html(html);
    }

    /**
     * Load pending comments
     */
    function loadPendingComments() {
        const comments = getAllComments();
        const list = $('#pendingCommentsList');
        
        // Find all comments (simulate pending comments)
        let pending = [];
        Object.entries(comments).forEach(([articleId, articleComments]) => {
            articleComments.forEach(comment => {
                // For demo, mark some comments as pending
                if (Math.random() > 0.7) {
                    pending.push({
                        ...comment,
                        articleId
                    });
                }
            });
        });
        
        // Limit to 3 pending comments
        pending = pending.slice(0, 3);
        
        if (pending.length === 0) {
            list.html('<div class="center grey-text">No pending comments</div>');
            return;
        }
        
        let html = '';
        pending.forEach(comment => {
            const timeAgo = CommentsStorage.formatCommentDate(comment.createdAt);
            const initials = comment.userAvatar || getInitials(comment.userName);
            
            html += `
                <div class="comment-item">
                    <div class="comment-avatar">${initials}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${escapeHtml(comment.userName)}</span>
                            <span class="comment-time">${timeAgo}</span>
                        </div>
                        <div class="comment-text">${escapeHtml(comment.text.substring(0, 100))}${comment.text.length > 100 ? '...' : ''}</div>
                        <div class="comment-moderate">
                            <button class="moderate-btn approve" onclick="approveComment('${comment.id}')">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="moderate-btn reject" onclick="rejectComment('${comment.id}')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        list.html(html);
    }

    /**
     * Load draft articles
     */
    function loadDrafts() {
        const articles = ArticleStorage.getAll();
        const draftsList = $('#draftsList');
        
        // Filter drafts (for demo, mark some as drafts)
        const drafts = articles.filter((a, i) => i % 3 === 0).slice(0, 3);
        
        if (drafts.length === 0) {
            draftsList.html('<div class="center grey-text">No draft articles</div>');
            return;
        }
        
        let html = '';
        drafts.forEach(draft => {
            const date = new Date(draft.createdAt || draft.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            
            html += `
                <div class="draft-item">
                    <div class="draft-info">
                        <div class="draft-title">${escapeHtml(draft.title.substring(0, 40))}${draft.title.length > 40 ? '...' : ''}</div>
                        <div class="draft-meta">Last edited: ${date}</div>
                    </div>
                    <div class="draft-actions">
                        <button class="draft-btn" onclick="editArticle('${draft.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="draft-btn" onclick="continueEditing('${draft.id}')">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        draftsList.html(html);
    }

    /**
     * Get initials from name
     */
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose functions globally
    window.editArticle = function(id) {
        sessionStorage.setItem('editArticleId', id);
        window.location.href = `create-article.html?edit=${id}`;
    };

    window.viewArticle = function(id) {
        sessionStorage.setItem('selectedArticleId', id);
        window.location.href = 'read-articles.html';
    };

    window.deleteArticle = function(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            ArticleStorage.delete(id);
            loadRecentArticles();
            loadStats();
            M.toast({html: 'Article deleted', classes: 'green'});
        }
    };

    window.continueEditing = function(id) {
        sessionStorage.setItem('editArticleId', id);
        window.location.href = `create-article.html?edit=${id}`;
    };

    window.approveComment = function(id) {
        M.toast({html: 'Comment approved', classes: 'green'});
        loadPendingComments();
    };

    window.rejectComment = function(id) {
        M.toast({html: 'Comment rejected', classes: 'red'});
        loadPendingComments();
    };
});