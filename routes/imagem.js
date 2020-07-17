var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
const QuadroAcoes = require('../public/class/QuadroAcoes');


var router = express.Router();

/* GET home page. */
router.get('/:imgId', function(req, res, next) {
    console.log('Img: dirname - ' + __dirname + ' ------- ' + req.params.imgId)
        // res.sendFile('index.html', { root: __dirname })
    res.sendFile(req.params.imgId, { root: './public/images/' })
});

router.get('/:quadro/:tarefaId/:idImg/deleteImg', function(req, res) {
    QuadroAcoes.deletarImgTarefaQuadro(req.params.quadro, req.params.idImg)
    res.status(200).send()
});

router.post('/:quadro/:tarefaId', function(req, res) {
    var form = new formidable.IncomingForm();
    var totalFiles = 0

    fs.readdir('./public/images/', function(error, files) {
        totalFiles = files.length + 1;
    });

    let nameImg = 'img_' + totalFiles

    form.parse(req, function(err, fields, files) {
        var image = files.image;
        var image_upload_path_old = image.path;
        var image_upload_path_new = './public/images/';
        var image_upload_name = nameImg + '.' + image.type.split('/')[1] // image.name;
        var image_upload_path_name = image_upload_path_new + image_upload_name;

        if (fs.existsSync(image_upload_path_new)) {
            fs.rename(
                image_upload_path_old,
                image_upload_path_name,
                function(err) {
                    if (err) {
                        console.log('Deu merda na hora de mover a imagem! - Erro: ', err);
                    }
                });

            console.log('Type img: ', image.type)
            const dadosImg = { "name": image.name, "nameSave": nameImg, "path": '/images/' + nameImg + '.' + image.type.split('/')[1] }
            QuadroAcoes.salvarImagemQuadroTarefa(req.params.quadro, req.params.tarefaId, dadosImg);
            res.send(dadosImg)
        }
    });
});

module.exports = router;