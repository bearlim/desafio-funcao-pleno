using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
        public int Id { get; set; }
        public int CPF { get; set; }
        public string NOME { get; set; }
        public int IdCliente { get; set; }
    }
}
