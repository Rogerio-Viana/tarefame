var express = require('express');
var cookieParser = require('cookie-parser');

const QuadroAcoes = require('../public/class/QuadroAcoes');

var router = express.Router();
router.use(cookieParser());

// buscar links
router.get('/:quadro/:tarefaId', function(req, res) {
    const quadro = req.params.quadro
    const tarefaId = req.params.tarefaId

    const dados = QuadroAcoes.buscarLinkTarefaQuadro(quadro, tarefaId)
    res.status(200).send(dados)
});

// Deletar link --- /link/${quadro}/${tarefaId}/${linkId}/delete
router.get('/:quadro/:tarefaId/:linkId/delete', function(req, res) {
    const quadro = req.params.quadro
    const tarefaId = req.params.tarefaId
    const linkId = req.params.linkId

    QuadroAcoes.deletarLinkTarefaQuadro(quadro, tarefaId, linkId)

    res.status(200).send()
});

router.post('/:quadro/:tarefaId/save', function(req, res) {

    const quadro = req.params.quadro
    const tarefaId = req.params.tarefaId
    const dados = {
        assunto: req.body.assunto,
        endereco: req.body.endereco
    }

    const link = QuadroAcoes.salvarLinkTarefaQuadro(quadro, tarefaId, dados)

    res.status(200).send(link)
});


module.exports = router;