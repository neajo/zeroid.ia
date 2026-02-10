// auth.js - Autenticação de usuários

document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;

    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!email || !password) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Modo de login
        const isLoginMode = document.getElementById('form-extra').style.display === 'none';
        
        if (isLoginMode) {
            // Login
            const user = authenticateUser(email, password);
            if (user) {
                alert('Login realizado com sucesso!');
                // Salvar sessão
                sessionStorage.setItem('zeroid_user', JSON.stringify(user));
                // Redirecionar para pagina1.html
                window.location.href = 'pagina1.html';
            } else {
                alert('E-mail ou senha incorretos.');
            }
        } else {
            // Cadastro
            const username = document.getElementById('username').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            
            if (!username) {
                alert('Por favor, informe um nome de usuário.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            
            // Validar força da senha
            const strength = calculatePasswordStrength(password);
            if (strength.percentage < 60) {
                alert('A senha é muito fraca. Use pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.');
                return;
            }
            
            const newUser = createUser(username, email, password);
            if (newUser) {
                alert('Conta criada com sucesso! Faça login para continuar.');
                // Mudar para modo login
                document.querySelector('.close-modal').click();
                document.getElementById('btn-login').click();
            } else {
                alert('Este e-mail já está registrado.');
            }
        }
    });
});

// Funções de banco de dados (simuladas)
function getUsers() {
    const users = localStorage.getItem('zeroid_users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('zeroid_users', JSON.stringify(users));
}

function createUser(username, email, password) {
    const users = getUsers();
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        username,
        email,
        passwordHash: btoa(password), // Apenas para demonstração, NÃO use em produção!
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

function authenticateUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && atob(u.passwordHash) === password);
    return user || false;
}

// Reutilizar a função de calcular força da senha
function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const percentage = score * 20;
    let color = '#ff0000';
    if (score >= 4) color = '#00ff00';
    else if (score >= 3) color = '#ffff00';

    return { percentage, color };
}
