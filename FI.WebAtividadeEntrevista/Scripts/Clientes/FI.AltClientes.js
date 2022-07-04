$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP).trigger("input");
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone).trigger("input");
        $("#formCadastro #CPF").val(obj.CPF).trigger("input");

        $("#modalBeneficiario #formBeneficiario #IdCliente").val(obj.Id);
    }

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
                window.location.href = urlRetorno;
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

// Evento para abrir modal de beneficiários
$("#btBeneficiarios").click(function () {
    $("#modalBeneficiario").modal("show");

    MontarDados();
});

// Função para apresentar modão de inserção de beneficiários
function MontarDados() {
    let html = "";

    $("#modalBeneficiario table tbody tr").remove();

    $.ajax({
        url: urlGetBen,
        method: "GET",
        data: {
            "IdCliente": $("#formBeneficiario #IdCliente").val()
        },
        error:
            function (response) {
                if (response.status == 400)
                    ModalDialog("Ocorreu um erro", response.responseJSON.Message);
                else if (response.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function (response) {
                if (!!response.data) {
                    response.data.map((e) => {
                        html += `<tr>`;
                        html += `<td>${e.CPF}</td>`;
                        html += `<td>${e.NOME}</td>`;
                        html += `<td><button class='btn btn-primary' type='button' id='btEditarBeneficiario' data-modal='#modalEditarBeneficiario' data-nome='${e.NOME}' data-cpf='${e.CPF}' data-id='${e.Id}'> Alterar </button></td>`;
                        html += `<td><button class='btn btn-danger' type='button' id='btExcluirBeneficiario' data-id='${e.Id}'> Excluir </button></td>`;
                        html += `</tr>`;
                    });

                    $("#modalBeneficiario table tbody:last-child").append(html);
                }
            }
    });
}


// Evento para editar beneficiario
$("BODY").on("click", "#modalBeneficiario table tbody #btEditarBeneficiario", function () {
    let button = $(this),
        modal = $(button).data("modal"),
        id = $(button).data("id"),
        nome = $(button).data("nome"),
        cpf = $(button).data("cpf");

    $(modal).modal("show");
    $(modal).find("#NomeBeneficiario").val(nome).trigger("input");
    $(modal).find("#CPFBeneficiario").val(cpf).trigger("input");
    $(modal).find("#IdBeneficiario").val(id);
});

// Evento para editar beneficiario
$("BODY").on("submit", "#formEditarBeneficiario", function () {
    let form = $(this);

    $.ajax({
        url: urlPostEditBen,
        method: "POST",
        data: {
            Id: $(form).find("#IdBeneficiario").val(),
            NOME: $(form).find("#NomeBeneficiario").val(),
            CPF: $(form).find("#CPFBeneficiario").val(),
            IdCliente: $("#formBeneficiario").find("#IdCliente").val()
        },
        error:
            function (response) {
                if (response.status == 400)
                    ModalDialog("Ocorreu um erro", response.responseJSON.Message);
                else if (response.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function () {
                $("#modalEditarBeneficiario").modal("hide");
                MontarDados();
            }
    });
});

// Evento para deletar beneficiario
$("BODY").on("click", "#modalBeneficiario table tbody #btExcluirBeneficiario", function () {
    let id = $(this).data("id");

    $.ajax({
        url: urlPostDelBen,
        method: "POST",
        data: {
            Id: id
        },
        error:
            function (response) {
                if (response.status == 400)
                    ModalDialog("Ocorreu um erro", response.responseJSON.Message);
                else if (response.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function () {
                MontarDados();
            }
    });
});

// Evento para incluir beneficiario
$("BODY").on("submit", "#formBeneficiario", function () {
    let form = $(this);

    if (!validarCPF($(form).find("#CPFBeneficiario").val())) {
        alert("CPF inválido!");
        return;
    }

    $.ajax({
        url: urlPostBen,
        method: "POST",
        data: {
            NOME: $(form).find("#NomeBeneficiario").val(),
            CPF: $(form).find("#CPFBeneficiario").val(),
            IdCliente: $(form).find("#IdCliente").val()
        },
        error:
            function (response) {
                if (response.status == 400)
                    ModalDialog("Ocorreu um erro", response.responseJSON.Message);
                else if (response.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
        success:
            function () {
                MontarDados();
                form[0].reset();
            }
    });
});

function validarCPF(CPF) {
    var Soma;
    var Resto;
    Soma = 0;
    CPF = String(CPF).replace("-", "").replaceAll(".", "");

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(CPF.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(CPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(CPF.substring(10, 11))) return false;
    return true;
}