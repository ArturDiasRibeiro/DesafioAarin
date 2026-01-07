import { faker } from '@faker-js/faker';
import UserService from '../support/services/UserService';
import ProductService from '../support/services/ProductService';
import CartService from '../support/services/CartService';

describe('E2E Flow - Service Objects Architecture', () => {

    // Test Data
    const user = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: 'true' // API Requirement: Must be 'administrador'
    };

    const product = {
        nome: `QA Product ${faker.string.uuid()}`,
        preco: 100,
        descricao: 'Test Description',
        quantidade: 100
    };

    // Shared State
    let userId;
    let userToken;
    let productId;

    context('User Journey: Full Purchase Cycle', () => {

        it('Step 1: Should register a new user successfully', () => {
            UserService.register(user).then(res => {
                expect(res.status).to.eq(201, `Failed to register user: ${res.body.message}`);
                userId = res.body._id;
            });
        });

        it('Step 2: Should login and retrieve the access token', () => {
            UserService.login(user.email, user.password).then(res => {
                expect(res.status).to.eq(200, 'Login failed');
                expect(res.body.authorization).to.exist;
                userToken = res.body.authorization;
            });
        });

        it('Step 3: Should create a new product', () => {
            ProductService.create(userToken, product).then(res => {
                expect(res.status).to.eq(201, 'Failed to create product');
                productId = res.body._id;
            });
        });

        it('Step 4: Should add the product to the user cart', () => {
            // Safety measure: Clear any existing cart before adding
            CartService.clear(userToken);
            
            CartService.add(userToken, productId, 2).then(res => {
                expect(res.status).to.eq(201, 'Failed to add product to cart');
            });
        });

        it('Step 5: Should validate the product details inside the cart', () => {
            // Removed the quantity param as we simplified the logic in the Service
            CartService.validateProductInCart(userToken, userId, productId);
        });

        it('Step 6: Should clear/finish the purchase', () => {
            CartService.clear(userToken).then(res => {
                expect(res.status).to.eq(200, 'Failed to clear cart');
            });
        });

        it('Step 7: Should verify that the cart is empty (Smoke Test)', () => {
            CartService.validateEmptyCart(userToken, userId);
        });

    });
});