// scripts/auth-check.js

$(document).ready(function() {
    'use strict';

    // Check if current page requires authentication
    const restrictedPages = [
        'admin-dashboard.html',
        'create-article.html',
        'created-articles.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage)) {
        checkAdminAccess();
    }

    /**
     * Check if user has admin access
     */
    function checkAdminAccess() {
        const session = getSession();
        
        if (!session) {
            // Not logged in
            redirectToLogin('Please log in to access this page');
        } else if (session.role !== 'admin') {
            // Logged in but not admin
            M.toast({
                html: '❌ Admin access required',
                classes: 'red'
            });
            setTimeout(() => {
                window.location.href = 'read-articles.html';
            }, 2000);
        }
    }

    /**
     * Get current session
     */
    function getSession() {
        return JSON.parse(localStorage.getItem('newspaper_session') || 
                          sessionStorage.getItem('newspaper_session') || 'null');
    }

    /**
     * Redirect to login with message
     */
    function redirectToLogin(message) {
        M.toast({
            html: `⚠️ ${message}`,
            classes: 'orange'
        });
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    /**
     * Logout function (expose globally)
     */
    window.logout = function() {
        localStorage.removeItem('newspaper_session');
        sessionStorage.removeItem('newspaper_session');
        
        M.toast({
            html: '✓ Logged out successfully',
            classes: 'green'
        });
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    };

    window.isLoggedIn = function () {
        return !!(localStorage.getItem('newspaper_session') || sessionStorage.getItem('newspaper_session'));
    };

    // Add this to handle comment button clicks for non-logged-in users
    $(document).on('click', '.requires-login', function (e) {
        if (!isLoggedIn()) {
            e.preventDefault();
            M.toast({
                html: '⚠️ Please log in to perform this action',
                classes: 'orange'
            });
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
});