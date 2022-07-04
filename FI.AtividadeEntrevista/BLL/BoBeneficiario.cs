using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public void Incluir(List<DML.Beneficiario> beneficiarios, long IdCliente)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
            ben.Incluir(beneficiarios, IdCliente);
        }

        public void IncluirUnico(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
            ben.InserirUnico(beneficiario);
        }

        public List<DML.Beneficiario> Consultar(long IdCliente)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
            return ben.Consultar(IdCliente);
        }

        public void Editar(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
            ben.Editar(beneficiario);
        }

        public void Excluir(long ID)
        {
            DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
            ben.Excluir(ID);
        }
    }
}
