// vibezz.js - Funcionalidades da rede social Vibezz

class VibezzManager {
    constructor() {
        this.isLoginMode = false;
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initFormValidation();
    }
    
    setupEventListeners() {
        // Botões principais
        document.getElementById('btn-criar-vibezz')?.addEventListener('click', () => {
            this.openForm('signup');
        });
        
        document.getElementById('btn-login-vibezz')?.addEventListener('click', () => {
            this.openForm('login');
        });
        
        document.getElementById('close-form')?.addEventListener('click', () => {
            this.closeForm();
        });
        
        // Formulário
        document.getElementById('vibezz-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
        
        // Validação de senha
        document.getElementById('vibezz-password')?.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });
        
        // Termos
        document.querySelector('.terms-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showTermsModal();
        });
    }
    
    initFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    openForm(mode) {
        this.isLoginMode = mode === 'login';
        const formContainer = document.getElementById('vibezz-form-container');
        const formTitle = document.getElementById('form-title');
        const submitBtn = document.getElementById('submit-vibezz');
        const fullNameField = document.getElementById('full-name').closest('.form-group');
        const termsField = document.querySelector('.form-check');
        
        if (this.isLoginMode) {
            formTitle.textContent = 'Login Vibezz';
            submitBtn.textContent = 'ENTRAR';
            fullNameField.style.display = 'none';
            termsField.style.display = 'none';
        } else {
            formTitle.textContent = 'Criar Conta Vibezz';
            submitBtn.textContent = 'CRIAR CONTA';
            fullNameField.style.display = 'block';
            termsField.style.display = 'flex';
        }
        
        formContainer.classList.add('expanded');
        
        // Resetar formulário
        document.getElementById('vibezz-form').reset();
        this.updatePasswordStrength('');
    }
    
    closeForm() {
        const formContainer = document.getElementById('vibezz-form-container');
        formContainer.classList.remove('expanded');
    }
    
    validateField(input) {
        const value = input.value.trim();
        const fieldId = input.id;
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldId) {
            case 'full-name':
                if (!value) {
                    errorMessage = 'Nome completo é obrigatório';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                    isValid = false;
                }
                break;
                
            case 'vibezz-username':
                if (!value) {
                    errorMessage = 'Nome de usuário é obrigatório';
                    isValid = false;
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    errorMessage = 'Use apenas letras, números e underscore';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Nome de usuário deve ter pelo menos 3 caracteres';
                    isValid = false;
                }
                break;
                
            case 'vibezz-email':
                if (!value) {
                    errorMessage = 'E-mail é obrigatório';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'E-mail inválido';
                    isValid = false;
                }
                break;
                
            case 'vibezz-password':
                if (!value) {
                    errorMessage = 'Senha é obrigatória';
                    isValid = false;
                } else if (value.length < 8) {
                    errorMessage = 'Senha deve ter pelo menos 8 caracteres';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(input, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        
        input.parentNode.appendChild(errorElement);
        input.style.borderColor = '#ff4444';
    }
    
    clearFieldError(input) {
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = '';
    }
    
    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (!password) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Força da senha:';
            strengthFill.style.backgroundColor = '';
            return;
        }
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const percentage = (score / 5) * 100;
        
        let color, text;
        if (score <= 2) {
            color = '#ff4444';
            text = 'Fraca';
        } else if (score <= 3) {
            color = '#ffbb33';
            text = 'Média';
        } else {
            color = '#00C851';
            text = 'Forte';
        }
        
        strengthFill.style.width = `${percentage}%`;
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = `Força da senha: ${text}`;
        strengthText.style.color = color;
    }
    
    validateForm() {
        const inputs = document.querySelectorAll('.form-input:not([style*="display: none"])');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!this.isLoginMode) {
            const termsCheckbox = document.getElementById('vibezz-terms');
            if (!termsCheckbox.checked) {
                alert('Você precisa aceitar os termos do Vibezz.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    async submitForm() {
        if (!this.validateForm()) {
            return;
        }
        
        const email = document.getElementById('vibezz-email').value.trim();
        const password = document.getElementById('vibezz-password').value.trim();
        
        if (this.isLoginMode) {
            await this.login(email, password);
        } else {
            const fullName = document.getElementById('full-name').value.trim();
            const username = document.getElementById('vibezz-username').value.trim();
            await this.signup(fullName, username, email, password);
        }
    }
    
    async login(email, password) {
        try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('zeroid_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                throw new Error('E-mail ou senha incorretos');
            }
            
            // Criar sessão Vibezz
            sessionStorage.setItem('vibezz_token', 'vibezz_' + Date.now());
            sessionStorage.setItem('vibezz_user', JSON.stringify(user));
            
            this.showSuccess('Login realizado com sucesso!');
            this.closeForm();
            
            setTimeout(() => {
                navigateTo('pagvibe2.html');
            }, 1500);
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    async signup(fullName, username, email, password) {
        try {
            // Verificar se usuário já existe
            const users = JSON.parse(localStorage.getItem('zeroid_users') || '[]');
            const existingUser = users.find(u => u.email === email || u.username === username);
            
            if (existingUser) {
                throw new Error('E-mail ou nome de usuário já registrado');
            }
            
            // Criar novo usuário
            const newUser = {
                id: Date.now(),
                fullName,
                username: '@' + username,
                email,
                password, // Em produção, usar bcrypt
                profilePic: '',
                bio: '',
                followers: 0,
                following: 0,
                posts: 0,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('zeroid_users', JSON.stringify(users));
            
            // Criar sessão Vibezz
            sessionStorage.setItem('vibezz_token', 'vibezz_' + Date.now());
            sessionStorage.setItem('vibezz_user', JSON.stringify(newUser));
            
            this.showSuccess('Conta criada com sucesso!');
            this.closeForm();
            
            setTimeout(() => {
                navigateTo('pagvibe2.html');
            }, 1500);
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    showSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    showMessage(message, type) {
        // Criar elemento de mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `vibezz-message vibezz-message-${type}`;
        messageElement.textContent = message;
        
        // Estilos
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.right = '20px';
        messageElement.style.padding = '15px 25px';
        messageElement.style.borderRadius = '8px';
        messageElement.style.color = 'white';
        messageElement.style.fontWeight = '500';
        messageElement.style.zIndex = '1000';
        messageElement.style.animation = 'slideInRight 0.3s ease';
        
        if (type === 'error') {
            messageElement.style.background = 'rgba(255, 68, 68, 0.9)';
            messageElement.style.border = '1px solid #ff4444';
        } else {
            messageElement.style.background = 'rgba(0, 200, 81, 0.9)';
            messageElement.style.border = '1px solid #00C851';
        }
        
        document.body.appendChild(messageElement);
        
        // Remover após 3 segundos
        setTimeout(() => {
            messageElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }
    
    showTermsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Termos do Vibezz</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Bem-vindo ao Vibezz, a Rede Social Neural. Ao usar nossos serviços, você concorda com:</p>
                    <ul>
                        <li>Respeitar a privacidade de outros usuários</li>
                        <li>Não compartilhar conteúdo ofensivo ou ilegal</li>
                        <li>Manter a segurança de sua conta</li>
                        <li>Contribuir para uma comunidade positiva</li>
                    </ul>
                    <p>Seus dados são protegidos com criptografia end-to-end e nunca são vendidos a terceiros.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="accept-terms">Aceitar Termos</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mostrar modal
        modal.style.display = 'flex';
        
        // Fechar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.querySelector('#accept-terms').addEventListener('click', () => {
            document.getElementById('vibezz-terms').checked = true;
            modal.style.display = 'none';
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Inicializar Vibezz quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.vibezzManager = new VibezzManager();
});
