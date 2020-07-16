// using context
$(document).ready(function() {
    $('.ui.sidebar')
        .sidebar({
            context: $('.conteudo'),
            dimPage: false,
            closable: false
        });

    $('.botao.menu a').click(function() {
        $('.menu').toggleClass('visible')
        $('.conteudo-pagina').toggleClass('redefinir-tamanho')
    })

    $('.ui.accordion').accordion();

    $('#form-criar-tarefa').submit(function(e) {
        e.preventDefault();

        if ($('#nome').val()) {
            $('#add-tarefa').addClass('loading')

            $.ajax({
                type: "POST",
                url: window.location.href + '/save',
                data: { nome: $('#nome').val(), data: $('#data').val() },
                success: function(data, textStatus, jqXHR) {

                    // add Tarefa na tela
                    inserirTarefaSalvaTela(window.location.href.split('/frame/')[1], data)

                    $('#add-tarefa').removeClass('loading')
                    document.getElementById('form-criar-tarefa').reset()
                },
                error: function(e) {
                    console.log('Erro ao salvar tarefa: ', e);
                }
            }).done();
        }

    });

    $('#form-criar-tarefa')
        .form({
            on: 'submit',
            fields: {
                nome: {
                    identifier: 'nome',
                    rules: [{
                        type: 'empty',
                        prompt: 'Tarefa sem nome'
                    }]
                }


            }
        });


    $('#data').datepicker({
        format: 'dd/mm/yyyy',
        language: 'pt-BR'
    })


    $('.tab-imagens .quadroImgTarefa .content img').click(function(e) {
        abriModalMostrarImg()
    });

    $('.tabular.menu .item').tab();

    //---------
    $('#input-up-img').change(function(e) {
        event.preventDefault();
        $('#button-up-img').addClass('loading')

        // capture o formulário
        var form = $('#form-up-img')[0];
        var data = new FormData(form);

        const quadro = $('#modal-quadro-id').val()
        const tarefaId = $('#modal-quadro-tarefa-id').val()

        // processar
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: `/imagem/${quadro}/${tarefaId}`,
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            // manipular o sucesso da requisição
            success: function(data) {
                inserirImagemUpada(data)
                $('#button-up-img').removeClass('loading')
            },
            // manipular erros da requisição
            error: function(e) {
                console.log('Erro ao enviar imagem: ', e);
            }
        });

    });
    //---------
});

function concluirTarefa(quadro, tarefaId) {

    $.ajax({
        type: "GET",
        url: `/frame/${quadro}/${tarefaId}/completed`,
        success: function(data) {
            $(`#tarefa-${tarefaId}`).remove()
        },
        error: function(e) {
            console.log('Erro ao concluir tarefa: ', e);
        }
    });

}

function infoAdicionais(el, quadro, tarefaId) {

    $(el).addClass('loading')

    $.ajax({
        type: "GET",
        url: `/frame/${quadro}/${tarefaId}`,
        success: function(data) {
            $(el).removeClass('loading')
            let dados = data

            $('.ui.modal.modal-info-add')
                .modal({
                    centered: false,
                    onShow: function() {
                        // TODO  montar Modal de Visualização da informações adicionais
                        $('#modal-info-add-title').text('')
                        $('#modal-info-add-title').text(`Informações Adicionais - ${dados.tarefa.nome}`)

                        $('#modal-quadro-id').val('')
                        $('#modal-quadro-id').val(quadro)
                        $('#modal-quadro-tarefa-id').val('')
                        $('#modal-quadro-tarefa-id').val(dados.tarefa.id)

                        const imagens = dados.imagens
                        $('#quadroImgTarefa').text('')
                        imagens.forEach(element => {
                            inserirImagemUpada(element)
                        });

                        const links = dados.links

                        $('#links-salvos').text('')
                        links.forEach(element => {
                            console.log('link: --- ', element)
                            inserirLinkTarefaTela(element)
                        });

                    }
                }).modal('show');
        },
        error: function(e) {
            console.log('Erro ao salvar tarefa: ', e);
        }
    });
}

function removeImg(el) {
    $(`#${el}`).remove()
    const idImg = el.split('div-img-')[1]
    const quadro = $('#modal-quadro-id').val()
    const tarefaId = $('#modal-quadro-tarefa-id').val()

    $.ajax({
        type: "GET",
        url: `/imagem/${quadro}/${tarefaId}/${idImg}/deleteImg`,
        success: function(data) {},
        error: function(e) {
            console.log('Erro ao deletar imagem: ', e);
        }
    });

}


function abriModalMostrarImg(path, name) {

    $('.ui.modal.modal-img')
        .modal({
            centered: false,
            onShow: function() {
                $('#modal-img-title').text(name)
                $('#modal-img-img').attr('src', path)
                $('#modal-img-img').attr('alt', name)
                $('#modal-img-img').attr('title', name)
            },
            onHidden: function() {
                $('.ui.modal.modal-info-add')
                    .modal({
                        centered: false
                    }).modal('show');
            }
        }).modal('show');

}

function inserirImagemUpada(img) {

    let quadroImg = `
    <div class="eight wide mobile eight wide tablet five wide computer column" id="div-img-${img.id}">
        <div class="ui link card">
            <div class="content"><div class="description"> 
                <img src="${img.path}" alt="${img.name}" title="${img.name}">
            </div>
            <div class="extra content">
                <div class="ui two buttons">
                    <div class="ui basic green button" onclick="abriModalMostrarImg('${img.path}', '${img.name}')"><i class="zoom-in icon"></i></div>
                    <div class="ui basic red button" onclick="removeImg('div-img-${img.id}')"><i class="trash alternate icon"></i></div>
                </div>
            </div>
        </div>
    </div>
    `
    $('#quadroImgTarefa').append(quadroImg)
}

function inserirTarefaSalvaTela(quadro, tarefa) {

    let tarefaTemplate = `
    <div class="card sixteen wide mobile sixteen wide tablet five wide computer column">
        <div class="content"><div class="header">${tarefa.nome}</div>
        <div class="description"> 
            <span>Data - ${tarefa.data}</span></div>
        </div>
        <div class="extra content">
            <div class="ui two buttons">
            <div onclick="infoAdicionais($(this), '${quadro}', ${tarefa.id})" data-frame="${quadro}" data-id="${tarefa.id}" class="ui basic primary button info-adicionais">informações</div>
            <div onclick="concluirTarefa('${quadro}', ${tarefa.id})" class="ui basic green button">Concluir</div>
            </div>
        </div>
    </div>
    `

    $('#tarefas-salvas').append(tarefaTemplate)
}

function salvarLinktarefaQuadro() {

    $('#add-link').addClass('loading')
    const assunto = $('#assunto').val()
    const endereco = $('#endereco').val()

    const quadro = $('#modal-quadro-id').val()
    const tarefaId = $('#modal-quadro-tarefa-id').val()

    $.ajax({
        type: "POST",
        url: `/link/${quadro}/${tarefaId}/save`,
        data: { assunto: assunto, endereco: endereco },
        success: function(data) {
            $('#add-link').removeClass('loading')
            $('#assunto').val('')
            $('#endereco').val('')

            inserirLinkTarefaTela(data)
        },
        error: function(e) {
            console.log('Erro ao salvar link: ', e);
        }
    });

}

function deletarLinktarefaQuadro(linkId) {
    const quadro = $('#modal-quadro-id').val()
    const tarefaId = $('#modal-quadro-tarefa-id').val()

    $.ajax({
        type: "GET",
        url: `/link/${quadro}/${tarefaId}/${linkId}/delete`,
        data: { assunto: assunto, endereco: endereco },
        processData: false,
        success: function(data) {
            $(`#div-link-${linkId}`).remove()
        },
        error: function(e) {
            console.log('Erro ao deletar link: ', e);
        }
    });
}

function inserirLinkTarefaTela(link) {
    let linkTemplete = `
    <div class="link" id="div-link-${link.id}">
        <span>${link.assunto} - <i onclick="deletarLinktarefaQuadro('${link.id}')" class="trash icon"></i></span>
        <div class="endereco">
            <a href="${link.endereco}" target="blank">${link.endereco}</a>
        </div>
    </div>
    `

    $('#links-salvos').append(linkTemplete)
}