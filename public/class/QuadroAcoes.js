exports.criarQuadro = function(n) {
    const db = conexaoQuadro(n)

    db.defaults({
            nome,
            dataCriacao: new Date(),
            quadros: [],
            imagens: [],
            links: [],
            textos: []
        })
        .write()
}

exports.buscarQuadro = function(n) {
    const db = conexaoQuadro(n)
    return montarQuadro(db)
}

exports.conluirTarefaQuadro = function(quadro, tarefaId) {
    const db = conexaoQuadro(quadro)
    let id = new Number(tarefaId)
    db.get('quadros').find({ id: id }).assign({ ativo: false }).write()
}

exports.buscarTarefaQuadro = function(quadro, IdTarefa) {
    const db = conexaoQuadro(quadro)
    let id = new Number(IdTarefa)
    const tarefa = db.get('quadros').find({ id: id }).value();
    const imagens = db.get('imagens').filter({ tarefaId: id }).value();
    const links = db.get('links').filter({ tarefaId: id }).value();

    let dados = {
        tarefa: tarefa,
        imagens: imagens,
        links: links
    }

    return dados
}

exports.salvarTarefa = function(quadro, dados) {
    const db = conexaoQuadro(quadro)
    let id = db.get('quadros').size().value()

    db.get('quadros')
        .push({ id: id, nome: dados.nome, data: dados.data, criacao: new Date(), ativo: true })
        .write()

    return db.get('quadros').find({ id: id }).value()
}

exports.salvarImagemQuadroTarefa = function(quadro, tarefaId, dadosImg) {
    const db = conexaoQuadro(quadro)
    let id = new Number(tarefaId)
    const idImg = db.get('imagens').size()
    db.get('imagens')
        .push({ id: idImg, tarefaId: id, name: dadosImg.name, nameSave: dadosImg.nameSave, path: dadosImg.path })
        .write()

}

exports.deletarImgTarefaQuadro = function(quadro, idImg) {
    const db = conexaoQuadro(quadro)
    let id = new Number(idImg)
    db.get('imagens').remove({ id: id }).write()
}

exports.buscarLinkTarefaQuadro = function(quadro, tarefaId) {
    const db = conexaoQuadro(quadro)
    let id = new Number(tarefaId)
    return db.get('links').filter({ tarefaId: id }).value()
}
exports.deletarLinkTarefaQuadro = function(quadro, tarefaId, linkId) {
    const db = conexaoQuadro(quadro)
    let id = new Number(linkId)

    db.get('links').remove({ id: id }).write()
}

exports.salvarLinkTarefaQuadro = function(quadro, tarefaId, dados) {
    const db = conexaoQuadro(quadro)
    let id = new Number(tarefaId)
    const idQuant = db.get('links').size()

    let link = {
        id: idQuant,
        tarefaId: id,
        assunto: dados.assunto,
        endereco: dados.endereco
    }

    db.get('links')
        .push(link)
        .write()

    return link
}

function montarQuadro(db) {
    let quadro = {}

    quadro.nome = db.get('nome').value()
    quadro.projetos = db.get('projetos').value()

    let quadroOrdenacao = db.get('quadros').filter({ ativo: true }).value()

    quadro.quadros = quadroOrdenacao.sort((q1, q2) => {
        let d1 = q1.data
        let d2 = q2.data

        if (d1 && d2) {
            d1 = d1.split('/').reverse().join('')
            d2 = d2.split('/').reverse().join('')
        }

        if (d1 > d2) {
            return 1
        }
        if (d1 < d2 || (d1 == null || d1 == '' && d2 == null || d2 == '')) {
            return -1
        }

        return 0
    })

    return quadro
}

function conexaoQuadro(n) {
    const nome = n.replace(' ', '_')

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync(`database/quadros/${nome}.json`)
    const db = low(adapter)

    return db
}