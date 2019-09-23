
// importa configuração do Express e do banco de dados
const app = require('./config/express')();
var path = require('path');
var serveStatic = require('serve-static');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('./config/database');

app.use(serveStatic(__dirname));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('dotenv').config();

/* Uma maneira simples de implementar autorização é criar
    um middleware simples para isso. Qualquer endpoint que 
    venha após o middleware de autorização não passará se 
    o usuário não tiver uma sessão válida */
// app.use((req, res, next) => {
//     if (req.session.user) {
//         next();
//     } else {
//         res.status(401).send('Authorization failed! Please login');
//     }
// });

// passa a porta definida no Express e levantamento do servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor rodando na porta ${app.get('port')}`)
});