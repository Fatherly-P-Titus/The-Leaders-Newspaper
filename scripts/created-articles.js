// scripts/created-articles.js

$(document).ready(function() {
    'use strict';
    
    // Initialize Materialize components
    $('.modal').modal();
    
    // Load articles
    loadArticles();
    
    // Update storage stats
    updateStorageStats();
    
    // Clear all articles
    $('#clearAllBtn').on('click', function() {
        if (ArticleStorage.getAll().length === 0) {
            M.toast({html: 'No articles to clear', classes: 'orange'});
            return;
        }
        
        if (confirm('Are you sure you want to delete ALL articles? This cannot be undone.')) {
            ArticleStorage.clearAll();
            loadArticles();
            updateStorageStats();
            M.toast({html: 'All articles cleared', classes: 'green'});
        }
    });
    
    /**
     * Load and display articles
     */
    function loadArticles() {
        const articles = ArticleStorage.getRecent(10); // Get up to 10 most recent
        const container = $('#articlesContainer');
        
        if (articles.length === 0) {
            container.html(`
                <div class="col s12 center grey-text" id="emptyState">
                    <i class="fas fa-newspaper fa-5x" style="opacity: 0.3;"></i>
                    <h5>No articles yet</h5>
                    <p>Create your first article to see it here</p>
                    <a href="create-article.html" class="btn velvet-red">
                        <i class="fas fa-plus-circle left"></i>Create Article
                    </a>
                </div>
            `);
            return;
        }
        
        let html = '';
        articles.forEach(article => {
            html += createArticleCard(article);
        });
        
        container.html(html);
        
        // Attach event handlers to cards
        attachCardHandlers();
    }
    
    /**
     * Create article card HTML
     */
    function createArticleCard(article) {
        const date = new Date(article.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const imageHtml = article.image 
            ? `<img src="${article.image}" alt="${escapeHtml(article.title)}">`
            : `<div class="card-image" style="background: linear-gradient(135deg, #8B0000 0%, #660000 100%); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-newspaper fa-4x" style="color: rgba(255,255,255,0.3);"></i>
               </div>`;
        
        const excerpt = article.posterText 
            ? article.posterText.substring(0, 120) + '...'
            : 'No content available';
        
        return `
            <div class="col s12 m6 l4 xl3">
                <div class="article-card" data-id="${article.id}">
                    <div class="card-image">
                        ${imageHtml}
                        <span class="card-badge">${article.layout.replace('-', ' ')}</span>
                    </div>
                    <div class="card-content">
                        <h6 class="card-title">${escapeHtml(article.title)}</h6>
                        ${article.subtitle ? `<div class="card-subtitle">${escapeHtml(article.subtitle)}</div>` : ''}
                        <div class="card-meta">
                            <span><i class="fas fa-user"></i> ${escapeHtml(article.author)}</span>
                            <span><i class="fas fa-calendar"></i> ${date}</span>
                        </div>
                        <div class="card-excerpt">
                            ${escapeHtml(excerpt)}
                        </div>
                    </div>
                    <div class="card-actions">
                        <a href="#" class="btn-flat view-btn" data-id="${article.id}">
                            <i class="fas fa-eye"></i> View
                        </a>
                        <a href="#" class="btn-flat edit-btn" data-id="${article.id}">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <a href="#" class="btn-flat delete-btn" data-id="${article.id}">
                            <i class="fas fa-trash"></i> Delete
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Attach event handlers to article cards
     */
    function attachCardHandlers() {
        // View article
        $('.view-btn').on('click', function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            viewArticle(id);
        });
        
        // Edit article
        $('.edit-btn').on('click', function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            editArticle(id);
        });
        
        // Delete article
        $('.delete-btn').on('click', function(e) {
            e.preventDefault();
            const id = $(this).data('id');
            confirmDelete(id);
        });
    }
    
    /**
     * View article in modal
     */
    function viewArticle(id) {
        const article = ArticleStorage.get(id);
        
        if (!article) {
            M.toast({html: 'Article not found', classes: 'red'});
            return;
        }
        
        // Set modal title
        $('#modalTitle').text(article.title);
        
        // Generate preview HTML
        const previewHtml = generatePreviewHTML(article);
        $('#modalContent').html(previewHtml);
        
        // Open modal
        $('#articleModal').modal('open');
    }
    
    /**
     * Generate preview HTML from article data
     */
    function generatePreviewHTML(article) {
        // Similar to your preview generation but simplified
        const imageHtml = article.image 
            ? `<img src="${article.image}" alt="${escapeHtml(article.title)}" style="max-width: 100%;">`
            : '<p class="grey-text">No image</p>';
        
        return `
            <div class="article-preview">
                <h1 class="preview-title">${escapeHtml(article.title)}</h1>
                ${article.subtitle ? `<h2 class="preview-subtitle">${escapeHtml(article.subtitle)}</h2>` : ''}
                <div class="preview-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(article.author)}</span>
                    <span><i class="fas fa-calendar"></i> ${article.date}</span>
                </div>
                <div class="preview-image">
                    ${imageHtml}
                </div>
                <div class="preview-content">
                    <p><strong>Poster Text:</strong> ${escapeHtml(article.posterText)}</p>
                    <p><strong>Full Content:</strong> ${escapeHtml(article.fullContent || article.remainingText)}</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Edit article
     */
    function editArticle(id) {
        // Store article ID in sessionStorage for editing
        sessionStorage.setItem('editArticleId', id);
        // Redirect to create page with edit mode
        window.location.href = `create-article.html?edit=${id}`;
    }
    
    /**
     * Confirm delete
     */
    function confirmDelete(id) {
        window.currentDeleteId = id;
        $('#confirmModal').modal('open');
        
        $('#confirmDeleteBtn').off('click').on('click', function() {
            deleteArticle(window.currentDeleteId);
        });
    }
    
    /**
     * Delete article
     */
    function deleteArticle(id) {
        ArticleStorage.delete(id);
        loadArticles();
        updateStorageStats();
        $('#confirmModal').modal('close');
        M.toast({html: 'Article deleted', classes: 'green'});
    }
    
    /**
     * Update storage statistics
     */
    function updateStorageStats() {
        const stats = ArticleStorage.stats();
        const articles = ArticleStorage.getAll();
        
        $('#articleCount').text(stats.articleCount);
        $('#storageUsed').text(stats.totalSizeKB + 'KB');
        
        const remainingMB = (stats.remainingKB / 1024).toFixed(2);
        $('#storageRemaining').text(remainingMB + 'MB');
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
});