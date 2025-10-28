// Page Profil - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientProfil();
});

function initClientProfil() {
    // Initialiser les interactions du profil
    initTabs();
    initPasswordStrength();
    initPasswordRequirements();
    initNotificationToggles();
    initFormValidation();
    initModals();
    initPhotoUpload();
}

// Gestion des onglets
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Retirer la classe active de tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Ajouter la classe active à l'onglet sélectionné
    const selectedTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    const selectedContent = document.getElementById(`tab-${tabName}`);

    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// Gestion de la force du mot de passe
function initPasswordStrength() {
    const passwordInput = document.getElementById('new-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
}

function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    if (!strengthFill || !strengthText) return;

    let strength = 0;
    let strengthLabel = 'Mot de passe faible';
    let strengthClass = '';

    // Vérifier la longueur
    if (password.length >= 8) strength += 1;

    // Vérifier les caractères
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Déterminer la force
    if (strength <= 2) {
        strengthLabel = 'Mot de passe faible';
        strengthClass = '';
    } else if (strength <= 4) {
        strengthLabel = 'Mot de passe moyen';
        strengthClass = 'medium';
    } else {
        strengthLabel = 'Mot de passe fort';
        strengthClass = 'strong';
    }

    // Mettre à jour l'affichage
    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthText.textContent = strengthLabel;
}

// Gestion des exigences du mot de passe
function initPasswordRequirements() {
    const passwordInput = document.getElementById('new-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordRequirements(this.value);
        });
    }
}

function checkPasswordRequirements(password) {
    const requirements = {
        'req-length': password.length >= 8,
        'req-uppercase': /[A-Z]/.test(password),
        'req-lowercase': /[a-z]/.test(password),
        'req-number': /[0-9]/.test(password),
        'req-special': /[^A-Za-z0-9]/.test(password)
    };

    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            if (requirements[reqId]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });
}

// Gestion des toggles de notification
function initNotificationToggles() {
    const toggles = document.querySelectorAll('.toggle-switch input');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const category = this.closest('.notification-category').querySelector('h3').textContent;
            const setting = this.closest('.notification-item').querySelector('h4').textContent;
            const isEnabled = this.checked;

            console.log(`${category} - ${setting}: ${isEnabled ? 'Activé' : 'Désactivé'}`);

            // Ici on pourrait sauvegarder les préférences
            saveNotificationPreference(category, setting, isEnabled);
        });
    });
}

function saveNotificationPreference(category, setting, isEnabled) {
    // Simulation de sauvegarde
    const preferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');

    if (!preferences[category]) {
        preferences[category] = {};
    }

    preferences[category][setting] = isEnabled;

    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
}

// Validation des formulaires
function initFormValidation() {
    const forms = document.querySelectorAll('form, .profile-form, .security-form, .preferences-form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '' && field.checkValidity();

    if (isValid) {
        field.classList.remove('error');
        field.style.borderColor = '#ddd';
    } else {
        field.classList.add('error');
        field.style.borderColor = 'var(--error)';
    }

    return isValid;
}

// Gestion des modals
function initModals() {
    // Modal de suppression de compte
    const deleteModal = document.getElementById('delete-account-modal');
    const confirmInput = document.getElementById('confirm-delete');
    const confirmButton = document.querySelector('.btn-danger[onclick="confirmDeleteAccount()"]');

    if (confirmInput && confirmButton) {
        confirmInput.addEventListener('input', function() {
            const isValid = this.value.toUpperCase() === 'SUPPRIMER';
            confirmButton.disabled = !isValid;

            if (isValid) {
                confirmButton.style.backgroundColor = 'var(--error)';
            } else {
                confirmButton.style.backgroundColor = '#ccc';
            }
        });
    }
}

// Gestion de la photo de profil
function initPhotoUpload() {
    const photoInput = document.createElement('input');
    photoInput.type = 'file';
    photoInput.accept = 'image/*';
    photoInput.style.display = 'none';

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadProfilePhoto(file);
        }
    });

    document.body.appendChild(photoInput);
    window.photoInput = photoInput;
}

function changePhoto() {
    if (window.photoInput) {
        window.photoInput.click();
    }
}

function uploadProfilePhoto(file) {
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale : 5MB');
        return;
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
    }

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = function(e) {
        const profilePhotoImg = document.getElementById('profile-photo-img');
        if (profilePhotoImg) {
            profilePhotoImg.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);

    alert('Photo de profil mise à jour avec succès !');
}

function removePhoto() {
    if (confirm('Supprimer la photo de profil ?')) {
        const profilePhotoImg = document.getElementById('profile-photo-img');
        if (profilePhotoImg) {
            profilePhotoImg.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
        }
        alert('Photo de profil supprimée.');
    }
}

// Actions du profil
function saveProfile() {
    const formData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthDate: document.getElementById('birth-date').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value,
        bio: document.getElementById('bio').value
    };

    // Validation
    const requiredFields = ['firstName', 'lastName', 'email'];
    const isValid = requiredFields.every(field => {
        const element = document.getElementById(field.replace(/([A-Z])/g, '-$1').toLowerCase());
        return element && element.value.trim() !== '';
    });

    if (!isValid) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Simulation de sauvegarde
    localStorage.setItem('userProfile', JSON.stringify(formData));

    alert('Profil sauvegardé avec succès !');
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    if (newPassword.length < 8) {
        alert('Le nouveau mot de passe doit contenir au moins 8 caractères.');
        return;
    }

    // Simulation du changement de mot de passe
    alert('Mot de passe modifié avec succès !');

    // Réinitialiser le formulaire
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    // Réinitialiser l'affichage de la force
    checkPasswordStrength('');
    checkPasswordRequirements('');
}

function enableTwoFactor() {
    alert('Authentification à deux facteurs\n\nCette fonctionnalité vous guidera à travers la configuration de l\'authentification à deux facteurs avec votre application d\'authentification préférée.');
}

function exportData() {
    // Récupérer les données utilisateur
    const userData = {
        profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
        preferences: JSON.parse(localStorage.getItem('notificationPreferences') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    // Créer et télécharger le fichier
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `immopro-data-${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Données exportées avec succès !');
}

function deactivateAccount() {
    if (confirm('Désactiver votre compte ?\n\nVotre compte sera temporairement désactivé. Vous pourrez le réactiver en vous reconnectant.')) {
        alert('Compte désactivé avec succès.\n\nVous allez être redirigé vers la page de connexion.');
        // Redirection vers la page de connexion
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 2000);
    }
}

function deleteAccount() {
    const modal = document.getElementById('delete-account-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteAccountModal() {
    const modal = document.getElementById('delete-account-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Réinitialiser le champ de confirmation
    const confirmInput = document.getElementById('confirm-delete');
    const confirmButton = document.querySelector('.btn-danger[onclick="confirmDeleteAccount()"]');

    if (confirmInput) confirmInput.value = '';
    if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.style.backgroundColor = '#ccc';
    }
}

function confirmDeleteAccount() {
    const confirmInput = document.getElementById('confirm-delete');

    if (confirmInput.value.toUpperCase() !== 'SUPPRIMER') {
        alert('Veuillez taper "SUPPRIMER" pour confirmer.');
        return;
    }

    if (confirm('Dernière confirmation : Supprimer définitivement votre compte ?\n\nCette action est IRRÉVERSIBLE !')) {
        alert('Compte supprimé avec succès.\n\nMerci d\'avoir utilisé ImmoPro.');

        // Nettoyer les données locales
        localStorage.clear();

        // Redirection vers la page d'accueil
        setTimeout(() => {
            window.location.href = '../auth/login.html';
        }, 2000);
    }
}

// Fonction pour basculer la visibilité du mot de passe
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('.material-icons');

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility';
    }
}

// Charger les données sauvegardées
function loadSavedData() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        Object.keys(profile).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                element.value = profile[key];
            }
        });
    }
}

// Sauvegarder automatiquement les préférences
function autoSavePreferences() {
    const inputs = document.querySelectorAll('#tab-preferences input, #tab-preferences select');

    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            preferences[this.name] = this.value;
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
        });
    });
}

// Initialiser les données sauvegardées
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    autoSavePreferences();
});

// Fermer les modals en cliquant en dehors
document.addEventListener('click', function(e) {
    const deleteModal = document.getElementById('delete-account-modal');

    if (e.target === deleteModal) {
        closeDeleteAccountModal();
    }
});

// Fermer les modals avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const deleteModal = document.getElementById('delete-account-modal');

        if (deleteModal.classList.contains('active')) {
            closeDeleteAccountModal();
        }
    }
});

// Fonction pour gérer la déconnexion
function handleLogout(event) {
    event.preventDefault();
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        alert('Déconnexion réussie !');
        window.location.href = '../auth/login.html';
    }
}

// Fonction pour le menu mobile
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}