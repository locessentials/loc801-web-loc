/**
 * Loc801: Website Localization for Beginners
 * Navigation Menu - For Outline Page
 */

// Global variable to store course structure
let courseStructure = null;

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await loadCourseStructure();
    
    // Check if we're on the outline page
    if (document.querySelector('.outline-topics')) {
        initOutlinePage();
    }
});

/**
 * Load course structure from JSON file
 */
async function loadCourseStructure() {
    try {
        const response = await fetch('../assets/course-structure.json');
        if (!response.ok) {
            throw new Error('Failed to load course structure');
        }
        courseStructure = await response.json();
    } catch (error) {
        console.error('Error loading course structure:', error);
        // Provide fallback
        courseStructure = { 
            en: { mainLinks: [], topicsTitle: 'Topics', topics: [] }, 
            es: { mainLinks: [], topicsTitle: 'Temas', topics: [] } 
        };
    }
}

/**
 * Initialize the outline page
 */
function initOutlinePage() {
    const currentLang = document.documentElement.lang || 'en';
    renderOutline(currentLang);
}

/**
 * Render the outline page content
 */
function renderOutline(lang) {
    const outlineContainer = document.querySelector('.outline-topics');
    if (!outlineContainer || !courseStructure) return;

    const structure = courseStructure[lang] || courseStructure.en;
    
    let html = '';
    
    structure.topics.forEach(topic => {
        html += `
            <div class="outline-topic">
                <div class="outline-topic-header">
                    <div class="outline-topic-number">${topic.number}</div>
                    <h2 class="outline-topic-title">${topic.title}</h2>
                </div>
                <div class="outline-topic-pages">
        `;
        
        topic.pages.forEach(page => {
            html += `
                <a href="${page.url}" class="outline-page-link">${page.label}</a>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    outlineContainer.innerHTML = html;
}