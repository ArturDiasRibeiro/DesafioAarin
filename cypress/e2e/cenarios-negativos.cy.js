import { faker } from '@faker-js/faker';

describe('Cenários Negativos - ServeRest', () => {

    let msg; 

    beforeEach(() => {
        cy.fixture('mensagens').then((dados) => {
            msg = dados;
        });
    });

    it('Não deve permitir cadastro de usuário com email duplicado', () => {
        const user = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: '123'
        };

        cy.cadastrarUsuario(user.nome, user.email, user.password).then(res => {
            expect(res.status).to.eq(201);
            expect(res.body.message).to.eq(msg.sucesso.cadastro);
        });

        cy.cadastrarUsuario(user.nome, user.email, user.password, 'true', false).then(res => {
            expect(res.status).to.eq(400);
            expect(res.body.message).to.eq(msg.erros.emailDuplicado);
        });
    });

    it('Não deve permitir login com credenciais inválidas', () => {
        cy.login(faker.internet.email(), 'senhaerrada', false).then(res => {
            expect(res.status).to.eq(401);
            expect(res.body.message).to.contain(msg.erros.loginInvalido);
        });
    });
    
});