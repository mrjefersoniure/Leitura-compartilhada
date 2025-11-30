# 📖 Banco de Livros Digitais (Plataforma de Leitura Compartilhada)

Este é um projeto **fullstack** desenvolvido em **Node.js/Express** e frontend em **JavaScript/Bootstrap**, seguindo a arquitetura **MVC (Model-View-Controller)**.

A aplicação permite **cadastro, busca, troca e doação de livros**, com controle de acesso via **sistema de autenticação (Login e Cadastro)**.

---

## 🚀 Tecnologias Utilizadas

### **Backend (Server)**
| Categoria | Tecnologia | Função |
|----------|------------|--------|
| Ambiente | Node.js, Express | Execução e framework para API REST |
| Banco de Dados | SQLite | Banco leve baseado em arquivo |
| Autenticação | bcryptjs | Hashing e comparação de senhas |
| Upload | multer | Middleware para upload de imagens de capa |

### **Frontend (Client)**
| Tecnologia | Função |
|------------|--------|
| HTML5, Bootstrap 5, JavaScript (Vanilla) | Interface do usuário e comunicação com API |

---

## 🏗️ Arquitetura do Projeto (MVC)

O projeto segue a organização em **MVC**, garantindo separação de responsabilidades:

- **server.js**: Ponto de entrada que inicializa o Express e conecta os roteadores.
- **config/**: Configuração de conexão com o banco de dados (`db.js`).
- **models/**: Camada de acesso e manipulação de dados (ex: `Book.js`, `User.js`).
- **controllers/**: Recebe requisições, chama o Model e devolve respostas (ex: `authController.js`).
- **routes/**: Define os endpoints da API e direciona as requisições.
- **public/**: Contém toda a interface do usuário (views e scripts).

---

## 📋 Como Rodar Localmente

Siga estes passos para configurar e executar o projeto.

### **Pré-requisitos**
- Node.js (16.x ou superior)
- npm

---

### **1. Clonar o Repositório**

```bash
git clone https://github.com/mrjefersoniure/Leitura-compartilhada.git
cd Plaaforma-leitura-compartilhada
