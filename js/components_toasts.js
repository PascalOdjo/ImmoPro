// Système de Toasts/Notifications

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    // Afficher un toast
    show(type, title, message, options = {}) {
        const toastId = this.generateId();
        const toast = this.createToast(toastId, type, title, message, options);

        this.container.appendChild(toast);
        this.toasts.set(toastId, toast);

        // Animation d'entrée
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto-fermeture
        if (options.duration !== 0) {
            const duration = options.duration || 5000;
            setTimeout(() => {
                this.hide(toastId);
            }, duration);
        }

        return toastId;
    }

    // Créer un toast
    createToast(id, type, title, message, options) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('data-toast-id', id);

        const iconMap = {
            success: 'check_circle',
            warning: 'warning',
            error: 'error',
            info: 'info'
        };

        let actionsHtml = '';
        if (options.actions) {
            actionsHtml = '<div class="toast-actions">';
            options.actions.forEach(action => {
                actionsHtml += `<button class="toast-action ${action.type || ''}" onclick="${action.onClick}">${action.text}</button>`;
            });
            actionsHtml += '</div>';
        }

        toast.innerHTML = `
            <div class="toast-icon">
                <span class="material-icons">${iconMap[type] || 'info'}</span>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
                ${actionsHtml}
            </div>
            <button class="toast-close" onclick="toastManager.hide('${id}')">
                <span class="material-icons">close</span>
            </button>
            <div class="toast-progress"></div>
        `;

        return toast;
    }

    // Masquer un toast
    hide(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;

        toast.classList.add('hide');

        setTimeout(() => {
            toast.remove();
            this.toasts.delete(toastId);
        }, 300);
    }

    // Masquer tous les toasts
    hideAll() {
        this.toasts.forEach((toast, id) => {
            this.hide(id);
        });
    }

    // Générer un ID unique
    generateId() {
        return 'toast_' + Math.random().toString(36).substr(2, 9);
    }

    // Méthodes de convenance
    success(title, message, options) {
        return this.show('success', title, message, options);
    }

    warning(title, message, options) {
        return this.show('warning', title, message, options);
    }

    error(title, message, options) {
        return this.show('error', title, message, options);
    }

    info(title, message, options) {
        return this.show('info', title, message, options);
    }

    // Toast avec actions
    showWithActions(type, title, message, actions) {
        return this.show(type, title, message, { actions });
    }

    // Toast persistant
    showPersistent(type, title, message) {
        return this.show(type, title, message, { duration: 0 });
    }

    // Toast compact
    showCompact(type, title, message) {
        const toastId = this.show(type, title, message);
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.classList.add('toast-compact');
        }
        return toastId;
    }

    // Toast large
    showLarge(type, title, message) {
        const toastId = this.show(type, title, message);
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.classList.add('toast-large');
        }
        return toastId;
    }
}

// Initialiser le gestionnaire de toasts
const toastManager = new ToastManager();

// Fonctions globales pour compatibilité
function showToast(type, title, message, options) {
    return toastManager.show(type, title, message, options);
}

function showSuccessToast(title, message, options) {
    return toastManager.success(title, message, options);
}

function showWarningToast(title, message, options) {
    return toastManager.warning(title, message, options);
}

function showErrorToast(title, message, options) {
    return toastManager.error(title, message, options);
}

function showInfoToast(title, message, options) {
    return toastManager.info(title, message, options);
}

function hideToast(toastId) {
    toastManager.hide(toastId);
}

function hideAllToasts() {
    toastManager.hideAll();
}

// Exporter pour utilisation dans d'autres modules
window.ToastManager = toastManager;
window.showToast = showToast;
window.showSuccessToast = showSuccessToast;
window.showWarningToast = showWarningToast;
window.showErrorToast = showErrorToast;
window.showInfoToast = showInfoToast;
window.hideToast = hideToast;
window.hideAllToasts = hideAllToasts;