// GESTÃO DE USUÁRIOS
Cypress.Commands.add('cadastrarUsuario', (nome, email, password, administrador = 'true', failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/usuarios',
        body: {
            nome: nome,
            email: email,
            password: password,
            administrador: administrador
        },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('login', (email, password, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            email: email,
            password: password
        },
        failOnStatusCode: failOnStatusCode
    });
});

// GESTÃO DE PRODUTOS
Cypress.Commands.add('cadastrarProduto', (token, produto, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/produtos',
        headers: { Authorization: token },
        body: produto,
        failOnStatusCode: failOnStatusCode
    });
});

// GESTÃO DE CARRINHO
Cypress.Commands.add('adicionarAoCarrinho', (token, idProduto, quantidade, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/carrinhos',
        headers: { Authorization: token },
        body: {
            produtos: [
                {
                    idProduto: idProduto,
                    quantidade: quantidade
                }
            ]
        },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('buscarCarrinhos', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'GET',
        url: '/carrinhos',
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('cancelarCompra', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'DELETE',
        url: '/carrinhos/concluir-compra', // ou cancelar-compra, dependendo da regra, mas geralmente usa-se o delete
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});

// Comando auxiliar para limpar carrinho específico (DELETE /carrinhos/cancelar-compra limpa o carrinho do usuário logado)
Cypress.Commands.add('limparCarrinhoUsuario', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'DELETE',
        url: '/carrinhos/cancelar-compra', 
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});