    document.addEventListener('DOMContentLoaded', () => {
        
        // URL LOCAL
        const BACKEND_URL = "https://leitura-compartilhada.onrender.com"; 

        const registerForm = document.getElementById('registerForm');
        const loginForm = document.getElementById('loginForm');
        const messageDiv = document.getElementById('message');

        /**
         * Função para enviar formulário de autenticação (Login ou Registro).
         */
        async function submitAuthForm(endpoint, data, successRedirect) {
            try {
                messageDiv.innerHTML = '<span class="text-info">Processando...</span>';
                
                const url = BACKEND_URL + endpoint; 

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json(); 

                if (response.ok) {
                    // SUCESSO
                    if (endpoint.includes('login')) {
                        // Armazena informações de sessão simuladas
                        localStorage.setItem('user_token', 'simulated_token_' + result.user.id);
                        localStorage.setItem('user_email', result.user.email); 
                    }
                    
                    messageDiv.innerHTML = `<span class="text-success">${result.message}</span>`;
                    
                    setTimeout(() => {
                        window.location.href = successRedirect; 
                    }, 1000);
                    
                } else {
                    // ERRO HTTP (401, 409, 500 etc.)
                    messageDiv.innerHTML = `<span class="text-danger">${result.error || 'Erro desconhecido do servidor.'}</span>`;
                }
            } catch (error) {
                console.error('Falha na comunicação ou no parsing da resposta:', error);
                messageDiv.innerHTML = '<span class="text-danger">Erro crítico: O servidor pode estar offline ou a resposta é inválida.</span>';
            }
        }

        // --- Listener para o formulário de Registro ---
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                submitAuthForm('/api/auth/register', { username, email, password }, 'login.html');
            });
        }

        // --- Listener para o formulário de Login ---
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                submitAuthForm('/api/auth/login', { email, password }, 'index.html'); 
            });
        }
    });