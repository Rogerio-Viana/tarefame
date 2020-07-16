const Quadro = require('./QuadroAcoes')

exports.criarEntrarQuadro = function(params) {

    const db = conexaoBancoQuadroRegistrados()

    const nome = params.nome
    params.id = nome.replace(' ', '_')
    params.data = new Date();
    params.ativo = true;

    const quadro = db.get('quadros').find({ nome: params.nome }).value()

    let dados = {}

    if (params.senha || params.senha != undefined || params.senha != '') {
        if (quadro != undefined) {
            if (quadro.senha != params.senha) {
                dados.url = '/?loginErro=true'
                dados.cookie = { nome: params.nome, auth: false };
                return dados
            }
        }
    }

    if (!quadro) {
        db.get('quadros')
            .push(params)
            .write();

        Quadro.criarQuadro(params.nome)
    }

    dados.url = '/frame/' + params.nome
    dados.cookie = { nome: params.nome, auth: true };

    return dados
}

function conexaoBancoQuadroRegistrados() {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('database/quadros.json')
    const db = low(adapter)

    db.defaults({ quadros: [] })
        .write()

    return db
}