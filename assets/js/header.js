/**
 * Loc801: Website Localization for Beginners
 * Header Component - Dynamically sets the course home link
 */

/**
 * Set the correct homepage link based on current language
 */
document.addEventListener('DOMContentLoaded', function() {
    const courseTitle = document.querySelector('.course-title');
    
    if (courseTitle) {
        const currentLang = document.documentElement.lang || 'en';
        const homeUrl = currentLang === 'es' ? '/inicio.html' : '/index.html';
        courseTitle.href = homeUrl;
    }
});
