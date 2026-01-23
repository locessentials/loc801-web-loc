/**
 * Loc801: Website Localization for Beginners
 * Topic Navigation - Dynamically generates prev/next buttons
 */

// Global variables
let courseStructure = null;
let navigationLabels = null;

/**
 * Initialize navigation when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async function() {
    await loadNavigationData();
    renderTopicNavigation();
});

/**
 * Load course structure and navigation labels
 */
async function loadNavigationData() {
    try {
        // Load course structure
        const structureResponse = await fetch('../assets/course-structure.json');
        if (!structureResponse.ok) throw new Error('Failed to load course structure');
        courseStructure = await structureResponse.json();

        // Load navigation labels
        const labelsResponse = await fetch('../assets/navigation-labels.json');
        if (!labelsResponse.ok) throw new Error('Failed to load navigation labels');
        navigationLabels = await labelsResponse.json();
    } catch (error) {
        console.error('Error loading navigation data:', error);
    }
}

/**
 * Find the current page in the course structure
 */
function findCurrentPage() {
    if (!courseStructure) return null;

    // Get current path and decode it to handle special characters like accents
    const currentPath = decodeURIComponent(window.location.pathname);
    const currentLang = document.documentElement.lang || 'en';
    const structure = courseStructure[currentLang] || courseStructure.en;

    for (let topicIndex = 0; topicIndex < structure.topics.length; topicIndex++) {
        const topic = structure.topics[topicIndex];
        for (let pageIndex = 0; pageIndex < topic.pages.length; pageIndex++) {
            const page = topic.pages[pageIndex];
            // Decode the URL from JSON too, in case it has encoded characters
            const decodedPageUrl = decodeURIComponent(page.url);
            if (currentPath.endsWith(decodedPageUrl)) {
                return {
                    topicIndex,
                    pageIndex,
                    topic,
                    page
                };
            }
        }
    }
    return null;
}

/**
 * Get the previous page
 */
function getPreviousPage(currentLocation) {
    if (!currentLocation) return null;

    const currentLang = document.documentElement.lang || 'en';
    const structure = courseStructure[currentLang] || courseStructure.en;
    const { topicIndex, pageIndex } = currentLocation;

    // If not the first page in topic, go to previous page in same topic
    if (pageIndex > 0) {
        return structure.topics[topicIndex].pages[pageIndex - 1];
    }

    // If first page in topic and not first topic, go to last page of previous topic
    if (topicIndex > 0) {
        const previousTopic = structure.topics[topicIndex - 1];
        return previousTopic.pages[previousTopic.pages.length - 1];
    }

    // First page of first topic - no previous
    return null;
}

/**
 * Get the next page
 */
function getNextPage(currentLocation) {
    if (!currentLocation) return null;

    const currentLang = document.documentElement.lang || 'en';
    const structure = courseStructure[currentLang] || courseStructure.en;
    const { topicIndex, pageIndex, topic } = currentLocation;

    // If not the last page in topic, go to next page in same topic
    if (pageIndex < topic.pages.length - 1) {
        return topic.pages[pageIndex + 1];
    }

    // If last page in topic and not last topic, go to first page of next topic
    if (topicIndex < structure.topics.length - 1) {
        return structure.topics[topicIndex + 1].pages[0];
    }

    // Last page of last topic - no next
    return null;
}

/**
 * Render the topic navigation buttons
 */
function renderTopicNavigation() {
    const navContainer = document.querySelector('.topic-nav');
    if (!navContainer || !courseStructure || !navigationLabels) return;

    const currentLocation = findCurrentPage();
    if (!currentLocation) return;

    const currentLang = document.documentElement.lang || 'en';
    const labels = navigationLabels[currentLang] || navigationLabels.en;

    const previousPage = getPreviousPage(currentLocation);
    const nextPage = getNextPage(currentLocation);

    let navHTML = '';

    // Previous button
    if (previousPage) {
        navHTML += `
            <a href="${previousPage.url}" class="nav-btn prev">
                ${labels.previous} ${previousPage.label}
            </a>
        `;
    }

    // Next button
    if (nextPage) {
        // Check if current page is the first page in a topic (intro/primer)
        const isFirstPageInTopic = currentLocation.pageIndex === 0;
        
        if (isFirstPageInTopic) {
            // Use "Start Topic X" for the button from intro to first content page
            navHTML += `
                <a href="${nextPage.url}" class="nav-btn next">
                    ${labels.startTopic} ${currentLocation.topic.number} ${labels.nextArrow}
                </a>
            `;
        } else {
            // Regular "Next: Page Name" button
            navHTML += `
                <a href="${nextPage.url}" class="nav-btn next">
                    ${labels.next} ${nextPage.label} ${labels.nextArrow}
                </a>
            `;
        }
    }

    navContainer.innerHTML = navHTML;
}

/**
 * Helper function to manually reload navigation (can be called after language switch)
 */
function reloadNavigation() {
    renderTopicNavigation();
}