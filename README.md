📰 The Leaders Newspaper - Complete Documentation

Project Overview

The Leaders Newspaper is a comprehensive digital newspaper management system designed for modern journalism. It provides a full-featured platform for creating, managing, and publishing newspaper articles with a sophisticated user interface, social engagement features, and a robust admin dashboard.

The system bridges the gap between traditional newspaper publishing and modern digital experiences, offering velvet-red themed elegance with powerful functionality.

---

Project Details

Attribute Information
Developer Fatherly P. Titus
Contact fatherlytitus69@gmail.com
Client The Leaders Newspaper Co.
Project Start Date February 14, 2026
Current Version 2.0.0 (Full-stack ready)
License Proprietary - The Leaders Newspaper Co.
Repository [Private]

---

Technology Stack

Frontend

· HTML5 - Semantic markup structure
· CSS3 - Custom properties, animations, responsive design
· JavaScript (ES6+) - Modern JavaScript with async/await
· jQuery - DOM manipulation and event handling
· Materialize CSS - Responsive grid and UI components
· Font Awesome 5 - Icon library
· Slick Carousel - Image carousels and sliders
· html2canvas - Image capture and export
· jsPDF - PDF generation

Backend (Ready for Implementation)

· Supabase - PostgreSQL database, authentication, storage
· PostgreSQL - Relational database
· Row Level Security (RLS) - Data access policies
· Real-time subscriptions - Live updates for comments/likes

Storage & Hosting

· LocalStorage - Client-side development storage
· Supabase Storage - Production image storage
· GitHub Pages - Initial hosting
· Vercel - Production hosting (planned)

---

System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Landing   │  │    Read     │  │    Admin    │  │   Auth      ││
│  │    Page     │  │  Articles   │  │    Hub      │  │   Pages     ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│         │               │               │               │          │
│         └───────────────┼───────────────┼───────────────┘          │
│                         ▼               ▼                          │
│              ┌─────────────────────────────────────┐               │
│              │         JavaScript Modules          │               │
│              │  - Article Storage  - Comments      │               │
│              │  - Authentication  - Analytics      │               │
│              └─────────────────────────────────────┘               │
│                         │                                           │
│                         ▼                                           │
│              ┌─────────────────────────────────────┐               │
│              │         Supabase Backend            │               │
│              │  ┌─────────────┐  ┌─────────────┐  │               │
│              │  │PostgreSQL DB│  │  Storage    │  │               │
│              │  │   (RLS)     │  │   Buckets   │  │               │
│              │  └─────────────┘  └─────────────┘  │               │
│              │  ┌─────────────┐  ┌─────────────┐  │               │
│              │  │   Auth      │  │  Realtime   │  │               │
│              │  │  (JWT)      │  │Subscriptions│  │               │
│              │  └─────────────┘  └─────────────┘  │               │
│              └─────────────────────────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

Core Features

1. Public Facing Features

· Landing Page - Hero section with animated entrance, breaking news ticker, featured articles grid, magazine cover carousel, subscription form
· Read Articles - Sequential article navigation with Previous/Next buttons, keyboard shortcuts (← →), reading progress indicator, 3-row layout system

2. Article Creation & Management

· Create Article - Comprehensive form with image upload (auto-resize to 250×250), full-screen rich text editor with formatting toolbar, word counter (500 word limit), quick templates, 3 layout options
· Article Storage - LocalStorage persistence with up to 10 articles, CRUD operations, storage statistics

3. 3-Row Layout System

· Row 1 (Heading) - Title, subtitle, author, date (full width)
· Row 2 (Poster) - Image + poster text (30 words or first sentence)
· Row 3 (Text) - Remaining content in multi-column format

4. Layout Options

· Top-Right - Image in column 2, poster text in column 1
· Top-Left - Image in column 1, poster text in column 2
· Top-Center - Full-width image, poster text integrated

5. Styling System

· Font Families - Georgia, Times New Roman, Garamond, Playfair, Roboto, Open Sans
· Title Styles - Standard, Bold, Elegant, Underlined, Accent Border
· Color Themes - Velvet Red (#8B0000), Navy (#003366), Forest (#2C5F2D), Wine (#722F37), Charcoal (#36454F), Classic (#000000)
· Image Styles - Standard, Shadow, Border, Rounded, Circular, Polaroid
· Typography - Drop caps, pull quotes, section dividers

6. Social Engagement

· Likes - Toggle like/unlike on articles, unique per user
· Comments - Threaded comments with nested replies, timestamps, user avatars (initials), reply functionality
· Sharing - Share via Twitter, Facebook, LinkedIn, Email, copy link

7. Authentication & Authorization

· User Roles - Admin (full access), Reader (view only)
· Login/Signup - Email/password authentication, remember me, password visibility toggle
· Route Protection - Admin pages restricted, public pages accessible
· Session Management - LocalStorage/sessionStorage based sessions

8. Admin Dashboard

· Admin Hub - Central navigation with quick stats, recent articles, pending comments, drafts
· Quick Actions - Write article, manage articles, categories, comments, users, analytics
· System Status - Database connection, storage usage, API status
· Floating Action Button - Quick access to common tasks

9. Export Features

· Download as Image - Capture full article as PNG
· Download as PDF - Multi-page PDF generation (A4 format)
· Zoom Controls - 50% to 200% zoom for preview

---

File Structure

```
the-leaders-newspaper/
│
├── 📄 index.html                    # Landing page (public)
├── 📄 read-articles.html            # Read articles page (public)
├── 📄 login.html                     # Login page
├── 📄 signup.html                    # Signup page
├── 📄 admin-hub.html                  # Admin navigation hub
├── 📄 admin-dashboard.html            # Admin dashboard
├── 📄 create-article.html             # Article creation
├── 📄 created-articles.html           # Article management
├── 📄 categories.html                 # Category management
├── 📄 comments-moderation.html        # Comment moderation
├── 📄 users.html                      # User management
├── 📄 analytics.html                  # Analytics dashboard
├── 📄 media-library.html               # Media management
├── 📄 settings.html                    # System settings
├── 📄 profile.html                     # User profile
│
├── 📁 styles/
│   ├── main-style.css                 # Main website styles
│   ├── style.css                       # Admin dashboard styles
│   ├── create-article.css              # Article creation styles
│   ├── created-articles.css             # Article management styles
│   ├── read-articles.css                # Reading interface styles
│   ├── auth.css                         # Login/signup styles
│   ├── comments.css                     # Comments system styles
│   ├── admin-hub.css                    # Admin hub styles
│   ├── w3css.css                        # W3.CSS framework
│   ├── materialize.min.css               # Materialize CSS
│   └── font/
│       └── material-icons.css            # Material Icons
│
├── 📁 scripts/
│   ├── jquery.js                        # jQuery library
│   ├── materialize.min.js                # Materialize JS
│   ├── article-storage.js                # LocalStorage manager
│   ├── comments-storage.js               # Comments storage
│   ├── auth.js                           # Authentication logic
│   ├── auth-check.js                     # Route protection
│   ├── admin-hub.js                      # Admin hub logic
│   ├── create-article.js                 # Article creation logic
│   ├── created-articles.js               # Article management logic
│   ├── read-articles.js                  # Reading interface logic
│   └── Slick/                            # Slick carousel
│       ├── slick.css
│       ├── slick-theme.css
│       └── slick.min.js
│
├── 📁 styles/FA5/fa5/                    # Font Awesome 5
│   ├── css/
│   │   └── all.min.css
│   └── webfonts/
│       └── (font files)
│
├── 📁 assets/
│   └── 📁 posters/                        # Magazine cover images
│       ├── magazine-cover-1.jpg
│       ├── magazine-cover-2.jpg
│       ├── magazine-cover-3.jpg
│       ├── magazine-cover-4.jpg
│       ├── magazine-cover-5.jpg
│       └── placeholder-cover.jpg
│
└── 📄 README.md                           # This documentation
```

---

Database Schema (Supabase)

Core Tables

Table Description
profiles User profiles (extends auth.users)
articles Newspaper articles with content and metadata
comments Threaded comments with replies
likes Polymorphic likes (articles/comments)
categories Article categories
tags Article tags
article_tags Article-tag relationships

Engagement Tables

Table Description
article_views View analytics
reading_history User reading progress
follows User/category follows
notifications User notifications
saved_articles Bookmarked articles
reports Content moderation reports

Key Relationships

· Users → Articles (one-to-many)
· Articles → Comments (one-to-many)
· Comments → Comments (self-referential for replies)
· Users → Likes (polymorphic)
· Articles → Categories (many-to-one)

---

Installation & Setup

Prerequisites

· Modern web browser (Chrome, Firefox, Safari, Edge)
· Code editor (VS Code recommended)
· Git (for version control)
· Node.js (optional, for development server)

Local Development Setup

1. Clone the repository

```bash
git clone [repository-url]
cd the-leaders-newspaper
```

1. File structure setup

```bash
# Create necessary directories
mkdir -p assets/posters
mkdir -p styles/font
mkdir -p scripts/Slick
```

1. Install dependencies (CDN-based, no npm required)

```html
<!-- Already included in HTML files -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
```

1. Run local server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx live-server

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

1. Access the application

· Landing page: http://localhost:8000/index.html
· Admin hub: http://localhost:8000/admin-hub.html
· Login: http://localhost:8000/login.html

Supabase Setup (Production)

1. Create Supabase project
   · Visit supabase.com
   · Create new project
   · Note: Project URL and anon key
2. Run database migrations
   · Open SQL Editor
   · Copy all CREATE TABLE statements from schema
   · Execute in order
3. Enable authentication
   · Email/Password provider (enabled by default)
   · Optional: Configure OAuth providers
4. Create storage buckets
   · article-images - Public bucket for article images
   · avatars - Public bucket for user avatars
   · posters - Public bucket for magazine covers
5. Set up environment variables

```javascript
// config.js (create this file)
const SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key',
    storageUrl: 'https://your-project.supabase.co/storage/v1'
};
```

---

User Guide

For Readers

Reading Articles

1. Navigate to Read Articles page
2. Use Previous/Next buttons to navigate
3. Use keyboard arrows (← →) for faster navigation
4. Click ❤️ Like to show appreciation (login required)
5. Click 💬 Comment to join discussion

Commenting

1. Log in to your account
2. Click Comments button on any article
3. Type your comment in the text area
4. Click Reply to respond to specific comments
5. Delete your own comments anytime

Subscribing

1. Visit the Landing page
2. Scroll to Subscribe section
3. Enter your email address
4. Click Subscribe Now

For Authors

Creating an Article

1. Log in as admin
2. Navigate to Create Article from Admin Hub
3. Upload a featured image (auto-resizes to 250×250)
4. Enter title, subtitle, author, date
5. Choose Layout Option (Top-Right, Top-Left, Top-Center)
6. Click text area to open Full-Screen Editor
7. Write content (max 500 words)
8. Use Formatting Toolbar for styling
9. Select Styling Options from panel
10. Click Preview Article to see result
11. Click Save Article to store

Using the Rich Text Editor

· Bold - Ctrl+B or toolbar button
· Italic - Ctrl+I or toolbar button
· Underline - Ctrl+U or toolbar button
· Link - Ctrl+K or toolbar button
· Lists - Bullet and numbered lists
· Quick Templates - News, Opinion, Interview, Review
· Tab key - Indent text

Managing Articles

1. Go to My Articles page
2. View all articles as cards
3. Click card to view full article
4. Edit - Pencil icon to modify
5. Delete - Trash icon to remove
6. Clear All - Remove all articles

For Administrators

Admin Hub Navigation

The Admin Hub provides central access to:

· Dashboard - Overview and analytics
· Create Article - New content creation
· Articles - Manage existing articles
· Categories - Organize content
· Comments - Moderate discussions
· Users - Manage accounts
· Analytics - Performance metrics
· Media Library - Image management
· Settings - System configuration

Quick Actions

· Write Article - Start new article
· Manage Articles - Edit/delete existing
· Categories - Add/edit categories
· Comments - Moderate pending comments
· Users - Add/edit users
· Analytics - View statistics

Moderation Tools

· Approve/Reject pending comments
· Delete inappropriate content
· Manage user accounts
· View system status

---

API Reference (Supabase)

Authentication Endpoints

```javascript
// Sign up
const { user, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'password123'
});

// Sign in
const { user, error } = await supabase.auth.signIn({
    email: 'user@example.com',
    password: 'password123'
});

// Sign out
await supabase.auth.signOut();
```

Articles API

```javascript
// Get all published articles
const { data, error } = await supabase
    .from('articles')
    .select(`
        *,
        profiles:author_id (full_name, avatar_url),
        categories (name, slug)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

// Get single article by slug
const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', 'article-slug')
    .single();

// Create article
const { data, error } = await supabase
    .from('articles')
    .insert([{
        title: 'Article Title',
        content: 'Content...',
        author_id: userId
    }]);
```

Comments API

```javascript
// Get comments for article
const { data, error } = await supabase
    .from('comments')
    .select(`
        *,
        profiles:user_id (full_name, avatar_url),
        replies:comments!parent_id (*)
    `)
    .eq('article_id', articleId)
    .is('parent_id', null);

// Post comment
const { data, error } = await supabase
    .from('comments')
    .insert([{
        article_id: articleId,
        user_id: userId,
        content: 'Comment text',
        parent_id: parentCommentId // null for top-level
    }]);
```

Likes API

```javascript
// Like article
const { data, error } = await supabase
    .from('likes')
    .insert([{
        user_id: userId,
        target_type: 'article',
        target_id: articleId
    }]);

// Unlike
await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('target_type', 'article')
    .eq('target_id', articleId);
```

---

Styling Guide

Color Palette

Color Name Hex Code Usage
Velvet Red #8B0000 Primary brand color, headers, accents
Velvet Red Dark #660000 Hover states, dark accents
Velvet Red Light #a52a2a Secondary elements, badges
Accent Gold #D4AF37 Highlights, special badges
Text Dark #333333 Body text
Text Light #f5f5f5 Text on dark backgrounds
Text Gray #666666 Secondary text, metadata

Typography

```css
/* Headings */
.preview-title {
    font-family: 'Times New Roman', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--velvet-red);
}

/* Body text */
.preview-content-text {
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--text-dark);
}

/* Metadata */
.preview-meta {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 0.9rem;
    color: #888;
}
```

CSS Variables

```css
:root {
    --velvet-red: #8B0000;
    --velvet-red-light: #a52a2a;
    --velvet-red-dark: #660000;
    --accent-gold: #D4AF37;
    --text-dark: #333;
    --text-light: #f5f5f5;
    --text-gray: #666;
    --bg-light: #f5f5f5;
    --card-shadow: 0 2px 4px rgba(0,0,0,0.08);
    --elevation-1: 0 2px 4px rgba(0,0,0,0.08);
    --elevation-2: 0 4px 12px rgba(0,0,0,0.12);
    --transition: all 0.3s ease;
}
```

---

Testing

Test Credentials

Role Email Password
Admin admin@leaders.com password123
Reader reader@example.com reader123

Test Articles

Use these sample titles for testing:

· "Global Summit Concludes with Historic Climate Agreement"
· "Tech Giants Unveil Revolutionary AI Systems"
· "Market Volatility Continues Amid Economic Uncertainty"
· "Cultural Renaissance Sweeps European Capitals"
· "New Healthcare Legislation Proposed"

Browser Testing

Browser Status
Google Chrome ✅ Fully supported
Mozilla Firefox ✅ Fully supported
Microsoft Edge ✅ Fully supported
Safari ✅ Fully supported
Mobile Chrome ✅ Responsive
Mobile Safari ✅ Responsive

---

Deployment

GitHub Pages (Static Hosting)

1. Push to GitHub repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/leaders-newspaper.git
git push -u origin main
```

1. Enable GitHub Pages
   · Go to repository Settings
   · Navigate to Pages section
   · Select main branch as source
   · Save (site will be available at https://yourusername.github.io/leaders-newspaper)

Vercel (Production)

1. Install Vercel CLI

```bash
npm i -g vercel
```

1. Deploy

```bash
vercel
```

1. Configure environment variables
   · Add Supabase URL and anon key in Vercel dashboard

Supabase Production

1. Set up production database
   · Run migrations in Supabase SQL editor
   · Enable Row Level Security
   · Create storage buckets
2. Configure CORS
   · Add your domain to Supabase CORS settings

---

Troubleshooting

Common Issues & Solutions

Issue: Images not displaying

```
Solution: Check image format (JPG/PNG only)
         Ensure image size < 5MB
         Verify base64 encoding is complete
```

Issue: Comments not saving

```
Solution: Check localStorage quota (5MB limit)
         Clear old comments if storage full
         Verify user is logged in
```

Issue: PDF download cuts off

```
Solution: System auto-generates multi-page PDFs
         Ensure content fits within A4 dimensions
         Check browser console for errors
```

Issue: Styling not applying

```
Solution: Refresh page to reload styles
         Check CSS class names in preview
         Verify jQuery is loaded
```

Issue: Login not working

```
Solution: Use test credentials
         Clear browser cache/cookies
         Check localStorage for corrupted session
```

Debugging Commands

```javascript
// Check storage
console.log('Articles:', ArticleStorage.getAll());
console.log('Comments:', CommentsStorage.getAllComments());
console.log('Users:', JSON.parse(localStorage.getItem('newspaper_users')));

// Clear all data (for testing)
localStorage.clear();
sessionStorage.clear();

// Check session
console.log('Session:', JSON.parse(
    localStorage.getItem('newspaper_session') || 
    sessionStorage.getItem('newspaper_session')
));
```

---

Future Enhancements

Phase 3 (Next Release)

· ✅ Admin navigation hub
· ✅ Comprehensive documentation
· 🔄 Supabase integration
· 🔄 Real-time comments with WebSockets
· 🔄 Email notifications

Phase 4 (Planned)

· 📱 Progressive Web App (PWA)
· 🔔 Push notifications
· 📊 Advanced analytics dashboard
· 🤖 AI-powered content recommendations
· 💳 Subscription payments (Stripe)

Phase 5 (Roadmap)

· 🌐 Multi-language support
· 📰 Print edition PDF generation
· 🎙️ Podcast integration
· 📹 Video articles
· 🔗 Social media auto-posting

---

Credits & Acknowledgments

Development Team

· Lead Developer: Fatherly P. Titus
· UI/UX Design: The Leaders Newspaper Design Team
· Frontend Architecture: Fatherly P. Titus
· Database Design: Fatherly P. Titus
· Quality Assurance: Internal Testing Team

Third-Party Libraries

Library License Purpose
jQuery MIT DOM manipulation
Materialize CSS MIT UI framework
Font Awesome Font Awesome License Icons
Slick Carousel MIT Image carousels
html2canvas MIT Image capture
jsPDF MIT PDF generation

Special Thanks

· The Leaders Newspaper editorial team for requirements
· Beta testers for valuable feedback
· Supabase team for excellent documentation
· Open source community for inspiration

---

Contact & Support

Developer Contact

Fatherly P. Titus

· Email: fatherlytitus69@gmail.com
· GitHub: @fatherlytitus
· LinkedIn: Fatherly P. Titus

Client

The Leaders Newspaper Co.

· Website: [Coming Soon]
· Email: contact@leadersnewspaper.com

Support Channels

· Technical Issues: fatherlytitus69@gmail.com
· Feature Requests: [Project Management Board - Coming Soon]
· Documentation: This README file

---

License

This project is proprietary and confidential. All rights reserved by The Leaders Newspaper Co.

Copyright © 2026 The Leaders Newspaper Co. All rights reserved.

Unauthorized copying, distribution, modification, public display, or use of this software is strictly prohibited without express written permission from the copyright holder.

---

Version History

Version Date Changes
1.0.0 Feb 14, 2026 Initial prototype with localStorage
1.1.0 Feb 15, 2026 Added 3-row layout system
1.2.0 Feb 16, 2026 Implemented styling options
1.3.0 Feb 17, 2026 Added comments and likes system
1.4.0 Feb 18, 2026 Authentication system
2.0.0 Feb 19, 2026 Admin hub and full documentation

---

Quick Start Commands

```bash
# Clone repository
git clone [repository-url]

# Navigate to project
cd the-leaders-newspaper

# Start local server (Python)
python -m http.server 8000

# Or with Node.js
npx live-server

# Open in browser
open http://localhost:8000
```

---

Documentation last updated: February 19, 2026
Next planned update: Phase 3 release with Supabase integration

---

"Informing Leaders, Shaping Tomorrow" - The Leaders Newspaper