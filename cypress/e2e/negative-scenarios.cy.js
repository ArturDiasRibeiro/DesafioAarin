import { faker } from '@faker-js/faker';
import UserService from '../support/services/UserService';
import ProductService from '../support/services/ProductService';
import messages from '../fixtures/messages.json';

describe('Negative Scenarios - ServeRest', () => {

    context('User Registration Validation', () => {
        
        it('Should not allow registration with a duplicate email', () => {
            const user = {                
                nome: faker.person.fullName(), 
                
                email: `teste.${Date.now()}@qa.com.br`, 
                password: '123',
                administrador: 'true'
            };

            UserService.register(user).then(res => {
                expect(res.status).to.eq(201);
            });

            UserService.register(user).then(res => {
                expect(res.status).to.eq(400);
                expect(res.body.message).to.eq(messages.errors.emailDuplicate);
            });
        });
    });

    context('Security & Authentication', () => {

        it('Should deny login with incorrect password', () => {
            const email = faker.internet.email();
            const wrongPassword = 'wrongPassword123';

            UserService.login(email, wrongPassword).then(res => {
                expect(res.status).to.eq(401);
                expect(res.body.message).to.contain(messages.errors.invalidLogin);
            });
        });

        it('Should deny product creation without a valid token', () => {
            const product = {
                nome: 'Hacker Product',
                preco: 10,
                descricao: 'Security Test',
                quantidade: 10
            };

            const invalidToken = 'Bearer invalid_token_123456';

            ProductService.create(invalidToken, product).then(res => {
                expect(res.status).to.eq(401);
                expect(res.body.message).to.contain(messages.errors.invalidToken);
            });
        });
    });
});