// importação módulo mongoose
const mongoose = require('mongoose');

// atribuição do model registrado à variável modelImovel
const modelImovel = mongoose.model('Imovel');
const modelUser = mongoose.model('User');

// inicializando objeto imovelController
let imovelController = {};

imovelController.getImoveis = (req, res) => {
    if (req.params.idImovel) {
        const idImovel = req.params.idImovel;
        const idUsuario = req.params.idUsuario;
        var promises = [];
        var imovelDetail = [];
        imovelDetail[0] = { "isFavorite": false };

        var promiseImovel = new Promise(function (resolve, reject) {
            modelImovel.findById(idImovel, function (err, imovel) {
                if (err || !imovel) {
                    res.status(400).send(err);
                } else {
                    imovelDetail.push(imovel);
                    if (!idUsuario) {
                        const results = { "success": true, "data": imovelDetail };
                        Promise.all(promises);
                        res.status(200).json(results);
                    }
                    resolve(true);
                }
            });
        });
        promises.push(promiseImovel);

        if (idUsuario != null) {
        var promiseUsuario = new Promise(function (resolve, reject) {
            modelUser.findById(idUsuario, function (err, usuario) {
                if (err || !usuario) {
                    res.status(400).send('Erro: ' + err);
                } else {
                    if (imovelDetail.length < 2)
                            res.status(400).send('Erro: imóvel não encontrado');
                    usuario.imoveisFavorites.forEach(element => {
                        if (element.id == imovelDetail[1].id) {
                            imovelDetail[0].isFavorite = true;
                            return;
                        }
                        else {
                            imovelDetail[0].isFavorite = false;
                        }
                    });
                    const results = { "success": true, "data": imovelDetail };
                    resolve(true);
                    promises.push(promiseUsuario);
                    res.status(200).json(results);
                }
            });
        });
    }
        Promise.all(promises);
    }
    else {
        var pageNo = parseInt(req.query.pageNo);
        var size = parseInt(req.query.size);
        var query = {};
        if (pageNo < 0 || pageNo === 0) {
            response = { "success": false, "message": "Número da página inválido" };
            return res.status(400).json(response);
        }
        query.skip = size * (pageNo - 1);
        query.limit = size;

        // Soma de Imóveis retornados
        modelImovel.countDocuments({}, function (err, totalCount) {
            if (err) {
                results = { "success": false, "message": "Error fetching data" };
            }

            modelImovel.find({}, {}, query, function (err, data) {
                if (err) {
                    results = { "success": false, "message": "Error fetching data" };
                } else {
                    var totalPages = Math.ceil(totalCount / size)
                    results = { "success": true, "data": data, "pages": totalPages };
                }
                res.json(results);
            })
        })
    }
}

imovelController.getImoveisUsuario = (req, res) => {
    idUsuario = req.params.idUsuario;

    var pageNo = parseInt(req.query.pageNo)
    var size = parseInt(req.query.size)

    var query = {}

    if (pageNo < 0 || pageNo === 0) {
        response = { "success": false, "message": "Número da página inválido" };
        return res.status(400).json(response)
    }

    query.skip = size * (pageNo - 1)
    query.limit = size

    if (idUsuario) {
        // Soma de Imóveis retornados
        modelImovel.countDocuments({}, function (err, totalCount) {
            if (err) {
                results = { "success": false, "message": "Error fetching data" };
            }

            modelImovel.find({ usuarioId: idUsuario }, {}, query, function (err, data) {
                if (err) {
                    results = { "success": false, "message": "Error fetching data" };
                } else {
                    var totalPages = Math.ceil(totalCount / size)
                    results = { "success": true, "data": data, "pages": totalPages };
                }
                res.json(results);
            })
        })
    }
    else {
        res.json({
            success: false,
            message: "Usuário inválido.",
            statusCode: 500
        })
    }
}

imovelController.getImoveisFavorito = (req, res) => {
    idUsuario = req.params.idUsuario;
    if (idUsuario) {
        modelUser.findById(idUsuario, (err, userData) => {
            if (!err) {
                idImoveisFavoritos = userData.imoveisFavorites;
                modelImovel.find({ _id: idImoveisFavoritos })
                    .then(results => res.json(results))
                    .catch(err => res.status(401).send(err));
            } else {
                res.status(401).send('Erro ao conectar no banco: ' + err);
                return;
            }
        });
    }
    else {
        res.json({
            success: false,
            message: "Usuário não encontrado.",
            statusCode: 500
        })
    }
}

imovelController.favoriteImovel = (req, res) => {
    idUsuario = req.params.idUsuario;
    idImovel = req.params.idImovel;

    modelUser.findById({ '_id': idUsuario }, function (err, usuario) {
        //Verifica se o ID do imóvel a ser favoritado existe no sub-documento do usuário solicitante
        var fav = usuario.imoveisFavorites.id(idImovel)
        if (fav) {
            // Remove caso exista
            fav.remove();
        } else {
            //Caso não exista, inclua.
            usuario.imoveisFavorites.push({ _id: idImovel });
        }
        //Salvo o documento com seus sub-documentos atualizados.
        usuario.save(function (err) {
            if (err)
                res.send("Erro ao favoritar o imóvel: " + err);

            res.status(200).json({ message: "Imóvel favoritado com sucesso." });
        });
    });
}

imovelController.deleteImovel = (req, res) => {
    if (req.params.idUsuario) {
        modelImovel.findByIdAndRemove(req.params.idImovel, (err, imovel) => {
            if (err) return res.status(500).send(err);

            const response = {
                message: "Imovel removido com sucesso",
                id: imovel.id
            };
            return res.status(200).send(response);
        });
    }
    else {
        res.json({
            success: false,
            message: "Usuário sem permissão para atualizar imóvel.",
            statusCode: 400
        })
    }
}

imovelController.deleteImovelAdmin = (req, res) => {
    modelImovel.findByIdAndRemove(req.params.idImovel, (err, imovel) => {
        if (err) return res.status(500).send(err);

        const response = {
            message: "Imóvel removido com sucesso",
            id: imovel.id
        };
        return res.status(200).send(response);
    });
}

imovelController.updateImovel = (req, res) => {
    const id = req.params.idImovel;

    modelImovel.findById(id, (err, imovel) => {
        if (err) {
            res.status(500).json({
                message: "Erro ao encontrar o imóvel: ID incorreto"
            });
        }
        else if (imovel == null) {
            res.status(400).json({
                message: "Imóvel não encontrado"
            });
        }
        else {
            if (req.params.idUsuario) {
                imovel.titulo = req.body.titulo;
                imovel.tipoImovel = req.body.tipoImovel;
                imovel.status = req.body.status;
                imovel.numQuartos = req.body.numQuartos;
                imovel.numVagasGaragem = req.body.numVagasGaragem;
                imovel.numBanheiros = req.body.numBanheiros;
                imovel.descricao = req.body.descricao;
                imovel.valorImovel = req.body.valorImovel;
                imovel.valorCondominio = req.body.valorCondominio;
                imovel.valorIptu = req.body.valorIptu;
                imovel.area = req.body.area;
                imovel.cep = req.body.cep;
                imovel.endereco = req.body.endereco;
                imovel.numEndereco = req.body.numEndereco;
                imovel.complementoEndereco = req.body.complementoEndereco;
                imovel.bairro = req.body.bairro;
                imovel.cidade = req.body.cidade;
                imovel.uf = req.body.uf;
                imovel.areaServico = req.body.areaServico;
                imovel.arCondicionado = req.body.arCondicionado;
                imovel.churrasqueira = req.body.churrasqueira;
                imovel.piscina = req.body.piscina;
                imovel.varanda = req.body.varanda;
                imovel.mobiliado = req.body.mobiliado;
                imovel.armariosCozinha = req.body.armariosCozinha;
                imovel.armariosQuarto = req.body.armariosQuarto;
                imovel.quartoServico = req.body.quartoServico;
                imovel.emCondominio = req.body.emCondominio;

                if (imovel.emCondominio == true) {
                    imovel.detalhesCondominio.fechado = req.body.detalhesCondominio.fechado;
                    imovel.detalhesCondominio.seg24hrs = req.body.detalhesCondominio.seg24hrs;
                    imovel.detalhesCondominio.podeAnimal = req.body.detalhesCondominio.podeAnimal;
                    imovel.detalhesCondominio.piscina = req.body.detalhesCondominio.piscina;
                    imovel.detalhesCondominio.academia = req.body.detalhesCondominio.academia;
                    imovel.detalhesCondominio.portaoEletrico = req.body.detalhesCondominio.portaoEletrico;
                }

                imovel.save(function (error) {
                    if (error)
                        res.send("Erro ao atualizar o imóvel: " + error);

                    res.status(200).json({
                        message: "Imóvel atualizado com sucesso"
                    });
                });
            }
            else {
                res.json({
                    success: false,
                    message: "Usuário sem permissão para atualizar imóvel.",
                    statusCode: 400
                })
            }
        }
    });
}

imovelController.newImovel = (req, res) => {
    if (req.params.idUsuario) {
        let newImovel = new modelImovel({
            titulo: req.body.titulo,
            tipoImovel: req.body.tipoImovel,
            status: req.body.status,
            numQuartos: req.body.numQuartos,
            numVagasGaragem: req.body.numVagasGaragem,
            numBanheiros: req.body.numBanheiros,
            descricao: req.body.descricao,
            valorImovel: req.body.valorImovel,
            valorCondominio: req.body.valorCondominio,
            valorIptu: req.body.valorIptu,
            area: req.body.area,
            cep: req.body.cep,
            endereco: req.body.endereco,
            numEndereco: req.body.numEndereco,
            complementoEndereco: req.body.complementoEndereco,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf,
            areaServico: req.body.areaServico,
            arCondicionado: req.body.arCondicionado,
            churrasqueira: req.body.churrasqueira,
            piscina: req.body.piscina,
            varanda: req.body.varanda,
            mobiliado: req.body.mobiliado,
            armariosCozinha: req.body.armariosCozinha,
            armariosQuarto: req.body.armariosQuarto,
            quartoServico: req.body.quartoServico,
            emCondominio: req.body.emCondominio,
            detalhesCondominio: {
                fechado: false,
                seg24hrs: false,
                podeAnimal: false,
                piscina: false,
                academia: false,
                portaoEletrico: false
            },
        });

        if (newImovel.emCondominio == true) {
            newImovel.detalhesCondominio.fechado = req.body.detalhesCondominio.fechado;
            newImovel.detalhesCondominio.seg24hrs = req.body.detalhesCondominio.seg24hrs;
            newImovel.detalhesCondominio.podeAnimal = req.body.detalhesCondominio.podeAnimal;
            newImovel.detalhesCondominio.piscina = req.body.detalhesCondominio.piscina;
            newImovel.detalhesCondominio.academia = req.body.detalhesCondominio.academia;
            newImovel.detalhesCondominio.portaoEletrico = req.body.detalhesCondominio.portaoEletrico;
        }

        newImovel.usuarioId = { _id: req.params.idUsuario };

        newImovel.save()
            .then(() => res.json({
                success: true,
                message: 'Imóvel inserido com sucesso',
                statusCode: 200
            }))
            .catch(err => res.json({
                success: false,
                message: err,
                statusCode: 500
            }));
    }
    else {
        res.json({
            success: false,
            message: "Usuário sem permissão para cadastrar imóvel.",
            statusCode: 400
        })
    }
}

imovelController.searchImovel = (req, res, next) => {
    var searchParams = req.query.query;
    modelImovel.find({ cidade: { $regex: '.*' + searchParams + '.*' } }, function (e, docs) {
        res.json({
            results: true,
            search: req.query.query,
            list: docs
        });
    });
}

// exporta o módulo
module.exports = imovelController;