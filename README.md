Contexto
Você está testando um e-commerce e um bug crítico foi reportado: “Às vezes, o cliente paga, mas o pedido não aparece na tela de 'Meus Pedidos'.” Não há acesso ao código-fonte. Apenas ao ambiente de produção, logs básicos e o time de Produto e Back-end estão disponíveis para suporte.

RESPOSTA CURTA: 

1- Realizaria uma busca por meio do ID do usuário (se disponível), encontrando o Log especifico da aplicação e do gateway de pagamento.
2- Por não possuir acesso ao código, rastreio onde os dados poderiam ter se perdido. 

    As possíbilidades são as seguintes:
        *Webhook - Gateway -> Backend*: Banco confirmou o pagamento, mas não recebemos o retorno;
        *Processamento - BackEnd* -> Banco de Dados: Servidor recebeu o pagamento, porém não foi salvo no Banco de dados;
        *Exibição - Banco de Dados* -> FrontEnd: Problemas com cache, ou uma intermitencia/lentidão no sistema;

Se o pagamento não chegou até nós, é problema de integração, porém se chegou com erro, trata-se do backend, e ambos retornaram com sucesso, é mais provável que seja apenas cache para o usuário.


COMO SERIA EM UMA SITUAÇÃO REAL.

ANTES DA ABERTURA DO BUG:

    1- Comunicar o time usando o GoogleChat/Slack/Teams do ocorrido. Questionando se isso é devido a algum tipo de rotina anormal do time (ação não comunicada sendo realizada que impactaria o sistema).
    2- Busco o Log especifico do ocorrido, este informando a data, hora e o usuário que sofreu com o defeito, e se caso não puder identificá-lo, prossigo.
    3- Realizo requisições da aplicação tentando simular o defeito descrito em PROD, descartando a possibilidade de cache (Algumas vezes é interessante validar se o mesmo está sendo apresentado em ambientes (caso existam) HML/DEV, validando assim uma possivel instabilidade em produção).
    4- Verifico se os registros aparecem corretamente no banco de dados. Podendo acarretar em um dos seguintes cenários:
    

Cenário positivo - TODOS os registros estão sendo devidamente salvos no Banco de Dados:

    Após identificado o comportamento, descrevo um BUG, adicionado os dados encontrados pelos registros de logs, então atualizo-o enquanto vou realizando a investigação do mesmo.
    
    Posso averiguar que provavelmente trata-se de um problema de integração do Banco de Dados com o FrontEnd no retorno dos registros dos Pedidos. 
    Assim sigo investigando registros de log (kibana, dataDog), verificando o motivo de algumas requisições estarem passando e outras não. nesta etapa seria interessante estar presente um desenvolvedor.
    A partir do que foi encontrado após a investigação, completo o Bug detalhando especificamente o que foi percebido dada a verificação dos logs.
    Se o time ainda não tiver 100% ciente do problema, apresento a ele na próxima Daily, ou agendo uma nova chamada, informando a equipe por completo do que foi encontrado, sinalizando tambem a importância de sua solução.


Cenário negativo - Apenas alguns registros estão presentes no banco de dados

    Após a identificação, realizo a abertura do BUG, informando a Alta criticalidade, preencho-o com as evidências até o momento encontradas, o passo-a-passo na tentativa de reproduzi-lo, e continuo atualizando-o conforme a investigação do mesmo. Além de avisar com urgência o time da gravidade do mesmo.

    Se mesmo dessa forma não puder encontrar o motivo, solicito auxilio do desenvolvedor backend para revalidarmos os Logs, e o motivo dessa intermitencia. Se nada for encontrado, contacto o time de produto. 
    Levanto questões que podem levar a uma solução como: 
            Quais foram as últimas implementações da release", "Poderia haver alguma co-relação tendo em vista se o mesmo estava ou não sendo préviamente apresentado", "Este impedimento está permitindo o usuário realizar o pagamento, esses pagamentos estão sendo reembolsados ao consumer?", "Este tipo de problema se dá a uma condição especifica de um usuário? (ex. Usuário prata, ouro, líder)"
    Ficando evidente que os registros estão sendo perdidos de alguma forma entre o middleware, deixo evidente no registro do defeito e também no próximo rito, ou agendo uma nova meeting envolvendo os times, informando esse impacto no sistema e a necessidade de ser solucionada a questão.