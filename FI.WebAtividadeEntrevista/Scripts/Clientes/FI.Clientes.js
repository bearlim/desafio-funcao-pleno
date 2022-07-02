
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON.Message);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

// Evento para iniciar o modal em inserção
$("#btBeneficiarios").click(() => {
    $("#modalBeneficiario").modal("show");
    MontarListagem();
});

// Evento de envio de dados de beneficiário
$("#formBeneficiario").submit(function () {
    var arrBen = localStorage.getItem("arrBen"),
        form = $(this);

    if (!!arrBen) {
        arrBen = JSON.parse(arrBen);
        arrBen.push({
            NOME: $(form).find("#NomeBeneficiario").val(),
            CPF: $(form).find("#CPFBeneficiario").va()
        });

        localStorage.setItem("arrBen", JSON.stringify(arrBen));
        form[0].reset();
        MontarListagem();
    } else {
        var obj =
            [
                {
                    NOME: $(form).find("#NomeBeneficiario").val(),
                    CPF: $(form).find("#CPFBeneficiario").val()
                }
            ]

        localStorage.setItem("arrBen", JSON.stringify(obj));
        form[0].reset();
        MontarListagem();
    }
});

function MontarListagem() {
    var arrObj = JSON.parse(localStorage.getItem("arrBen")),
        html = "";

    $("#modalBeneficiario #gridBeneficiarios #tableData tr").remove();

    if (!!arrObj) {
        arrObj.map((e, index) => {
            html += `<tr>`
            html += `<td>${e.CPF}</td>`;
            html += `<td>${e.NOME}</td>`;
            html += `<td><button class='btn btn-primary' type='button' id='Email' data-index='${index}'> Alterar </button></td>`;
            html += `<td><button class='btn btn-danger' type='button' id='btExcluir'> Excluir </button></td>`;
            html += `</tr>`;
        });

        $("#modalBeneficiario table tbody:last-child").append(html);
    }
}