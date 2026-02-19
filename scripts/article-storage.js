// scripts/article-storage.js
// Article Storage Manager using LocalStorage

const ArticleStorage = (function() {
    const STORAGE_KEY = 'the_leaders_articles';
    const MAX_ARTICLES = 10; // Store up to 10 recent articles
    
    /**
     * Get all stored articles
     */
    function getAllArticles() {
        const articles = localStorage.getItem(STORAGE_KEY);
        return articles ? JSON.parse(articles) : [];
    }
    
    /**
     * Save an article
     */
    function saveArticle(articleData) {
        let articles = getAllArticles();
        
        // Create article object with metadata
        const article = {
            id: generateId(),
            title: articleData.title,
            subtitle: articleData.subtitle || '',
            author: articleData.author,
            date: articleData.date,
            layout: articleData.layout,
            posterText: articleData.posterText,
            remainingText: articleData.remainingText,
            fullContent: articleData.fullContent,
            image: articleData.image, // base64 string
            imageCaption: articleData.imageCaption || '',
            styling: articleData.styling || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to beginning of array
        articles.unshift(article);
        
        // Keep only MAX_ARTICLES most recent
        if (articles.length > MAX_ARTICLES) {
            articles = articles.slice(0, MAX_ARTICLES);
        }
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
        
        return article;
    }
    
    /**
     * Get article by ID
     */
    function getArticle(id) {
        const articles = getAllArticles();
        return articles.find(article => article.id === id) || null;
    }
    
    /**
     * Update an existing article
     */
    function updateArticle(id, updatedData) {
        let articles = getAllArticles();
        const index = articles.findIndex(article => article.id === id);
        
        if (index !== -1) {
            articles[index] = {
                ...articles[index],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
            return articles[index];
        }
        
        return null;
    }
    
    /**
     * Delete an article
     */
    function deleteArticle(id) {
        let articles = getAllArticles();
        const filtered = articles.filter(article => article.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return filtered;
    }
    
    /**
     * Get recent articles (for card display)
     */
    function getRecentArticles(count = 5) {
        const articles = getAllArticles();
        return articles.slice(0, count);
    }

    function getAllArticles() {
        const articles = localStorage.getItem(STORAGE_KEY);
        return articles ? JSON.parse(articles) : [];
    }
    
    /**
     * Generate unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Clear all articles
     */
    function clearAllArticles() {
        localStorage.removeItem(STORAGE_KEY);
    }
    
    /**
     * Get storage stats
     */
    function getStorageStats() {
        const articles = getAllArticles();
        const totalSize = new Blob([JSON.stringify(articles)]).size;
        const remainingSize = 5 * 1024 * 1024 - totalSize; // 5MB limit approx
        
        return {
            articleCount: articles.length,
            totalSizeKB: Math.round(totalSize / 1024),
            remainingKB: Math.round(remainingSize / 1024)
        };
    }
    
    // Public API
    return {
        getAll: getAllArticles,
        get: getArticle,
        save: saveArticle,
        update: updateArticle,
        delete: deleteArticle,
        getRecent: getRecentArticles,
        clearAll: clearAllArticles,
        stats: getStorageStats
    };
})();

// Make globally available
window.ArticleStorage = ArticleStorage;

