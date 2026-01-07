import messages from '../../fixtures/messages.json';

class UserService {

    register(user) {
        return cy.request({
            method: 'POST',
            url: '/usuarios',
            failOnStatusCode: false,
            body: user
        }).then((res) => {
            if (res.status === 201) {
                expect(res.body.message).to.eq(messages.success.register);
            }
            return res;
        });
    }

    login(email, password) {
        return cy.request({
            method: 'POST',
            url: '/login',
            body: { email, password },
            failOnStatusCode: false
        }).then((res) => {
            if (res.status === 200) {
                expect(res.body.message).to.eq(messages.success.login);
            }
            return res;
        });
    }
}

export default new UserService();