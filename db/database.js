// database.js - Simulação de banco de dados com LocalStorage/IndexedDB

// Usar LocalStorage para simular um banco de dados simples

const DB = {
    // Usuários ZeroID
    users: [],
    
    // Conversas do chat
    conversations: [],
    
    // Posts do Vibezz
    vibezzPosts: [],
    
    // Seguidores do Vibezz
    vibezzFollows: [],
    
    // Mensagens privadas do Vibezz
    vibezzMessages: [],
    
    // Inicializar banco de dados
    init() {
        this.loadFromLocalStorage();
    },
    
    // Carregar dados do LocalStorage
    loadFromLocalStorage() {
        this.users = JSON.parse(localStorage.getItem('zeroid_db_users')) || [];
        this.conversations = JSON.parse(localStorage.getItem('zeroid_db_conversations')) || [];
        this.vibezzPosts = JSON.parse(localStorage.getItem('zeroid_db_vibezzPosts')) || [];
        this.vibezzFollows = JSON.parse(localStorage.getItem('zeroid_db_vibezzFollows')) || [];
        this.vibezzMessages = JSON.parse(localStorage.getItem('zeroid_db_vibezzMessages')) || [];
    },
    
    // Salvar dados no LocalStorage
    saveToLocalStorage() {
        localStorage.setItem('zeroid_db_users', JSON.stringify(this.users));
        localStorage.setItem('zeroid_db_conversations', JSON.stringify(this.conversations));
        localStorage.setItem('zeroid_db_vibezzPosts', JSON.stringify(this.vibezzPosts));
        localStorage.setItem('zeroid_db_vibezzFollows', JSON.stringify(this.vibezzFollows));
        localStorage.setItem('zeroid_db_vibezzMessages', JSON.stringify(this.vibezzMessages));
    },
    
    // Funções para usuários ZeroID
    createUser(userData) {
        const user = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(user);
        this.saveToLocalStorage();
        return user;
    },
    
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    },
    
    findUserById(id) {
        return this.users.find(user => user.id === id);
    },
    
    // Funções para conversas
    createConversation(conversationData) {
        const conversation = {
            id: Date.now(),
            ...conversationData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.conversations.push(conversation);
        this.saveToLocalStorage();
        return conversation;
    },
    
    getConversationsByUserId(userId) {
        return this.conversations
            .filter(conv => conv.userId === userId)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },
    
    getConversationById(id) {
        return this.conversations.find(conv => conv.id === id);
    },
    
    updateConversation(id, updates) {
        const index = this.conversations.findIndex(conv => conv.id === id);
        if (index >= 0) {
            this.conversations[index] = {
                ...this.conversations[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToLocalStorage();
            return this.conversations[index];
        }
        return null;
    },
    
    deleteConversation(id) {
        const index = this.conversations.findIndex(conv => conv.id === id);
        if (index >= 0) {
            this.conversations.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Funções para Vibezz
    createVibezzPost(postData) {
        const post = {
            id: Date.now(),
            likes: [],
            comments: [],
            ...postData,
            createdAt: new Date().toISOString()
        };
        
        this.vibezzPosts.push(post);
        this.saveToLocalStorage();
        return post;
    },
    
    getVibezzPosts(userId = null) {
        let posts = [...this.vibezzPosts];
        
        if (userId) {
            // Filtrar por usuário específico
            posts = posts.filter(post => post.userId === userId);
        }
        
        // Ordenar por data (mais recente primeiro)
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    
    likeVibezzPost(postId, userId) {
        const post = this.vibezzPosts.find(p => p.id === postId);
        if (!post) return false;
        
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex >= 0) {
            // Já curtiu, remover like
            post.likes.splice(likeIndex, 1);
        } else {
            // Adicionar like
            post.likes.push(userId);
        }
        
        this.saveToLocalStorage();
        return post.likes;
    },
    
    addCommentToPost(postId, commentData) {
        const post = this.vibezzPosts.find(p => p.id === postId);
        if (!post) return null;
        
        const comment = {
            id: Date.now(),
            ...commentData,
            createdAt: new Date().toISOString()
        };
        
        post.comments.push(comment);
        this.saveToLocalStorage();
        return comment;
    },
    
    followUser(followerId, followingId) {
        // Verificar se já segue
        const existingFollow = this.vibezzFollows.find(
            follow => follow.followerId === followerId && follow.followingId === followingId
        );
        
        if (existingFollow) {
            // Já segue, então parar de seguir (remover)
            const index = this.vibezzFollows.indexOf(existingFollow);
            this.vibezzFollows.splice(index, 1);
            this.saveToLocalStorage();
            return false; // Indica que deixou de seguir
        } else {
            // Seguir
            const follow = {
                followerId,
                followingId,
                createdAt: new Date().toISOString()
            };
            
            this.vibezzFollows.push(follow);
            this.saveToLocalStorage();
            return true; // Indica que começou a seguir
        }
    },
    
    getFollowers(userId) {
        return this.vibezzFollows.filter(follow => follow.followingId === userId);
    },
    
    getFollowing(userId) {
        return this.vibezzFollows.filter(follow => follow.followerId === userId);
    },
    
    // Funções para mensagens privadas do Vibezz
    createVibezzMessage(messageData) {
        const message = {
            id: Date.now(),
            readAt: null,
            ...messageData,
            createdAt: new Date().toISOString()
        };
        
        this.vibezzMessages.push(message);
        this.saveToLocalStorage();
        return message;
    },
    
    getConversationBetweenUsers(userId1, userId2) {
        return this.vibezzMessages.filter(msg => 
            (msg.senderId === userId1 && msg.receiverId === userId2) ||
            (msg.senderId === userId2 && msg.receiverId === userId1)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    
    markMessageAsRead(messageId) {
        const message = this.vibezzMessages.find(msg => msg.id === messageId);
        if (message && !message.readAt) {
            message.readAt = new Date().toISOString();
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }
};

// Inicializar o banco de dados
DB.init();

// Exportar para uso em outros arquivos
window.DB = DB;
