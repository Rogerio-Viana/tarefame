var express = require('express');
var cookieParser = require('cookie-parser');
var Frame = require('../public/class/frame');

var router = express.Router();
router.use(cookieParser());

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'Tarefa-me',
        quadro: req.query.quadro,
        loginErro: req.query.loginErro,
        quadroErro: req.query.quadroErro
    });
});

router.post('/', function(req, res) {
    const dados = Frame.criarEntrarQuadro(req.body)

    res.clearCookie('quadroAuth')
    if (dados.cookie.auth) res.cookie('quadroAuth', dados.cookie.nome);

    res.redirect(dados.url)
});

module.exports = router;