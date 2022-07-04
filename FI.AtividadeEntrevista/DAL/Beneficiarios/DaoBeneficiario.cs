using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal void Incluir(List<DML.Beneficiario> beneficiarios, long IdCliente)
        {
            if(beneficiarios == null)
                return;

            beneficiarios.ForEach(beneficiario =>
            {
                List<SqlParameter> parameters = new List<SqlParameter>();

                parameters.Add(new SqlParameter("NOME", beneficiario.NOME));
                parameters.Add(new SqlParameter("CPF", beneficiario.CPF));
                parameters.Add(new SqlParameter("IDCLIENTE", IdCliente));
                var retorno = new SqlParameter("RETORNO", SqlDbType.Int);
                retorno.Direction = ParameterDirection.Output;
                parameters.Add(retorno);

                var ds = base.ConsultarV2("FI_SP_InsBeneficiario", parameters, out int output);

                if (output == -1)
                    throw new Exception("Não foi possível salvar beneficiário. CPF já cadastrado para esse cliente");
            });
        }

        internal List<DML.Beneficiario> Consultar(long IdCliente)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("IDCLIENTE", IdCliente));

            var ds = base.Consultar("FI_SP_ConsBeneficiario", parameters);
            List<DML.Beneficiario> lista = Converter(ds);

            return lista;
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if(ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DML.Beneficiario beneficiario = new DML.Beneficiario();
                    beneficiario.IdCliente = dr.Field<long>("IDCLIENTE");
                    beneficiario.NOME = dr.Field<string>("NOME");
                    beneficiario.CPF = dr.Field<string>("CPF");
                    beneficiario.Id = dr.Field<long>("ID");

                    lista.Add(beneficiario);
                }
            }

            return lista;
        }

        internal void InserirUnico(DML.Beneficiario beneficiario)
        {
            
            List<SqlParameter> parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("IDCLIENTE", beneficiario.IdCliente));
            parameters.Add(new SqlParameter("NOME", beneficiario.NOME));
            parameters.Add(new SqlParameter("CPF", beneficiario.CPF));
            var output = new SqlParameter("RETORNO", SqlDbType.Int);
            output.Direction = ParameterDirection.Output;
            parameters.Add(output);

            base.ConsultarV2("FI_SP_InsBeneficiario", parameters, out int OutputValue);

            if (OutputValue == -1)
                throw new Exception("CPF de beneficiário já cadastrado para esse cliente");
            
        }

        internal void Editar(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("ID", beneficiario.Id));
            parameters.Add(new SqlParameter("NOME", beneficiario.NOME));
            parameters.Add(new SqlParameter("CPF", beneficiario.CPF));
            parameters.Add(new SqlParameter("IDCLIENTE", beneficiario.IdCliente));
            var output = new SqlParameter("RETORNO", SqlDbType.Int);
            output.Direction= ParameterDirection.Output;
            parameters.Add(output);

            base.ConsultarV2("FI_SP_EditBeneficiario", parameters, out int OutputValue);

            if(OutputValue == -1)
                throw new Exception("CPF de beneficiário já cadastrado para esse cliente");


        }

        internal void Excluir(long ID)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("ID", ID));

            base.Consultar("FI_SP_DelBeneficiario", parameters);
        }
    }
}
