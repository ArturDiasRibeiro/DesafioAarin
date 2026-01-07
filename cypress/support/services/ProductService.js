import messages from '../../fixtures/messages.json';

class ProductService {

    create(token, product) {
        return cy.createProduct(token, product, false).then((res) => {
            if (res.status === 201) {
                expect(res.body.message).to.contain(messages.success.register);
            }
            // Wraps the response to ensure the Cypress chain continues correctly
            return cy.wrap(res);
        });
    }
}

export default new ProductService();