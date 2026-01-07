import messages from '../../fixtures/messages.json';

class CartService {

    add(token, productId, quantity) {
        return cy.addToCart(token, productId, quantity, false).then(res => {
            // Wraps the response to ensure chainability
            return cy.wrap(res);
        });
    }

    clear(token) {
        return cy.clearUserCart(token, false);
    }

    validateProductInCart(token, userId, productId) {
        // Safety Guard: Ensures productId exists before making the request
        expect(productId, 'Critical Error: productId is undefined').to.exist;

        return cy.request({
            method: 'GET',
            url: '/carrinhos',
            headers: { Authorization: token },
            qs: { idUsuario: userId },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200, 'Failed to retrieve carts');
            expect(res.body.quantidade).to.be.greaterThan(0, 'Cart is empty (Item was not added)');

            const cart = res.body.carrinhos[0];
            const cartProductIds = cart.produtos.map(p => p.idProduto);

            expect(cartProductIds).to.include(productId);
        });
    }

    validateEmptyCart(token, userId) {
        return cy.request({
            method: 'GET',
            url: '/carrinhos',
            headers: { Authorization: token },
            qs: { idUsuario: userId },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.body.quantidade).to.eq(0, 'Cart should be empty');
        });
    }
}

export default new CartService();