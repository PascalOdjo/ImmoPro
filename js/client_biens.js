// Page Mes Biens - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientBiens();
});

function initClientBiens() {
    // Initialiser les interactions de la page
    initViewToggle();
    initFilters();
    initPropertyActions();
    initModal();
    initStatsAnimations();

    // Initialiser la vue par défaut (grille)
    initializeDefaultView();
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
    const gridView = document.getElementById('properties-grid');
    const listView = document.getElementById('properties-list');
    const buttons = document.querySelectorAll('.btn-secondary[onclick*="toggleView"]');

    // Retirer la classe active de tous les boutons
    buttons.forEach(btn => btn.classList.remove('active'));

    if (view === 'grid') {
        // Afficher la grille, masquer la liste
        if (gridView) gridView.style.display = 'grid';
        if (listView) listView.style.display = 'none';

        // Activer le bouton grille (index 1)
        if (buttons[1]) buttons[1].classList.add('active');
    } else {
        // Afficher la liste, masquer la grille
        if (gridView) gridView.style.display = 'none';
        if (listView) listView.style.display = 'block';

        // Activer le bouton liste (index 0)
        if (buttons[0]) buttons[0].classList.add('active');
    }
}

// Initialiser la vue par défaut
function initializeDefaultView() {
    const gridView = document.getElementById('properties-grid');
    const listView = document.getElementById('properties-list');

    // S'assurer que la grille est affichée par défaut
    if (gridView) gridView.style.display = 'grid';
    if (listView) listView.style.display = 'none';

    // Activer le bouton grille par défaut
    const buttons = document.querySelectorAll('.btn-secondary[onclick*="toggleView"]');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttons[1]) buttons[1].classList.add('active'); // Bouton grille
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
    const statusFilter = document.querySelector('select[class*="filter-select"]').value;
    const typeFilter = document.querySelectorAll('select[class*="filter-select"]')[1].value;
    const minPrice = document.querySelector('input[placeholder="0 €"]').value;
    const maxPrice = document.querySelector('input[placeholder="1 000 000 €"]').value;

    const properties = document.querySelectorAll('.property-card-full, .properties-table tbody tr');

    properties.forEach(property => {
        let show = true;

        // Filtrer par statut
        if (statusFilter) {
            const statusBadge = property.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.classList.contains('status-online') ? 'online' :
                    statusBadge.classList.contains('status-pending') ? 'pending' :
                    statusBadge.classList.contains('status-sold') ? 'sold' :
                    statusBadge.classList.contains('status-rented') ? 'rented' : '';
                if (status !== statusFilter) show = false;
            }
        }

        // Filtrer par prix
        if (minPrice || maxPrice) {
            const priceElement = property.querySelector('.price-cell, .property-price');
            if (priceElement) {
                const price = parseInt(priceElement.textContent.replace(/[^\d]/g, ''));
                if (minPrice && price < parseInt(minPrice)) show = false;
                if (maxPrice && price > parseInt(maxPrice)) show = false;
            }
        }

        // Afficher/masquer la propriété
        if (show) {
            property.style.display = '';
        } else {
            property.style.display = 'none';
        }
    });

    // Afficher un message si aucun résultat
    showNoResultsMessage();
}

function resetFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });
    document.querySelectorAll('.filter-input').forEach(input => {
        input.value = '';
    });

    // Réafficher toutes les propriétés
    const properties = document.querySelectorAll('.property-card-full, .properties-table tbody tr');
    properties.forEach(property => {
        property.style.display = '';
    });

    // Masquer le message "aucun résultat"
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function showNoResultsMessage() {
    const visibleProperties = document.querySelectorAll('.property-card-full:not([style*="display: none"]), .properties-table tbody tr:not([style*="display: none"])');

    if (visibleProperties.length === 0) {
        const container = document.querySelector('.properties-container');
        const existingMsg = container.querySelector('.no-results-message');

        if (!existingMsg) {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <span class="material-icons" style="font-size: 48px; margin-bottom: 16px; display: block;">search_off</span>
                    <h3>Aucun bien trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                </div>
            `;
            container.appendChild(noResultsMsg);
        }
    } else {
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// Actions sur les propriétés
function initPropertyActions() {
    // Actions sur les cartes en vue grille
    document.querySelectorAll('.property-card-full').forEach(card => {
        card.addEventListener('click', function(e) {
            // Ne pas déclencher si on clique sur un bouton
            if (e.target.closest('button')) return;

            const propertyId = this.getAttribute('data-id');
            viewPropertyDetails(propertyId);
        });
    });
}

function viewPropertyDetails(propertyId) {
    // Simuler l'ouverture des détails du bien
    const property = document.querySelector(`[data-id="${propertyId}"]`);
    const title = property.querySelector('.property-title').textContent;

    alert(`Détails du bien: ${title}\n\nCette fonctionnalité ouvrira une page dédiée avec toutes les informations du bien, les statistiques détaillées et les options de gestion.`);
}

function editProperty(propertyId) {
    const property = document.querySelector(`[data-id="${propertyId}"]`);
    const title = property.querySelector('.property-title').textContent;

    alert(`Modification du bien: ${title}\n\nCette fonctionnalité ouvrira un formulaire d'édition pour modifier les informations du bien.`);
}

function viewPropertyStats(propertyId) {
    const property = document.querySelector(`[data-id="${propertyId}"]`);
    const title = property.querySelector('.property-title').textContent;

    // Créer une modal avec les statistiques
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Statistiques - ${title}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div style="text-align: center; padding: 20px; background: var(--accent-beige-light); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary-blue);">156</div>
                        <div style="color: var(--text-secondary);">Vues totales</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: var(--accent-beige-light); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary-blue);">12</div>
                        <div style="color: var(--text-secondary);">Favoris</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: var(--accent-beige-light); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary-blue);">3</div>
                        <div style="color: var(--text-secondary);">Visites</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: var(--accent-beige-light); border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary-blue);">7.7%</div>
                        <div style="color: var(--text-secondary);">Taux de conversion</div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 10px;">Évolution des vues (7 derniers jours)</h3>
                    <div style="height: 200px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        Graphique des vues quotidiennes
                    </div>
                </div>
                <div>
                    <h3 style="margin-bottom: 10px;">Dernières activités</h3>
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 15px;">
                        <div style="margin-bottom: 10px;">• Nouvelle vue il y a 2h</div>
                        <div style="margin-bottom: 10px;">• Ajouté aux favoris il y a 4h</div>
                        <div style="margin-bottom: 10px;">• Visite planifiée pour demain</div>
                        <div>• Message reçu il y a 1 jour</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-primary" onclick="this.closest('.modal').remove()">Fermer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function deleteProperty(propertyId) {
    const property = document.querySelector(`[data-id="${propertyId}"]`);
    const title = property.querySelector('.property-title').textContent;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le bien "${title}" ?\n\nCette action est irréversible.`)) {
        // Animation de suppression
        property.style.transition = 'all 0.3s ease';
        property.style.opacity = '0';
        property.style.transform = 'scale(0.9)';

        setTimeout(() => {
            property.remove();
            updateStatsAfterDelete();
        }, 300);
    }
}

function updateStatsAfterDelete() {
    // Mettre à jour les statistiques après suppression
    const totalProperties = document.querySelectorAll('.property-card-full').length;
    const totalViews = Array.from(document.querySelectorAll('.stat-item')).reduce((sum, item) => {
        const text = item.textContent;
        if (text.includes('vues')) {
            const views = parseInt(text.match(/\d+/)[0]);
            return sum + views;
        }
        return sum;
    }, 0);

    // Mettre à jour l'affichage des stats
    const totalStat = document.querySelector('.stat-card:first-child .stat-value');
    if (totalStat) {
        totalStat.textContent = totalProperties;
    }
}

// Gestion de la modal d'ajout
function initModal() {
    const modal = document.getElementById('add-property-modal');
    const form = document.getElementById('add-property-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProperty();
        });
    }
}

function showAddPropertyModal() {
    const modal = document.getElementById('add-property-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddPropertyModal() {
    const modal = document.getElementById('add-property-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Réinitialiser le formulaire
    const form = document.getElementById('add-property-form');
    if (form) {
        form.reset();
    }
}

function saveProperty() {
    const form = document.getElementById('add-property-form');
    const formData = new FormData(form);

    // Validation basique
    const title = formData.get('title');
    const type = formData.get('type');
    const price = formData.get('price');

    if (!title || !type || !price) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Simuler l'ajout du bien
    alert(`Bien "${title}" ajouté avec succès !\n\nLe bien sera visible après validation par notre équipe.`);

    closeAddPropertyModal();

    // Ici on pourrait ajouter le bien à la liste
    addPropertyToList(formData);
}

function addPropertyToList(formData) {
    const propertiesGrid = document.getElementById('properties-grid');
    const newPropertyId = Date.now();

    const newProperty = document.createElement('div');
    newProperty.className = 'property-card-full';
    newProperty.setAttribute('data-id', newPropertyId);

    newProperty.innerHTML = `
        <div class="property-image-container">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop" alt="${formData.get('title')}" class="property-image">
            <div class="property-overlay">
                <button class="overlay-btn" onclick="editProperty(${newPropertyId})" title="Modifier">
                    <span class="material-icons">edit</span>
                </button>
                <button class="overlay-btn" onclick="viewPropertyStats(${newPropertyId})" title="Statistiques">
                    <span class="material-icons">analytics</span>
                </button>
                <button class="overlay-btn" onclick="deleteProperty(${newPropertyId})" title="Supprimer">
                    <span class="material-icons">delete</span>
                </button>
            </div>
            <div class="property-status">
                <span class="status-badge status-pending">En attente</span>
            </div>
        </div>
        <div class="property-info">
            <div class="property-title">${formData.get('title')}</div>
            <div class="property-location">
                <span class="material-icons">location_on</span>
                <span>${formData.get('location')}</span>
            </div>
            <div class="property-details">
                <span class="detail-item">
                    <span class="material-icons">bed</span>
                    <span>${formData.get('rooms')} chambres</span>
                </span>
                <span class="detail-item">
                    <span class="material-icons">square_foot</span>
                    <span>${formData.get('area')} m²</span>
                </span>
            </div>
            <div class="property-price">${parseInt(formData.get('price')).toLocaleString()} €</div>
            <div class="property-stats">
                <div class="stat-item">
                    <span class="material-icons">visibility</span>
                    <span>0 vues</span>
                </div>
                <div class="stat-item">
                    <span class="material-icons">favorite</span>
                    <span>0 favoris</span>
                </div>
                <div class="stat-item">
                    <span class="material-icons">event</span>
                    <span>0 visites</span>
                </div>
            </div>
            <div class="property-actions">
                <button class="action-btn primary" onclick="viewPropertyDetails(${newPropertyId})">
                    <span class="material-icons">visibility</span>
                    <span>Voir</span>
                </button>
                <button class="action-btn secondary" onclick="editProperty(${newPropertyId})">
                    <span class="material-icons">edit</span>
                    <span>Modifier</span>
                </button>
            </div>
        </div>
    `;

    propertiesGrid.insertBefore(newProperty, propertiesGrid.firstChild);

    // Ajouter l'événement de clic
    newProperty.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        viewPropertyDetails(newPropertyId);
    });

    // Mettre à jour les statistiques
    updateStatsAfterAdd();
}

function updateStatsAfterAdd() {
    const totalStat = document.querySelector('.stat-card:first-child .stat-value');
    if (totalStat) {
        const currentCount = parseInt(totalStat.textContent);
        totalStat.textContent = currentCount + 1;
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

// Fermer la modal en cliquant en dehors
document.addEventListener('click', function(e) {
    const modal = document.getElementById('add-property-modal');
    if (e.target === modal) {
        closeAddPropertyModal();
    }
});

// Fermer la modal avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('add-property-modal');
        if (modal.classList.contains('active')) {
            closeAddPropertyModal();
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