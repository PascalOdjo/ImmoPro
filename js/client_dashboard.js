// Dashboard client - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientDashboard();
});

function initClientDashboard() {
    // Initialiser les interactions du dashboard client
    initPropertyActions();
    initMessageInteractions();
    initNotificationInteractions();
    initVisitInteractions();
    initStatsAnimations();
}

// Actions sur les biens (favoris, visites, détails)
function initPropertyActions() {
    // Boutons d'action sur les cartes de biens
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.getAttribute('title');
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('.property-title').textContent;

            switch (action) {
                case 'Voir les détails':
                    showPropertyDetails(propertyTitle);
                    break;
                case 'Planifier une visite':
                    scheduleVisit(propertyTitle);
                    break;
                case 'Retirer des favoris':
                    removeFromFavorites(propertyCard);
                    break;
            }
        });
    });

    // Clic sur les cartes de biens pour voir les détails
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.property-title').textContent;
            showPropertyDetails(title);
        });
    });
}

// Interactions avec les messages
function initMessageInteractions() {
    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', function() {
            const sender = this.querySelector('.message-sender').textContent;
            openMessageConversation(sender);
        });
    });
}

// Interactions avec les notifications
function initNotificationInteractions() {
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.notification-title').textContent;
            handleNotificationClick(title, this);
        });
    });
}

// Interactions avec les visites
function initVisitInteractions() {
    document.querySelectorAll('.visit-item').forEach(item => {
        item.addEventListener('click', function() {
            const visitTitle = this.querySelector('.visit-title').textContent;
            showVisitDetails(visitTitle);
        });
    });
}

// Animations des statistiques
function initStatsAnimations() {
    const statCards = document.querySelectorAll('.stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatCard(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
}

function animateStatCard(card) {
    const valueElement = card.querySelector('.stat-value');
    const finalValue = parseInt(valueElement.textContent);

    if (isNaN(finalValue)) return;

    let currentValue = 0;
    const increment = finalValue / 30; // Animation sur 30 frames

    const animation = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(animation);
        }
        valueElement.textContent = Math.floor(currentValue);
    }, 50);
}

// Fonctions d'action
function showPropertyDetails(propertyTitle) {
    // Simuler l'ouverture des détails du bien
    alert(`Détails du bien: ${propertyTitle}\n\nCette fonctionnalité ouvrira une page dédiée avec toutes les informations du bien.`);
}

function scheduleVisit(propertyTitle) {
    const date = prompt(`Planifier une visite pour "${propertyTitle}"\n\nDate souhaitée (JJ/MM/AAAA):`);
    if (date) {
        const time = prompt('Heure souhaitée (HH:MM):');
        if (time) {
            alert(`Visite planifiée pour ${propertyTitle}\nDate: ${date}\nHeure: ${time}\n\nVous recevrez une confirmation par email.`);
            // Ici on pourrait ajouter la visite à la liste
            addVisitToList(propertyTitle, date, time);
        }
    }
}

function removeFromFavorites(propertyCard) {
    if (confirm('Retirer ce bien de vos favoris ?')) {
        propertyCard.style.opacity = '0.5';
        propertyCard.style.transform = 'scale(0.95)';

        setTimeout(() => {
            propertyCard.remove();
            updateFavoritesCount();
        }, 300);
    }
}

function openMessageConversation(sender) {
    alert(`Ouverture de la conversation avec ${sender}\n\nCette fonctionnalité ouvrira la messagerie avec cette personne.`);
    // Redirection vers la messagerie
    window.location.href = 'messagerie.html';
}

function handleNotificationClick(title, notificationElement) {
    // Marquer comme lue
    notificationElement.style.opacity = '0.6';

    // Actions spécifiques selon le type de notification
    if (title.includes('Visite confirmée')) {
        alert('Visite confirmée !\n\nVous pouvez maintenant voir les détails de votre visite planifiée.');
    } else if (title.includes('Nouveau bien')) {
        alert('Nouveau bien disponible !\n\nUn bien correspondant à vos critères a été ajouté.');
    } else if (title.includes('Prix modifié')) {
        alert('Prix modifié !\n\nLe prix d\'un de vos biens favoris a été mis à jour.');
    }
}

function showVisitDetails(visitTitle) {
    alert(`Détails de la visite: ${visitTitle}\n\nCette fonctionnalité affichera tous les détails de la visite planifiée.`);
}

function addVisitToList(propertyTitle, date, time) {
    // Ajouter une nouvelle visite à la liste
    const visitsSection = document.querySelector('.section:has(.visit-item)');
    if (visitsSection) {
        const visitsList = visitsSection.querySelector('.visit-item').parentElement;

        const newVisit = document.createElement('div');
        newVisit.className = 'visit-item';
        newVisit.innerHTML = `
            <div class="visit-time">
                <div class="time-box">
                    <div class="time-hour">${time}</div>
                    <div class="time-period">${time.split(':')[0] >= 12 ? 'PM' : 'AM'}</div>
                </div>
                <div class="visit-details">
                    <div class="visit-title">${propertyTitle}</div>
                    <div class="visit-client">Visite en attente de confirmation</div>
                    <div class="visit-status">
                        <span class="status-badge status-pending">En attente</span>
                    </div>
                </div>
            </div>
        `;

        visitsList.insertBefore(newVisit, visitsList.firstChild);

        // Ajouter l'événement de clic
        newVisit.addEventListener('click', function() {
            showVisitDetails(propertyTitle);
        });
    }
}

function updateFavoritesCount() {
    const favoritesCount = document.querySelector('.stat-card:first-child .stat-value');
    if (favoritesCount) {
        const currentCount = parseInt(favoritesCount.textContent);
        favoritesCount.textContent = currentCount - 1;
    }
}

// Fonction pour gérer la déconnexion
function handleLogout(event) {
    event.preventDefault();
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Simulation de déconnexion
        alert('Déconnexion réussie !');
        window.location.href = '../auth/login.html';
    }
}

// Fonction pour le menu mobile
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Fonction pour afficher une page (navigation)
function showPage(pageId) {
    // Masquer toutes les pages
    document.querySelectorAll('[id^="page-"]').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // Afficher la page sélectionnée
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        page.style.display = 'block';
    }
}

// Gestion des notifications en temps réel (simulation)
function simulateRealTimeNotifications() {
    const notifications = [{
            title: 'Nouveau message',
            text: 'Vous avez reçu un nouveau message de votre agent',
            time: 'Il y a 5 min'
        },
        {
            title: 'Visite confirmée',
            text: 'Votre visite de demain est confirmée',
            time: 'Il y a 10 min'
        }
    ];

    // Ajouter une notification toutes les 30 secondes (pour la démo)
    setInterval(() => {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        addNotificationToUI(randomNotification);
    }, 30000);
}

function addNotificationToUI(notification) {
    const notificationsSection = document.querySelector('.notifications-section');
    if (notificationsSection) {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <span class="material-icons">notifications</span>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-text">${notification.text}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;

        notificationsSection.appendChild(notificationItem);

        // Ajouter l'événement de clic
        notificationItem.addEventListener('click', function() {
            handleNotificationClick(notification.title, this);
        });

        // Animation d'apparition
        notificationItem.style.opacity = '0';
        notificationItem.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            notificationItem.style.transition = 'all 0.3s ease';
            notificationItem.style.opacity = '1';
            notificationItem.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Initialiser les notifications en temps réel
// simulateRealTimeNotifications(); // Décommenter pour activer la simulation