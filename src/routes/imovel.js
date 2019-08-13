// controller que deverá responder na rota configurada
const imovelController = require('../controllers/imovel');

// exportando a função anônima que representa as rotas da aplicação
module.exports = (app) => {

    // route invoca Expresse Router

    app.route('/api/imoveis/:id_imovel')
        .get(imovelController.getImoveis)
        .get(imovelController.detailsImoveis)

    app.route('/api/imoveis/:id_imovel/:idUsuario')
        .delete(imovelController.deleteImovel)
        .put(imovelController.updateImovel)

    app.route('/api/imoveis/user/:idUsuario?')
        .get(imovelController.getImoveisUsuario)
        .post(imovelController.newImovel);

    app.route('/api/searchimovel')
        .get(imovelController.searchImovel);
}