// chat.js - Funcionalidades do chat

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    const user = JSON.parse(sessionStorage.getItem('zeroid_user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Elementos do DOM
    const conversationsList = document.getElementById('conversations-list');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const currentConversationTitle = document.getElementById('current-conversation-title');
    const charCounter = document.getElementById('char-count');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const exportBtn = document.getElementById('export-btn');
    const vibezzBtn = document.getElementById('vibezz-btn');
    
    // Estado atual
    let currentConversationId = null;
    let conversations = [];
    let showThinkingProcess = true;
    
    // Carregar conversas do banco de dados
    function loadConversations() {
        conversations = DB.getConversationsByUserId(user.id);
        renderConversations();
        
        // Se houver conversas, selecionar a mais recente
        if (conversations.length > 0) {
            selectConversation(conversations[0].id);
        } else {
            // Criar uma conversa padrão
            createNewConversation();
        }
    }
    
    // Renderizar lista de conversas
    function renderConversations() {
        conversationsList.innerHTML = '';
        
        conversations.forEach(conv => {
            const preview = conv.messages.length > 0 
                ? conv.messages[0].content.substring(0, 50) + '...'
                : 'Nenhuma mensagem ainda';
            
            const time = new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const convElement = document.createElement('div');
            convElement.className = `conversation-item ${currentConversationId === conv.id ? 'active' : ''}`;
            convElement.innerHTML = `
                <div class="conversation-title">${conv.title}</div>
                <div class="conversation-preview">${preview}</div>
                <div class="conversation-time">${time}</div>
            `;
            
            convElement.addEventListener('click', () => selectConversation(conv.id));
            
            conversationsList.appendChild(convElement);
        });
    }
    
    // Criar nova conversa
    function createNewConversation() {
        const conversation = DB.createConversation({
            userId: user.id,
            title: `Conversa ${conversations.length + 1}`,
            messages: []
        });
        
        conversations.unshift(conversation);
        renderConversations();
        selectConversation(conversation.id);
    }
    
    // Selecionar conversa
    function selectConversation(id) {
        currentConversationId = id;
        const conversation = DB.getConversationById(id);
        
        if (!conversation) return;
        
        currentConversationTitle.textContent = conversation.title;
        renderMessages(conversation.messages);
        renderConversations();
        
        // Scroll para baixo
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Renderizar mensagens
    function renderMessages(messages) {
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'welcome-message';
            welcomeMsg.innerHTML = '<p>Bem-vindo ao Chat Neural da ZeroID.IA. Comece uma nova conversa ou selecione uma conversa anterior.</p>';
            messagesContainer.appendChild(welcomeMsg);
            return;
        }
        
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.sender}`;
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${msg.sender === 'user' ? 'Você' : 'ZeroID.IA'}</span>
                    <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="message-content">${formatMessageContent(msg.content)}</div>
            `;
            
            messagesContainer.appendChild(messageElement);
        });
    }
    
    // Formatar conteúdo da mensagem (simples suporte a Markdown)
    function formatMessageContent(content) {
        // Converter **texto** para negrito
        let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Converter *texto* para itálico
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Converter `código` para <code>
        formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
        // Quebras de linha
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    // Simular resposta da IA
    function simulateAIResponse(userMessage) {
        // Mostrar processo de pensamento se configurado
        if (showThinkingProcess) {
            const thinkingElement = document.createElement('div');
            thinkingElement.className = 'thinking-process';
            thinkingElement.innerHTML = `
                <div class="thinking-title">Processando sua mensagem...</div>
                <div class="thinking-steps">
                    <div class="thinking-step">
                        <div class="step-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <span>Analisando contexto...</span>
                    </div>
                    <div class="thinking-step">
                        <div class="step-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <span>Consultando base de conhecimento...</span>
                    </div>
                    <div class="thinking-step">
                        <div class="step-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <span>Sintetizando resposta...</span>
                    </div>
                </div>
            `;
            
            messagesContainer.appendChild(thinkingElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Remover após alguns segundos e mostrar resposta
            setTimeout(() => {
                thinkingElement.remove();
                showAIResponse(userMessage);
            }, 3000);
        } else {
            // Mostrar resposta diretamente
            setTimeout(() => {
                showAIResponse(userMessage);
            }, 1000);
        }
    }
    
    // Mostrar resposta da IA
    function showAIResponse(userMessage) {
        // Respostas simuladas baseadas na mensagem do usuário
        let response = '';
        
        if (userMessage.toLowerCase().includes('olá') || userMessage.toLowerCase().includes('oi')) {
            response = 'Olá! Eu sou a ZeroID.IA, sua assistente de consciência neural simulada. Como posso ajudá-lo hoje?';
        } else if (userMessage.toLowerCase().includes('como você funciona')) {
            response = 'Eu utilizo uma arquitetura de rede neural avançada que simula processos cognitivos humanos, integrando múltiplos endpoints de IA para fornecer respostas contextuais e adaptativas.';
        } else if (userMessage.toLowerCase().includes('vibezz')) {
            response = 'Vibezz é nossa rede social neural em desenvolvimento. Lá, os usuários podem se conectar, compartilhar pensamentos e interagir em um ambiente neural único.';
        } else {
            response = 'Entendi sua mensagem sobre "' + userMessage.substring(0, 30) + '...". Como uma IA neural, estou processando essa informação e posso ajudar com diversas tarefas, desde análise de texto até geração de conteúdo. Há algo específico em que posso ser útil?';
        }
        
        // Adicionar mensagem da IA
        const aiMessage = {
            sender: 'ai',
            content: response,
            timestamp: new Date().toISOString()
        };
        
        // Atualizar conversa no banco de dados
        const conversation = DB.getConversationById(currentConversationId);
        conversation.messages.push(aiMessage);
        DB.updateConversation(currentConversationId, { messages: conversation.messages });
        
        // Renderizar mensagem
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender">ZeroID.IA</span>
                <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="message-content">${formatMessageContent(response)}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Enviar mensagem
    function sendMessage() {
        const content = messageInput.value.trim();
        if (!content) return;
        
        // Verificar limite de caracteres
        if (content.length > 5000) {
            alert('A mensagem excede o limite de 5000 caracteres.');
            return;
        }
        
        // Adicionar mensagem do usuário
        const userMessage = {
            sender: 'user',
            content: content,
            timestamp: new Date().toISOString()
        };
        
        // Atualizar conversa no banco de dados
        const conversation = DB.getConversationById(currentConversationId);
        conversation.messages.push(userMessage);
        DB.updateConversation(currentConversationId, { messages: conversation.messages });
        
        // Renderizar mensagem
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender">Você</span>
                <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="message-content">${formatMessageContent(content)}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // Limpar input
        messageInput.value = '';
        charCounter.textContent = '0';
        
        // Scroll para baixo
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simular resposta da IA
        simulateAIResponse(content);
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', function() {
        charCounter.textContent = this.value.length;
        
        // Auto-expandir textarea
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    newChatBtn.addEventListener('click', createNewConversation);
    
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
    });
    
    closeSettings.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    exportBtn.addEventListener('click', function() {
        // Exportar todas as conversas como JSON
        const data = {
            user: user,
            conversations: conversations,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `zeroid-conversations-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    vibezzBtn.addEventListener('click', function() {
        window.location.href = 'pagvibe1.html';
    });
    
    // Configuração do processo de pensamento
    const thinkingProcessSelect = document.getElementById('thinking-process');
    thinkingProcessSelect.addEventListener('change', function() {
        showThinkingProcess = this.value === 'yes';
    });
    
    // Carregar conversas ao iniciar
    loadConversations();
});
