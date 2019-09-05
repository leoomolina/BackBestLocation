// importação módulo mongoose
var mongoose = require('mongoose');

// guardando valor de mongoose.Schema (apenas para facilitar na hora de escrever)
const Schema = mongoose.Schema;

// objeto instância do Schema
const imovelSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        default: ''
    },
    tipoImovel: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: ''
    },
    numQuartos: {
        type: Number,
        default: ''
    },
    numVagasGaragem: {
        type: Number,
        default: 0
    },
    numBanheiros: {
        type: Number,
        default: 0
    },
    descricao: {
        type: String,
        default: ''
    },
    valorImovel: {
        type: Number,
        default: 0.00
    },
    valorIptu: {
        type: Number,
        default: 0.00
    },
    area: {
        type: Number,
        default: 0.00
    },
    cep: {
        type: String,
        default: ''
    },
    endereco: {
        type: String,
        required: true,
        default: ''
    },
    numEndereco: {
        type: String,
        required: true,
        default: ''
    },
    complementoEndereco: {
        type: String,
        default: ''
    },
    bairro: {
        type: String,
        default: ''
    },
    cidade: {
        type: String,
        default: ''
    },
    uf: {
        type: String,
        default: ''
    },
    areaServico: {
        type: Boolean,
        default: false
    },
    arCondicionado: {
        type: Boolean,
        default: false
    },
    churrasqueira: {
        type: Boolean,
        default: false
    },
    piscina: {
        type: Boolean,
        default: false
    },
    varanda: {
        type: Boolean,
        default: false
    },
    mobiliado: {
        type: Boolean,
        default: false
    },
    armariosCozinha: {
        type: Boolean,
        default: false
    },
    armariosQuarto: {
        type: Boolean,
        default: false
    },
    quartoServico: {
        type: Boolean,
        default: false
    },
    emCondominio: {
        type: Boolean,
        default: false
    },
    images: [{
        type: String,
        trim: true
    }],
    detalhesCondominio: [{
        valorCondominio: {
            type: Number,
            default: 0.00
        },
        fechado: {
            type: Boolean,
            default: false
        },
        seg24hrs: {
            type: Boolean,
            default: false
        },
        podeAnimal: {
            type: Boolean,
            default: false
        },
        piscina: {
            type: Boolean,
            default: false
        },
        academia: {
            type: Boolean,
            default: false
        },
        portaoEletrico: {
            type: Boolean,
            default: false
        }
    }],
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    }
    // 'runSettersOnQuery' usado para implementar as especificações no esquema de modelo
}, { runSttersOnQuery: true });

imovelSchema.pre('save', function (next) {
    var currentDate = new Date().getTime();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

// registrando model utilizando objeto criado 
mongoose.model('Imovel', imovelSchema);