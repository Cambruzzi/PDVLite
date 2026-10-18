describe('Fluxo de Autenticação Completo', () => {
  it('Deve fazer login com sucesso e aceder ao sistema', () => {
    // 1. O robô acede à página de login
    cy.visit('http://localhost:5173/login');

    // 2. Procura o campo de utilizador e digita (Substitua pelos dados do seu superusuário)
    cy.get('input[placeholder="Seu nome de usuário"]').type('admin_test');

    // 3. Procura o campo de senha e digita
    cy.get('input[placeholder="••••••••"]').type('123456');

    // 4. Clica no botão de entrar
    cy.contains('button', 'Entrar no Sistema').click();

    // 5. Verifica (Assert) se a URL mudou para a página inicial
    cy.url().should('eq', 'http://localhost:5173/');

    // 6. Verifica se a Navbar carregou corretamente com a opção "Novo Pedido"
    cy.contains('Novo Pedido').should('be.visible');
  });

it('Deve mostrar mensagem de erro com credenciais inválidas', () => {
    cy.visit('http://localhost:5173/login');
    
    // 1. Dizemos ao Cypress para "escutar" qualquer pedido POST feito para a rota de login
    cy.intercept('POST', '**/login/').as('tentativaLogin');
    
    cy.get('input[placeholder="Seu nome de usuário"]').type('usuario_errado');
    cy.get('input[placeholder="••••••••"]').type('senha_errada');
    
    // Clica no botão
    cy.contains('button', 'Entrar no Sistema').click();

    // 2. O robô faz uma pausa inteligente! Ele espera até que a API devolva a resposta de erro
    cy.wait('@tentativaLogin');

    // 3. Verifica a mensagem completa e exata que definimos no componente
    cy.contains('Usuário ou senha incorretos. Tente novamente.').should('be.visible');
  });
});