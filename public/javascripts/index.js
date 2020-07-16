$(document).ready(function() {



    // Validar formulário
    $('form')
        .form({
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'nome',
                    rules: [{
                        type: 'empty',
                        prompt: 'Quadro deve ter nome!'
                    }]
                }


            }
        });
});