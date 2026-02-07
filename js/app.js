// TAUsers - Application Logic

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('TAUsers application loaded');
    
    // Set current year in footer
    updateFooterYear();
    
    // Initialize user session
    initializeUserSession();
    
    // Add smooth scrolling
    addSmoothScrolling();
});

// Update footer year
function updateFooterYear() {
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = `© ${currentYear} TAUsers - Приложения для tashi-ani.ru`;
    }
}

// Initialize user session (placeholder)
function initializeUserSession() {
    // Check if user is logged in (using localStorage as example)
    const user = localStorage.getItem('tausers_user');
    
    if (!user) {
        // Create demo user for demonstration
        const demoUser = {
            id: 1,
            name: 'Демо пользователь',
            email: 'demo@tashi-ani.ru',
            registrationDate: new Date().toISOString()
        };
        localStorage.setItem('tausers_user', JSON.stringify(demoUser));
    }
}

// Get current user
function getCurrentUser() {
    const userJson = localStorage.getItem('tausers_user');
    return userJson ? JSON.parse(userJson) : null;
}

// Update user profile
function updateUserProfile(userData) {
    localStorage.setItem('tausers_user', JSON.stringify(userData));
    return true;
}

// Requests management
const requestsDB = {
    get: function() {
        const requests = localStorage.getItem('tausers_requests');
        return requests ? JSON.parse(requests) : [];
    },
    
    save: function(requests) {
        localStorage.setItem('tausers_requests', JSON.stringify(requests));
    },
    
    add: function(request) {
        const requests = this.get();
        // Generate unique ID using timestamp and random component
        // Check for collisions and regenerate if necessary
        let newId;
        let attempts = 0;
        do {
            newId = Date.now() + Math.floor(Math.random() * 10000);
            attempts++;
        } while (requests.some(r => r.id === newId) && attempts < 10);
        
        request.id = newId;
        request.status = 'new';
        request.createdAt = new Date().toISOString();
        requests.push(request);
        this.save(requests);
        return request;
    },
    
    update: function(id, updates) {
        const requests = this.get();
        const index = requests.findIndex(r => r.id === id);
        if (index !== -1) {
            requests[index] = { ...requests[index], ...updates };
            this.save(requests);
            return true;
        }
        return false;
    },
    
    delete: function(id) {
        const requests = this.get();
        const filtered = requests.filter(r => r.id !== id);
        this.save(filtered);
        return true;
    }
};

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status text in Russian
function getStatusText(status) {
    const statusMap = {
        'new': 'Новая',
        'processing': 'В обработке',
        'completed': 'Завершена',
        'rejected': 'Отклонена'
    };
    return statusMap[status] || status;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add smooth scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other pages
window.TAUsers = {
    getCurrentUser,
    updateUserProfile,
    requestsDB,
    formatDate,
    getStatusText,
    showNotification
};
