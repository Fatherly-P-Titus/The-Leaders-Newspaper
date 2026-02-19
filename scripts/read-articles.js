// scripts/read-articles.js

$(document).ready(function() {
    'use strict';
    
    // State
    let articles = [];
    let currentIndex = 0;
    let totalArticles = 0;

    let currentArticleId = null;
    let currentUserId = null;
    let currentUserName = null;
    let replyToComment = null;

    
    // Initialize
    loadArticles();
    
    // Event Listeners
    $('#prevBtn').on('click', previousArticle);
    $('#nextBtn').on('click', nextArticle);
    
    // Keyboard Navigation
    $(document).on('keydown', handleKeyPress);

    // Initialize comments system
    initCommentsSystem();
    
    // Load user session
    loadUserSession();
    
    // Setup engagement listeners
    setupEngagementListeners();

    
    /**
     * Load articles from storage
     */
    function loadArticles() {
        articles = ArticleStorage.getAll();
        totalArticles = articles.length;
        
        // Update UI based on article count
        if (totalArticles === 0) {
            showEmptyState();
        } else {
            hideEmptyState();
            updateCounter();
            loadArticle(0); // Start with first article
            updateNavigationButtons();
        }
    }
    
    /**
     * Show empty state
     */
    function showEmptyState() {
        $('#emptyState').show();
        $('#articleReader').hide();
        $('#prevBtn, #nextBtn').prop('disabled', true);
        $('.progress-container').hide();
        $('.keyboard-hint').hide();
    }
    
    /**
     * Hide empty state
     */
    function hideEmptyState() {
        $('#emptyState').hide();
        $('#articleReader').show();
        $('.progress-container').show();
        $('.keyboard-hint').show();
    }
    
    /**
     * Load article by index
     */
    function loadArticle(index) {
        if (index < 0 || index >= totalArticles) return;
        
        currentIndex = index;
        const article = articles[currentIndex];
        
        // Show loading state
        showLoading();
        
        // Simulate loading for smooth transition (remove in production)
        setTimeout(() => {
            displayArticle(article);
            updateCounter();
            updateNavigationButtons();
            updateProgress();
            hideLoading();
        }, 300);
    }
    
    /**
     * Display article content
     */
    function displayArticle(article) {
        // Set header
        $('#articleTitle').text(article.title || 'Untitled');
        $('#articleSubtitle').text(article.subtitle || '');
        $('#articleAuthor').html(`<i class="fas fa-user-circle"></i> ${article.author || 'Unknown'}`);
        $('#articleDate').html(`<i class="fas fa-calendar-alt"></i> ${article.date || 'No date'}`);
        $('#articleLayout').text(formatLayout(article.layout));
        
        // Generate poster section
        const posterHtml = generatePosterHTML(article);
        $('#posterSection').html(posterHtml);
        
        // Generate text section
        const textHtml = generateTextHTML(article);
        $('#textSection').html(textHtml);
    }
    
    /**
     * Generate poster section HTML
     */
    function generatePosterHTML(article) {
        const layout = article.layout || 'top-right';
        const imageHtml = article.image 
            ? `<img src="${article.image}" alt="${escapeHtml(article.title)}" class="responsive-img">`
            : `<div class="no-image-placeholder">
                <i class="fas fa-image fa-4x" style="opacity: 0.3;"></i>
                <p>No image</p>
               </div>`;
        
        const posterText = article.posterText || 'No poster text available...';
        
        // Determine column order based on layout
        if (layout === 'top-right') {
            // Image in col 2, text in col 1
            return `
                <div class="poster-text-cell">
                    <div class="poster-text">
                        <span class="poster-label">Lead</span>
                        <div class="poster-content">${formatText(posterText)}</div>
                    </div>
                </div>
                <div class="poster-image-cell">
                    <div class="poster-image">
                        ${imageHtml}
                    </div>
                </div>
            `;
        } else if (layout === 'top-left') {
            // Image in col 1, text in col 2
            return `
                <div class="poster-image-cell">
                    <div class="poster-image">
                        ${imageHtml}
                    </div>
                </div>
                <div class="poster-text-cell">
                    <div class="poster-text">
                        <span class="poster-label">Lead</span>
                        <div class="poster-content">${formatText(posterText)}</div>
                    </div>
                </div>
            `;
        } else {
            // Top-center: Image spans both columns
            return `
                <div class="poster-image-full" style="grid-column: 1 / -1;">
                    <div class="poster-image">
                        ${imageHtml}
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Generate text section HTML
     */
    function generateTextHTML(article) {
        const remainingText = article.remainingText || article.fullContent || '';
        
        if (!remainingText) {
            return '<p class="grey-text center">No additional content...</p>';
        }
        
        return formatText(remainingText);
    }
    
    /**
     * Format text with paragraphs
     */
    function formatText(text) {
        if (!text) return '';
        
        // Split by double newlines for paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        
        if (paragraphs.length === 0) {
            return `<p>${escapeHtml(text)}</p>`;
        }
        
        return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
    
    /**
     * Format layout name for display
     */
    function formatLayout(layout) {
        const layouts = {
            'top-right': 'Top Right',
            'top-left': 'Top Left',
            'top-center': 'Top Center'
        };
        return layouts[layout] || layout;
    }
    
    /**
     * Update article counter
     */
    function updateCounter() {
        $('#currentArticleNum').text(currentIndex + 1);
        $('#totalArticles').text(totalArticles);
        $('#readingPosition').text(`Article ${currentIndex + 1} of ${totalArticles}`);
    }
    
    /**
     * Update navigation buttons state
     */
    function updateNavigationButtons() {
        $('#prevBtn').prop('disabled', currentIndex === 0);
        $('#nextBtn').prop('disabled', currentIndex === totalArticles - 1);
    }
    
    /**
     * Update reading progress
     */
    function updateProgress() {
        const progress = ((currentIndex + 1) / totalArticles) * 100;
        $('#readingProgress').css('width', progress + '%');
    }
    
    /**
     * Navigate to previous article
     */
    function previousArticle() {
        if (currentIndex > 0) {
            // Fade out effect
            $('#articleReader').fadeOut(200, function() {
                loadArticle(currentIndex - 1);
                $(this).fadeIn(300);
            });
        }
    }
    
    /**
     * Navigate to next article
     */
    function nextArticle() {
        if (currentIndex < totalArticles - 1) {
            // Fade out effect
            $('#articleReader').fadeOut(200, function() {
                loadArticle(currentIndex + 1);
                $(this).fadeIn(300);
            });
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeyPress(e) {
        // Only if we have articles
        if (totalArticles === 0) return;
        
        // Left arrow for previous
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            previousArticle();
        }
        
        // Right arrow for next
        if (e.key === 'ArrowRight' && currentIndex < totalArticles - 1) {
            e.preventDefault();
            nextArticle();
        }
        
        // Home key for first article
        if (e.key === 'Home' && currentIndex !== 0) {
            e.preventDefault();
            $('#articleReader').fadeOut(200, function() {
                loadArticle(0);
                $(this).fadeIn(300);
            });
        }
        
        // End key for last article
        if (e.key === 'End' && currentIndex !== totalArticles - 1) {
            e.preventDefault();
            $('#articleReader').fadeOut(200, function() {
                loadArticle(totalArticles - 1);
                $(this).fadeIn(300);
            });
        }
    }
    
    /**
     * Show loading state
     */
    function showLoading() {
        $('#articleReader').addClass('loading');
    }
    
    /**
     * Hide loading state
     */
    function hideLoading() {
        $('#articleReader').removeClass('loading');
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

    // Load user info
    function loadUserInfo() {
        const session = JSON.parse(localStorage.getItem('newspaper_session') ||
            sessionStorage.getItem('newspaper_session') || 'null');

        if (session) {
            $('#userName').text(session.name.split(' ')[0]);
            $('.dropdown-trigger').dropdown();
        } else {
            // Not logged in, show login link
            $('#userMenu').attr('href', 'login.html').text('Login');
        }
    }
    
    // Handle window resize for responsive layout
    $(window).on('resize', function() {
        // Reflow columns if needed
        if ($(window).width() <= 992) {
            $('.text-section').css('column-count', '1');
        } else {
            $('.text-section').css('column-count', '2');
        }
    });


    /**
 * Load user session
 */
    function loadUserSession() {
        const session = JSON.parse(localStorage.getItem('newspaper_session') ||
            sessionStorage.getItem('newspaper_session') || 'null');

        if (session) {
            currentUserId = session.userId;
            currentUserName = session.name;
            $('#currentUserAvatar').text(getInitials(session.name));
            $('#userName').text(session.name.split(' ')[0]);
            $('.dropdown-trigger').dropdown();
        } else {
            $('#userName').text('Login');
            $('#userMenu').attr('href', 'login.html');
        }
    }

    /**
     * Get initials from name
     */
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    /**
     * Initialize comments system
     */
    function initCommentsSystem() {
        // Open comments modal
        $('#openCommentsBtn').on('click', function () {
            if (currentArticleId) {
                loadComments(currentArticleId);
                $('#commentsModal').modal('open');
            }
        });

        // Post comment
        $('#postCommentBtn').on('click', function () {
            postComment();
        });

        // Cancel reply
        $('#cancelReplyBtn').on('click', function () {
            cancelReply();
        });

        // Enter key to post (with Shift+Enter for new line)
        $('#commentInput').on('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                postComment();
            }
        });

        // Share article
        $('#shareArticleBtn').on('click', function () {
            if (currentArticleId) {
                const article = ArticleStorage.get(currentArticleId);
                if (article) {
                    $('#shareUrl').val(`${window.location.origin}/article/${currentArticleId}`);
                    $('#shareModal').modal('open');
                }
            }
        });

        // Copy link
        $('#copyLinkBtn').on('click', function () {
            const url = $('#shareUrl').val();
            navigator.clipboard.writeText(url).then(() => {
                M.toast({ html: '✓ Link copied!', classes: 'green' });
            });
        });

        // Social sharing
        $('#shareTwitter').on('click', function (e) {
            e.preventDefault();
            const article = ArticleStorage.get(currentArticleId);
            if (article) {
                const text = encodeURIComponent(`Check out "${article.title}" on The Leaders Newspaper`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
            }
        });

        $('#shareFacebook').on('click', function (e) {
            e.preventDefault();
            const url = encodeURIComponent($('#shareUrl').val());
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        });

        $('#shareLinkedin').on('click', function (e) {
            e.preventDefault();
            const url = encodeURIComponent($('#shareUrl').val());
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        });

        $('#shareEmail').on('click', function (e) {
            e.preventDefault();
            const article = ArticleStorage.get(currentArticleId);
            const subject = encodeURIComponent(`The Leaders: ${article.title}`);
            const body = encodeURIComponent(`I thought you'd enjoy this article from The Leaders Newspaper:\n\n${article.title}\n\n${$('#shareUrl').val()}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    }

    /**
     * Setup like button
     */
    function setupEngagementListeners() {
        $('#likeArticleBtn').on('click', function () {
            if (!currentUserId) {
                M.toast({ html: 'Please log in to like articles', classes: 'orange' });
                return;
            }

            const liked = CommentsStorage.userLikedArticle(currentArticleId, currentUserId);

            if (liked) {
                const newCount = CommentsStorage.unlikeArticle(currentArticleId, currentUserId);
                updateLikeButton(newCount, false);
            } else {
                const newCount = CommentsStorage.likeArticle(currentArticleId, currentUserId);
                updateLikeButton(newCount, true);
            }
        });
    }

    /**
     * Update like button state
     */
    function updateLikeButton(count, liked) {
        $('#likeCount').text(count);

        if (liked) {
            $('#likeArticleBtn').addClass('liked');
            $('#likeArticleBtn i').removeClass('far').addClass('fas');
        } else {
            $('#likeArticleBtn').removeClass('liked');
            $('#likeArticleBtn i').removeClass('fas').addClass('far');
        }
    }

    /**
     * Load comments for an article
     */
    function loadComments(articleId) {
        const comments = CommentsStorage.getArticleComments(articleId);
        const container = $('#commentsSection');

        // Update comment count
        const totalComments = countTotalComments(comments);
        $('#commentCount').text(totalComments);
        $('#modalCommentCount').text(`${totalComments} Comment${totalComments !== 1 ? 's' : ''}`);
        $('#footerCommentCount').text(`${totalComments} comment${totalComments !== 1 ? 's' : ''}`);

        if (comments.length === 0) {
            container.html(`
            <div class="empty-comments">
                <i class="far fa-comment-dots"></i>
                <h6>No comments yet</h6>
                <p class="grey-text">Be the first to share your thoughts!</p>
            </div>
        `);
            return;
        }

        let html = '';
        comments.forEach(comment => {
            html += renderComment(comment, 0);
        });

        container.html(html);

        // Attach reply handlers
        attachCommentHandlers();
    }

    /**
     * Count total comments including replies
     */
    function countTotalComments(comments) {
        let count = comments.length;
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                count += comment.replies.length;
            }
        });
        return count;
    }

    /**
     * Render a comment and its replies
     */
    function renderComment(comment, depth) {
        const timeAgo = CommentsStorage.formatCommentDate(comment.createdAt);
        const initials = comment.userAvatar || getInitials(comment.userName);

        let replyHtml = '';
        if (comment.replies && comment.replies.length > 0) {
            replyHtml = '<div class="comment-replies">';
            comment.replies.forEach(reply => {
                replyHtml += renderComment(reply, depth + 1);
            });
            replyHtml += '</div>';
        }

        const replyToHtml = comment.parentId && depth > 0 ?
            `<div class="reply-to"><i class="fas fa-reply"></i> Replying to <strong>${comment.parentName || 'previous comment'}</strong></div>` : '';

        return `
        <div class="comment-thread" data-comment-id="${comment.id}">
            <div class="comment-card">
                <div class="comment-header">
                    <div class="comment-avatar">${initials}</div>
                    <div class="comment-info">
                        <span class="comment-author">${escapeHtml(comment.userName)}</span>
                        <span class="comment-time">${timeAgo}</span>
                        ${replyToHtml}
                    </div>
                </div>
                <div class="comment-text">
                    ${escapeHtml(comment.text)}
                </div>
                <div class="comment-actions">
                    <button class="comment-action-btn reply-btn" data-comment-id="${comment.id}" data-user-name="${escapeHtml(comment.userName)}">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    ${currentUserId === comment.userId ? `
                        <button class="comment-action-btn delete-btn" data-comment-id="${comment.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
            ${replyHtml}
        </div>
    `;
    }

    /**
     * Attach reply and delete handlers
     */
    function attachCommentHandlers() {
        $('.reply-btn').on('click', function () {
            if (!currentUserId) {
                M.toast({ html: 'Please log in to reply', classes: 'orange' });
                return;
            }

            const commentId = $(this).data('comment-id');
            const userName = $(this).data('user-name');
            startReply(commentId, userName);
        });

        $('.delete-btn').on('click', function () {
            const commentId = $(this).data('comment-id');
            deleteComment(commentId);
        });
    }

    /**
     * Start reply to a comment
     */
    function startReply(commentId, userName) {
        replyToComment = {
            id: commentId,
            name: userName
        };

        $('#replyIndicator').show();
        $('#replyToName').text(userName);
        $('#commentInput').focus();
    }

    /**
     * Cancel reply
     */
    function cancelReply() {
        replyToComment = null;
        $('#replyIndicator').hide();
    }

    /**
     * Post a comment or reply
     */
    function postComment() {
        if (!currentUserId) {
            M.toast({ html: 'Please log in to comment', classes: 'orange' });
            return;
        }

        const text = $('#commentInput').val().trim();

        if (!text) {
            M.toast({ html: 'Please enter a comment', classes: 'orange' });
            return;
        }

        if (text.length > 500) {
            M.toast({ html: 'Comment too long (max 500 chars)', classes: 'orange' });
            return;
        }

        const commentData = {
            userId: currentUserId,
            userName: currentUserName,
            text: text,
            parentId: replyToComment ? replyToComment.id : null,
            parentName: replyToComment ? replyToComment.name : null
        };

        const newComment = CommentsStorage.addComment(currentArticleId, commentData);

        // Clear input and cancel reply
        $('#commentInput').val('');
        cancelReply();

        // Reload comments
        loadComments(currentArticleId);

        M.toast({ html: '✓ Comment posted!', classes: 'green' });
    }

    /**
     * Delete a comment
     */
    function deleteComment(commentId) {
        if (!confirm('Delete this comment?')) return;

        const deleted = CommentsStorage.deleteComment(currentArticleId, commentId);

        if (deleted) {
            loadComments(currentArticleId);
            M.toast({ html: '✓ Comment deleted', classes: 'green' });
        }
    }

    /**
     * Override loadArticle to store current article ID and load likes
     */
    const originalLoadArticle = loadArticle;
    loadArticle = function (index) {
        originalLoadArticle(index);

        // Get article ID
        const articles = ArticleStorage.getAll();
        if (articles[index]) {
            currentArticleId = articles[index].id;

            // Load likes
            const likeCount = CommentsStorage.getArticleLikes(currentArticleId);
            const userLiked = currentUserId ? CommentsStorage.userLikedArticle(currentArticleId, currentUserId) : false;

            $('#likeCount').text(likeCount);
            if (userLiked) {
                $('#likeArticleBtn').addClass('liked');
                $('#likeArticleBtn i').removeClass('far').addClass('fas');
            } else {
                $('#likeArticleBtn').removeClass('liked');
                $('#likeArticleBtn i').removeClass('fas').addClass('far');
            }
        }
    };

    // Helper function for escaping HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});