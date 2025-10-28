// JavaScript pour les Pages d'Erreur (404, 500)

document.addEventListener('DOMContentLoaded', function() {
    initErrorPage();
});

function initErrorPage() {
    // Initialiser les informations de l'erreur
    setErrorTime();
    setSessionId();
    setErrorStack();

    // Ajouter des animations
    addErrorAnimations();

    // Gérer la recherche rapide
    initQuickSearch();
}

// Définir l'heure de l'erreur
function setErrorTime() {
    const errorTimeElement = document.getElementById('error-time');
    if (errorTimeElement) {
        const now = new Date();
        errorTimeElement.textContent = now.toLocaleString('fr-FR');
    }
}

// Définir l'ID de session
function setSessionId() {
    const sessionIdElement = document.getElementById('session-id');
    if (sessionIdElement) {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem('sessionId', sessionId);
        }
        sessionIdElement.textContent = sessionId;
    }
}

// Générer un ID de session
function generateSessionId() {
    return 'SESS_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Définir la stack trace d'erreur
function setErrorStack() {
    const errorStackElement = document.getElementById('error-stack');
    if (errorStackElement) {
        const stackTrace = `Error: Internal Server Error
    at ServerHandler.handleRequest (/app/server.js:45:12)
    at DatabaseConnection.query (/app/database.js:78:23)
    at PropertyService.getProperties (/app/services/property.js:156:8)
    at PropertyController.index (/app/controllers/property.js:34:15)
    at Router.handle (/app/routes/property.js:12:18)
    at Layer.handle (/node_modules/express/lib/router/layer.js:95:5)
    at next (/node_modules/express/lib/router/route.js:137:13)
    at Function.proto.handle (/node_modules/express/lib/router/index.js:251:22)
    at expressInit (/node_modules/express/lib/middleware/init.js:40:5)
    at Layer.handle (/node_modules/express/lib/router/layer.js:95:5)`;

        errorStackElement.textContent = stackTrace;
    }
}

// Ajouter des animations
function addErrorAnimations() {
    // Animation des cartes de suggestion
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Animation des boutons d'action
    const actionButtons = document.querySelectorAll('.error-actions button');
    actionButtons.forEach((button, index) => {
        button.style.animationDelay = `${index * 0.1}s`;
        button.classList.add('fade-in-up');
    });
}

// Initialiser la recherche rapide
function initQuickSearch() {
    const searchInput = document.getElementById('quick-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performQuickSearch();
            }
        });
    }
}

// Actions de navigation
function goHome() {
    window.location.href = '/';
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        goHome();
    }
}

function retryPage() {
    window.location.reload();
}

// Actions spécifiques 404
function searchProperties() {
    window.location.href = '/properties';
}

function goToProperties() {
    window.location.href = '/properties';
}

function goToContact() {
    window.location.href = '/contact';
}

function goToAbout() {
    window.location.href = '/about';
}

// Recherche rapide
function performQuickSearch() {
    const searchInput = document.getElementById('quick-search');
    const query = searchInput.value.trim();

    if (query) {
        // Simuler une recherche
        showSearchLoading();

        setTimeout(() => {
            // Rediriger vers la page de résultats
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }, 1000);
    } else {
        showToast('warning', 'Recherche vide', 'Veuillez saisir un terme de recherche.');
    }
}

function showSearchLoading() {
    const searchBtn = document.querySelector('.search-btn');
    const originalContent = searchBtn.innerHTML;

    searchBtn.innerHTML = '<div class="loader loader-sm"></div>';
    searchBtn.disabled = true;

    // Restaurer après 3 secondes maximum
    setTimeout(() => {
        searchBtn.innerHTML = originalContent;
        searchBtn.disabled = false;
    }, 3000);
}

// Actions spécifiques 500
function toggleTechnicalDetails() {
    const details = document.getElementById('technical-details');
    const button = document.querySelector('.btn-link');
    const icon = button.querySelector('.material-icons');

    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.textContent = 'expand_less';
        button.querySelector('span:last-child').textContent = 'Masquer les détails';
    } else {
        details.style.display = 'none';
        icon.textContent = 'expand_more';
        button.querySelector('span:last-child').textContent = 'Détails techniques';
    }
}

// Actions de contact
function goToHelp() {
    window.location.href = '/help';
}

function goToPrivacy() {
    window.location.href = '/privacy';
}

// Fonction utilitaire pour afficher des toasts
function showToast(type, title, message) {
    // Créer le container s'il n'existe pas
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        success: 'check_circle',
        warning: 'warning',
        error: 'error',
        info: 'info'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <span class="material-icons">${iconMap[type] || 'info'}</span>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <span class="material-icons">close</span>
        </button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Animation de sortie automatique
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

function closeToast(button) {
    const toast = button.closest('.toast');
    toast.classList.add('hide');

    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Gestion des erreurs JavaScript
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);

    // Envoyer l'erreur au serveur (si possible)
    if (typeof sendErrorReport === 'function') {
        sendErrorReport({
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error ? e.error.stack : null,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    }
});

// Fonction pour envoyer un rapport d'erreur
function sendErrorReport(errorData) {
    // Simuler l'envoi d'un rapport d'erreur
    console.log('Envoi du rapport d\'erreur:', errorData);

    // Dans une vraie application, vous feriez une requête AJAX ici
    // fetch('/api/error-report', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(errorData)
    // });
}

// Gestion des erreurs de promesses non capturées
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesse rejetée non gérée:', e.reason);

    // Empêcher le comportement par défaut
    e.preventDefault();

    // Afficher un toast d'erreur
    showToast('error', 'Erreur', 'Une erreur inattendue s\'est produite.');
});

// Fonction pour tester la connectivité
function testConnectivity() {
    return fetch('/api/health', {
            method: 'GET',
            cache: 'no-cache'
        })
        .then(response => response.ok)
        .catch(() => false);
}

// Vérifier la connectivité périodiquement (pour la page 500)
function startConnectivityCheck() {
    if (window.location.pathname.includes('500')) {
        setInterval(async() => {
            const isConnected = await testConnectivity();
            updateServiceStatus('api', isConnected);
        }, 30000); // Vérifier toutes les 30 secondes
    }
}

function updateServiceStatus(service, isOnline) {
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        const text = item.querySelector('.status-text').textContent.toLowerCase();
        if (text.includes(service)) {
            const indicator = item.querySelector('.status-indicator');
            indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        }
    });
}

// Initialiser la vérification de connectivité
startConnectivityCheck();

// CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
`;
document.head.appendChild(style);