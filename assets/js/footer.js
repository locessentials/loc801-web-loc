/**
 * Loc801: Website Localization for Beginners
 * Footer Component - Dynamically loads footer content
 */

// Global variable to store footer content
let footerContent = null;

/**
 * Initialize footer when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async function() {
    await loadFooterContent();
    renderFooter();
});

/**
 * Determine the correct path based on current location
 */
function getAssetPath() {
    const path = window.location.pathname;
    // If we're at root level (index.html, inicio.html, etc.)
    if (path === '/' || path.match(/^\/(index|inicio)\.html$/)) {
        return 'assets/data/footer-content.json';
    }
    // If we're in a subdirectory
    return '../assets/data/footer-content.json';
}

/**
 * Load footer content from JSON file
 */
async function loadFooterContent() {
    try {
        const response = await fetch(getAssetPath());
        if (!response.ok) {
            throw new Error('Failed to load footer content');
        }
        footerContent = await response.json();
    } catch (error) {
        console.error('Error loading footer content:', error);
        // Provide minimal fallback
        footerContent = { 
            en: { tagline: "Your localization thinking cap.", sections: {} }, 
            es: { tagline: "Your localization thinking cap.", sections: {} } 
        };
    }
}

/**
 * Render the footer
 */
function renderFooter() {
    const footerContainer = document.querySelector('.site-footer');
    if (!footerContainer || !footerContent) return;

    // Get current page language
    const currentLang = document.documentElement.lang || 'en';
    const content = footerContent[currentLang] || footerContent.en;

    // Build footer HTML
    const footerHTML = `
        <div class="footer-content">
            <div class="footer-column footer-left">
                <img src="${window.location.pathname === '/' || window.location.pathname.match(/^\/(index|inicio)\.html$/) ? 'assets/images/LocCapLogoTransparent.png' : '../assets/images/LocCapLogoTransparent.png'}" alt="Two toned baseball cap in blue with the phrase Loc in white lettering enclosed in a white square on the crown" class="footer-logo">
                <a href="https://locessentials.com" target="_blank" rel="noopener noreferrer" class="footer-brand">LocEssentials</a>
                <p class="footer-tagline">${content.tagline}</p>
            </div>
            
            <div class="footer-column">
                <h4>${content.sections.navigation.title}</h4>
                <ul class="footer-links">
                    ${content.sections.navigation.links.map(link => 
                        `<li><a href="${link.url}">${link.text}</a></li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>${content.sections.social.title}</h4>
                <ul class="footer-links">
                    ${content.sections.social.links.map(link => 
                        `<li><a href="${link.url}" ${link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${link.text}</a></li>`
                    ).join('')}
                </ul>
            </div>

            <div class="footer-column">
                <h4>${content.sections.legal.title}</h4>
                <ul class="footer-links">
                    ${content.sections.legal.links.map(link => 
                        `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a></li>`
                    ).join('')}
                </ul>
            </div>
        </div>
    `;

    footerContainer.innerHTML = footerHTML;
}

/**
 * Helper function to manually reload footer (can be called after language switch)
 */
function reloadFooter() {
    renderFooter();
}