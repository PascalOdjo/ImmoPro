// Gestion des Cookies et RGPD
document.addEventListener('DOMContentLoaded', function() {
    initCookieBanner();
});

// Initialisation du banner cookies
function initCookieBanner() {
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        showCookieBanner();
    } else {
        showCookieSettingsButton();
        loadCookiePreferences();
    }
}

// Afficher le banner cookies
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('show');
    }
}

// Masquer le banner cookies
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }
}

// Accepter tous les cookies
function acceptAllCookies() {
    const preferences = {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

    hideCookieBanner();
    showCookieSettingsButton();
    showToast('success', 'Cookies acceptés', 'Tous les cookies ont été acceptés.');

    // Charger les scripts selon les préférences
    loadCookieScripts(preferences);
}

// Accepter seulement les cookies nécessaires
function acceptNecessaryCookies() {
    const preferences = {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

    hideCookieBanner();
    showCookieSettingsButton();
    showToast('info', 'Cookies nécessaires', 'Seuls les cookies nécessaires ont été acceptés.');

    // Charger les scripts selon les préférences
    loadCookieScripts(preferences);
}

// Afficher les paramètres cookies
function showCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Charger les préférences actuelles
        loadCurrentPreferences();
    }
}

// Fermer les paramètres cookies
function closeCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sauvegarder les paramètres cookies
function saveCookieSettings() {
    const preferences = {
        necessary: true, // Toujours true
        functional: document.getElementById('functional-cookies').checked,
        analytics: document.getElementById('analytics-cookies').checked,
        marketing: document.getElementById('marketing-cookies').checked,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

    closeCookieSettings();
    hideCookieBanner();
    showCookieSettingsButton();
    showToast('success', 'Paramètres sauvegardés', 'Vos préférences de cookies ont été mises à jour.');

    // Charger les scripts selon les préférences
    loadCookieScripts(preferences);
}

// Charger les préférences actuelles
function loadCurrentPreferences() {
    const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');

    document.getElementById('functional-cookies').checked = preferences.functional !== false;
    document.getElementById('analytics-cookies').checked = preferences.analytics !== false;
    document.getElementById('marketing-cookies').checked = preferences.marketing === true;
}

// Charger les préférences cookies
function loadCookiePreferences() {
    const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
    loadCookieScripts(preferences);
}

// Charger les scripts selon les préférences
function loadCookieScripts(preferences) {
    // Scripts fonctionnels
    if (preferences.functional) {
        loadFunctionalScripts();
    }

    // Scripts analytiques
    if (preferences.analytics) {
        loadAnalyticsScripts();
    }

    // Scripts marketing
    if (preferences.marketing) {
        loadMarketingScripts();
    }
}

// Charger les scripts fonctionnels
function loadFunctionalScripts() {
    console.log('Chargement des scripts fonctionnels...');

    // Exemple : charger un script pour les préférences utilisateur
    // loadScript('js/functional-cookies.js');
}

// Charger les scripts analytiques
function loadAnalyticsScripts() {
    console.log('Chargement des scripts analytiques...');

    // Exemple : Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID');
}

// Charger les scripts marketing
function loadMarketingScripts() {
    console.log('Chargement des scripts marketing...');

    // Exemple : Facebook Pixel, Google Ads, etc.
    // fbq('init', 'FACEBOOK_PIXEL_ID');
}

// Afficher le bouton paramètres cookies
function showCookieSettingsButton() {
    const button = document.getElementById('cookie-settings-button');
    if (button) {
        button.classList.add('show');
    }
}

// Masquer le bouton paramètres cookies
function hideCookieSettingsButton() {
    const button = document.getElementById('cookie-settings-button');
    if (button) {
        button.classList.remove('show');
    }
}

// Afficher la politique de confidentialité
function showPrivacyPolicy() {
    const modal = document.getElementById('privacy-policy-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fermer la politique de confidentialité
function closePrivacyPolicy() {
    const modal = document.getElementById('privacy-policy-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fonction utilitaire pour charger un script
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
}

// Fonction utilitaire pour afficher un toast
function showToast(type, title, message) {
    // Cette fonction sera définie dans le fichier des toasts
    if (typeof window.showToast === 'function') {
        window.showToast(type, title, message);
    } else {
        console.log(`Toast ${type}: ${title} - ${message}`);
    }
}

// Gestion des événements
document.addEventListener('click', function(e) {
    // Fermer les modals en cliquant en dehors
    if (e.target.classList.contains('modal')) {
        const cookieModal = document.getElementById('cookie-settings-modal');
        const privacyModal = document.getElementById('privacy-policy-modal');

        if (cookieModal && cookieModal.classList.contains('active')) {
            closeCookieSettings();
        }

        if (privacyModal && privacyModal.classList.contains('active')) {
            closePrivacyPolicy();
        }
    }
});

// Fermer les modals avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cookieModal = document.getElementById('cookie-settings-modal');
        const privacyModal = document.getElementById('privacy-policy-modal');

        if (cookieModal && cookieModal.classList.contains('active')) {
            closeCookieSettings();
        }

        if (privacyModal && privacyModal.classList.contains('active')) {
            closePrivacyPolicy();
        }
    }
});

// Fonctions utilitaires pour les cookies
const CookieUtils = {
    // Définir un cookie
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    // Obtenir un cookie
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    // Supprimer un cookie
    deleteCookie: function(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },

    // Obtenir tous les cookies
    getAllCookies: function() {
        const cookies = {};
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            const parts = c.split('=');
            if (parts.length === 2) {
                cookies[parts[0]] = parts[1];
            }
        }
        return cookies;
    }
};

// Exporter les fonctions pour utilisation globale
window.CookieManager = {
    acceptAllCookies,
    acceptNecessaryCookies,
    showCookieSettings,
    closeCookieSettings,
    saveCookieSettings,
    showPrivacyPolicy,
    closePrivacyPolicy,
    CookieUtils
};