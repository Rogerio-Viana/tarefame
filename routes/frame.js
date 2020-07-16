var express = require('express');
var cookieParser = require('cookie-parser');

const QuadroAcoes = require('../public/class/QuadroAcoes');

var router = express.Router();
router.use(cookieParser());


/* GET Frame listing. */
router.get('/:id', function(req, res, next) {
    const quadroAuth = req.cookies['quadroAuth']

    if (req.params.id == quadroAuth) {
        const quadro = QuadroAcoes.buscarQuadro(quadroAuth)
        const infoExtra = {
            hoje: new Date().toLocaleDateString(),
            urlQuadro: '/frame/' + req.params.id + '/save'
        };

        res.render('quadro', { quadro: quadro, info: infoExtra });
    } else {
        res.redirect('/?quadroErro=true&quadro=' + req.params.id)
    }

});

router.get('/:id/:tarefa', function(req, res, next) {
    const dadosTarefa = QuadroAcoes.buscarTarefaQuadro(req.params.id, req.params.tarefa)
    res.status(200).send(dadosTarefa)
});

router.get('/:id/:tarefa/completed', function(req, res, next) {
    QuadroAcoes.conluirTarefaQuadro(req.params.id, req.params.tarefa)
    res.status(200).send()
});


router.post('/:id/save', function(req, res, next) {

    let dados = {
        nome: req.body.nome,
        data: req.body.data
    }


    res.status(200).send(QuadroAcoes.salvarTarefa(req.params.id, dados))

});

module.exports = router;