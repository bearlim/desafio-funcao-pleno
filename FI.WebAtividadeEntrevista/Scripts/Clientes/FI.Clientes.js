
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {

        if (!validarCPF($(this).find("#CPF").val())) {
            alert("CPF Inválido");
            return;
        }

        let arrBen = JSON.parse(localStorage.getItem("arrBen"));
        if (!arrBen)
            arrBen = [];

        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val().replace(".", "").replace("-", ""),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val().replace("(", "").replace(")", "").replaceAll(" ", "").replace("-", ""),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": arrBen
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
                localStorage.removeItem("arrBen");
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
    let arrBen = localStorage.getItem("arrBen"),
        form = $(this),
        cond = false;

    if (!validarCPF(form.find("#CPFBeneficiario").val())) {
        alert("CPF Inválido");
        return
    }

    if (!!arrBen) {
        arrBen = JSON.parse(arrBen);

        arrBen.map((e) => {
            if (e.CPF === form.find("#CPFBeneficiario").val()) {
                alert("CPF já cadastrado para algum beneficiário desse cliente.");
                cond = true;
            }
        });

        if (cond)
            return

        arrBen.push({
            NOME: $(form).find("#NomeBeneficiario").val(),
            CPF: $(form).find("#CPFBeneficiario").val()
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

// Função para montar listagem
function MontarListagem() {
    var arrObj = JSON.parse(localStorage.getItem("arrBen")),
        html = "";

    $("#modalBeneficiario table tbody tr").remove();

    if (!!arrObj) {
        arrObj.map((e, index) => {
            html += `<tr>`
            html += `<td>${e.CPF}</td>`;
            html += `<td>${e.NOME}</td>`;
            html += `<td><button class='btn btn-primary' type='button' id='btEditarBeneficiario' data-modal='#modalEditarBeneficiario' data-index='${index}'> Alterar </button></td>`;
            html += `<td><button class='btn btn-danger' type='button' id='btExcluirBeneficiario' data-index='${index}'> Excluir </button></td>`;
            html += `</tr>`;
        });

        $("#modalBeneficiario table tbody:last-child").append(html);
    }
}

// Evento para abrir modal de editar beneficiário 
$("BODY").on("click", "#modalBeneficiario table tbody #btEditarBeneficiario", function () {
    var obj = JSON.parse(localStorage.getItem("arrBen")),
        modal = $(this).data("modal"),
        index = $(this).data("index");

    $(modal).modal("show");
    $(modal).find("#NomeBeneficiario").val(obj[index].NOME).trigger("input");
    $(modal).find("#CPFBeneficiario").val(obj[index].CPF).trigger("input");
    $(modal).find("#indexInput").val(index);
});

// Evento para editar beneficiario
$("BODY").on("submit", "#formEditarBeneficiario", function () {
    let form = $(this),
        index = form.find("#indexInput").val(),
        cond = false,
        arrBen = JSON.parse(localStorage.getItem("arrBen"));


    if (!validarCPF(form.find("#CPFBeneficiario").val())) {
        alert("CPF Inválido");
        return
    }

    arrBen.map((e, i) => {
        if (e.CPF === form.find("#CPFBeneficiario").val() && i != index) {
            alert("CPF já cadastrado para algum beneficiário desse cliente.");
            cond = true;
            return
        }
    });

    if (cond)
        return

    let obj = {
        NOME: form.find("#NomeBeneficiario").val(),
        CPF: form.find("#CPFBeneficiario").val()
    }

    arrBen[index] = obj;
    localStorage.setItem("arrBen", JSON.stringify(arrBen));

    $("#modalEditarBeneficiario").modal("hide");
    MontarListagem();
});

// Evento para exlcuir beneficiário
$("BODY").on("click", "#modalBeneficiario table tbody #btExcluirBeneficiario", function () {
    let index = $(this).data("index"),
        arrBen = JSON.parse(localStorage.getItem("arrBen"));

    arrBen.splice(index, 1);

    localStorage.setItem("arrBen", JSON.stringify(arrBen));
    MontarListagem();
})

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