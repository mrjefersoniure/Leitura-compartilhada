document.addEventListener('DOMContentLoaded', () => {
    
    // URL LOCAL
    const BACKEND_URL = "http://localhost:3000"; 

    // =================================================================
    // 🔑 1. VERIFICAÇÃO DE AUTENTICAÇÃO (PROTEÇÃO DE TELA)
    // =================================================================
    const userToken = localStorage.getItem('user_token');
    
    if (!userToken) {
        window.location.href = 'login.html';
        return; 
    }
    // =================================================================

    // 2. Inicialização de Elementos e Modals
    const formCadastroLivro = document.getElementById('formCadastroLivro');
    const listaLivrosDiv = document.getElementById('listaLivros');
    const inputBusca = document.getElementById('inputBusca');
    const btnBusca = document.getElementById('btnBusca');
    
    const modalCadastro = new bootstrap.Modal(document.getElementById('modalCadastro'));
    const modalDetalhes = new bootstrap.Modal(document.getElementById('modalDetalhes'));
    const modalEdicao = new bootstrap.Modal(document.getElementById('modalEdicao'));
    
    const detalhesContent = document.getElementById('detalhesContent');
    const formEdicaoLivro = document.getElementById('formEdicaoLivro');
    const loggedUserEmail = localStorage.getItem('user_email'); // Email do usuário logado


    // --- 3. Função para Fazer Requisições com Autorização ---
    async function makeAuthRequest(endpoint, options = {}) {
        const defaultHeaders = options.headers || {};
        
        options.headers = {
            ...defaultHeaders,
            'Authorization': `Bearer ${userToken}`,
            'X-User-Email': loggedUserEmail // Para a regra de quem pode deletar/editar
        };
        
        const url = BACKEND_URL + endpoint;
        const response = await fetch(url, options);

        // Tratamento de sessão expirada ou inválida (401/403)
        if (response.status === 401 || response.status === 403) {
             localStorage.removeItem('user_token');
             localStorage.removeItem('user_email');
             alert('Sessão expirada. Faça login novamente.');
             window.location.href = 'login.html';
             throw new Error("Sessão Inválida");
        }

        return response;
    }


    // --- 4. Listagem e Busca (GET) ---
    async function carregarLivros(termoBusca = '') {
        try {
            const endpoint = termoBusca ? `/api/livros?q=${encodeURIComponent(termoBusca)}` : '/api/livros';
            
            const response = await makeAuthRequest(endpoint);
            const livros = await response.json();
            
            listaLivrosDiv.innerHTML = ''; 

            if (livros.length === 0) {
                listaLivrosDiv.innerHTML = '<p class="col-12 text-center text-muted">Nenhum livro encontrado. Tente cadastrar um!</p>';
                return;
            }

            // Cria Cards para exibição
            livros.forEach(livro => {
                const cardHtml = `
                    <div class="col">
                        <div class="card h-100 shadow-sm livro-card" data-id="${livro.id}">
                            <img src="${livro.path_imagem}" class="card-img-top" alt="Capa do Livro" style="height: 250px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title text-primary">${livro.titulo}</h5>
                                <p class="card-text text-muted">Autor: ${livro.autor || 'Desconhecido'}</p>
                            </div>
                            <div class="card-footer bg-white border-top-0">
                                <span class="badge bg-secondary">${livro.genero || 'Não informado'}</span>
                            </div>
                        </div>
                    </div>
                `;
                listaLivrosDiv.innerHTML += cardHtml;
            });
            
            adicionarListenerDetalhes();

        } catch (error) {
            console.error('Erro ao carregar livros:', error);
            if (error.message !== "Sessão Inválida") {
                listaLivrosDiv.innerHTML = '<p class="col-12 text-center text-danger">Falha ao carregar a lista de livros (Erro de rede ou servidor).</p>';
            }
        }
    }
    
    // Listeners de Busca
    const executarBusca = () => carregarLivros(inputBusca.value.trim());
    btnBusca.addEventListener('click', executarBusca);
    inputBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { executarBusca(); e.preventDefault(); }
    });


    // --- 5. Cadastro (POST) ---
    formCadastroLivro.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const formData = new FormData(formCadastroLivro);

        try {
            const response = await makeAuthRequest('/api/livros', {
                method: 'POST',
                body: formData 
            });

            const result = await response.json();

            if (response.ok) {
                modalCadastro.hide(); 
                formCadastroLivro.reset(); 
                carregarLivros(); 
            } else {
                alert('Erro ao cadastrar o livro: ' + (result.error || 'Erro desconhecido.'));
            }
        } catch (error) {
            console.error('Erro de rede ou na requisição POST:', error);
            if (error.message !== "Sessão Inválida") alert('Falha na comunicação com o servidor.');
        }
    });


    // --- 6. Detalhes (GET /:id) e Ações ---
    async function exibirDetalhes(id) {
        try {
            const response = await makeAuthRequest(`/api/livros/${id}`);
            
            if (response.ok) {
                const livro = await response.json();
                
                const acoesHtml = (livro.email_criador === loggedUserEmail) 
                    ? `
                        <button class="btn btn-warning btn-sm" data-id="${livro.id}" id="btnAbrirEdicao">
                            <i class="bi bi-pencil-square"></i> Editar Livro
                        </button>
                        <button class="btn btn-danger btn-sm" data-id="${livro.id}" id="btnExcluirLivro">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    `
                    : `<span class="text-muted small">Apenas o criador pode editar/excluir.</span>`;

                detalhesContent.innerHTML = `
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${livro.path_imagem}" class="img-fluid rounded shadow-sm" alt="Capa do Livro">
                        </div>
                        <div class="col-md-8">
                            <h3 class="text-primary">${livro.titulo}</h3>
                            <p class="text-muted mb-1">Autor: <strong>${livro.autor || 'Não Informado'}</strong></p>
                            <p class="text-muted mb-3">Gênero: <strong>${livro.genero || 'Não Informado'}</strong></p>
                            
                            <h5>Descrição:</h5>
                            <p>${livro.descricao || 'Nenhuma descrição fornecida.'}</p>
                            
                            <hr>
                            <h6>Contato e Ações:</h6>
                            <a href="mailto:${livro.email_contato}" class="btn btn-success btn-sm">
                                <i class="bi bi-envelope-fill"></i> Contatar ${livro.email_contato}
                            </a>
                            
                            <div class="mt-3">
                                ${acoesHtml} 
                            </div>
                        </div>
                    </div>
                `;
                modalDetalhes.show();
                
                if (livro.email_criador === loggedUserEmail) {
                    document.getElementById('btnAbrirEdicao').addEventListener('click', () => preencherFormEdicao(livro));
                    document.getElementById('btnExcluirLivro').addEventListener('click', () => excluirLivro(livro.id, livro.titulo));
                }

            } else {
                const erroData = await response.json();
                alert('Erro ao carregar detalhes: ' + (erroData.error || `Status: ${response.status}`));
            }
        } catch (error) {
            console.error('Erro de rede ao buscar detalhes:', error);
            if (error.message !== "Sessão Inválida") alert('Falha na comunicação com o servidor ao buscar detalhes.');
        }
    }

    function adicionarListenerDetalhes() {
        document.querySelectorAll('.livro-card').forEach(card => {
            card.style.cursor = 'pointer'; 
            card.addEventListener('click', function() {
                exibirDetalhes(this.dataset.id);
            });
        });
    }


    // --- 7. Edição (PUT) ---
    function preencherFormEdicao(livro) {
        modalDetalhes.hide();
        document.getElementById('edit-id').value = livro.id;
        document.getElementById('edit-titulo').value = livro.titulo;
        document.getElementById('edit-autor').value = livro.autor || '';
        document.getElementById('edit-genero').value = livro.genero || '';
        document.getElementById('edit-descricao').value = livro.descricao || '';
        document.getElementById('edit-email_contato').value = livro.email_contato;
        modalEdicao.show();
    }
    
    formEdicaoLivro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const formData = new FormData(formEdicaoLivro);
        formData.delete('id'); 

        try {
            const response = await makeAuthRequest(`/api/livros/${id}`, {
                method: 'PUT',
                body: formData 
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Livro ID ${id} atualizado com sucesso!`);
                modalEdicao.hide();
                carregarLivros(); 
            } else {
                alert('Erro ao atualizar o livro: ' + (result.error || 'Erro desconhecido.'));
            }
        } catch (error) {
            console.error('Erro na requisição PUT:', error);
            if (error.message !== "Sessão Inválida") alert('Falha na comunicação com o servidor ao editar.');
        }
    });

    // --- 8. Exclusão (DELETE) ---
    async function excluirLivro(id, titulo) {
        if (!confirm(`Tem certeza que deseja EXCLUIR o livro "${titulo}"? Esta ação é irreversível.`)) return;

        try {
            const response = await makeAuthRequest(`/api/livros/${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();

            if (response.ok) {
                alert(`Livro excluído com sucesso!`);
                modalDetalhes.hide(); 
                carregarLivros(); 
            } else {
                alert('Erro ao excluir o livro: ' + (result.error || 'Erro desconhecido.'));
            }
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            if (error.message !== "Sessão Inválida") alert('Falha na comunicação com o servidor ao excluir.');
        }
    }


    // --- 9. Inicialização e Logout ---
    carregarLivros();
    
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_email');
        window.location.href = 'login.html';
    });
});