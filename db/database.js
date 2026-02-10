// database.js - Simulação de banco de dados com LocalStorage

class Database {
    constructor() {
        this.init();
    }
    
    init() {
        // Inicializar coleções se não existirem
        if (!localStorage.getItem('zeroid_users')) {
            localStorage.setItem('zeroid_users', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('zeroid_conversations')) {
            localStorage.setItem('zeroid_conversations', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('zeroid_vibezz_posts')) {
            localStorage.setItem('zeroid_vibezz_posts', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('zeroid_vibezz_follows')) {
            localStorage.setItem('zeroid_vibezz_follows', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('zeroid_vibezz_messages')) {
            localStorage.setItem('zeroid_vibezz_messages', JSON.stringify([]));
        }
    }
    
    // Usuários
    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('zeroid_users', JSON.stringify(users));
        return newUser;
    }
    
    getUsers() {
        return JSON.parse(localStorage.getItem('zeroid_users')) || [];
    }
    
    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }
    
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }
    
    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('zeroid_users', JSON.stringify(users));
            return users[index];
        }
        
        return null;
    }
    
    // Conversações (Chat)
    createConversation(conversationData) {
        const conversations = this.getConversations();
        const newConversation = {
            id: this.generateId(),
            ...conversationData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        conversations.push(newConversation);
        localStorage.setItem('zeroid_conversations', JSON.stringify(conversations));
        return newConversation;
    }
    
    getConversations(userId = null) {
        const conversations = JSON.parse(localStorage.getItem('zeroid_conversations')) || [];
        
        if (userId) {
            return conversations.filter(conv => conv.userId === userId);
        }
        
        return conversations;
    }
    
    getConversationById(id) {
        const conversations = this.getConversations();
        return conversations.find(conv => conv.id === id);
    }
    
    updateConversation(id, updates) {
        const conversations = this.getConversations();
        const index = conversations.findIndex(conv => conv.id === id);
        
        if (index !== -1) {
            conversations[index] = {
                ...conversations[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('zeroid_conversations', JSON.stringify(conversations));
            return conversations[index];
        }
        
        return null;
    }
    
    deleteConversation(id) {
        const conversations = this.getConversations();
        const filtered = conversations.filter(conv => conv.id !== id);
        localStorage.setItem('zeroid_conversations', JSON.stringify(filtered));
        return true;
    }
    
    // Posts Vibezz
    createPost(postData) {
        const posts = this.getPosts();
        const newPost = {
            id: this.generateId(),
            likes: [],
            comments: [],
            shares: 0,
            ...postData,
            createdAt: new Date().toISOString()
        };
        
        posts.unshift(newPost); // Adicionar no início para feed mais recente primeiro
        localStorage.setItem('zeroid_vibezz_posts', JSON.stringify(posts));
        return newPost;
    }
    
    getPosts(userId = null) {
        const posts = JSON.parse(localStorage.getItem('zeroid_vibezz_posts')) || [];
        
        if (userId) {
            return posts.filter(post => post.userId === userId);
        }
        
        return posts;
    }
    
    getPostById(id) {
        const posts = this.getPosts();
        return posts.find(post => post.id === id);
    }
    
    likePost(postId, userId) {
        const posts = this.getPosts();
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex !== -1) {
            const post = posts[postIndex];
            const likeIndex = post.likes.indexOf(userId);
            
            if (likeIndex === -1) {
                // Adicionar like
                post.likes.push(userId);
            } else {
                // Remover like
                post.likes.splice(likeIndex, 1);
            }
            
            localStorage.setItem('zeroid_vibezz_posts', JSON.stringify(posts));
            return post.likes;
        }
        
        return null;
    }
    
    addComment(postId, commentData) {
        const posts = this.getPosts();
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex !== -1) {
            const comment = {
                id: this.generateId(),
                ...commentData,
                createdAt: new Date().toISOString()
            };
            
            posts[postIndex].comments.push(comment);
            localStorage.setItem('zeroid_vibezz_posts', JSON.stringify(posts));
            return comment;
        }
        
        return null;
    }
    
    // Seguidores
    followUser(followerId, followingId) {
        const follows = this.getFollows();
        
        // Verificar se já segue
        const existingFollow = follows.find(
            follow => follow.followerId === followerId && follow.followingId === followingId
        );
        
        if (existingFollow) {
            // Deixar de seguir
            const filtered = follows.filter(
                follow => !(follow.followerId === followerId && follow.followingId === followingId)
            );
            localStorage.setItem('zeroid_vibezz_follows', JSON.stringify(filtered));
            return false;
        } else {
            // Seguir
            const newFollow = {
                id: this.generateId(),
                followerId,
                followingId,
                createdAt: new Date().toISOString()
            };
            
            follows.push(newFollow);
            localStorage.setItem('zeroid_vibezz_follows', JSON.stringify(follows));
            return true;
        }
    }
    
    getFollows() {
        return JSON.parse(localStorage.getItem('zeroid_vibezz_follows')) || [];
    }
    
    getFollowers(userId) {
        const follows = this.getFollows();
        return follows.filter(follow => follow.followingId === userId);
    }
    
    getFollowing(userId) {
        const follows = this.getFollows();
        return follows.filter(follow => follow.followerId === userId);
    }
    
    // Mensagens privadas
    createMessage(messageData) {
        const messages = this.getMessages();
        const newMessage = {
            id: this.generateId(),
            read: false,
            ...messageData,
            createdAt: new Date().toISOString()
        };
        
        messages.push(newMessage);
        localStorage.setItem('zeroid_vibezz_messages', JSON.stringify(messages));
        return newMessage;
    }
    
    getMessages(userId1, userId2 = null) {
        const messages = JSON.parse(localStorage.getItem('zeroid_vibezz_messages')) || [];
        
        if (userId1 && userId2) {
            return messages.filter(
                msg => (msg.senderId === userId1 && msg.receiverId === userId2) ||
                       (msg.senderId === userId2 && msg.receiverId === userId1)
            ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        
        return messages;
    }
    
    markMessageAsRead(messageId) {
        const messages = this.getMessages();
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex !== -1) {
            messages[messageIndex].read = true;
            localStorage.setItem('zeroid_vibezz_messages', JSON.stringify(messages));
            return true;
        }
        
        return false;
    }
    
    // Utilitários
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Busca
    searchUsers(query) {
        const users = this.getUsers();
        const lowerQuery = query.toLowerCase();
        
        return users.filter(user => 
            user.username.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        );
    }
    
    searchPosts(query) {
        const posts = this.getPosts();
        const lowerQuery = query.toLowerCase();
        
        return posts.filter(post => 
            post.content.toLowerCase().includes(lowerQuery) ||
            post.hashtags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// Criar instância global do banco de dados
const db = new Database();
window.db = db;
