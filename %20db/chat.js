// chat.js - Funcionalidades do chat com IA

class ChatManager {
    constructor() {
        this.currentConversationId = null;
        this.conversations = [];
        this.showThinkingProcess = true;
        this.currentUser = null;
        
        this.init();
    }
    
    async init() {
        // Verificar autenticação
        if (!checkAuth()) {
            navigateTo('index.html');
            return;
        }
        
        this.currentUser = getCurrentUser();
        this.setupEventListeners();
        await this.loadConversations();
        
        if (this.conversations.length === 0) {
            this.createNewConversation();
        } else {
            this.selectConversation(this.conversations[0].id);
        }
    }
    
    setupEventListeners() {
        // Novo chat
        document.getElementById('new-chat-btn')?.addEventListener('click', () => {
            this.createNewConversation();
        });
        
        // Enviar mensagem
        document.getElementById('send-btn')?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter para enviar (Shift+Enter para nova linha)
        document.getElementById('message-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Contador de caracteres
        document.getElementById('message-input')?.addEventListener('input', (e) => {
            const count = e.target.value.length;
            document.getElementById('char-count').textContent = count;
            
            // Auto-expandir textarea
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
        
        // Configurações
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.openSettings();
        });
        
        document.getElementById('close-settings')?.addEventListener('click', () => {
            this.closeSettings();
        });
        
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportConversations();
        });
        
        // Processo de pensamento
        document.getElementById('thinking-process')?.addEventListener('change', (e) => {
            this.showThinkingProcess = e.target.value === 'yes';
        });
    }
    
    async loadConversations() {
        try {
            // Carregar do banco de dados
            this.conversations = db.getConversations(this.currentUser?.id) || [];
            this.renderConversations();
        } catch (error) {
            console.error('Erro ao carregar conversas:', error);
        }
    }
    
    renderConversations() {
        const container = document.getElementById('conversations-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.conversations.forEach(conversation => {
            const item = document.createElement('div');
            item.className = `conversation-item ${
                this.currentConversationId === conversation.id ? 'active' : ''
            }`;
            item.dataset.id = conversation.id;
            
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            const preview = lastMessage?.content?.substring(0, 50) || 'Nenhuma mensagem';
            const time = new Date(conversation.updatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            item.innerHTML = `
                <div class="conversation-title">${conversation.title}</div>
                <div class="conversation-preview">${preview}${preview.length >= 50 ? '...' : ''}</div>
                <div class="conversation-time">${time}</div>
            `;
            
            item.addEventListener('click', () => {
                this.selectConversation(conversation.id);
            });
            
            container.appendChild(item);
        });
    }
    
    createNewConversation() {
        const conversation = db.createConversation({
            userId: this.currentUser?.id,
            title: `Conversa ${this.conversations.length + 1}`,
            messages: []
        });
        
        this.conversations.unshift(conversation);
        this.renderConversations();
        this.selectConversation(conversation.id);
    }
    
    selectConversation(id) {
        this.currentConversationId = id;
        const conversation = db.getConversationById(id);
        
        if (!conversation) return;
        
        // Atualizar título
        document.getElementById('current-conversation-title').textContent = conversation.title;
        
        // Renderizar mensagens
        this.renderMessages(conversation.messages);
        
        // Atualizar lista de conversas
        this.renderConversations();
        
        // Scroll para baixo
        this.scrollToBottom();
    }
    
    renderMessages(messages) {
        const container = document.getElementById('messages-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <p>Bem-vindo ao Chat Neural da ZeroID.IA. Comece uma nova conversa ou selecione uma conversa anterior.</p>
                </div>
            `;
            return;
        }
        
        messages.forEach(message => {
            this.addMessageToUI(message, false);
        });
    }
    
    async sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Verificar limite de caracteres
        if (message.length > 5000) {
            alert('A mensagem excede o limite de 5000 caracteres.');
            return;
        }
        
        // Adicionar mensagem do usuário
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        
        this.addMessageToUI(userMessage, true);
        
        // Limpar input
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('char-count').textContent = '0';
        
        // Salvar no banco de dados
        this.saveMessage(userMessage);
        
        // Simular resposta da IA
        await this.simulateAIResponse(message);
    }
    
    async simulateAIResponse(userMessage) {
        if (this.showThinkingProcess) {
            this.showThinkingAnimation();
            
            // Aguardar para simular processamento
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Remover animação de pensamento
            const thinkingElement = document.querySelector('.thinking-process');
            if (thinkingElement) {
                thinkingElement.remove();
            }
        }
        
        // Gerar resposta simulada
        const response = await this.generateAIResponse(userMessage);
        
        // Adicionar resposta da IA
        const aiMessage = {
            id: Date.now(),
            sender: 'ai',
            content: response,
            timestamp: new Date().toISOString()
        };
        
        this.addMessageToUI(aiMessage, true);
        this.saveMessage(aiMessage);
    }
    
    async generateAIResponse(userMessage) {
        // Respostas simuladas baseadas no conteúdo
        const responses = {
            'olá|oi|hello|hi': 'Olá! Eu sou a ZeroID.IA, sua assistente de consciência neural simulada. Como posso ajudá-lo hoje?',
            'como você funciona|como funciona': 'Eu utilizo uma arquitetura de rede neural avançada que simula processos cognitivos humanos. Minha base de conhecimento integra múltiplos modelos de IA para fornecer respostas contextuais e adaptativas.',
            'vibezz|rede social': 'Vibezz é nossa rede social neural em desenvolvimento. É um espaço onde mentes se conectam através de interações neurais avançadas. Em breve você poderá experimentar!',
            'segurança|privacidade': 'Sua segurança é nossa prioridade. Todas as conversas são criptografadas end-to-end e seus dados nunca são compartilhados com terceiros.',
            'obrigado|thanks|grato': 'De nada! Estou aqui para ajudar. Se tiver mais alguma dúvida, é só perguntar.'
        };
        
        // Procurar resposta correspondente
        const lowerMessage = userMessage.toLowerCase();
        for (const [pattern, response] of Object.entries(responses)) {
            if (new RegExp(pattern).test(lowerMessage)) {
                return response;
            }
        }
        
        // Resposta padrão
        return `Entendi sua mensagem sobre "${userMessage.substring(0, 30)}...". Como uma IA neural, posso ajudar com análise de texto, geração de conteúdo, respostas a perguntas e muito mais. Há algo específico em que posso ser útil?`;
    }
    
    showThinkingAnimation() {
        const container = document.getElementById('messages-container');
        
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
        
        container.appendChild(thinkingElement);
        this.scrollToBottom();
    }
    
    addMessageToUI(message, scroll = true) {
        const container = document.getElementById('messages-container');
        
        // Remover mensagem de boas-vindas se existir
        const welcomeMessage = container.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${
                    message.sender === 'user' ? 'Você' : 'ZeroID.IA'
                }</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.formatMessage(message.content)}</div>
        `;
        
        container.appendChild(messageElement);
        
        if (scroll) {
            this.scrollToBottom();
        }
    }
    
    formatMessage(content) {
        // Converter Markdown simples para HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        return formatted;
    }
    
    saveMessage(message) {
        if (!this.currentConversationId) return;
        
        const conversation = db.getConversationById(this.currentConversationId);
        if (!conversation) return;
        
        // Adicionar mensagem à conversa
        conversation.messages.push(message);
        
        // Atualizar título se for a primeira mensagem
        if (conversation.messages.length === 1) {
            conversation.title = message.content.substring(0, 30) + 
                (message.content.length > 30 ? '...' : '');
        }
        
        // Atualizar no banco de dados
        db.updateConversation(this.currentConversationId, {
            messages: conversation.messages,
            title: conversation.title,
            updatedAt: new Date().toISOString()
        });
        
        // Atualizar lista de conversas
        this.loadConversations();
    }
    
    scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }
    
    openSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
    }
    
    closeSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }
    
    exportConversations() {
        const data = {
            user: this.currentUser,
            conversations: this.conversations,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zeroid-conversations-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Conversas exportadas com sucesso!');
    }
}

// Inicializar chat quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});
