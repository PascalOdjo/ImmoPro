// Initialize current page on load
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page filename
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    // Set active states based on current page
    if (filename === 'biens.html') {
        showPage('page-biens');
        // Set active state on sidebar menu
        document.querySelectorAll('.menu-item').forEach(item => {
            if (item.getAttribute('href') === filename) {
                item.classList.add('active');
            }
        });
    }
});

// Gestion de la modal de visite
function showVisitModal() {
    const modal = document.getElementById('visit-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVisitModal() {
    const modal = document.getElementById('visit-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Fermer la modal quand on appuie sur Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVisitModal();
    }
});

// Menu mobile toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Navigation entre pages
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

// Navigation menu
document.querySelectorAll('.menu-item').forEach((item, index) => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        // Navigation vers les pages
        const pages = ['page-dashboard', 'page-biens', 'page-clients', 'page-visites', 'page-messages', 'page-parametres'];
        if (pages[index]) {
            showPage(pages[index]);
        }

        // Fermer le menu mobile après sélection
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('mobile-open');
        }
    });
});

// Toggle view (grid/list)
function toggleView(view) {
    const gridView = document.getElementById('properties-grid');
    const listView = document.getElementById('properties-list');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (view === 'grid') {
        gridView.classList.add('active');
        listView.classList.remove('active');
        buttons[0].classList.add('active');
    } else {
        gridView.classList.remove('active');
        listView.classList.add('active');
        buttons[1].classList.add('active');
    }
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });
    document.querySelectorAll('.filter-input').forEach(input => {
        input.value = '';
    });
}

// Fermer le menu mobile en cliquant en dehors
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const isClickInside = sidebar.contains(event.target);

    if (!isClickInside && window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
    }
});

// Action buttons on property cards
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const action = this.getAttribute('title');
        alert(`Action: ${action}`);
    });
});

// Property card click
document.querySelectorAll('.property-card-full').forEach(card => {
    card.addEventListener('click', function () {
        alert('Voir les détails du bien');
    });
});

// Initialize dashboard charts if canvases are present
function initDashboardCharts() {
    try {
        const visitas = document.getElementById('chart-visites');
        const ventas = document.getElementById('chart-ventes');

        if (visitas) {
            // ensure the canvas has an explicit height to avoid zero-height rendering
            visitas.style.height = visitas.style.height || '220px';
            new Chart(visitas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [{
                        label: 'Visites',
                        data: [30, 45, 28, 60, 80, 75],
                        borderColor: 'rgba(28,63,96,0.9)',
                        backgroundColor: 'rgba(28,63,96,0.12)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        if (ventas) {
            // ensure the canvas has an explicit height to avoid zero-height rendering
            ventas.style.height = ventas.style.height || '220px';
            new Chart(ventas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                    datasets: [{
                        label: 'Ventes',
                        data: [2, 3, 1, 4, 3, 5],
                        backgroundColor: 'rgba(60,161,140,0.8)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    } catch (err) {
        // Chart.js might not be loaded or canvases missing
        console.warn('Charts initialization skipped:', err);
    }
}

// Photo uploads preview for property form
function initPhotoUploadPreview() {
    const photoInput = document.getElementById('photo-input');
    const preview = document.getElementById('photo-preview');
    const dropZone = document.getElementById('photo-drop-zone');
    if (!photoInput || !preview) return;

    function renderFiles(files) {
        preview.innerHTML = '';
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const url = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = url;
            img.alt = file.name;
            img.style.width = '100%';
            img.style.height = '120px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            const wrapper = document.createElement('div');
            wrapper.className = 'photo-thumb';
            wrapper.style.overflow = 'hidden';
            wrapper.appendChild(img);
            preview.appendChild(wrapper);
        });
    }

    photoInput.addEventListener('change', (e) => renderFiles(e.target.files));

    // drag & drop
    if (dropZone) {
        ['dragenter','dragover'].forEach(ev => {
            dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        });
        ['dragleave','drop'].forEach(ev => {
            dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); });
        });
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length) {
                photoInput.files = dt.files; // set files to input
                renderFiles(dt.files);
            }
        });
    }
}

// Table delete button handler
function initTableActions() {
    document.querySelectorAll('.delete-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            if (confirm('Supprimer ce bien ?')) {
                const row = document.querySelector(`#properties-table tbody tr[data-id='${id}']`);
                if (row) row.remove();
            }
        });
    });
}

// --- Messagerie: interactions de base ---
function selectConversation(id) {
    // mark active conversation in the list
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });

    const el = document.querySelector(`.conversation-item[data-id='${id}']`) || document.querySelector(`.conversation-item:nth-child(${id})`);
    if (el) el.classList.add('active');

    // update conversation header name if present
    const nameEl = el ? el.querySelector('.conversation-name') : null;
    if (nameEl) {
        const title = document.querySelector('.conversation-view .conversation-info h2');
        if (title) title.textContent = nameEl.textContent.trim();
    }

    // ensure messages container is scrolled to bottom
    const messages = document.querySelector('.messages-container');
    if (messages) messages.scrollTop = messages.scrollHeight;
}

function startNewConversation() {
    const name = prompt('Nom du destinataire :');
    if (!name) return;

    // create a new conversation item at the top
    const convs = document.querySelector('.conversations');
    const id = Date.now();
    const item = document.createElement('div');
    item.className = 'conversation-item active';
    item.setAttribute('data-id', id);
    item.innerHTML = `
        <div class="conversation-avatar"><div style="width:48px;height:48px;background:#eee;border-radius:50%;"></div></div>
        <div class="conversation-content">
            <div class="conversation-header">
                <h3 class="conversation-name">${name}</h3>
                <span class="conversation-time">Maintenant</span>
            </div>
            <p class="conversation-preview">Nouvelle conversation</p>
        </div>`;
    // prepend
    if (convs) convs.prepend(item);

    // wire click
    item.addEventListener('click', function() { selectConversation(id); });

    // select it
    selectConversation(id);

    // clear messages view for new conversation
    const messages = document.querySelector('.messages-container');
    if (messages) messages.innerHTML = '';
}

function sendMessage(event) {
    event.preventDefault();
    const form = event.target.tagName === 'FORM' ? event.target : document.querySelector('.message-input');
    const input = form.querySelector('input[type="text"]');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    // create message element
    const group = document.querySelector('.message-group:last-of-type') || document.createElement('div');
    if (!group.classList.contains('message-group')) {
        group.className = 'message-group';
        const dateEl = document.createElement('div');
        dateEl.className = 'message-date';
        dateEl.textContent = 'Aujourd\'hui';
        group.appendChild(dateEl);
        document.querySelector('.messages-container').appendChild(group);
    }

    const message = document.createElement('div');
    message.className = 'message sent';
    message.innerHTML = `<div class="message-content"><p>${escapeHtml(text)}</p></div><span class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>`;
    group.appendChild(message);

    // clear input and scroll
    input.value = '';
    const messages = document.querySelector('.messages-container');
    if (messages) messages.scrollTop = messages.scrollHeight;
}

function initMessaging() {
    // wire conversation clicks
    document.querySelectorAll('.conversation-item').forEach((item, idx) => {
        // ensure each has a data-id for easier selection
        if (!item.hasAttribute('data-id')) item.setAttribute('data-id', idx + 1);
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            selectConversation(id);
        });
    });

    // wire filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // simple UI filter: could be enhanced to actually filter
        });
    });

    // wire new message button
    const newBtn = document.querySelector('.new-message-btn');
    if (newBtn) newBtn.addEventListener('click', startNewConversation);

    // wire form submit (in case inline onsubmit not used)
    const form = document.querySelector('.message-input');
    if (form) form.addEventListener('submit', sendMessage);
}

// small helper to escape HTML in messages
function escapeHtml(unsafe) {
    return unsafe.replace(/[&<>"]+/g, function(match) {
        switch(match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            default: return match;
        }
    });
}

// Run initializers after DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initDashboardCharts();
    initPhotoUploadPreview();
    initTableActions();
    initMessaging();
});
