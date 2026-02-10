/**
 * HTML Code Viewer - Interactive Code/Result Toggler
 * Allows users to switch between viewing HTML code and its rendered result
 * Also handles JSON comparison views
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all code example wrappers
    const codeWrappers = document.querySelectorAll('.code-example-wrapper');
    
    codeWrappers.forEach(wrapper => {
        const tabs = wrapper.querySelectorAll('.code-tab');
        
        // Check if this is a JSON comparer or HTML viewer
        const isJsonComparer = wrapper.querySelector('.json-comparer');
        
        if (isJsonComparer) {
            // Handle JSON views
            const jsonViews = wrapper.querySelectorAll('.json-view');
            
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and views
                    tabs.forEach(t => t.classList.remove('active'));
                    jsonViews.forEach(v => v.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding view
                    tab.classList.add('active');
                    jsonViews[index].classList.add('active');
                });
            });
        } else {
            // Handle HTML code/result views (original functionality)
            const codeView = wrapper.querySelector('.code-view');
            const resultView = wrapper.querySelector('.result-view');
            
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs in this wrapper
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Toggle views based on which tab was clicked
                    if (index === 0) {
                        // Show code view
                        codeView.classList.add('active');
                        resultView.classList.remove('active');
                    } else {
                        // Show result view
                        codeView.classList.remove('active');
                        resultView.classList.add('active');
                    }
                });
            });
        }
    });
});