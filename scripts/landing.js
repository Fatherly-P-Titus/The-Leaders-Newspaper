// scripts/landing.js

$(document).ready(function() {
    'use strict';

    // Initialize Materialize components
    initMaterialize();
    
    // Load articles from storage
    loadPublishedArticles();
    
    // Setup navigation scroll effects
    setupNavigation();
    
    // Setup back to top button
    setupBackToTop();
    
    // Setup poster carousel
    setupPosterCarousel();
    
    // Setup subscribe form
    setupSubscribeForm();
    
    /**
     * Initialize Materialize components
     */
    function initMaterialize() {
        // Initialize sidenav (mobile menu)
        $('.sidenav').sidenav({
            draggable: true
        });
        
        // Initialize tabs
        $('.tabs').tabs({
            swipeable: true,
            responsiveThreshold: 600
        });
        
        // Tab change event
        $('.tabs').on('click', 'a', function(e) {
            e.preventDefault();
            const category = $(this).text().toLowerCase();
            filterArticles(category);
        });
    }
    
    /**
     * Load published articles from ArticleStorage
     */
    function loadPublishedArticles() {
        const articles = ArticleStorage.getAll();
        
        if (articles.length === 0) {
            showEmptyState();
            return;
        }
        
        // Load featured article (most recent)
        loadFeaturedArticle(articles[0]);
        
        // Load article grid (next 5 articles)
        loadArticleGrid(articles.slice(1, 6));
    }
    
    /**
     * Load featured article
     */
    function loadFeaturedArticle(article) {
        if (!article) return;
        
        const date = new Date(article.createdAt || article.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        const imageHtml = article.image 
            ? `url('${article.image}')` 
            : 'url("assets/posters/placeholder-cover.jpg")';
        
        const featuredHtml = `
            <div class="featured-content">
                <div class="featured-image" style="background-image: ${imageHtml}">
                    <span class="featured-badge">Latest Edition</span>
                </div>
                <div class="featured-text">
                    <div class="featured-category">${article.layout?.replace('-', ' ') || 'Featured'}</div>
                    <h3 class="featured-title">${escapeHtml(article.title)}</h3>
                    ${article.subtitle ? `<p class="featured-excerpt">${escapeHtml(article.subtitle)}</p>` : ''}
                    <div class="featured-meta">
                        <span><i class="fas fa-user-circle"></i> ${escapeHtml(article.author)}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${escapeHtml(date)}</span>
                    </div>
                    <a href="read-articles.html" class="btn velvet-red waves-effect">
                        <i class="fas fa-book-open left"></i>Read Full Article
                    </a>
                </div>
            </div>
        `;
        
        $('#featuredArticle').html(featuredHtml);
    }
    
    /**
     * Load article grid
     */
    function loadArticleGrid(articles) {
        if (articles.length === 0) {
            $('#articlesGrid').html(`
                <div class="col s12 center">
                    <p class="grey-text">No more articles to display</p>
                </div>
            `);
            return;
        }
        
        let gridHtml = '';
        
        articles.forEach(article => {
            const date = new Date(article.createdAt || article.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            const imageHtml = article.image 
                ? `<img src="${article.image}" alt="${escapeHtml(article.title)}">` 
                : `<div class="card-image" style="background: linear-gradient(135deg, #8B0000 0%, #660000 100%); display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-newspaper fa-3x" style="color: rgba(255,255,255,0.3);"></i>
                   </div>`;
            
            const excerpt = article.posterText 
                ? article.posterText.substring(0, 120) + '...' 
                : 'Click to read this article';
            
            gridHtml += `
                <div class="col s12 m6 l4">
                    <div class="article-card" data-id="${article.id}">
                        <div class="card-image">
                            ${imageHtml}
                            <span class="card-category">${article.layout?.replace('-', ' ') || 'Article'}</span>
                        </div>
                        <div class="card-content">
                            <h5 class="card-title">${escapeHtml(article.title)}</h5>
                            <p class="card-excerpt">${escapeHtml(excerpt)}</p>
                            <div class="card-meta">
                                <span><i class="fas fa-user"></i> ${escapeHtml(article.author)}</span>
                                <span><i class="fas fa-clock"></i> ${escapeHtml(date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#articlesGrid').html(gridHtml);
        
        // Make cards clickable
        $('.article-card').on('click', function() {
            const articleId = $(this).data('id');
            // Store article ID in session storage and navigate to read page
            sessionStorage.setItem('selectedArticleId', articleId);
            window.location.href = 'read-articles.html';
        });
    }
    
    /**
     * Filter articles by category
     */
    function filterArticles(category) {
        const articles = ArticleStorage.getAll();
        
        if (category === 'all') {
            loadArticleGrid(articles.slice(1, 6));
            return;
        }
        
        // Filter by category (simplified - you'd need category field in articles)
        const filtered = articles.filter(a => 
            a.title?.toLowerCase().includes(category) || 
            a.subtitle?.toLowerCase().includes(category)
        );
        
        if (filtered.length > 0) {
            loadArticleGrid(filtered.slice(0, 5));
        } else {
            $('#articlesGrid').html(`
                <div class="col s12 center">
                    <p class="grey-text">No articles found in ${category}</p>
                </div>
            `);
        }
    }
    
    /**
     * Show empty state when no articles
     */
    function showEmptyState() {
        $('#featuredArticle').html(`
            <div class="card-panel grey lighten-4 center">
                <i class="fas fa-newspaper fa-4x" style="color: #8B0000; opacity: 0.3;"></i>
                <h5>No Articles Yet</h5>
                <p class="grey-text">Check back soon for latest news</p>
            </div>
        `);
        
        $('#articlesGrid').html(`
            <div class="col s12 center">
                <p class="grey-text">No articles to display</p>
            </div>
        `);
    }
    
    /**
     * Setup navigation scroll effects
     */
    function setupNavigation() {
        const nav = $('#mainNav');
        
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 100) {
                nav.addClass('nav-shrink');
            } else {
                nav.removeClass('nav-shrink');
            }
            
            // Update active menu based on scroll position
            updateActiveMenu();
        });
        
        // Smooth scroll for navigation links
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 800);
            }
        });
    }
    
    /**
     * Update active menu based on scroll position
     */
    function updateActiveMenu() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('section').each(function() {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionBottom = sectionTop + section.outerHeight();
            const sectionId = section.attr('id');
            
            if (sectionId && scrollPos >= sectionTop && scrollPos < sectionBottom) {
                $(`nav a[href="#${sectionId}"]`).parent().addClass('active');
            } else if (sectionId) {
                $(`nav a[href="#${sectionId}"]`).parent().removeClass('active');
            }
        });
    }
    
    /**
     * Setup back to top button
     */
    function setupBackToTop() {
        const backToTop = $('.back-to-top');
        
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 500) {
                backToTop.addClass('show');
            } else {
                backToTop.removeClass('show');
            }
        });
    }
    
    /**
     * Setup poster carousel
     */
    function setupPosterCarousel() {
        const posters = [
            'magazine-cover-1.jpg',
            'magazine-cover-2.jpg',
            'magazine-cover-3.jpg'
        ];
        
        let currentPoster = 0;
        
        // Update poster counter
        function updatePosterCounter() {
            $('.poster-counter').text(`${currentPoster + 1} / ${posters.length}`);
        }
        
        // Change poster image
        function changePoster(direction) {
            if (direction === 'next') {
                currentPoster = (currentPoster + 1) % posters.length;
            } else {
                currentPoster = (currentPoster - 1 + posters.length) % posters.length;
            }
            
            $('#magazineCover').fadeOut(300, function() {
                $(this).attr('src', `assets/posters/${posters[currentPoster]}`).fadeIn(300);
            });
            
            updatePosterCounter();
        }
        
        // Event listeners
        $('.next-poster').on('click', function() {
            changePoster('next');
        });
        
        $('.prev-poster').on('click', function() {
            changePoster('prev');
        });
        
        // Auto-rotate every 5 seconds
        setInterval(function() {
            changePoster('next');
        }, 5000);
    }
    
    /**
     * Setup subscribe form
     */
    function setupSubscribeForm() {
        $('#subscribeForm').on('submit', function(e) {
            e.preventDefault();
            
            const email = $('#email').val();
            
            if (email && isValidEmail(email)) {
                // Store email in localStorage (for demo)
                const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
                subscribers.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
                
                // Show success message
                M.toast({
                    html: '✓ Thank you for subscribing!',
                    classes: 'green'
                });
                
                // Reset form
                $('#email').val('');
            } else {
                M.toast({
                    html: '❌ Please enter a valid email',
                    classes: 'red'
                });
            }
        });
    }
    
    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});