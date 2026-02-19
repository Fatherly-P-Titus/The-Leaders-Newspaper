// scripts/auth.js

$(document).ready(function() {
    'use strict';

    // Initialize Materialize components
    $('.modal').modal();
    
    // Password visibility toggle
    setupPasswordToggle();
    
    // Form submissions
    setupLoginForm();
    setupSignupForm();
    
    // Forgot password
    setupForgotPassword();
    
    // Check if user is already logged in
    checkAuthStatus();

    /**
     * Setup password visibility toggle
     */
    function setupPasswordToggle() {
        $('.password-toggle').on('click', function() {
            const input = $(this).siblings('input');
            const icon = $(this).find('i');
            
            if (input.attr('type') === 'password') {
                input.attr('type', 'text');
                icon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                input.attr('type', 'password');
                icon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });
    }

    /**
     * Setup login form
     */
    function setupLoginForm() {
        $('#loginForm').on('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = $('#email').val();
            const password = $('#password').val();
            const remember = $('#remember').is(':checked');
            
            // Validate
            if (!email || !password) {
                showError('loginError', 'Please fill in all fields');
                return;
            }
            
            // Show loading
            setLoadingState('loginBtn', true);
            
            // Simulate API call (replace with actual authentication)
            setTimeout(() => {
                const users = getUsers();
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Successful login
                    loginUser(user, remember);
                } else {
                    // Failed login
                    setLoadingState('loginBtn', false);
                    showError('loginError', 'Invalid email or password');
                }
            }, 1500);
        });
    }

    /**
     * Setup signup form
     */
    function setupSignupForm() {
        // Password match validation
        $('#confirmPassword').on('input', function() {
            const password = $('#password').val();
            const confirm = $(this).val();
            
            if (confirm && password !== confirm) {
                $('#passwordMatchMsg').text('Passwords do not match').css('color', '#f44336');
                $(this).addClass('invalid');
            } else if (confirm) {
                $('#passwordMatchMsg').text('Passwords match').css('color', '#4CAF50');
                $(this).removeClass('invalid').addClass('valid');
            } else {
                $('#passwordMatchMsg').text('');
                $(this).removeClass('invalid valid');
            }
        });

        $('#signupForm').on('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = $('#name').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const confirm = $('#confirmPassword').val();
            const accountType = $('input[name="accountType"]:checked').val();
            const terms = $('#terms').is(':checked');
            
            // Validate
            if (!name || !email || !password || !confirm) {
                showError('signupError', 'Please fill in all fields');
                return;
            }
            
            if (password !== confirm) {
                showError('signupError', 'Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                showError('signupError', 'Password must be at least 6 characters');
                return;
            }
            
            if (!terms) {
                showError('signupError', 'You must agree to the terms');
                return;
            }
            
            // Show loading
            setLoadingState('signupBtn', true);
            
            // Simulate API call
            setTimeout(() => {
                const users = getUsers();
                
                // Check if email exists
                if (users.some(u => u.email === email)) {
                    setLoadingState('signupBtn', false);
                    showError('signupError', 'Email already registered');
                    return;
                }
                
                // Create new user
                const newUser = {
                    id: generateId(),
                    name: name,
                    email: email,
                    password: password, // In real app, hash this!
                    role: accountType,
                    createdAt: new Date().toISOString()
                };
                
                // Save user
                users.push(newUser);
                localStorage.setItem('newspaper_users', JSON.stringify(users));
                
                // Show success modal
                setLoadingState('signupBtn', false);
                $('#successModal').modal('open');
                
                // Reset form
                $('#signupForm')[0].reset();
            }, 1500);
        });
    }

    /**
     * Setup forgot password
     */
    function setupForgotPassword() {
        $('#forgotPassword').on('click', function(e) {
            e.preventDefault();
            $('#forgotModal').modal('open');
        });

        $('#sendResetBtn').on('click', function() {
            const email = $('#resetEmail').val();
            
            if (email && isValidEmail(email)) {
                M.toast({
                    html: '✓ Password reset instructions sent to your email',
                    classes: 'green'
                });
                $('#forgotModal').modal('close');
                $('#resetEmail').val('');
            } else {
                M.toast({
                    html: '❌ Please enter a valid email',
                    classes: 'red'
                });
            }
        });
    }

    /**
     * Login user
     */
    function loginUser(user, remember) {
        // Create session
        const session = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            loggedInAt: new Date().toISOString()
        };
        
        // Store session
        if (remember) {
            localStorage.setItem('newspaper_session', JSON.stringify(session));
        } else {
            sessionStorage.setItem('newspaper_session', JSON.stringify(session));
        }
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'read-articles.html';
        }
    }

    /**
     * Check authentication status
     */
    function checkAuthStatus() {
        const session = getSession();
        
        // If on login/signup page and already logged in, redirect
        const currentPage = window.location.pathname.split('/').pop();
        
        if (session) {
            if (currentPage === 'login.html' || currentPage === 'signup.html') {
                if (session.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'read-articles.html';
                }
            }
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
     * Get users from storage
     */
    function getUsers() {
        // Initialize with default users if empty
        let users = JSON.parse(localStorage.getItem('newspaper_users') || '[]');
        
        if (users.length === 0) {
            // Create default users
            users = [
                {
                    id: 'admin_' + generateId(),
                    name: 'Admin User',
                    email: 'admin@leaders.com',
                    password: 'password123', // In production, use hashed passwords!
                    role: 'admin',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'reader_' + generateId(),
                    name: 'Reader User',
                    email: 'reader@example.com',
                    password: 'reader123',
                    role: 'reader',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('newspaper_users', JSON.stringify(users));
        }
        
        return users;
    }

    /**
     * Show error message
     */
    function showError(elementId, message) {
        $(`#${elementId}`).text(message).show();
        setTimeout(() => {
            $(`#${elementId}`).fadeOut();
        }, 3000);
    }

    /**
     * Set loading state for button
     */
    function setLoadingState(btnId, isLoading) {
        const btn = $(`#${btnId}`);
        
        if (isLoading) {
            btn.find('.btn-text').hide();
            btn.find('.btn-loader').show();
            btn.prop('disabled', true);
        } else {
            btn.find('.btn-text').show();
            btn.find('.btn-loader').hide();
            btn.prop('disabled', false);
        }
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Generate unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
});