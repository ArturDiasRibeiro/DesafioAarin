// --- USER MANAGEMENT ---

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} isAdmin - 'true' or 'false' (API requires string)
 */
Cypress.Commands.add('registerUser', (name, email, password, isAdmin = 'true', failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/usuarios',
        body: {
            nome: name,            // API expects 'nome'
            email: email,
            password: password,
            administrador: isAdmin // API expects 'administrador'
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

// --- PRODUCT MANAGEMENT ---

/**
 * Create a product
 * @param {string} token - Auth token
 * @param {object} product - Object containing { nome, preco, descricao, quantidade }
 */
Cypress.Commands.add('createProduct', (token, product, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/produtos',
        headers: { Authorization: token },
        body: product, 
        failOnStatusCode: failOnStatusCode
    });
});

// --- CART MANAGEMENT ---

Cypress.Commands.add('addToCart', (token, productId, quantity, failOnStatusCode = true) => {
    cy.request({
        method: 'POST',
        url: '/carrinhos',
        headers: { Authorization: token },
        body: {
            produtos: [
                {
                    idProduto: productId, // API expects 'idProduto'
                    quantidade: quantity  // API expects 'quantidade'
                }
            ]
        },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('getCarts', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'GET',
        url: '/carrinhos',
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('completePurchase', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'DELETE',
        url: '/carrinhos/concluir-compra',
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});

Cypress.Commands.add('clearUserCart', (token, failOnStatusCode = true) => {
    cy.request({
        method: 'DELETE',
        url: '/carrinhos/cancelar-compra', 
        headers: { Authorization: token },
        failOnStatusCode: failOnStatusCode
    });
});