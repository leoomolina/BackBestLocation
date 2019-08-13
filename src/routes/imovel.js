// controller que deverá responder na rota configurada
const imovelController = require('../controllers/imovel');

// exportando a função anônima que representa as rotas da aplicação
module.exports = (app) => {

    // route invoca Expresse Router

    app.route('/api/imovel/buscar/:idImovel?')
        .get(imovelController.getImoveis)

    app.route('/api/imovel/usuario/:idUsuario/:idImovel')
        .delete(imovelController.deleteImovel)
        .put(imovelController.updateImovel)

    app.route('/api/imovel/admin/:idImovel')
        .delete(imovelController.deleteImovelAdmin)

    app.route('/api/imovel/usuario/:idUsuario?')
        .get(imovelController.getImoveisUsuario)
        .post(imovelController.newImovel);

    app.route('/api/imovel/searchimovel')
        .get(imovelController.searchImovel);
}