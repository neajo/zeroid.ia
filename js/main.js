// main.js - Funcionalidades globais e animações

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
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
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    }

    // Efeito de digitação no texto da página inicial
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const text = "Consciência Neural Simulada";
        let index = 0;
        function type() {
            if (index < text.length) {
                typingText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            } else {
                typingText.style.borderRight = 'none';
            }
        }
        // Iniciar após 1 segundo
        setTimeout(type, 1000);
    }

    // Modal de autenticação
    const btnCriarConta = document.getElementById('btn-criar-conta');
    const btnLogin = document.getElementById('btn-login');
    const modal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const authForm = document.getElementById('auth-form');
    const modalTitle = document.getElementById('modal-title');
    const formExtra = document.getElementById('form-extra');
    const submitBtn = document.getElementById('submit-btn');

    let isLoginMode = false;

    if (btnCriarConta && btnLogin) {
        btnCriarConta.addEventListener('click', () => openModal('criar'));
        btnLogin.addEventListener('click', () => openModal('login'));
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    function openModal(mode) {
        isLoginMode = mode === 'login';
        modalTitle.textContent = isLoginMode ? 'Fazer Login' : 'Criar Conta';
        formExtra.style.display = isLoginMode ? 'none' : 'block';
        submitBtn.textContent = isLoginMode ? 'Entrar' : 'Criar Conta';
        authForm.reset();
        modal.style.display = 'flex';
    }

    function closeModalFunc() {
        modal.style.display = 'none';
    }

    // Validação de senha em tempo real
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');

    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.style.backgroundColor = strength.color;
        });
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const percentage = score * 20;
        let color = '#ff0000'; // vermelho
        if (score >= 4) color = '#00ff00'; // verde
        else if (score >= 3) color = '#ffff00'; // amarelo

        return { percentage, color };
    }

    // Efeito ripple em botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
