// Marketplace Frontend App Functions

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Marketplace frontend initialized');
    
    // Set up any additional initialization here
    setupEventListeners();
});

// Set up event listeners for UI elements
function setupEventListeners() {
    // Add any additional event listeners here
    console.log('Event listeners set up');
}

// UI Helper Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Export functions for global use
window.marketplaceApp = {
    showNotification
};