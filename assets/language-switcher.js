/**
 * Loc801: Website Localization for Beginners
 * Language Switcher - Dynamically finds equivalent pages across languages
 */

// Global variable to store course structure
let courseStructureForLangSwitch = null;

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await loadCourseStructureForLangSwitch();
    initLanguageSwitcher();
    restoreScrollPosition();
});

/**
 * Load course structure from JSON file
 */
async function loadCourseStructureForLangSwitch() {
    try {
        const response = await fetch('../assets/course-structure.json');
        if (!response.ok) {
            throw new Error('Failed to load course structure');
        }
        courseStructureForLangSwitch = await response.json();
    } catch (error) {
        console.error('Error loading course structure for language switch:', error);
    }
}

/**
 * Find the current page's position in the course structure
 */
function findCurrentPagePosition() {
    if (!courseStructureForLangSwitch) return null;

    const currentPath = decodeURIComponent(window.location.pathname);
    const currentLang = document.documentElement.lang || 'en';
    const structure = courseStructureForLangSwitch[currentLang] || courseStructureForLangSwitch.en;

    // Check main links first
    for (let i = 0; i < structure.mainLinks.length; i++) {
        const link = structure.mainLinks[i];
        if (currentPath.endsWith(link.url) || currentPath === link.url) {
            return {
                type: 'mainLink',
                index: i
            };
        }
    }

    // Check topic pages
    for (let topicIndex = 0; topicIndex < structure.topics.length; topicIndex++) {
        const topic = structure.topics[topicIndex];
        for (let pageIndex = 0; pageIndex < topic.pages.length; pageIndex++) {
            const page = topic.pages[pageIndex];
            const decodedPageUrl = decodeURIComponent(page.url);
            if (currentPath.endsWith(decodedPageUrl)) {
                return {
                    type: 'topicPage',
                    topicIndex,
                    pageIndex
                };
            }
        }
    }

    return null;
}

/**
 * Get the equivalent page in the target language
 */
function getEquivalentPage(targetLang) {
    const currentPosition = findCurrentPagePosition();
    if (!currentPosition || !courseStructureForLangSwitch) return null;

    const targetStructure = courseStructureForLangSwitch[targetLang];
    if (!targetStructure) return null;

    if (currentPosition.type === 'mainLink') {
        // Return the equivalent main link
        return targetStructure.mainLinks[currentPosition.index]?.url || null;
    } else if (currentPosition.type === 'topicPage') {
        // Return the equivalent topic page
        const targetTopic = targetStructure.topics[currentPosition.topicIndex];
        if (!targetTopic) return null;
        return targetTopic.pages[currentPosition.pageIndex]?.url || null;
    }

    return null;
}

/**
 * Set the active language button based on current page language
 */
function setActiveLanguage() {
    const currentLang = document.documentElement.lang || 'en';
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        if (button.dataset.lang === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Initialize the language switching functionality
 */
function initLanguageSwitcher() {
    // Set the active language button on page load
    setActiveLanguage();
    
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const targetLang = button.dataset.lang;
            const currentLang = document.documentElement.lang || 'en';
            
            // Don't do anything if clicking the current language
            if (targetLang === currentLang) return;
            
            // Save language preference
            localStorage.setItem('loc801-language', targetLang);
            
            // Get the equivalent page in the target language
            const equivalentPage = getEquivalentPage(targetLang);
            
            if (equivalentPage) {
                saveScrollPosition();
                window.location.href = equivalentPage;
            } else {
                // Fallback to homepage if no equivalent page found
                console.warn('No equivalent page found, redirecting to homepage');
                window.location.href = '/';
            }
        });
    });
}

/**
 * Save current scroll position to localStorage
 */
function saveScrollPosition() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    localStorage.setItem('loc801-scroll-position', scrollPosition.toString());
}

/**
 * Restore scroll position from localStorage
 */
function restoreScrollPosition() {
    const savedScroll = localStorage.getItem('loc801-scroll-position');
    
    if (savedScroll !== null) {
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedScroll, 10),
                behavior: 'instant'
            });
            
            localStorage.removeItem('loc801-scroll-position');
        }, 50);
    }
}