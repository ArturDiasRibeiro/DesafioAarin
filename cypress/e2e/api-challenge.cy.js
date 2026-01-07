import { faker } from '@faker-js/faker';

describe('Fluxo de API - ServeRest', () => {

    let msg;

    beforeEach(() => {
        cy.fixture('mensagens').then((tabelaDeMensagens) => {
            msg = tabelaDeMensagens;
        });
    });

    const usuario = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: 'true'
    };

    const produto = {
        nome: `Produto QA ${faker.commerce.productName()} ${faker.string.uuid()}`,
        preco: 100,
        descricao: 'Produto de Teste',
        quantidade: 100
    };

    let userToken;
    let userId;
    let produtoId;

    it('Deve realizar o ciclo completo de compra no E-commerce', () => {
        
        cy.cadastrarUsuario(usuario.nome, usuario.email, usuario.password)
            .then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body.message).to.eq(msg.sucesso.cadastro);
                userId = res.body._id;
            });

        cy.login(usuario.email, usuario.password)
            .then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.message).to.eq(msg.sucesso.login);
                userToken = res.body.authorization;
                expect(userToken).to.exist;
            });
            
        cy.then(() => {
            cy.cadastrarProduto(userToken, produto).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body.message).to.eq(msg.sucesso.cadastro);
                produtoId = res.body._id;
            });
        });

        cy.then(() => {
            cy.adicionarAoCarrinho(userToken, produtoId, 2).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body.message).to.eq(msg.sucesso.cadastro);
            });
        });

        cy.then(() => {
            cy.buscarCarrinhos(userToken).then((res) => {
                expect(res.status).to.eq(200);
                
                const carrinhoUsuario = res.body.carrinhos.find(c => c.idUsuario === userId);
                expect(carrinhoUsuario).to.exist;
                
                const produtoNoCarrinho = carrinhoUsuario.produtos.find(p => p.idProduto === produtoId);
                expect(produtoNoCarrinho.quantidade).to.eq(2);
            });
        });

        cy.then(() => {
            cy.limparCarrinhoUsuario(userToken).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.message).to.contain(msg.sucesso.exclusao);
            });
        });

        cy.then(() => {
            cy.buscarCarrinhos(userToken).then((res) => {
                expect(res.status).to.eq(200);
                const carrinhoUsuario = res.body.carrinhos.find(c => c.idUsuario === userId);
                expect(carrinhoUsuario).to.be.undefined;
            });
        });
    });
});