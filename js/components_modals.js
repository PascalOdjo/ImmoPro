// Système de Modales Réutilisables

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Fermer les modals en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Fermer les modals avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    // Ouvrir une modal
    openModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal avec l'ID "${modalId}" non trouvée`);
            return;
        }

        // Fermer la modal active s'il y en a une
        if (this.activeModal) {
            this.closeModal();
        }

        // Configurer la modal
        this.configureModal(modal, options);

        // Afficher la modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.activeModal = modal;

        // Callback d'ouverture
        if (options.onOpen) {
            options.onOpen(modal);
        }
    }

    // Fermer la modal active
    closeModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            document.body.style.overflow = '';
            this.activeModal = null;
        }
    }

    // Configurer une modal
    configureModal(modal, options) {
        // Type de modal
        if (options.type) {
            modal.className = modal.className.replace(/modal-\w+/g, '');
            modal.classList.add(`modal-${options.type}`);
        }

        // Taille
        if (options.size) {
            modal.className = modal.className.replace(/modal-\w+/g, '');
            modal.classList.add(`modal-${options.size}`);
        }

        // Titre
        if (options.title) {
            const titleElement = modal.querySelector('.modal-header h2');
            if (titleElement) {
                titleElement.textContent = options.title;
            }
        }

        // Contenu
        if (options.content) {
            const bodyElement = modal.querySelector('.modal-body');
            if (bodyElement) {
                bodyElement.innerHTML = options.content;
            }
        }

        // Boutons
        if (options.buttons) {
            this.configureButtons(modal, options.buttons);
        }
    }

    // Configurer les boutons
    configureButtons(modal, buttons) {
        const footer = modal.querySelector('.modal-footer');
        if (!footer) return;

        footer.innerHTML = '';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn-${button.type || 'secondary'}`;
            btn.textContent = button.text;

            if (button.icon) {
                btn.innerHTML = `<span class="material-icons">${button.icon}</span> ${button.text}`;
            }

            if (button.onClick) {
                btn.addEventListener('click', button.onClick);
            }

            footer.appendChild(btn);
        });
    }

    // Méthodes utilitaires
    showConfirm(title, message, onConfirm, onCancel) {
        const content = `
            <div class="modal-icon warning">
                <span class="material-icons">warning</span>
            </div>
            <p>${message}</p>
        `;

        this.openModal('confirm-modal', {
            title: title,
            content: content,
            type: 'warning',
            buttons: [{
                    text: 'Annuler',
                    type: 'secondary',
                    onClick: () => {
                        this.closeModal();
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: 'Confirmer',
                    type: 'primary',
                    icon: 'check',
                    onClick: () => {
                        this.closeModal();
                        if (onConfirm) onConfirm();
                    }
                }
            ]
        });
    }

    showAlert(title, message, type = 'info') {
        const iconMap = {
            success: 'check_circle',
            warning: 'warning',
            error: 'error',
            info: 'info'
        };

        const content = `
            <div class="modal-icon ${type}">
                <span class="material-icons">${iconMap[type]}</span>
            </div>
            <p>${message}</p>
        `;

        this.openModal('alert-modal', {
            title: title,
            content: content,
            type: type,
            buttons: [{
                text: 'OK',
                type: 'primary',
                onClick: () => this.closeModal()
            }]
        });
    }

    showLoading(title, message) {
        const content = `
            <div class="modal-icon">
                <div class="loader loader-lg"></div>
            </div>
            <p>${message}</p>
        `;

        this.openModal('loading-modal', {
            title: title,
            content: content,
            type: 'info',
            buttons: []
        });
    }
}

// Initialiser le gestionnaire de modales
const modalManager = new ModalManager();

// Fonctions globales pour compatibilité
function showModal(modalId, options) {
    modalManager.openModal(modalId, options);
}

function closeModal() {
    modalManager.closeModal();
}

function showConfirm(title, message, onConfirm, onCancel) {
    modalManager.showConfirm(title, message, onConfirm, onCancel);
}

function showAlert(title, message, type) {
    modalManager.showAlert(title, message, type);
}

function showLoading(title, message) {
    modalManager.showLoading(title, message);
}

// Exporter pour utilisation dans d'autres modules
window.ModalManager = modalManager;
window.showModal = showModal;
window.closeModal = closeModal;
window.showConfirm = showConfirm;
window.showAlert = showAlert;
window.showLoading = showLoading;