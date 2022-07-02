using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioController : Controller
    {
        // GET: Beneficiario
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Inserir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                try
                {
                    model.Id = bo.Incluir(new Beneficiario()
                    {
                        NOME = model.NOME,
                        CPF = model.CPF
                    });
                }
                catch (Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json( new {Result = "ERROR", Message = ex.Message});
                }

                return Json("Beneficiário cadastrado com sucesso!");
            }
        }
    }
}