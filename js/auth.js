// Gestion de l'affichage/masquage des mots de passe
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des boutons de visibilité du mot de passe
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('.material-icons');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility_off';
            }
        });
    });

    // Validation du mot de passe en temps réel (page d'inscription)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const requirements = {
            length: str => str.length >= 8,
            uppercase: str => /[A-Z]/.test(str),
            lowercase: str => /[a-z]/.test(str),
            number: str => /[0-9]/.test(str),
            special: str => /[!@#$%^&*]/.test(str)
        };

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            for (const [requirement, validateFunc] of Object.entries(requirements)) {
                const element = document.querySelector(`[data-requirement="${requirement}"]`);
                if (element) {
                    element.dataset.valid = validateFunc(password);
                }
            }
        });
    }

    // Validation de la confirmation du mot de passe
    const confirmPasswordInput = document.getElementById('confirm-password');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const isMatch = this.value === passwordInput.value;
            this.setCustomValidity(isMatch ? '' : 'Les mots de passe ne correspondent pas');
        });
    }

    // Gestion de la soumission des formulaires
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Réinitialiser les messages d'erreur
            form.querySelectorAll('.form-error').forEach(error => error.remove());
            form.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));

            // Validation basique des champs requis
            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    showError(input, 'Ce champ est requis');
                    isValid = false;
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'Email invalide');
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Simulation de l'envoi du formulaire
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.classList.add('btn-loading');

            try {
                // Simulation d'une requête API
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Redirection selon le type de formulaire
                const formId = form.id;
                switch (formId) {
                    case 'login-form':
                        window.location.href = '../admin/dashboard.html';
                        break;
                    case 'register-form':
                        window.location.href = '../admin/dashboard.html';
                        break;
                    case 'reset-form':
                        showSuccess(form, 'Un email de réinitialisation a été envoyé à votre adresse.');
                        break;
                }
            } catch (error) {
                showError(form, 'Une erreur est survenue. Veuillez réessayer.');
            } finally {
                submitButton.classList.remove('btn-loading');
            }
        });
    });
});

// Fonctions utilitaires
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    if (element instanceof HTMLInputElement) {
        element.classList.add('input-error');
        element.parentElement.parentElement.appendChild(errorDiv);
    } else {
        element.appendChild(errorDiv);
    }
}

function showSuccess(form, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.color = 'var(--success)';
    successDiv.style.textAlign = 'center';
    successDiv.style.marginTop = '16px';
    successDiv.textContent = message;
    form.appendChild(successDiv);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}