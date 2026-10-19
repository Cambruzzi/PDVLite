# PDVLite (FullStack)

O objetivo deste projeto é fornecer um sistema simplificado para emissão e gestão de pedidos, atendendo a todas as regras de negócio de rentabilidade e múltiplos de venda estipuladas no desafio, utilizando o universo de Star Wars como base de dados de clientes e produtos.

---

## 🛠 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias modernas:

**Frontend (`/front-PDVlite`):**
*   **React 19** com **Vite**: Para uma interface rápida, responsiva e otimizada.
*   **Tailwind CSS 4**: Para a estilização e criação de um design system limpo e direto no HTML.
*   **React Router Dom**: Para o roteamento das páginas (Listagem, Cadastro e Edição de Pedidos).
*   **Axios**: Para consumo da API REST.

**Backend (`/pedidos` & `/setup`):**
*   **Python / Django**: Framework robusto utilizado para a construção do servidor.
*   **Django Rest Framework (DRF)**: Para a criação da API REST.
*   **djangorestframework-simplejwt**: Para autenticação segura utilizando tokens JWT.
*   **django-cors-headers**: Para gerenciar as permissões de Cross-Origin Resource Sharing (CORS) entre o frontend e a API.
*   **SQLite**: Banco de dados padrão, facilitando a execução e avaliação do teste sem necessidade de containers complexos.

**Testes e Qualidade:**
*   **Cypress**: Para testes End-to-End (E2E), garantindo que os fluxos críticos de negócio funcionem conforme esperado.
*   **Vitest**: Para testes unitários no frontend, garantindo a integridade dos cálculos e componentes.
*   **Django Test**: Testes automatizados na API para validar as regras de negócio no servidor.

---

## ⚙️ Regras de Negócio Implementadas


### 1. Rentabilidade
Ao adicionar ou editar um item no pedido, o sistema calcula dinamicamente a rentabilidade com base na diferença entre o preço informado pelo usuário e o preço base do produto:
*   🟢 **Ótima**: Quando o preço de venda é **maior** que o preço base do produto.
*   🟡 **Boa**: Quando o preço de venda é **até 10% menor** que o preço base.
*   🔴 **Ruim**: Quando o preço de venda é **mais de 10% menor** que o preço base. **Neste cenário, o sistema bloqueia a inserção do item no pedido.**

### 2. Múltiplo de Venda
Alguns produtos possuem restrições de quantidade:
*   Produtos como *X-Wing* (múltiplo de 2) ou *Lightsaber* (múltiplo de 5) só podem ser inseridos no pedido se a quantidade informada respeitar esse múltiplo exato. 
*   Produtos sem múltiplo específico podem ser vendidos em qualquer quantidade (inteira e maior que zero).

### 3. Catálogo Fixo (Star Wars)
O sistema conta com uma base de dados pré-cadastrada contendo clientes (Darth Vader, Luke Skywalker, etc.) e produtos (Millenium Falcon, TIE Fighter, etc.) conforme a tabela fornecida no escopo do projeto.

---

## 💻 Como executar o projeto localmente

Siga os passos abaixo para rodar a aplicação na sua máquina.

### Pré-requisitos
*   Python 3.10+
*   Node.js 18+

### 1. Configurando o Backend (Django)

Abra um terminal na raiz do projeto:

```bash
# Crie e ative o ambiente virtual (Linux/Mac)
python -m venv venv
source venv/bin/activate

# (No Windows)
# python -m venv venv
# .\venv\Scripts\activate

# Instale as dependências do Python
pip install -r requirements.txt

# Execute as migrações do banco de dados
python manage.py migrate

# IMPORTANTE: Popule o banco com os Clientes e Produtos de teste (Star Wars)
python manage.py importar_dados

# Inicie o servidor
python manage.py runserver
```
*A API estará rodando em `http://localhost:8000`*

### 2. Configurando o Frontend (React/Vite)

Abra um novo terminal e navegue até a pasta do frontend:

```bash
cd front-PDVlite

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```
*O frontend estará acessível em `http://localhost:5173`.*

---

## 🧪 Como rodar os testes

**Testes do Backend (Django):**
```bash
# Na raiz do projeto, com o venv ativado:
python manage.py test
```

**Testes Unitários do Frontend (Vitest):**
```bash
cd front-PDVlite
npm run test
```

**Testes End-to-End (Cypress):**
Certifique-se de que o backend e o frontend estão rodando em terminais separados antes de abrir o Cypress.
```bash
cd front-PDVlite
npx cypress open
# Ou para rodar em modo headless no terminal:
npx cypress run
```

---
