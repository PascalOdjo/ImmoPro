// Page Messagerie - Fonctionnalités spécifiques
document.addEventListener('DOMContentLoaded', function() {
    initClientMessagerie();
});

function initClientMessagerie() {
    // Initialiser les interactions de la messagerie
    initConversationFilters();
    initConversationSelection();
    initMessageInput();
    initModals();
    initStatsAnimations();
    initRealTimeUpdates();
}

// Filtres de conversations
function initConversationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            // Appliquer le filtre
            const filter = this.textContent.toLowerCase();
            filterConversations(filter);
        });
    });
}

function filterConversations(filter) {
    const conversations = document.querySelectorAll('.conversation-item');

    conversations.forEach(conversation => {
        let show = true;

        switch (filter) {
            case 'tous':
                show = true;
                break;
            case 'non lus':
                const unreadCount = conversation.querySelector('.unread-count');
                show = unreadCount !== null;
                break;
            case 'agents':
                const status = conversation.querySelector('.conversation-status').textContent;
                show = status.includes('Agent');
                break;
        }

        if (show) {
            conversation.style.display = '';
        } else {
            conversation.style.display = 'none';
        }
    });
}

// Sélection de conversation
function initConversationSelection() {
    const conversations = document.querySelectorAll('.conversation-item');

    conversations.forEach(conversation => {
        conversation.addEventListener('click', function() {
            const conversationId = this.getAttribute('data-id');
            selectConversation(conversationId);
        });
    });
}

function selectConversation(conversationId) {
    // Retirer la classe active de toutes les conversations
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });

    // Ajouter la classe active à la conversation sélectionnée
    const selectedConversation = document.querySelector(`[data-id="${conversationId}"]`);
    if (selectedConversation) {
        selectedConversation.classList.add('active');

        // Masquer l'état vide et afficher la conversation
        document.getElementById('empty-conversation').style.display = 'none';
        document.getElementById('conversation-view').style.display = 'flex';

        // Mettre à jour les informations de la conversation
        updateConversationView(conversationId);

        // Marquer les messages comme lus
        markConversationAsRead(conversationId);
    }
}

function updateConversationView(conversationId) {
    const conversation = document.querySelector(`[data-id="${conversationId}"]`);
    if (!conversation) return;

    const name = conversation.querySelector('.conversation-name').textContent;
    const status = conversation.querySelector('.conversation-status').textContent;
    const isOnline = conversation.querySelector('.online-indicator') !== null;

    // Mettre à jour l'en-tête de la conversation
    const conversationHeader = document.querySelector('.conversation-view .conversation-details');
    if (conversationHeader) {
        conversationHeader.querySelector('h2').textContent = name;
        conversationHeader.querySelector('p').textContent = `${status} • ${isOnline ? 'En ligne' : 'Hors ligne'}`;
    }

    // Mettre à jour l'avatar
    const avatar = document.querySelector('.conversation-view .avatar-medium');
    if (avatar) {
        avatar.style.backgroundColor = getAvatarColor(name);
    }

    // Charger les messages de la conversation
    loadConversationMessages(conversationId);
}

function getAvatarColor(name) {
    const colors = ['#d8c4a0', '#3f6e8c', '#c05b4d', '#3ca18c', '#d4a65a'];
    const index = name.length % colors.length;
    return colors[index];
}

function loadConversationMessages(conversationId) {
    const messagesContainer = document.querySelector('.messages-container');

    // Simuler le chargement des messages
    const messages = getConversationMessages(conversationId);

    messagesContainer.innerHTML = '';

    messages.forEach(messageGroup => {
        const groupElement = document.createElement('div');
        groupElement.className = 'message-group';

        if (messageGroup.date) {
            const dateElement = document.createElement('div');
            dateElement.className = 'message-date';
            dateElement.textContent = messageGroup.date;
            groupElement.appendChild(dateElement);
        }

        messageGroup.messages.forEach(message => {
            const messageElement = createMessageElement(message);
            groupElement.appendChild(messageElement);
        });

        messagesContainer.appendChild(groupElement);
    });

    // Faire défiler vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getConversationMessages(conversationId) {
    // Messages simulés selon l'ID de conversation
    const messagesData = {
        '1': [{
            date: 'Aujourd\'hui',
            messages: [{
                    type: 'received',
                    content: 'Bonjour Marie, votre visite de demain à 14h est confirmée !',
                    time: '14:30',
                    avatar: true
                },
                {
                    type: 'sent',
                    content: 'Parfait, merci Sophie ! Pouvez-vous me confirmer l\'adresse exacte ?',
                    time: '14:32'
                },
                {
                    type: 'received',
                    content: 'Bien sûr ! L\'adresse est : 15 rue de la Paix, 75015 Paris. Le code d\'entrée est 1234. Je vous attends devant l\'immeuble.',
                    time: '14:35',
                    avatar: true
                },
                {
                    type: 'sent',
                    content: 'Parfait, je serai là à l\'heure ! Merci beaucoup.',
                    time: '14:36'
                },
                {
                    type: 'received',
                    content: 'Excellent ! N\'hésitez pas si vous avez des questions avant la visite. À demain !',
                    time: '14:38',
                    avatar: true
                }
            ]
        }],
        '2': [{
            date: 'Hier',
            messages: [{
                    type: 'received',
                    content: 'Bonjour Marie, j\'ai un nouveau bien qui pourrait vous intéresser. Un appartement T3 moderne dans le 15ème arrondissement.',
                    time: '16:45',
                    avatar: true
                },
                {
                    type: 'sent',
                    content: 'Bonjour Pierre, cela m\'intéresse ! Pouvez-vous me donner plus de détails ?',
                    time: '17:20'
                },
                {
                    type: 'received',
                    content: 'Bien sûr ! C\'est un appartement de 85m², 3 chambres, 2 salles de bain, avec balcon. Prix : 650 000€. Voulez-vous planifier une visite ?',
                    time: '17:25',
                    avatar: true
                }
            ]
        }]
    };

    return messagesData[conversationId] || [];
}

function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;

    let html = '';

    if (message.type === 'received' && message.avatar) {
        html += `
            <div class="message-avatar">
                <div class="avatar-small"></div>
            </div>
        `;
    }

    html += `
        <div class="message-content">
            <div class="message-bubble">
                <p>${message.content}</p>
            </div>
            <div class="message-time">${message.time}</div>
        </div>
    `;

    messageElement.innerHTML = html;
    return messageElement;
}

function markConversationAsRead(conversationId) {
    const conversation = document.querySelector(`[data-id="${conversationId}"]`);
    if (conversation) {
        const unreadCount = conversation.querySelector('.unread-count');
        if (unreadCount) {
            unreadCount.remove();
        }
    }

    // Mettre à jour les statistiques
    updateUnreadCount();
}

function updateUnreadCount() {
    const unreadCount = document.querySelectorAll('.unread-count').length;
    const unreadStat = document.querySelectorAll('.stat-card .stat-value')[2];

    if (unreadStat) {
        unreadStat.textContent = unreadCount;
    }
}

// Gestion de l'input de message
function initMessageInput() {
    const textarea = document.querySelector('.message-input textarea');
    if (textarea) {
        textarea.addEventListener('keydown', handleKeyDown);
        textarea.addEventListener('input', function() {
            autoResize(this);
        });
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function sendMessage() {
    const textarea = document.querySelector('.message-input textarea');
    const message = textarea.value.trim();

    if (!message) return;

    // Ajouter le message à la conversation
    addMessageToConversation(message, 'sent');

    // Vider l'input
    textarea.value = '';
    textarea.style.height = 'auto';

    // Simuler une réponse automatique
    setTimeout(() => {
        simulateAgentResponse();
    }, 2000);
}

function addMessageToConversation(content, type) {
    const messagesContainer = document.querySelector('.messages-container');
    const lastGroup = messagesContainer.querySelector('.message-group:last-child');

    if (!lastGroup) {
        // Créer un nouveau groupe si aucun n'existe
        const newGroup = document.createElement('div');
        newGroup.className = 'message-group';
        messagesContainer.appendChild(newGroup);
        return addMessageToConversation(content, type);
    }

    const messageElement = createMessageElement({
        type: type,
        content: content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    lastGroup.appendChild(messageElement);

    // Faire défiler vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function simulateAgentResponse() {
    const responses = [
        'Merci pour votre message, je vous réponds rapidement.',
        'Parfait, je prends note de votre demande.',
        'Je vais vérifier cela et vous tenir informé.',
        'Excellente question ! Laissez-moi vous donner plus de détails.',
        'Je comprends votre préoccupation, nous allons résoudre cela ensemble.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    addMessageToConversation(randomResponse, 'received');
}

// Réponses rapides
function addQuickReply(text) {
    const textarea = document.querySelector('.message-input textarea');
    textarea.value = text;
    textarea.focus();
    autoResize(textarea);
}

// Gestion des modals
function initModals() {
    // Modal nouveau message
    const newMessageModal = document.getElementById('new-message-modal');
    const newMessageForm = document.getElementById('new-message-form');

    if (newMessageForm) {
        newMessageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendNewMessage();
        });
    }
}

function showNewMessageModal() {
    const modal = document.getElementById('new-message-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewMessageModal() {
    const modal = document.getElementById('new-message-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Réinitialiser le formulaire
    const form = document.getElementById('new-message-form');
    if (form) {
        form.reset();
    }
}

function sendNewMessage() {
    const form = document.getElementById('new-message-form');
    const formData = new FormData(form);

    const recipient = formData.get('recipient');
    const subject = formData.get('subject');
    const content = formData.get('content');
    const priority = formData.get('priority');

    if (!recipient || !content) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Simuler l'envoi du message
    const recipientSelect = document.getElementById('message-recipient');
    const selectedOption = recipientSelect.options[recipientSelect.selectedIndex];

    alert(`Message envoyé avec succès !\n\nDestinataire: ${selectedOption.text}\nSujet: ${subject || 'Aucun'}\nPriorité: ${priority}\n\nVotre message a été transmis.`);

    closeNewMessageModal();

    // Créer une nouvelle conversation
    createNewConversation(selectedOption.text, content);
}

function createNewConversation(recipientName, firstMessage) {
    const conversationsList = document.querySelector('.conversations-list');
    const newConversationId = Date.now();

    const newConversation = document.createElement('div');
    newConversation.className = 'conversation-item';
    newConversation.setAttribute('data-id', newConversationId);

    newConversation.innerHTML = `
        <div class="conversation-avatar">
            <div class="avatar-small"></div>
        </div>
        <div class="conversation-content">
            <div class="conversation-header">
                <div class="conversation-name">${recipientName}</div>
                <div class="conversation-time">Maintenant</div>
            </div>
            <div class="conversation-preview">${firstMessage}</div>
            <div class="conversation-meta">
                <span class="conversation-status">Agent immobilier</span>
            </div>
        </div>
    `;

    conversationsList.insertBefore(newConversation, conversationsList.firstChild);

    // Ajouter l'événement de clic
    newConversation.addEventListener('click', function() {
        selectConversation(newConversationId);
    });

    // Sélectionner automatiquement la nouvelle conversation
    selectConversation(newConversationId);

    // Mettre à jour les statistiques
    updateStatsAfterNewMessage();
}

function updateStatsAfterNewMessage() {
    const sentStat = document.querySelectorAll('.stat-card .stat-value')[1];
    const conversationsStat = document.querySelectorAll('.stat-card .stat-value')[3];

    if (sentStat) {
        const currentCount = parseInt(sentStat.textContent);
        sentStat.textContent = currentCount + 1;
    }

    if (conversationsStat) {
        const currentCount = parseInt(conversationsStat.textContent);
        conversationsStat.textContent = currentCount + 1;
    }
}

// Actions de conversation
function archiveConversation(conversationId) {
    const conversation = document.querySelector(`[data-id="${conversationId}"]`);
    const conversationName = conversation.querySelector('.conversation-name').textContent;

    if (confirm(`Archiver la conversation avec ${conversationName} ?`)) {
        conversation.style.transition = 'all 0.3s ease';
        conversation.style.opacity = '0';
        conversation.style.transform = 'scale(0.95)';

        setTimeout(() => {
            conversation.remove();
            showEmptyConversation();
        }, 300);

        alert('Conversation archivée avec succès.');
    }
}

function deleteConversation(conversationId) {
    const conversation = document.querySelector(`[data-id="${conversationId}"]`);
    const conversationName = conversation.querySelector('.conversation-name').textContent;

    if (confirm(`Supprimer définitivement la conversation avec ${conversationName} ?\n\nCette action est irréversible.`)) {
        conversation.style.transition = 'all 0.3s ease';
        conversation.style.opacity = '0';
        conversation.style.transform = 'scale(0.95)';

        setTimeout(() => {
            conversation.remove();
            showEmptyConversation();
        }, 300);

        alert('Conversation supprimée avec succès.');
    }
}

function showConversationInfo(conversationId) {
    const modal = document.getElementById('conversation-info-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConversationInfoModal() {
    const modal = document.getElementById('conversation-info-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showEmptyConversation() {
    document.getElementById('conversation-view').style.display = 'none';
    document.getElementById('empty-conversation').style.display = 'flex';
}

// Actions de contact
function callAgent() {
    alert('Fonctionnalité d\'appel téléphonique\n\nCette fonctionnalité ouvrira l\'application téléphone avec le numéro de l\'agent.');
}

function emailAgent() {
    alert('Fonctionnalité d\'envoi d\'email\n\nCette fonctionnalité ouvrira votre client email avec l\'adresse de l\'agent.');
}

function scheduleMeeting() {
    alert('Planification de rendez-vous\n\nCette fonctionnalité ouvrira le calendrier pour planifier un rendez-vous avec l\'agent.');
}

// Fonction pour joindre un fichier
function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.pdf,.doc,.docx';

    input.onchange = function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            alert(`Fichier(s) sélectionné(s) : ${files.map(f => f.name).join(', ')}\n\nCette fonctionnalité permettra d'envoyer des fichiers joints.`);
        }
    };

    input.click();
}

// Mises à jour en temps réel
function initRealTimeUpdates() {
    // Simuler des messages en temps réel
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de chance toutes les 30 secondes
            simulateIncomingMessage();
        }
    }, 30000);
}

function simulateIncomingMessage() {
    const conversations = document.querySelectorAll('.conversation-item:not([style*="display: none"])');
    if (conversations.length === 0) return;

    const randomConversation = conversations[Math.floor(Math.random() * conversations.length)];
    const conversationId = randomConversation.getAttribute('data-id');
    const conversationName = randomConversation.querySelector('.conversation-name').textContent;

    // Ajouter un indicateur de nouveau message
    const unreadCount = randomConversation.querySelector('.unread-count');
    if (unreadCount) {
        unreadCount.textContent = parseInt(unreadCount.textContent) + 1;
    } else {
        const meta = randomConversation.querySelector('.conversation-meta');
        const newUnreadCount = document.createElement('span');
        newUnreadCount.className = 'unread-count';
        newUnreadCount.textContent = '1';
        meta.appendChild(newUnreadCount);
    }

    // Mettre à jour le preview
    const preview = randomConversation.querySelector('.conversation-preview');
    preview.textContent = 'Nouveau message reçu...';

    // Mettre à jour les statistiques
    updateUnreadCount();

    // Notification
    showMessageNotification(conversationName);
}

function showMessageNotification(senderName) {
    const notification = document.createElement('div');
    notification.className = 'message-notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-width: 300px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span class="material-icons" style="color: var(--primary-blue);">chat</span>
                <strong>Nouveau message</strong>
            </div>
            <div style="font-size: 14px; color: var(--text-primary);">
                De: ${senderName}
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
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

// Fermer les modals en cliquant en dehors
document.addEventListener('click', function(e) {
    const newMessageModal = document.getElementById('new-message-modal');
    const conversationInfoModal = document.getElementById('conversation-info-modal');

    if (e.target === newMessageModal) {
        closeNewMessageModal();
    }

    if (e.target === conversationInfoModal) {
        closeConversationInfoModal();
    }
});

// Fermer les modals avec Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const newMessageModal = document.getElementById('new-message-modal');
        const conversationInfoModal = document.getElementById('conversation-info-modal');

        if (newMessageModal.classList.contains('active')) {
            closeNewMessageModal();
        }

        if (conversationInfoModal.classList.contains('active')) {
            closeConversationInfoModal();
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