using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using Newtonsoft.Json;

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
                    if(model.IdCliente == 0)
                    {
                        Response.StatusCode = 400;
                        return Json( new {Result = "ERROR", Message = "IdCliente é obrigatório. Contate o suporte" });
                    }

                    bo.IncluirUnico(new Beneficiario()
                    {
                        NOME = model.NOME,
                        CPF = model.CPF,
                        IdCliente = model.IdCliente
                    });
                }
                catch (Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json(new { Result = "ERROR", Message = ex.Message });
                }

                return Json("Beneficiário cadastrado com sucesso!");
            }
        }

        [HttpPost]
        public JsonResult Editar(BeneficiarioModel model)
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
                    bo.Editar(new Beneficiario()
                    {
                        NOME = model.NOME,
                        CPF = model.CPF,
                        Id = model.Id,
                        IdCliente = model.IdCliente
                    });

                    return Json("Beneficiário editado com sucesso!");
                }
                catch(Exception ex)
                {
                    Response.StatusCode = 400;
                    return Json(new { Result = "ERROR", Message = ex.Message });
                }
            }
        }

        [HttpPost]
        public JsonResult Exluir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            
            try
            {
                bo.Excluir(model.Id);

                return Json("Beneficiário excluído com sucesso!");
            }
            catch (Exception ex)
            {
                Response.StatusCode = 400;
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult Listar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            try
            {
                var list = bo.Consultar(model.IdCliente);

                Response.StatusCode = 200;
                return Json(new { data = list }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { Status = "ERROR", Message = ex.Message}, JsonRequestBehavior.AllowGet);
            }
        }
    }
}