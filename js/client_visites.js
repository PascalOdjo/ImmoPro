// Page Mes Visites - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientVisites();
});

function initClientVisites() {
    // Initialiser les interactions de la page
    initViewToggle();
    initFilters();
    initVisitActions();
    initCalendar();
    initModal();
    initStatsAnimations();
}

// Toggle entre vue calendrier et liste
function initViewToggle() {
    const calendarBtn = document.querySelector('.btn-secondary[onclick="toggleView(\'calendar\')"]');
    const listBtn = document.querySelector('.btn-secondary[onclick="toggleView(\'list\')"]');

    if (calendarBtn && listBtn) {
        calendarBtn.addEventListener('click', function() {
            toggleView('calendar');
        });

        listBtn.addEventListener('click', function() {
            toggleView('list');
        });
    }
}

function toggleView(view) {
    const calendarView = document.getElementById('visits-calendar');
    const listView = document.getElementById('visits-list');
    const buttons = document.querySelectorAll('.btn-secondary[onclick*="toggleView"]');

    // Retirer la classe active de tous les boutons
    buttons.forEach(btn => btn.classList.remove('active'));

    if (view === 'calendar') {
        calendarView.classList.add('active');
        listView.classList.remove('active');
        buttons[0].classList.add('active'); // Bouton calendrier
        generateCalendar();
    } else {
        calendarView.classList.remove('active');
        listView.classList.add('active');
        buttons[1].classList.add('active'); // Bouton liste
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
    const statusFilter = document.querySelectorAll('select[class*="filter-select"]')[0].value;
    const periodFilter = document.querySelectorAll('select[class*="filter-select"]')[1].value;
    const agentFilter = document.querySelectorAll('select[class*="filter-select"]')[2].value;
    const startDate = document.querySelectorAll('input[type="date"]')[0].value;
    const endDate = document.querySelectorAll('input[type="date"]')[1].value;

    const visits = document.querySelectorAll('.visit-item');

    visits.forEach(visit => {
        let show = true;

        // Filtrer par statut
        if (statusFilter) {
            const statusBadge = visit.querySelector('.status-badge');
            if (statusBadge) {
                const status = statusBadge.classList.contains('status-confirmed') ? 'confirmed' :
                    statusBadge.classList.contains('status-pending') ? 'pending' :
                    statusBadge.classList.contains('status-completed') ? 'completed' :
                    statusBadge.classList.contains('status-cancelled') ? 'cancelled' : '';
                if (status !== statusFilter) show = false;
            }
        }

        // Filtrer par période
        if (periodFilter) {
            const visitDate = visit.querySelector('.visit-date');
            if (visitDate) {
                const day = visitDate.querySelector('.date-day').textContent;
                const month = visitDate.querySelector('.date-month').textContent;
                const year = visitDate.querySelector('.date-year').textContent;

                if (!matchesPeriod(day, month, year, periodFilter)) show = false;
            }
        }

        // Filtrer par agent
        if (agentFilter) {
            const agentName = visit.querySelector('.agent-name').textContent.toLowerCase();
            const agentMap = {
                'sophie': 'sophie martin',
                'pierre': 'pierre durand',
                'marie': 'marie leroy'
            };
            if (!agentName.includes(agentMap[agentFilter])) show = false;
        }

        // Afficher/masquer la visite
        if (show) {
            visit.style.display = '';
        } else {
            visit.style.display = 'none';
        }
    });
}

function matchesPeriod(day, month, year, period) {
    const today = new Date();
    const visitDate = new Date(`${day} ${month} ${year}`);

    switch (period) {
        case 'today':
            return visitDate.toDateString() === today.toDateString();
        case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return visitDate >= weekStart && visitDate <= weekEnd;
        case 'month':
            return visitDate.getMonth() === today.getMonth() && visitDate.getFullYear() === today.getFullYear();
        case 'past':
            return visitDate < today;
        default:
            return true;
    }
}

function resetFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });
    document.querySelectorAll('.filter-input').forEach(input => {
        input.value = '';
    });

    // Réafficher toutes les visites
    const visits = document.querySelectorAll('.visit-item');
    visits.forEach(visit => {
        visit.style.display = '';
    });
}

// Actions sur les visites
function initVisitActions() {
    // Actions sur les éléments de visite
    document.querySelectorAll('.visit-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Ne pas déclencher si on clique sur un bouton
            if (e.target.closest('button')) return;

            const visitId = this.getAttribute('data-id');
            viewVisitDetails(visitId);
        });
    });
}

function viewVisitDetails(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const propertyTitle = visit.querySelector('.property-title').textContent;
    const agentName = visit.querySelector('.agent-name').textContent;
    const status = visit.querySelector('.status-badge').textContent;

    // Créer une modal avec les détails de la visite
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Détails de la visite</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: var(--primary-blue); margin-bottom: 10px;">${propertyTitle}</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <strong>Agent:</strong> ${agentName}
                        </div>
                        <div>
                            <strong>Statut:</strong> ${status}
                        </div>
                        <div>
                            <strong>Date:</strong> ${visit.querySelector('.date-day').textContent} ${visit.querySelector('.date-month').textContent} ${visit.querySelector('.date-year').textContent}
                        </div>
                        <div>
                            <strong>Heure:</strong> ${visit.querySelector('.time-hour').textContent} ${visit.querySelector('.time-period').textContent}
                        </div>
                    </div>
                </div>
                <div style="background: var(--accent-beige-light); padding: 15px; border-radius: 8px;">
                    <h4 style="margin-bottom: 10px;">Informations importantes</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Présentez-vous 5 minutes avant l'heure prévue</li>
                        <li>Apportez une pièce d'identité</li>
                        <li>N'hésitez pas à poser toutes vos questions</li>
                        <li>Prenez des notes si nécessaire</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-primary" onclick="this.closest('.modal').remove()">Fermer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function contactAgent(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const agentName = visit.querySelector('.agent-name').textContent;
    const agentPhone = visit.querySelector('.agent-phone').textContent;
    const propertyTitle = visit.querySelector('.property-title').textContent;

    const message = prompt(`Contacter ${agentName} pour "${propertyTitle}"\n\nTéléphone: ${agentPhone}\n\nVotre message:`);
    if (message) {
        alert(`Message envoyé à ${agentName} !\n\n"${message}"\n\nL'agent vous contactera rapidement.`);
        // Ici on pourrait ouvrir la messagerie
        window.location.href = 'messagerie.html';
    }
}

function cancelVisit(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const propertyTitle = visit.querySelector('.property-title').textContent;
    const agentName = visit.querySelector('.agent-name').textContent;

    if (confirm(`Annuler la visite de "${propertyTitle}" avec ${agentName} ?\n\nCette action enverra une notification à l'agent.`)) {
        const reason = prompt('Raison de l\'annulation (optionnel):');

        // Animation de suppression
        visit.style.transition = 'all 0.3s ease';
        visit.style.opacity = '0';
        visit.style.transform = 'scale(0.95)';

        setTimeout(() => {
            visit.remove();
            updateStatsAfterCancel();
        }, 300);

        alert(`Visite annulée avec succès.\n\nL'agent ${agentName} a été notifié${reason ? ` avec la raison: "${reason}"` : ''}.`);
    }
}

function addToFavorites(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const propertyTitle = visit.querySelector('.property-title').textContent;
    
    alert(`"${propertyTitle}" ajouté à vos favoris !\n\nVous pouvez consulter tous vos favoris dans la section dédiée.`);
}

function rateVisit(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const propertyTitle = visit.querySelector('.property-title').textContent;
    const agentName = visit.querySelector('.agent-name').textContent;
    
    const rating = prompt(`Noter la visite de "${propertyTitle}" avec ${agentName}\n\nNote (1-5 étoiles):`);
    if (rating && rating >= 1 && rating <= 5) {
        const comment = prompt('Commentaire (optionnel):');
        alert(`Merci pour votre évaluation !\n\nNote: ${rating}/5${comment ? `\nCommentaire: "${comment}"` : ''}\n\nVotre avis nous aide à améliorer nos services.`);
    }
}

function rescheduleVisit(visitId) {
    const visit = document.querySelector(`[data-id="${visitId}"]`);
    const propertyTitle = visit.querySelector('.property-title').textContent;
    
    const newDate = prompt(`Reprogrammer la visite de "${propertyTitle}"\n\nNouvelle date souhaitée (JJ/MM/AAAA):`);
    if (newDate) {
        const newTime = prompt('Nouvelle heure souhaitée (HH:MM):');
        if (newTime) {
            alert(`Visite reprogrammée !\n\nNouvelle date: ${newDate}\nNouvelle heure: ${newTime}\n\nVous recevrez une confirmation par email.`);
        }
    }
}

function updateStatsAfterCancel() {
    // Mettre à jour les statistiques après annulation
    const totalVisits = document.querySelectorAll('.visit-item').length;
    const confirmedVisits = document.querySelectorAll('.status-badge.status-confirmed').length;
    const pendingVisits = document.querySelectorAll('.status-badge.status-pending').length;
    
    const totalStat = document.querySelector('.stat-card:first-child .stat-value');
    const confirmedStat = document.querySelectorAll('.stat-card .stat-value')[1];
    const pendingStat = document.querySelectorAll('.stat-card .stat-value')[2];
    
    if (totalStat) totalStat.textContent = totalVisits;
    if (confirmedStat) confirmedStat.textContent = confirmedVisits;
    if (pendingStat) pendingStat.textContent = pendingVisits;
}

// Gestion du calendrier
function initCalendar() {
    generateCalendar();
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Mettre à jour le titre du calendrier
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    document.getElementById('calendar-title').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Générer les jours du calendrier
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    calendarGrid.innerHTML = '';
    
    // En-têtes des jours
    const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Jours du mois précédent
    for (let i = startingDay - 1; i >= 0; i--) {
        const prevMonthDay = new Date(currentYear, currentMonth, -i);
        const dayElement = createCalendarDay(prevMonthDay.getDate(), true);
        calendarGrid.appendChild(dayElement);
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createCalendarDay(day, false);
        calendarGrid.appendChild(dayElement);
    }
    
    // Jours du mois suivant
    const remainingDays = 42 - (startingDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        const dayElement = createCalendarDay(day, true);
        calendarGrid.appendChild(dayElement);
    }
}

function createCalendarDay(dayNumber, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('calendar-day-other-month');
    }
    
    const today = new Date();
    if (dayNumber === today.getDate() && !isOtherMonth) {
        dayElement.classList.add('calendar-day-today');
    }
    
    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'calendar-day-number';
    dayNumberElement.textContent = dayNumber;
    dayElement.appendChild(dayNumberElement);
    
    // Ajouter des visites simulées
    if (!isOtherMonth && Math.random() < 0.3) {
        const visitElement = document.createElement('div');
        visitElement.className = 'calendar-visit';
        visitElement.textContent = 'Visite';
        visitElement.onclick = () => showVisitOnCalendar(dayNumber);
        dayElement.appendChild(visitElement);
    }
    
    return dayElement;
}

function showVisitOnCalendar(day) {
    alert(`Visites prévues le ${day} janvier 2025\n\nCette fonctionnalité affichera toutes les visites prévues pour cette date.`);
}

function previousMonth() {
    // Logique pour aller au mois précédent
    alert('Mois précédent - Cette fonctionnalité sera implémentée pour naviguer dans le calendrier.');
}

function nextMonth() {
    // Logique pour aller au mois suivant
    alert('Mois suivant - Cette fonctionnalité sera implémentée pour naviguer dans le calendrier.');
}

// Gestion de la modal de planification
function initModal() {
    const modal = document.getElementById('schedule-visit-modal');
    const form = document.getElementById('schedule-visit-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveVisit();
        });
    }
}

function showScheduleVisitModal() {
    const modal = document.getElementById('schedule-visit-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Définir la date minimale à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visit-date').setAttribute('min', today);
}

function closeScheduleVisitModal() {
    const modal = document.getElementById('schedule-visit-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Réinitialiser le formulaire
    const form = document.getElementById('schedule-visit-form');
    if (form) {
        form.reset();
    }
}

function saveVisit() {
    const form = document.getElementById('schedule-visit-form');
    const formData = new FormData(form);
    
    // Validation basique
    const property = formData.get('property');
    const date = formData.get('date');
    const time = formData.get('time');
    
    if (!property || !date || !time) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Simuler l'ajout de la visite
    const propertySelect = document.getElementById('visit-property');
    const selectedOption = propertySelect.options[propertySelect.selectedIndex];
    
    alert(`Visite planifiée avec succès !\n\nBien: ${selectedOption.text}\nDate: ${date}\nHeure: ${time}\n\nVous recevrez une confirmation par email.`);
    
    closeScheduleVisitModal();
    
    // Ici on pourrait ajouter la visite à la liste
    addVisitToList(selectedOption.text, date, time);
}

function addVisitToList(propertyTitle, date, time) {
    const visitsSection = document.querySelector('.visits-section:first-child');
    if (visitsSection) {
        const visitsList = visitsSection.querySelector('.visit-item').parentElement;
        const newVisitId = Date.now();
        
        const newVisit = document.createElement('div');
        newVisit.className = 'visit-item';
        newVisit.setAttribute('data-id', newVisitId);
        
        const [year, month, day] = date.split('-');
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                           'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        newVisit.innerHTML = `
            <div class="visit-date">
                <div class="date-day">${day}</div>
                <div class="date-month">${monthNames[parseInt(month) - 1]}</div>
                <div class="date-year">${year}</div>
            </div>
            <div class="visit-time">
                <div class="time-hour">${time}</div>
                <div class="time-period">${parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}</div>
            </div>
            <div class="visit-details">
                <div class="visit-property">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&h=80&fit=crop" alt="${propertyTitle}" class="property-thumb">
                    <div class="property-info">
                        <div class="property-title">${propertyTitle}</div>
                        <div class="property-location">Adresse à confirmer</div>
                        <div class="property-price">Prix à confirmer</div>
                    </div>
                </div>
                <div class="visit-agent">
                    <div class="agent-avatar"></div>
                    <div class="agent-info">
                        <div class="agent-name">Agent à assigner</div>
                        <div class="agent-phone">À confirmer</div>
                    </div>
                </div>
                <div class="visit-status">
                    <span class="status-badge status-pending">En attente</span>
                </div>
            </div>
            <div class="visit-actions">
                <button class="action-btn primary" onclick="viewVisitDetails(${newVisitId})">
                    <span class="material-icons">visibility</span>
                    <span>Détails</span>
                </button>
                <button class="action-btn secondary" onclick="contactAgent(${newVisitId})">
                    <span class="material-icons">chat</span>
                    <span>Contacter</span>
                </button>
                <button class="action-btn warning" onclick="cancelVisit(${newVisitId})">
                    <span class="material-icons">cancel</span>
                    <span>Annuler</span>
                </button>
            </div>
        `;
        
        visitsList.insertBefore(newVisit, visitsList.firstChild);
        
        // Ajouter l'événement de clic
        newVisit.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;
            viewVisitDetails(newVisitId);
        });
        
        // Mettre à jour les statistiques
        updateStatsAfterAdd();
    }
}

function updateStatsAfterAdd() {
    const totalStat = document.querySelector('.stat-card:first-child .stat-value');
    const pendingStat = document.querySelectorAll('.stat-card .stat-value')[2];
    
    if (totalStat) {
        const currentCount = parseInt(totalStat.textContent);
        totalStat.textContent = currentCount + 1;
    }
    
    if (pendingStat) {
        const currentCount = parseInt(pendingStat.textContent);
        pendingStat.textContent = currentCount + 1;
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
        
        valueElement.textContent = Math.floor(currentValue);
    }, 50);
}

// Fermer la modal en cliquant en dehors
document.addEventListener('click', function(e) {
    const modal = document.getElementById('schedule-visit-modal');
    if (e.target === modal) {
        closeScheduleVisitModal();
    }
});

// Fermer la modal avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('schedule-visit-modal');
        if (modal.classList.contains('active')) {
            closeScheduleVisitModal();
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