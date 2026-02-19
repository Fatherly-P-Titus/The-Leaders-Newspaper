// scripts/comments-storage.js

const CommentsStorage = (function() {
    const STORAGE_KEY = 'the_leaders_comments';
    
    /**
     * Get all comments for an article
     */
    function getArticleComments(articleId) {
        const allComments = getAllComments();
        return allComments[articleId] || [];
    }
    
    /**
     * Get all comments
     */
    function getAllComments() {
        const comments = localStorage.getItem(STORAGE_KEY);
        return comments ? JSON.parse(comments) : {};
    }
    
    /**
     * Save all comments
     */
    function saveAllComments(comments) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    }
    
    /**
     * Add a comment to an article
     */
    function addComment(articleId, commentData) {
        const allComments = getAllComments();
        
        if (!allComments[articleId]) {
            allComments[articleId] = [];
        }
        
        const comment = {
            id: generateId(),
            articleId: articleId,
            userId: commentData.userId,
            userName: commentData.userName,
            userAvatar: commentData.userAvatar || getUserInitials(commentData.userName),
            text: commentData.text,
            parentId: commentData.parentId || null,
            replies: [],
            createdAt: new Date().toISOString(),
            likes: 0,
            likedBy: []
        };
        
        if (commentData.parentId) {
            // This is a reply - find parent and add to its replies
            const parent = findComment(allComments[articleId], commentData.parentId);
            if (parent) {
                if (!parent.replies) parent.replies = [];
                parent.replies.push(comment);
            }
        } else {
            // This is a top-level comment
            allComments[articleId].push(comment);
        }
        
        saveAllComments(allComments);
        return comment;
    }
    
    /**
     * Find a comment by ID in nested structure
     */
    function findComment(comments, commentId) {
        for (let comment of comments) {
            if (comment.id === commentId) {
                return comment;
            }
            if (comment.replies && comment.replies.length > 0) {
                const found = findComment(comment.replies, commentId);
                if (found) return found;
            }
        }
        return null;
    }
    
    /**
     * Delete a comment
     */
    function deleteComment(articleId, commentId) {
        const allComments = getAllComments();
        if (!allComments[articleId]) return false;
        
        const deleteFromArray = (comments) => {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].id === commentId) {
                    comments.splice(i, 1);
                    return true;
                }
                if (comments[i].replies && comments[i].replies.length > 0) {
                    if (deleteFromArray(comments[i].replies)) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        const deleted = deleteFromArray(allComments[articleId]);
        if (deleted) {
            saveAllComments(allComments);
        }
        return deleted;
    }
    
    /**
     * Like an article
     */
    function likeArticle(articleId, userId) {
        const likesKey = `article_likes_${articleId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '{"count":0, "users":[]}');
        
        if (!likes.users.includes(userId)) {
            likes.count++;
            likes.users.push(userId);
            localStorage.setItem(likesKey, JSON.stringify(likes));
        }
        
        return likes.count;
    }
    
    /**
     * Unlike an article
     */
    function unlikeArticle(articleId, userId) {
        const likesKey = `article_likes_${articleId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '{"count":0, "users":[]}');
        
        const index = likes.users.indexOf(userId);
        if (index > -1) {
            likes.count--;
            likes.users.splice(index, 1);
            localStorage.setItem(likesKey, JSON.stringify(likes));
        }
        
        return likes.count;
    }
    
    /**
     * Check if user liked article
     */
    function userLikedArticle(articleId, userId) {
        const likesKey = `article_likes_${articleId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '{"count":0, "users":[]}');
        return likes.users.includes(userId);
    }
    
    /**
     * Get article like count
     */
    function getArticleLikes(articleId) {
        const likesKey = `article_likes_${articleId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '{"count":0, "users":[]}');
        return likes.count;
    }
    
    /**
     * Generate user initials from name
     */
    function getUserInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    /**
     * Generate unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Format date for display
     */
    function formatCommentDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    return {
        getArticleComments,
        addComment,
        deleteComment,
        likeArticle,
        unlikeArticle,
        userLikedArticle,
        getArticleLikes,
        formatCommentDate
    };
})();

window.CommentsStorage = CommentsStorage;