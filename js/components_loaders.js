// Système de Loaders/Spinners

class LoaderManager {
    constructor() {
        this.loaders = new Map();
        this.init();
    }

    init() {
        // Créer les styles CSS pour les animations
        this.createStyles();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes dotPulse {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes barPulse {
                0%, 40%, 100% {
                    transform: scaleY(0.4);
                    opacity: 0.5;
                }
                20% {
                    transform: scaleY(1);
                    opacity: 1;
                }
            }
            
            @keyframes circleRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
            
            @keyframes wave {
                0%, 40%, 100% {
                    transform: scaleY(0.4);
                }
                20% {
                    transform: scaleY(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Créer un loader
    create(type = 'spinner', options = {}) {
        const loaderId = this.generateId();
        const loader = this.createLoaderElement(type, options);

        this.loaders.set(loaderId, {
            element: loader,
            type: type,
            options: options
        });

        return loaderId;
    }

    // Créer l'élément loader
    createLoaderElement(type, options) {
        const loader = document.createElement('div');
        loader.className = `loader loader-${options.size || 'md'} loader-${options.color || 'primary'}`;

        switch (type) {
            case 'spinner':
                loader.innerHTML = '';
                break;
            case 'dots':
                loader.className = 'loader-dots';
                loader.innerHTML = '<div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div>';
                break;
            case 'bars':
                loader.className = 'loader-bars';
                loader.innerHTML = '<div class="loader-bar"></div><div class="loader-bar"></div><div class="loader-bar"></div><div class="loader-bar"></div><div class="loader-bar"></div>';
                break;
            case 'circle':
                loader.className = 'loader-circle';
                break;
            case 'pulse':
                loader.className = 'loader-pulse';
                break;
            case 'wave':
                loader.className = 'loader-wave';
                loader.innerHTML = '<div class="loader-wave-bar"></div><div class="loader-wave-bar"></div><div class="loader-wave-bar"></div><div class="loader-wave-bar"></div><div class="loader-wave-bar"></div>';
                break;
        }

        return loader;
    }

    // Afficher un loader dans un élément
    showInElement(elementId, type = 'spinner', options = {}) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Élément avec l'ID "${elementId}" non trouvé`);
            return null;
        }

        const loaderId = this.create(type, options);
        const loader = this.loaders.get(loaderId);

        element.appendChild(loader.element);
        element.style.position = 'relative';

        return loaderId;
    }

    // Masquer un loader
    hide(loaderId) {
        const loaderData = this.loaders.get(loaderId);
        if (!loaderData) return;

        loaderData.element.remove();
        this.loaders.delete(loaderId);
    }

    // Masquer tous les loaders
    hideAll() {
        this.loaders.forEach((loaderData, id) => {
            this.hide(id);
        });
    }

    // Loader en overlay
    showOverlay(message = 'Chargement...', options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'loader-overlay';
        if (options.dark) {
            overlay.classList.add('loader-overlay-dark');
        }

        const content = document.createElement('div');
        content.className = 'loader-overlay-content';

        const loader = this.createLoaderElement(options.type || 'spinner', options);
        const text = document.createElement('div');
        text.className = 'loader-overlay-text';
        text.textContent = message;

        content.appendChild(loader);
        content.appendChild(text);
        overlay.appendChild(content);

        document.body.appendChild(overlay);

        return overlay;
    }

    // Masquer l'overlay
    hideOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.remove();
        }
    }

    // Loader de page complète
    showPageLoader(message = 'Chargement...', subMessage = 'Veuillez patienter...') {
        const pageLoader = document.createElement('div');
        pageLoader.className = 'page-loader';

        const content = document.createElement('div');
        content.className = 'page-loader-content';

        const logo = document.createElement('div');
        logo.className = 'page-loader-logo';
        logo.textContent = 'IP';

        const text = document.createElement('div');
        text.className = 'page-loader-text';
        text.textContent = message;

        const subText = document.createElement('div');
        subText.className = 'page-loader-subtext';
        subText.textContent = subMessage;

        const loader = this.createLoaderElement('spinner', { size: 'lg' });

        content.appendChild(logo);
        content.appendChild(text);
        content.appendChild(subText);
        content.appendChild(loader);
        pageLoader.appendChild(content);

        document.body.appendChild(pageLoader);

        return pageLoader;
    }

    // Masquer le loader de page
    hidePageLoader(pageLoader) {
        if (pageLoader && pageLoader.parentNode) {
            pageLoader.remove();
        }
    }

    // Loader en bouton
    setButtonLoading(buttonId, loading = true) {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.error(`Bouton avec l'ID "${buttonId}" non trouvé`);
            return;
        }

        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;

            const loader = this.createLoaderElement('spinner', { size: 'sm' });
            button.appendChild(loader);
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;

            const loader = button.querySelector('.loader');
            if (loader) {
                loader.remove();
            }
        }
    }

    // Générer un ID unique
    generateId() {
        return 'loader_' + Math.random().toString(36).substr(2, 9);
    }

    // Méthodes de convenance
    showSpinner(elementId, size = 'md', color = 'primary') {
        return this.showInElement(elementId, 'spinner', { size, color });
    }

    showDots(elementId) {
        return this.showInElement(elementId, 'dots');
    }

    showBars(elementId) {
        return this.showInElement(elementId, 'bars');
    }

    showCircle(elementId) {
        return this.showInElement(elementId, 'circle');
    }

    showPulse(elementId) {
        return this.showInElement(elementId, 'pulse');
    }

    showWave(elementId) {
        return this.showInElement(elementId, 'wave');
    }
}

// Initialiser le gestionnaire de loaders
const loaderManager = new LoaderManager();

// Fonctions globales pour compatibilité
function showLoader(elementId, type, options) {
    return loaderManager.showInElement(elementId, type, options);
}

function hideLoader(loaderId) {
    loaderManager.hide(loaderId);
}

function showOverlayLoader(message, options) {
    return loaderManager.showOverlay(message, options);
}

function hideOverlayLoader(overlay) {
    loaderManager.hideOverlay(overlay);
}

function showPageLoader(message, subMessage) {
    return loaderManager.showPageLoader(message, subMessage);
}

function hidePageLoader(pageLoader) {
    loaderManager.hidePageLoader(pageLoader);
}

function setButtonLoading(buttonId, loading) {
    loaderManager.setButtonLoading(buttonId, loading);
}

// Exporter pour utilisation dans d'autres modules
window.LoaderManager = loaderManager;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.showOverlayLoader = showOverlayLoader;
window.hideOverlayLoader = hideOverlayLoader;
window.showPageLoader = showPageLoader;
window.hidePageLoader = hidePageLoader;
window.setButtonLoading = setButtonLoading;