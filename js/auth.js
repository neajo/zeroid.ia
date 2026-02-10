// auth.js - Sistema de autenticação e validação

document.addEventListener('DOMContentLoaded', function() {
    initAuthForm();
});

function initAuthForm() {
    const authForm = document.getElementById('auth-form');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!authForm) return;
    
    // Validação de força da senha em tempo real
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.style.backgroundColor = strength.color;
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        });
    }
    
    // Submissão do formulário
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const isSignup = document.getElementById('form-extra').style.display !== 'none';
        
        if (isSignup) {
            const username = document.getElementById('username').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            
            if (!validateSignup(email, password, username, confirmPassword)) {
                return;
            }
            
            // Criar conta
            createAccount(email, password, username);
        } else {
            if (!validateLogin(email, password)) {
                return;
            }
            
            // Fazer login
            login(email, password);
        }
    });
}

// Validar criação de conta
function validateSignup(email, password, username, confirmPassword) {
    // Validar email
    if (!isValidEmail(email)) {
        showError('Por favor, insira um e-mail válido.');
        return false;
    }
    
    // Validar nome de usuário
    if (username.length < 3) {
        showError('O nome de usuário deve ter pelo menos 3 caracteres.');
        return false;
    }
    
    // Validar senha
    const strength = calculatePasswordStrength(password);
    if (strength.score < 3) {
        showError('A senha é muito fraca. Use letras maiúsculas, minúsculas, números e símbolos.');
        return false;
    }
    
    // Confirmar senha
    if (password !== confirmPassword) {
        showError('As senhas não coincidem.');
        return false;
    }
    
    return true;
}

// Validar login
function validateLogin(email, password) {
    if (!isValidEmail(email)) {
        showError('Por favor, insira um e-mail válido.');
        return false;
    }
    
    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres.');
        return false;
    }
    
    return true;
}

// Calcular força da senha
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Comprimento
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Letras minúsculas
    if (/[a-z]/.test(password)) score++;
    
    // Letras maiúsculas
    if (/[A-Z]/.test(password)) score++;
    
    // Números
    if (/[0-9]/.test(password)) score++;
    
    // Símbolos
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Determinar força
    let strength = {
        score: score,
        percentage: (score / 6) * 100
    };
    
    if (score <= 2) {
        strength.text = 'Fraca';
        strength.color = '#ff4444';
    } else if (score <= 4) {
        strength.text = 'Média';
        strength.color = '#ffbb33';
    } else {
        strength.text = 'Forte';
        strength.color = '#00C851';
    }
    
    return strength;
}

// Validar email com regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Criar conta
function createAccount(email, password, username) {
    // Verificar se usuário já existe
    const users = JSON.parse(localStorage.getItem('zeroid_users') || '[]');
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        showError('Este e-mail já está registrado.');
        return;
    }
    
    // Criar novo usuário (em produção, usar hash para senha)
    const newUser = {
        id: Date.now(),
        email: email,
        username: username,
        password: password, // Em produção, usar bcrypt
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('zeroid_users', JSON.stringify(users));
    
    // Gerar token e salvar sessão
    const token = generateToken();
    localStorage.setItem('zeroid_token', token);
    localStorage.setItem('zeroid_user', JSON.stringify(newUser));
    
    // Redirecionar para página 1
    showSuccess('Conta criada com sucesso!');
    setTimeout(() => {
        navigateTo('pagina1.html');
    }, 1500);
}

// Fazer login
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('zeroid_users') || '[]');
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        showError('E-mail ou senha incorretos.');
        return;
    }
    
    // Gerar token e salvar sessão
    const token = generateToken();
    localStorage.setItem('zeroid_token', token);
    localStorage.setItem('zeroid_user', JSON.stringify(user));
    
    // Redirecionar para página 1
    showSuccess('Login realizado com sucesso!');
    setTimeout(() => {
        navigateTo('pagina1.html');
    }, 1500);
}

// Gerar token simples (em produção usar JWT)
function generateToken() {
    return 'zeroid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Mostrar erro
function showError(message) {
    // Criar ou atualizar elemento de erro
    let errorElement = document.querySelector('.auth-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'auth-error';
        document.getElementById('auth-form').prepend(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#ff4444';
    errorElement.style.marginBottom = '20px';
    errorElement.style.padding = '10px';
    errorElement.style.border = '1px solid #ff4444';
    errorElement.style.borderRadius = '4px';
    errorElement.style.animation = 'fadeIn 0.3s ease';
}

// Mostrar sucesso
function showSuccess(message) {
    // Criar elemento de sucesso
    const successElement = document.createElement('div');
    successElement.className = 'auth-success';
    successElement.textContent = message;
    successElement.style.color = '#00C851';
    successElement.style.marginBottom = '20px';
    successElement.style.padding = '10px';
    successElement.style.border = '1px solid #00C851';
    successElement.style.borderRadius = '4px';
    successElement.style.animation = 'fadeIn 0.3s ease';
    
    document.getElementById('auth-form').prepend(successElement);
    
    // Remover após 3 segundos
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

// Exportar funções
window.validateSignup = validateSignup;
window.validateLogin = validateLogin;
window.calculatePasswordStrength = calculatePasswordStrength;
window.isValidEmail = isValidEmail;
