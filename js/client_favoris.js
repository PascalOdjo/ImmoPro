// Page Mes Favoris - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientFavoris();
});

function initClientFavoris() {
    // Initialiser les interactions de la page
    initViewToggle();
    initFilters();
    initFavoriteActions();
    initStatsAnimations();
    checkEmptyState();
}

// Toggle entre vue grille et liste
function initViewToggle() {
    const gridBtn = document.querySelector('.btn-secondary[onclick="toggleView(\'grid\')"]');
    const listBtn = document.querySelector('.btn-secondary[onclick="toggleView(\'list\')"]');

    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', function() {
            toggleView('grid');
        });

        listBtn.addEventListener('click', function() {
            toggleView('list');
        });
    }
}

function toggleView(view) {
    const gridView = document.getElementById('favorites-grid');
    const listView = document.getElementById('favorites-list');
    const buttons = document.querySelectorAll('.btn-secondary[onclick*="toggleView"]');

    // Retirer la classe active de tous les boutons
    buttons.forEach(btn => btn.classList.remove('active'));

    if (view === 'grid') {
        gridView.classList.add('active');
        listView.classList.remove('active');
        buttons[1].classList.add('active'); // Bouton grille
    } else {
        gridView.classList.remove('active');
        listView.classList.add('active');
        buttons[0].classList.add('active'); // Bouton liste
    }
}

// Gestion des filtres
function initFilters() {
    const filterInputs = document.querySelectorAll('.filter-select, .filter-input');

    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Auto-filtrer quand on change un filtre
            applyFilters();
        });
    });
}

function applyFilters() {
    const typeFilter = document.querySelectorAll('select[class*="filter-select"]')[0].value;
    const statusFilter = document.querySelectorAll('select[class*="filter-select"]')[1].value;
    const minPrice = document.querySelectorAll('input[class*="filter-input"]')[0].value;
    const maxPrice = document.querySelectorAll('input[class*="filter-input"]')[1].value;
    const locationFilter = document.querySelectorAll('input[class*="filter-input"]')[2].value;

    const favorites = document.querySelectorAll('.favorite-card, .favorites-table tbody tr');

    favorites.forEach(favorite => {
        let show = true;

        // Filtrer par statut
        if (statusFilter) {
            const statusBadge = favorite.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.classList.contains('status-available') ? 'available' :
                    statusBadge.classList.contains('status-pending') ? 'pending' :
                    statusBadge.classList.contains('status-sold') ? 'sold' : '';
                if (status !== statusFilter) show = false;
            }
        }

        // Filtrer par prix
        if (minPrice || maxPrice) {
            const priceElement = favorite.querySelector('.price-cell, .favorite-price');
            if (priceElement) {
                const price = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
                if (minPrice && price < parseInt(minPrice)) show = false;
                if (maxPrice && price > parseInt(maxPrice)) show = false;
            }
        }

        // Filtrer par localisation
        if (locationFilter) {
            const locationElement = favorite.querySelector('.favorite-location, td:nth-child(2)');
            if (locationElement) {
                const location = locationElement.textContent.toLowerCase();
                if (!location.includes(locationFilter.toLowerCase())) show = false;
            }
        }

        // Afficher/masquer le favori
        if (show) {
            favorite.style.display = '';
        } else {
            favorite.style.display = 'none';
        }
    });

    // Vérifier l'état vide après filtrage
    checkEmptyState();
}

function resetFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });
    document.querySelectorAll('.filter-input').forEach(input => {
        input.value = '';
    });

    // Réafficher tous les favoris
    const favorites = document.querySelectorAll('.favorite-card, .favorites-table tbody tr');
    favorites.forEach(favorite => {
        favorite.style.display = '';
    });

    // Masquer le message "aucun résultat"
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Actions sur les favoris
function initFavoriteActions() {
    // Actions sur les cartes en vue grille
    document.querySelectorAll('.favorite-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Ne pas déclencher si on clique sur un bouton
            if (e.target.closest('button')) return;

            const favoriteId = this.getAttribute('data-id');
            viewPropertyDetails(favoriteId);
        });
    });
}

function viewPropertyDetails(favoriteId) {
    // Simuler l'ouverture des détails du bien
    const favorite = document.querySelector(`[data-id="${favoriteId}"]`);
    const title = favorite.querySelector('.favorite-title, .favorite-cell-title').textContent;

    alert(`Détails du bien: ${title}\n\nCette fonctionnalité ouvrira une page dédiée avec toutes les informations du bien, les photos, les caractéristiques et les options de contact.`);
}

function scheduleVisit(favoriteId) {
    const favorite = document.querySelector(`[data-id="${favoriteId}"]`);
    const title = favorite.querySelector('.favorite-title, .favorite-cell-title').textContent;
    const agentName = favorite.querySelector('.agent-name, td:nth-child(6)').textContent;

    const date = prompt(`Planifier une visite pour "${title}"\n\nAgent: ${agentName}\n\nDate souhaitée (JJ/MM/AAAA):`);
    if (date) {
        const time = prompt('Heure souhaitée (HH:MM):');
        if (time) {
            alert(`Visite planifiée pour ${title}\nDate: ${date}\nHeure: ${time}\nAgent: ${agentName}\n\nVous recevrez une confirmation par email.`);
            // Ici on pourrait ajouter la visite à la liste
            addVisitToList(title, date, time, agentName);
        }
    }
}

function contactAgent(favoriteId) {
    const favorite = document.querySelector(`[data-id="${favoriteId}"]`);
    const title = favorite.querySelector('.favorite-title, .favorite-cell-title').textContent;
    const agentName = favorite.querySelector('.agent-name, td:nth-child(6)').textContent;
    const agentPhone = favorite.querySelector('.agent-phone');

    const phone = agentPhone ? agentPhone.textContent : 'Non disponible';

    const message = prompt(`Contacter l'agent ${agentName} pour "${title}"\n\nTéléphone: ${phone}\n\nVotre message:`);
    if (message) {
        alert(`Message envoyé à ${agentName} !\n\n"${message}"\n\nL'agent vous contactera rapidement.`);
        // Ici on pourrait ouvrir la messagerie
        window.location.href = 'messagerie.html';
    }
}

function removeFromFavorites(favoriteId) {
    const favorite = document.querySelector(`[data-id="${favoriteId}"]`);
    const title = favorite.querySelector('.favorite-title, .favorite-cell-title').textContent;

    if (confirm(`Retirer "${title}" de vos favoris ?`)) {
        // Animation de suppression
        favorite.style.transition = 'all 0.3s ease';
        favorite.style.opacity = '0';
        favorite.style.transform = 'scale(0.9)';

        setTimeout(() => {
            favorite.remove();
            updateStatsAfterRemove();
            checkEmptyState();
        }, 300);
    }
}

function clearAllFavorites() {
    const favorites = document.querySelectorAll('.favorite-card, .favorites-table tbody tr');

    if (favorites.length === 0) {
        alert('Votre liste de favoris est déjà vide.');
        return;
    }

    if (confirm(`Êtes-vous sûr de vouloir retirer tous les biens de vos favoris ?\n\nCette action supprimera ${favorites.length} bien(s) de votre liste.`)) {
        // Animation de suppression en cascade
        favorites.forEach((favorite, index) => {
            setTimeout(() => {
                favorite.style.transition = 'all 0.3s ease';
                favorite.style.opacity = '0';
                favorite.style.transform = 'scale(0.9)';

                setTimeout(() => {
                    favorite.remove();
                }, 300);
            }, index * 100);
        });

        // Mettre à jour les stats après suppression
        setTimeout(() => {
            updateStatsAfterRemove();
            checkEmptyState();
        }, favorites.length * 100 + 500);
    }
}

function updateStatsAfterRemove() {
    // Mettre à jour les statistiques après suppression
    const totalFavorites = document.querySelectorAll('.favorite-card, .favorites-table tbody tr').length;
    const totalStat = document.querySelector('.stat-card:first-child .stat-value');

    if (totalStat) {
        totalStat.textContent = totalFavorites;
    }

    // Recalculer le prix moyen
    const prices = Array.from(document.querySelectorAll('.favorite-price, .price-cell')).map(el => {
        return parseInt(el.textContent.replace(/[^\d]/g, ''));
    });

    const averagePrice = prices.length > 0 ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0;
    const averagePriceStat = document.querySelectorAll('.stat-card .stat-value')[1];

    if (averagePriceStat) {
        averagePriceStat.textContent = averagePrice.toLocaleString() + ' €';
    }
}

function addVisitToList(title, date, time, agentName) {
    // Ajouter une nouvelle visite à la liste (simulation)
    alert(`Visite ajoutée à votre planning !\n\nBien: ${title}\nDate: ${date}\nHeure: ${time}\nAgent: ${agentName}\n\nVous pouvez consulter vos visites dans la section "Mes visites".`);
}

// Vérifier l'état vide
function checkEmptyState() {
    const favorites = document.querySelectorAll('.favorite-card:not([style*="display: none"]), .favorites-table tbody tr:not([style*="display: none"])');
    const noFavoritesMessage = document.getElementById('no-favorites-message');
    const favoritesContainer = document.querySelector('.favorites-container');

    if (favorites.length === 0) {
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'block';
        }
        if (favoritesContainer) {
            favoritesContainer.style.display = 'none';
        }
    } else {
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'none';
        }
        if (favoritesContainer) {
            favoritesContainer.style.display = 'block';
        }
    }
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
    const finalValue = valueElement.textContent.replace(/[^\d]/g, '');

    if (!finalValue) return;

    let currentValue = 0;
    const increment = parseInt(finalValue) / 30;

    const animation = setInterval(() => {
        currentValue += increment;
        if (currentValue >= parseInt(finalValue)) {
            currentValue = parseInt(finalValue);
            clearInterval(animation);
        }

        // Formater le nombre avec des virgules si nécessaire
        const formattedValue = Math.floor(currentValue).toLocaleString();
        valueElement.textContent = formattedValue;
    }, 50);
}

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

// Gestion des notifications en temps réel (simulation)
function simulateRealTimeUpdates() {
    // Simuler des mises à jour de prix
    setInterval(() => {
        const randomFavorite = document.querySelector('.favorite-card');
        if (randomFavorite && Math.random() < 0.1) { // 10% de chance
            const priceElement = randomFavorite.querySelector('.favorite-price');
            if (priceElement) {
                const currentPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
                const newPrice = Math.floor(currentPrice * (0.95 + Math.random() * 0.1)); // Variation de ±5%

                if (newPrice !== currentPrice) {
                    priceElement.textContent = newPrice.toLocaleString() + ' €';

                    // Ajouter une animation pour indiquer le changement
                    priceElement.style.color = newPrice > currentPrice ? 'var(--error)' : 'var(--success)';
                    setTimeout(() => {
                        priceElement.style.color = 'var(--primary-blue)';
                    }, 2000);

                    // Afficher une notification
                    showPriceUpdateNotification(randomFavorite.querySelector('.favorite-title').textContent, newPrice, currentPrice);
                }
            }
        }
    }, 30000); // Vérifier toutes les 30 secondes
}

function showPriceUpdateNotification(title, newPrice, oldPrice) {
    const notification = document.createElement('div');
    notification.className = 'price-update-notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-width: 300px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span class="material-icons" style="color: var(--primary-blue);">price_change</span>
                <strong>Prix modifié</strong>
            </div>
            <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">${title}</div>
            <div style="font-size: 13px; color: var(--text-secondary);">
                ${oldPrice.toLocaleString()} € → ${newPrice.toLocaleString()} €
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Initialiser les mises à jour en temps réel
// simulateRealTimeUpdates(); // Décommenter pour activer la simulation