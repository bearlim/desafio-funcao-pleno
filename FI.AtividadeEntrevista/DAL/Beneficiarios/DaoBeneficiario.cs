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
        internal int Incluir(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();

            parameters.Add(new SqlParameter("NOME", beneficiario.NOME));
            parameters.Add(new SqlParameter("CPF", beneficiario.CPF));
            parameters.Add(new SqlParameter("IDCLIENTE", beneficiario.IdCliente));
            var retorno = new SqlParameter("RETORNO", SqlDbType.Int);
            retorno.Direction = ParameterDirection.Output;
            parameters.Add(retorno);

            var ds = base.ConsultarV2("FI_SP_InsBeneficiario", parameters, out int output);

            if (output == -1)
                throw new Exception("Não foi possível salvar beneficiário. CPF já cadastrado para esse cliente");

            int id = 0;
            
            if (ds.Tables[0].Rows.Count > 0)
                int.TryParse(ds.Tables[0].Rows[0][0].ToString(), out id);

            return id;
        }
    }
}
