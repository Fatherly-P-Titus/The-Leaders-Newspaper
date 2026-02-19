// scripts/create-article.js - Updated with 3-Row Layout

$(document).ready(function() {
    'use strict';

    // Initialize Materialize components
    initMaterializeComponents();
    
    // Module variables
    let currentImage = null;
    let currentZoom = 1;
    const MAX_WORDS = 500;

    // Initialize styling options
    initStylingOptions();
    
    // Update generatePreview function to include styling
    const originalGeneratePreview = generatePreview;
    generatePreview = function(title, date, subtitle, author, posterText, remainingText, layout, image) {
        originalGeneratePreview(title, date, subtitle, author, posterText, remainingText, layout, image);
        setTimeout(applyStylingToPreview, 100); // Apply styling after preview loads
    };

     // Initialize modals
    $('.modal').modal({
        opacity: 0.7,
        inDuration: 300,
        outDuration: 200
    });
    
    // Make original textarea clickable to open editor
    $('#articleContent').addClass('article-content-trigger');
    $('#articleContent').parent().addClass('clickable-editor');
    
    // Add click handler to open editor
    $('#articleContent').on('click', function(e) {
        e.preventDefault();
        openTextEditor();
    });
    
    // Add "Open Editor" button next to textarea
    const openEditorBtn = $(`
        <button type="button" id="openEditorBtn" class="btn-floating btn-small velvet-red" style="position: absolute; right: 0; bottom: 20px;">
            <i class="fas fa-pen-fancy"></i>
        </button>
    `);
    $('#articleContent').parent().append(openEditorBtn);
    
    openEditorBtn.on('click', function(e) {
        e.preventDefault();
        openTextEditor();
    });

    /////////////////////////////
    
    /**
     * Initialize all Materialize CSS components
     */
    function initMaterializeComponents() {
        // Initialize datepicker
        $('.datepicker').datepicker({
            format: 'mmm dd, yyyy',
            yearRange: 50,
            defaultDate: new Date(),
            setDefaultDate: true,
            container: 'body',
            i18n: {
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                weekdaysAbbrev: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            }
        });
        
        // Initialize select dropdown
        $('select').formSelect();
        
        // Initialize character counter for textarea
        $('#articleContent').characterCounter();
        
        // Initialize materialbox for images
        $('.materialboxed').materialbox();
    }
    
    /**
     * Word counter
     */
    function countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    /**
     * Extract first sentence or first 30 words
     */
    function extractPosterText(text) {
        if (!text || text.trim().length === 0) {
            return { poster: '', remaining: '' };
        }
        
        // Clean the text
        const cleanText = text.trim();
        
        // Try to find first sentence ending with period
        const firstSentenceMatch = cleanText.match(/^.*?[.!?](?:\s|$)/);
        
        if (firstSentenceMatch) {
            const firstSentence = firstSentenceMatch[0].trim();
            const firstSentenceWords = countWords(firstSentence);
            
            // If first sentence is 30 words or less, use it
            if (firstSentenceWords <= 30) {
                const remaining = cleanText.substring(firstSentence.length).trim();
                return {
                    poster: firstSentence,
                    remaining: remaining
                };
            }
        }
        
        // Otherwise, take first 30 words
        const words = cleanText.split(/\s+/);
        const posterWords = words.slice(0, 30);
        const remainingWords = words.slice(30);
        
        return {
            poster: posterWords.join(' '),
            remaining: remainingWords.join(' ')
        };
    }
    
    /**
     * Format text with paragraphs
     */
    function formatTextWithParagraphs(text) {
        if (!text || text.trim().length === 0) {
            return '<p class="grey-text">No content provided...</p>';
        }
        
        // Split by double newlines for paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
        
        if (paragraphs.length === 0) {
            return `<p>${text.replace(/\n/g, '<br>')}</p>`;
        }
        
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    }
    
    $('#articleContent').on('input', function() {
        const wordCount = countWords($(this).val());
        const remaining = MAX_WORDS - wordCount;
        
        // Add word count indicator
        let indicator = $(this).siblings('.word-count-indicator');
        if (indicator.length === 0) {
            indicator = $('<span class="word-count-indicator helper-text"></span>');
            $(this).parent().append(indicator);
        }
        
        if (wordCount > MAX_WORDS) {
            indicator.text(`⚠️ Word limit exceeded by ${Math.abs(remaining)} words`).addClass('red-text');
            $(this).css('border-bottom', '2px solid #f44336');
        } else {
            indicator.text(`${remaining} words remaining`).removeClass('red-text');
            $(this).css('border-bottom', '');
        }
    });
    
    /**
     * Image upload handling
     */
    $('#articleImage').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                M.toast({html: 'Please upload an image file', classes: 'red'});
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                M.toast({html: 'Image size should be less than 5MB', classes: 'red'});
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                currentImage = e.target.result;
                $('#imagePreview img').attr('src', currentImage);
                $('#imagePreview').fadeIn(300);
                
                // Resize image to 250x250 for preview
                resizeImageForPreview(currentImage);
            };
            reader.readAsDataURL(file);
        }
    });
    
    /**
     * Resize image for preview
     */
    function resizeImageForPreview(imageData) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 250;
            canvas.height = 250;
            
            // Calculate dimensions for cover
            const scale = Math.max(250 / this.width, 250 / this.height);
            const x = (250 - this.width * scale) / 2;
            const y = (250 - this.height * scale) / 2;
            
            ctx.drawImage(this, x, y, this.width * scale, this.height * scale);
            currentImage = canvas.toDataURL('image/jpeg');
            $('#imagePreview img').attr('src', currentImage);
        };
        img.src = imageData;
    }
    
    /**
     * Remove uploaded image
     */
    $('#removeImage').on('click', function() {
        currentImage = null;
        $('#articleImage').val('');
        $('#imagePreview').fadeOut(300);
        $('#imagePreview img').attr('src', '#');
        $('.file-path').val('');
    });
    
    /**
     * Form submission - Generate preview
     */
    $('#articleForm').on('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form values
        const title = $('#articleTitle').val();
        const date = $('#articleDate').val();
        const subtitle = $('#articleSubtitle').val() || '';
        const author = $('#articleAuthor').val();
        const layout = $('#articleLayout').val();
        const content = $('#articleContent').val() || '';
        
        // Check word count
        const wordCount = countWords(content);
        if (wordCount > MAX_WORDS) {
            M.toast({html: `❌ Article exceeds maximum word count (${MAX_WORDS} words)`, classes: 'red'});
            return;
        }
        
        // Extract poster text and remaining content
        const { poster, remaining } = extractPosterText(content);

        // Generate preview
        generatePreview(title, date, subtitle, author, poster, remaining, layout, currentImage);

        // Add save button if not exists
        addSaveButton({
            title, date, subtitle, author, layout,
            posterText: poster,
            remainingText: remaining,
            fullContent: content,
            image: currentImage,
            imageCaption: $('#imageCaption').val(),
            styling: getCurrentStylingOptions()
        });

        M.toast({ html: '✓ Preview generated successfully!', classes: 'green' });
    });
    
    /**
     * Validate form fields
     */
    function validateForm() {
        const title = $('#articleTitle').val();
        const date = $('#articleDate').val();
        const author = $('#articleAuthor').val();
        
        if (!title || !title.trim()) {
            M.toast({html: 'Please enter an article title', classes: 'red'});
            $('#articleTitle').focus();
            return false;
        }
        
        if (!date || !date.trim()) {
            M.toast({html: 'Please select a publication date', classes: 'red'});
            return false;
        }
        
        if (!author || !author.trim()) {
            M.toast({html: 'Please enter an author name', classes: 'red'});
            $('#articleAuthor').focus();
            return false;
        }
        
        return true;
    }
    
    /**
     * Generate article preview with 3-row layout
     */
    function generatePreview(title, date, subtitle, author, posterText, remainingText, layout, image) {
        const formattedDate = date || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Format poster text with paragraph
        const formattedPoster = posterText ? 
            `<div class="poster-content">${formatTextWithParagraphs(posterText)}</div>` : 
            '<p class="grey-text italic">No poster text available...</p>';
        
        // Format remaining text
        const formattedRemaining = remainingText ? 
            formatTextWithParagraphs(remainingText) : 
            '<p class="grey-text">No additional content...</p>';
        
        // Determine layout class
        let layoutClass = '';
        switch(layout) {
            case 'top-right':
                layoutClass = 'layout-top-right';
                break;
            case 'top-left':
                layoutClass = 'layout-top-left';
                break;
            case 'top-center':
                layoutClass = 'layout-top-center';
                break;
        }
        
        // Generate image HTML
        const imageHtml = image ? 
            `<img src="${image}" alt="${escapeHtml(title)}" class="responsive-img">` : 
            `<div class="no-image-placeholder">
                <i class="fas fa-image fa-4x"></i>
                <p>No image uploaded</p>
            </div>`;
        
        // Build the 3-row grid preview
        const previewHtml = `
            <div class="article-preview ${layoutClass}">
                <div class="preview-grid">
                    <!-- Row 1: Heading Section (spans both columns) -->
                    <div class="heading-row">
                        <h1 class="preview-title">${escapeHtml(title)}</h1>
                        ${subtitle ? `<h2 class="preview-subtitle">${escapeHtml(subtitle)}</h2>` : ''}
                        <div class="preview-meta">
                            <span><i class="fas fa-user-circle"></i> ${escapeHtml(author)}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${escapeHtml(formattedDate)}</span>
                        </div>
                    </div>
                    
                    <!-- Row 2: Poster Section (2 columns) -->
                    <!-- Image Cell -->
                    <div class="poster-cell image-cell">
                        ${imageHtml}
                    </div>
                    
                    <!-- Poster Text Cell -->
                    <div class="poster-cell poster-text-cell">
                        <div class="poster-text">
                            <span class="poster-label">Lead</span>
                            ${formattedPoster}
                        </div>
                    </div>
                    
                    <!-- Row 3: Text Section (spans both columns) -->
                    <div class="text-row">
                        <div class="remaining-text">
                            ${formattedRemaining}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#previewContent').fadeOut(200, function() {
            $(this).html(previewHtml).fadeIn(300);
        });

        applyStylingToPreview();
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
    
    /**
     * Zoom functionality
     */
    $('#zoomIn').on('click', function() {
        currentZoom = Math.min(currentZoom + 0.25, 2);
        applyZoom();
    });
    
    $('#zoomOut').on('click', function() {
        currentZoom = Math.max(currentZoom - 0.25, 0.5);
        applyZoom();
    });
    
    $('#resetZoom').on('click', function() {
        currentZoom = 1;
        applyZoom();
    });
    
    function applyZoom() {
        $('#previewContent').css('transform', `scale(${currentZoom})`);
        $('#previewContent').css('transform-origin', 'top center');
        
        // Show current zoom level
        M.toast({html: `Zoom: ${Math.round(currentZoom * 100)}%`, classes: 'blue', displayLength: 500});
    }
    
    /**
 * Download as Image - Captures FULL article
 */
    $('#downloadImage').on('click', async function() {
        const previewContent = document.getElementById('previewContent');
        const articlePreview = previewContent.querySelector('.article-preview');
        
        if (!articlePreview || previewContent.querySelector('.preview-message')) {
            M.toast({html: 'No article to download. Create a preview first!', classes: 'red'});
            return;
        }
        
        M.toast({html: '📸 Generating high-res image...', classes: 'blue'});
        
        try {
            // Store current zoom and scroll position
            const currentZoom = $('#previewContent').css('transform');
            const scrollPos = $('.preview-content').scrollTop();
            
            // Reset zoom and ensure full content is visible
            $('#previewContent').css('transform', 'scale(1)');
            $('.preview-content').css('height', 'auto').css('max-height', 'none');
            
            // Temporarily expand container to show full content
            const previewContainer = $('.preview-container');
            const originalHeight = previewContainer.css('height');
            previewContainer.css('height', 'auto');
            
            // Wait for DOM to settle
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Capture with higher scale for better quality
            const canvas = await html2canvas(articlePreview, {
                scale: 3, // Higher scale for better quality
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                useCORS: true,
                windowWidth: articlePreview.scrollWidth,
                windowHeight: articlePreview.scrollHeight,
                onclone: (clonedDoc, element) => {
                    // Ensure cloned element has full height
                    element.style.height = 'auto';
                    element.style.overflow = 'visible';
                }
            });
            
            // Create download link
            const link = document.createElement('a');
            link.download = `The-Leaders-${new Date().toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Restore original settings
            $('#previewContent').css('transform', currentZoom);
            $('.preview-content').css('height', '').css('max-height', '');
            previewContainer.css('height', originalHeight);
            $('.preview-content').scrollTop(scrollPos);
            
            M.toast({html: '✓ Full article image downloaded!', classes: 'green'});
            
        } catch (error) {
            console.error('Error generating image:', error);
            M.toast({html: '❌ Error generating image. Check console.', classes: 'red'});
        }
    });

    
    /**
 * Download as PDF - Captures FULL article
 */
    $('#downloadPDF').on('click', async function() {
        const previewContent = document.getElementById('previewContent');
        const articlePreview = previewContent.querySelector('.article-preview');
        
        if (!articlePreview || previewContent.querySelector('.preview-message')) {
            M.toast({html: 'No article to download. Create a preview first!', classes: 'red'});
            return;
        }
        
        M.toast({html: '📄 Generating PDF...', classes: 'blue'});
        
        try {
            // Store current zoom and scroll position
            const currentZoom = $('#previewContent').css('transform');
            const scrollPos = $('.preview-content').scrollTop();
            
            // Reset zoom and ensure full content is visible
            $('#previewContent').css('transform', 'scale(1)');
            $('.preview-content').css('height', 'auto').css('max-height', 'none');
            
            // Temporarily expand container
            const previewContainer = $('.preview-container');
            const originalHeight = previewContainer.css('height');
            previewContainer.css('height', 'auto');
            
            // Wait for DOM to settle
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Capture with html2canvas
            const canvas = await html2canvas(articlePreview, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                useCORS: true,
                windowWidth: articlePreview.scrollWidth,
                windowHeight: articlePreview.scrollHeight
            });
            
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate PDF dimensions
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Create PDF with appropriate orientation
            const pdf = new jsPDF({
                orientation: imgHeight > pageHeight ? 'portrait' : 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calculate how many pages needed
            let heightLeft = imgHeight;
            let position = 0;
            let pageCount = 1;
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
            
            // Add additional pages if needed
            while (heightLeft > 0) {
                position = -pageHeight * pageCount;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
                pageCount++;
            }
            
            // Save PDF
            pdf.save(`The-Leaders-${new Date().toISOString().slice(0,10)}.pdf`);
            
            // Restore original settings
            $('#previewContent').css('transform', currentZoom);
            $('.preview-content').css('height', '').css('max-height', '');
            previewContainer.css('height', originalHeight);
            $('.preview-content').scrollTop(scrollPos);
            
            M.toast({html: `✓ PDF downloaded (${pageCount} page${pageCount > 1 ? 's' : ''})!`, classes: 'green'});
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            M.toast({html: '❌ Error generating PDF. Check console.', classes: 'red'});
        }
    });

    /**
     * Alternative: Download as Multi-Page PDF with better formatting
     */
    $('#downloadPDFMulti').on('click', async function() {
        const previewContent = document.getElementById('previewContent');
        const articlePreview = previewContent.querySelector('.article-preview');
        
        if (!articlePreview || previewContent.querySelector('.preview-message')) {
            M.toast({html: 'No article to download. Create a preview first!', classes: 'red'});
            return;
        }
        
        M.toast({html: '📄 Generating multi-page PDF...', classes: 'blue'});
        
        try {
            // Store current state
            const currentZoom = $('#previewContent').css('transform');
            const scrollPos = $('.preview-content').scrollTop();
            
            // Reset zoom
            $('#previewContent').css('transform', 'scale(1)');
            
            // Get individual sections for better PDF rendering
            const headingSection = articlePreview.querySelector('.heading-row');
            const posterSection = articlePreview.querySelectorAll('.poster-cell');
            const textSection = articlePreview.querySelector('.text-row');
            
            // Initialize PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Capture each section separately
            let pageCount = 1;
            
            // Capture heading + poster as first page
            const firstPageClone = document.createElement('div');
            firstPageClone.style.width = '1000px';
            firstPageClone.style.padding = '20px';
            firstPageClone.style.background = 'white';
            firstPageClone.appendChild(headingSection.cloneNode(true));
            posterSection.forEach(cell => {
                firstPageClone.appendChild(cell.cloneNode(true));
            });
            
            document.body.appendChild(firstPageClone);
            
            const firstPageCanvas = await html2canvas(firstPageClone, {
                scale: 2,
                backgroundColor: '#ffffff'
            });
            
            document.body.removeChild(firstPageClone);
            
            // Add first page to PDF
            const firstPageImgData = firstPageCanvas.toDataURL('image/png');
            const imgWidth = 210;
            const imgHeight = (firstPageCanvas.height * imgWidth) / firstPageCanvas.width;
            pdf.addImage(firstPageImgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Capture text section as second page
            if (textSection) {
                pdf.addPage();
                pageCount++;
                
                const textClone = document.createElement('div');
                textClone.style.width = '1000px';
                textClone.style.padding = '20px';
                textClone.style.background = 'white';
                textClone.appendChild(textSection.cloneNode(true));
                
                document.body.appendChild(textClone);
                
                const textCanvas = await html2canvas(textClone, {
                    scale: 2,
                    backgroundColor: '#ffffff'
                });
                
                document.body.removeChild(textClone);
                
                const textImgData = textCanvas.toDataURL('image/png');
                const textImgHeight = (textCanvas.height * imgWidth) / textCanvas.width;
                pdf.addImage(textImgData, 'PNG', 0, 0, imgWidth, textImgHeight);
            }
            
            // Save PDF
            pdf.save(`The-Leaders-${new Date().toISOString().slice(0,10)}.pdf`);
            
            // Restore original settings
            $('#previewContent').css('transform', currentZoom);
            $('.preview-content').scrollTop(scrollPos);
            
            M.toast({html: `✓ Multi-page PDF downloaded (${pageCount} pages)!`, classes: 'green'});
            
        } catch (error) {
            console.error('Error generating multi-page PDF:', error);
            M.toast({html: '❌ Error generating PDF', classes: 'red'});
        }
    });
    
    /**
     * Reset form
     */
    $('button[type="reset"]').on('click', function(e) {
        e.preventDefault();
        
        // Reset form fields
        $('#articleForm')[0].reset();
        
        // Reset preview with fade
        $('#previewContent').fadeOut(200, function() {
            $(this).html(`
                <div class="article-preview">
                    <div class="preview-message center">
                        <i class="fas fa-newspaper fa-4x"></i>
                        <h5>Ready to Create</h5>
                        <p>Fill in the form and click "Preview Article" to see your article here</p>
                    </div>
                </div>
            `).fadeIn(300);
        });
        
        // Reset image
        currentImage = null;
        $('#imagePreview').fadeOut(300);
        
        // Reset Materialize components
        $('select').formSelect();
        $('.datepicker').val('');
        
        // Reset word counter
        $('.word-count-indicator').remove();
        
        M.toast({html: '✓ Form reset successfully', classes: 'green'});
    });
    
    /**
     * Initialize preview with default values
     */
    function initializeDefaultPreview() {
        const today = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        $('#articleDate').val(today);
    }

    // ============ STYLING OPTIONS HANDLING ============

    // Initialize styling options
    function initStylingOptions() {
        // Color theme selection
        $('.theme-option').on('click', function () {
            $('.theme-option').removeClass('active');
            $(this).addClass('active');

            const theme = $(this).data('theme');
            applyColorTheme(theme);
        });

        // Real-time preview updates for styling options
        $('#fontFamily, #fontSize, #titleStyle, #titleAlignment, #textAlignment, #lineHeight, #titleSeparator, #sectionDividers, #imageStyle').on('change', function () {
            applyStylingToPreview();
        });

        // Toggle switches
        $('#dropCap, #pullQuotes').on('change', function () {
            applyStylingToPreview();
        });

        // Image caption
        $('#imageCaption').on('input', function () {
            applyImageCaption($(this).val());
        });
    }

    /**
     * Apply color theme to preview
     */
    function applyColorTheme(theme) {
        const preview = $('.article-preview');

        // Remove existing theme classes
        preview.removeClass('theme-velvet-red theme-navy theme-forest theme-wine theme-charcoal theme-classic');

        // Add new theme class
        preview.addClass(`theme-${theme}`);
        preview.addClass('theme-active');

        // Update CSS variables
        const colors = {
            'velvet-red': '#8B0000',
            'navy': '#003366',
            'forest': '#2C5F2D',
            'wine': '#722F37',
            'charcoal': '#36454F',
            'classic': '#000000'
        };

        if (colors[theme]) {
            preview.css('--theme-primary', colors[theme]);
        }
    }

    /**
     * Apply all styling options to preview
     */
    function applyStylingToPreview() {
        const preview = $('.article-preview');
        const previewTitle = preview.find('.preview-title');
        const previewContent = preview.find('.remaining-text, .poster-content');

        // Font Family
        const fontFamily = $('#fontFamily').val();
        preview.css('font-family', getFontFamily(fontFamily));

        // Font Size
        const fontSize = $('#fontSize').val();
        preview.removeClass('font-size-normal font-size-large font-size-larger font-size-small');
        preview.addClass(`font-size-${fontSize}`);

        // Title Style
        const titleStyle = $('#titleStyle').val();
        previewTitle.removeClass('title-standard title-bold title-elegant title-underlined title-accent-border');
        previewTitle.addClass(`title-${titleStyle}`);

        // Title Alignment
        const titleAlignment = $('#titleAlignment').val();
        previewTitle.removeClass('title-left title-center title-right');
        previewTitle.addClass(`title-${titleAlignment}`);

        // Text Alignment
        const textAlignment = $('#textAlignment').val();
        previewContent.removeClass('text-justify text-left text-right');
        previewContent.addClass(`text-${textAlignment}`);

        // Line Height
        const lineHeight = $('#lineHeight').val();
        previewContent.removeClass('line-normal line-relaxed line-compact line-double');
        previewContent.addClass(`line-${lineHeight}`);

        // Drop Cap
        if ($('#dropCap').is(':checked')) {
            previewContent.addClass('drop-cap');
        } else {
            previewContent.removeClass('drop-cap');
        }

        // Pull Quotes (simplified - would need more complex implementation for real quotes)
        if ($('#pullQuotes').is(':checked')) {
            addPullQuotes();
        } else {
            $('.pull-quote').remove();
        }

        // Title Separator
        const titleSeparator = $('#titleSeparator').val();
        if (titleSeparator !== 'none') {
            previewTitle.css('border-bottom', '');
            previewTitle.addClass(`separator-${titleSeparator}`);
        } else {
            previewTitle.removeClass('separator-solid separator-double separator-dashed separator-dotted separator-gold');
        }

        // Section Dividers
        const sectionDividers = $('#sectionDividers').val();
        $('.section-divider').remove();
        if (sectionDividers !== 'none') {
            const dividerClass = sectionDividers === 'line' ? 'w3-border' : `divider-${sectionDividers}`;
            $('.text-row').before(`<div class="section-divider ${dividerClass}"></div>`);
        }

        // Image Style
        const imageStyle = $('#imageStyle').val();
        const previewImage = $('.image-cell img');
        previewImage.removeClass('img-standard img-shadow img-border img-rounded img-circle img-polaroid');
        previewImage.addClass(`img-${imageStyle}`);
    }

    /**
     * Get font family CSS value
     */
    function getFontFamily(font) {
        const fonts = {
            'georgia': 'Georgia, serif',
            'times': 'Times New Roman, serif',
            'garamond': 'Garamond, serif',
            'playfair': 'Playfair Display, serif',
            'roboto': 'Roboto, sans-serif',
            'opensans': 'Open Sans, sans-serif'
        };
        return fonts[font] || fonts.georgia;
    }

    /**
     * Add pull quotes to article
     */
    function addPullQuotes() {
        // Simple implementation - would need more sophisticated logic
        const paragraphs = $('.remaining-text p');
        if (paragraphs.length > 2) {
            const quoteText = $(paragraphs[1]).text().substring(0, 100) + '...';
            $(paragraphs[1]).after(`<div class="pull-quote">${quoteText}</div>`);
        }
    }

    /**
     * Apply image caption
     */
    function applyImageCaption(caption) {
        $('.image-caption').remove();
        if (caption && caption.trim()) {
            $('.image-cell').append(`<div class="image-caption">${caption}</div>`);
        }
    }


    /**
     * Get current styling options
     */
    function getCurrentStylingOptions() {
        return {
            fontFamily: $('#fontFamily').val(),
            fontSize: $('#fontSize').val(),
            titleStyle: $('#titleStyle').val(),
            titleAlignment: $('#titleAlignment').val(),
            textAlignment: $('#textAlignment').val(),
            lineHeight: $('#lineHeight').val(),
            dropCap: $('#dropCap').is(':checked'),
            pullQuotes: $('#pullQuotes').is(':checked'),
            titleSeparator: $('#titleSeparator').val(),
            sectionDividers: $('#sectionDividers').val(),
            colorTheme: $('.theme-option.active').data('theme'),
            imageStyle: $('#imageStyle').val()
        };
    }

    /**
     * Add save button to preview section
     */
    function addSaveButton(articleData) {
        // Remove existing save button if any
        $('#saveArticleBtn').remove();

        // Create save button
        const saveBtn = $(`
        <button id="saveArticleBtn" class="btn waves-effect waves-light green darken-2" style="margin-left: 15px;">
            <i class="fas fa-save left"></i>Save Article
        </button>
    `);

        // Add to preview header
        $('.preview-header').append(saveBtn);

        // Handle save
        saveBtn.on('click', function () {
            const saved = ArticleStorage.save(articleData);

            if (saved) {
                M.toast({
                    html: `✓ Article "${articleData.title}" saved successfully!`,
                    classes: 'green'
                });

                // Show stats
                const stats = ArticleStorage.stats();
                console.log('Storage stats:', stats);
            }
        });
    }    


    /**
     * Open the full-screen text editor
     */
    function openTextEditor() {
        // Load current content into editor
        const currentContent = $('#articleContent').val();
        $('#fullTextEditor').val(currentContent);

        // Update word count
        updateEditorWordCount(currentContent);

        // Open modal
        $('#textEditorModal').modal('open');

        // Focus editor
        setTimeout(() => $('#fullTextEditor').focus(), 300);
    }

    /**
     * Update word count in editor
     */
    function updateEditorWordCount(text) {
        const wordCount = countWords(text);
        const charCount = text.length;
        const remaining = MAX_WORDS - wordCount;
        const progress = (wordCount / MAX_WORDS) * 100;

        // Update word count badge
        $('#modalWordCount').text(`${wordCount} / ${MAX_WORDS} words`);

        // Update progress bar
        $('#wordCountProgress').css('width', progress + '%');

        // Update character count
        $('#charCount').text(charCount);

        // Update reading time (average 200 words per minute)
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        $('#readingTime').text(readingTime);

        // Change color if over limit
        if (wordCount > MAX_WORDS) {
            $('#modalWordCount').css('background', '#f44336');
            $('#wordCountProgress').css('background', '#f44336');
        } else {
            $('#modalWordCount').css('background', 'var(--velvet-red-light)');
            $('#wordCountProgress').css('background', 'var(--velvet-red)');
        }
    }

    // Editor input handler
    $('#fullTextEditor').on('input', function () {
        updateEditorWordCount($(this).val());
    });

    // Save from editor
    $('#saveEditorBtn').on('click', function () {
        const editedContent = $('#fullTextEditor').val();
        const wordCount = countWords(editedContent);

        if (wordCount > MAX_WORDS) {
            M.toast({
                html: `❌ Exceeds ${MAX_WORDS} word limit by ${wordCount - MAX_WORDS} words`,
                classes: 'red'
            });
            return;
        }

        // Update original textarea
        $('#articleContent').val(editedContent);

        // Trigger input event to update word count
        $('#articleContent').trigger('input');

        // Close modal
        $('#textEditorModal').modal('close');

        M.toast({ html: '✓ Content updated', classes: 'green' });
    });

    // Clear editor
    $('#clearEditorBtn').on('click', function () {
        if (confirm('Clear all content?')) {
            $('#fullTextEditor').val('');
            updateEditorWordCount('');
            M.toast({ html: 'Editor cleared', classes: 'blue' });
        }
    });

    // Preview content
    $('#previewEditorBtn').on('click', function () {
        const content = $('#fullTextEditor').val();
        const formattedContent = formatPreviewContent(content);
        $('#editorPreviewContent').html(formattedContent);
        $('#editorPreviewModal').modal('open');
    });

    // Format preview content
    function formatPreviewContent(text) {
        if (!text) return '<p class="grey-text">No content to preview</p>';

        return text.split('\n\n').map(para =>
            `<p>${para.replace(/\n/g, '<br>')}</p>`
        ).join('');
    }

    // Toolbar formatting
    $('.tool-btn').on('click', function () {
        const format = $(this).data('format');
        const textarea = $('#fullTextEditor')[0];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let formattedText = '';

        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `_${selectedText}_`;
                break;
            case 'h2':
                formattedText = `\n## ${selectedText || 'Heading'}\n`;
                break;
            case 'quote':
                formattedText = `\n> ${selectedText || 'Quote'}\n`;
                break;
            case 'list-ul':
                formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
                break;
            case 'list-ol':
                formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
                break;
            case 'link':
                const url = prompt('Enter URL:', 'https://');
                if (url) {
                    formattedText = `[${selectedText || 'link'}](${url})`;
                }
                break;
            case 'image':
                const imageUrl = prompt('Enter image URL:', 'https://');
                if (imageUrl) {
                    formattedText = `![${selectedText || 'image'}](${imageUrl})`;
                }
                break;
        }

        if (formattedText) {
            // Insert formatted text
            textarea.value = textarea.value.substring(0, start) +
                formattedText +
                textarea.value.substring(end);

            // Update cursor position
            textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;

            // Trigger input event
            $(textarea).trigger('input');
        }
    });

    // Quick templates
    $('.template-btn').on('click', function () {
        const template = $(this).data('template');
        const templateText = getTemplate(template);

        if (templateText) {
            if ($('#fullTextEditor').val().length > 0) {
                if (!confirm('Replace current content with template?')) {
                    return;
                }
            }

            $('#fullTextEditor').val(templateText);
            updateEditorWordCount(templateText);

            M.toast({ html: `✓ ${template} template loaded`, classes: 'blue' });
        }
    });

    // Template content
    function getTemplate(type) {
        const templates = {
            news: `Breaking news from around the world...

The event unfolded earlier today as world leaders gathered to address pressing global concerns. The atmosphere was tense yet hopeful, with representatives from over 50 nations in attendance.

"Today marks a new chapter in international cooperation," stated the secretary-general during the opening remarks. "We must work together to solve the challenges that face all of humanity."

Key points discussed during the summit included climate change mitigation, economic recovery post-pandemic, and technological cooperation between nations. Delegates expressed cautious optimism about reaching consensus on several crucial issues.

The summit continues tomorrow with working groups focusing on specific policy areas. Observers note that this could be a turning point in multilateral diplomacy.`,

            opinion: `In my years of observing political trends, I've rarely seen such a clear divide in public opinion...

The current debate surrounding [topic] reveals deeper tensions in our society that cannot be ignored. On one hand, proponents argue that change is necessary and long overdue. On the other, traditionalists warn of unintended consequences.

What both sides fail to recognize is that the truth rarely lies in extremes. The path forward requires nuance, compromise, and a willingness to listen to all perspectives.

We must ask ourselves: What kind of society do we want to build for future generations? The answer to this question should guide our decisions, not short-term political gains.`,

            interview: `Q: Thank you for joining us today. Can you tell us about your latest project?

A: It's my pleasure. The project has been in development for three years, and we're finally ready to share it with the world. We've assembled an incredible team of experts who have pushed the boundaries of what's possible.

Q: What inspired this direction?

A: We noticed a gap in the market—people were asking for solutions that simply didn't exist yet. Our users' feedback drove us to innovate in ways we hadn't anticipated.

Q: What's next for your organization?

A: We're just getting started. The feedback has been overwhelming, and we're already planning the next phase. Stay tuned for announcements later this year.`,

            review: `Rating: ★★★★☆

From the opening scene to the closing credits, this [movie/album/product] delivers an experience that will stay with you long after it's over.

The standout element is undoubtedly the [specific aspect], which raises the bar for the entire genre. The attention to detail is remarkable, with every frame/minute/component carefully crafted.

However, it's not without its flaws. The pacing in the middle section could have been tighter, and some supporting elements feel underdeveloped.

Despite these minor quibbles, this is essential viewing/listening/reading for anyone interested in [topic/theme]. Highly recommended.`
        };

        return templates[type] || '';
    }

    // Keyboard shortcuts
    $('#fullTextEditor').on('keydown', function (e) {
        // Ctrl/Cmd + B for bold
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            $('[data-format="bold"]').click();
        }

        // Ctrl/Cmd + I for italic
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            $('[data-format="italic"]').click();
        }

        // Ctrl/Cmd + U for underline
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            $('[data-format="underline"]').click();
        }

        // Ctrl/Cmd + K for link
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('[data-format="link"]').click();
        }

        // Tab for indent
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;

            // Insert 4 spaces
            this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            $(this).trigger('input');
        }
    });

    // Helper function to count words (already exists, but ensure it's available)
    if (typeof countWords !== 'function') {
        window.countWords = function (text) {
            return text.trim().split(/\s+/).filter(word => word.length > 0).length;
        };
    }

    
    initializeDefaultPreview();
});

