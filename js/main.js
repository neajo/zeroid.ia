// main.js - Funcionalidades globais e inicialização

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    initParticles();
    
    // Efeito de digitação na página inicial
    initTypingEffect();
    
    // Configurar botões de autenticação
    initAuthButtons();
    
    // Inicializar efeitos de interface
    initUIEffects();
});

// Inicializar partículas de fundo
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Efeito de digitação
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const texts = [
        "Consciência Neural Simulada",
        "Inteligência Artificial Avançada",
        "Rede Neural Integrada"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Deletando texto
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, 50);
            }
        } else {
            // Digitando texto
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    setTimeout(type, 1000);
                }, 2000);
            } else {
                setTimeout(type, 100);
            }
        }
    }
    
    // Iniciar após 1 segundo
    setTimeout(type, 1000);
}

// Configurar botões de autenticação
function initAuthButtons() {
    const btnCriarConta = document.getElementById('btn-criar-conta');
    const btnLogin = document.getElementById('btn-login');
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.modal-close');
    const authForm = document.getElementById('auth-form');
    
    if (btnCriarConta) {
        btnCriarConta.addEventListener('click', () => {
            openAuthModal('signup');
        });
    }
    
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            openAuthModal('login');
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeAuthModal();
        });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAuthModal();
            }
        });
    }
    
    // Prevenir envio do formulário (será tratado em auth.js)
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}

function openAuthModal(mode) {
    const modal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const formExtra = document.getElementById('form-extra');
    const submitBtn = document.getElementById('submit-btn');
    
    if (mode === 'signup') {
        modalTitle.textContent = 'Criar Conta';
        formExtra.style.display = 'block';
        submitBtn.textContent = 'Criar Conta';
    } else {
        modalTitle.textContent = 'Fazer Login';
        formExtra.style.display = 'none';
        submitBtn.textContent = 'Entrar';
    }
    
    modal.style.display = 'flex';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'none';
}

// Efeitos de interface
function initUIEffects() {
    // Efeito ripple nos botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Efeito glitch no logo
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        setInterval(() => {
            if (Math.random() > 0.7) {
                element.classList.add('glitching');
                setTimeout(() => {
                    element.classList.remove('glitching');
                }, 300);
            }
        }, 3000);
    });
}

// Navegação entre páginas
function navigateTo(page) {
    window.location.href = page;
}

// Verificar autenticação
function checkAuth() {
    return localStorage.getItem('zeroid_token') !== null;
}

// Obter usuário atual
function getCurrentUser() {
    const user = localStorage.getItem('zeroid_user');
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem('zeroid_token');
    localStorage.removeItem('zeroid_user');
    navigateTo('index.html');
}

// Exportar funções globais
window.navigateTo = navigateTo;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
